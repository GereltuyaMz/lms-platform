-- Migration 044: Enable RLS and Create Shipping Address Functions
-- Enables Row Level Security on shop_shipping_addresses table
-- Creates helper functions for address management
-- Updates create_shop_order to use address_id instead of JSONB

-- ============================================
-- 1. Enable RLS on shop_shipping_addresses
-- ============================================

ALTER TABLE shop_shipping_addresses ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 2. Create RLS Policies
-- ============================================

-- Policy: Users can view their own addresses
CREATE POLICY "Users can view own shipping addresses"
  ON shop_shipping_addresses
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own addresses
CREATE POLICY "Users can insert own shipping addresses"
  ON shop_shipping_addresses
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own addresses
CREATE POLICY "Users can update own shipping addresses"
  ON shop_shipping_addresses
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own addresses
CREATE POLICY "Users can delete own shipping addresses"
  ON shop_shipping_addresses
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- 3. Get User Default Address Function
-- ============================================

CREATE OR REPLACE FUNCTION get_user_default_address(p_user_id UUID)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  full_name TEXT,
  phone TEXT,
  city TEXT,
  district TEXT,
  khoroo TEXT,
  address_line TEXT,
  is_default BOOLEAN,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ssa.id,
    ssa.user_id,
    ssa.full_name,
    ssa.phone,
    ssa.city,
    ssa.district,
    ssa.khoroo,
    ssa.address_line,
    ssa.is_default,
    ssa.created_at,
    ssa.updated_at
  FROM shop_shipping_addresses ssa
  WHERE ssa.user_id = p_user_id AND ssa.is_default = true
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION get_user_default_address IS 'Returns user default shipping address';

-- ============================================
-- 4. Upsert User Shipping Address Function
-- ============================================

CREATE OR REPLACE FUNCTION upsert_user_shipping_address(
  p_user_id UUID,
  p_full_name TEXT,
  p_phone TEXT,
  p_address_line TEXT,
  p_city TEXT DEFAULT NULL,
  p_district TEXT DEFAULT NULL,
  p_khoroo TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_address_id UUID;
  v_existing_address_id UUID;
BEGIN
  -- Check if user already has a default address
  SELECT id INTO v_existing_address_id
  FROM shop_shipping_addresses
  WHERE user_id = p_user_id AND is_default = true
  LIMIT 1;

  IF v_existing_address_id IS NOT NULL THEN
    -- Update existing address
    UPDATE shop_shipping_addresses
    SET
      full_name = p_full_name,
      phone = p_phone,
      city = p_city,
      district = p_district,
      khoroo = p_khoroo,
      address_line = p_address_line,
      updated_at = NOW()
    WHERE id = v_existing_address_id
    RETURNING id INTO v_address_id;
  ELSE
    -- Insert new address as default
    INSERT INTO shop_shipping_addresses (
      user_id,
      full_name,
      phone,
      city,
      district,
      khoroo,
      address_line,
      is_default
    )
    VALUES (
      p_user_id,
      p_full_name,
      p_phone,
      p_city,
      p_district,
      p_khoroo,
      p_address_line,
      true
    )
    RETURNING id INTO v_address_id;
  END IF;

  RETURN v_address_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION upsert_user_shipping_address IS 'Creates or updates user single default shipping address';

-- ============================================
-- 5. Update create_shop_order Function
-- ============================================

-- Drop the old function signature first
DROP FUNCTION IF EXISTS create_shop_order(UUID, UUID, INTEGER, JSONB);

CREATE OR REPLACE FUNCTION create_shop_order(
  p_user_id UUID,
  p_product_id UUID,
  p_quantity INTEGER,
  p_address_id UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_order_id UUID;
  v_order_item_id UUID;
  v_product RECORD;
  v_total_cost INTEGER;
  v_user_xp INTEGER;
  v_product_snapshot JSONB;
  v_shipping_address JSONB;
BEGIN
  -- 1. Get product details
  SELECT * INTO v_product
  FROM shop_products
  WHERE id = p_product_id AND is_active = true;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Product not found or inactive';
  END IF;

  -- 2. Calculate total cost
  v_total_cost := v_product.xp_cost * p_quantity;

  -- 3. Check user's XP balance
  SELECT total_xp INTO v_user_xp
  FROM user_profiles
  WHERE id = p_user_id;

  IF v_user_xp < v_total_cost THEN
    RAISE EXCEPTION 'Insufficient XP balance';
  END IF;

  -- 4. Reserve inventory (atomic check for physical items)
  IF v_product.inventory_available IS NOT NULL THEN
    IF NOT reserve_product_inventory(p_product_id, p_quantity) THEN
      RAISE EXCEPTION 'Product out of stock';
    END IF;
  END IF;

  -- 5. Fetch shipping address if address_id provided (for physical items)
  IF p_address_id IS NOT NULL THEN
    SELECT jsonb_build_object(
      'address_id', ssa.id,
      'fullName', ssa.full_name,
      'phone', ssa.phone,
      'city', ssa.city,
      'district', ssa.district,
      'khoroo', ssa.khoroo,
      'addressLine', ssa.address_line
    ) INTO v_shipping_address
    FROM shop_shipping_addresses ssa
    WHERE ssa.id = p_address_id AND ssa.user_id = p_user_id;

    IF v_shipping_address IS NULL THEN
      RAISE EXCEPTION 'Shipping address not found';
    END IF;
  END IF;

  -- 6. Create product snapshot (now includes shipping address)
  v_product_snapshot := jsonb_build_object(
    'name', v_product.name,
    'name_mn', v_product.name_mn,
    'description_mn', v_product.description_mn,
    'product_type', v_product.product_type,
    'xp_cost', v_product.xp_cost,
    'image_url', v_product.image_url,
    'metadata', v_product.metadata
  );

  -- Add shipping address to snapshot if provided
  IF v_shipping_address IS NOT NULL THEN
    v_product_snapshot := v_product_snapshot || jsonb_build_object('shipping_address', v_shipping_address);
  END IF;

  -- 7. Create order
  INSERT INTO shop_orders (user_id, total_xp_cost, status)
  VALUES (p_user_id, v_total_cost, 'pending')
  RETURNING id INTO v_order_id;

  -- 8. Create order item
  INSERT INTO shop_order_items (
    order_id,
    product_id,
    product_snapshot,
    quantity,
    xp_cost_per_item,
    fulfillment_status
  )
  VALUES (
    v_order_id,
    p_product_id,
    v_product_snapshot,
    p_quantity,
    v_product.xp_cost,
    CASE
      WHEN v_product.product_type LIKE 'physical%' THEN 'pending'
      ELSE NULL
    END
  )
  RETURNING id INTO v_order_item_id;

  -- 9. Deduct XP (creates negative xp_transaction)
  INSERT INTO xp_transactions (
    user_id,
    amount,
    source_type,
    source_id,
    description,
    metadata
  )
  VALUES (
    p_user_id,
    -v_total_cost,  -- Negative amount
    'shop_purchase',
    v_order_item_id,
    'Purchased: ' || v_product.name_mn,
    jsonb_build_object(
      'product_id', p_product_id,
      'order_id', v_order_id,
      'product_type', v_product.product_type
    )
  );

  -- 10. Auto-deliver digital items
  IF v_product.product_type LIKE 'digital%' THEN
    -- Add to user inventory
    INSERT INTO user_digital_inventory (user_id, product_id, order_item_id)
    VALUES (p_user_id, p_product_id, v_order_item_id);

    -- 10a. Handle course unlocks (100% free)
    IF v_product.product_type = 'digital_course_unlock' AND v_product.metadata ? 'course_id' THEN
      -- Create 100% discount coupon
      INSERT INTO course_discount_coupons (
        user_id,
        course_id,
        discount_percentage,
        order_item_id,
        expires_at
      )
      VALUES (
        p_user_id,
        (v_product.metadata->>'course_id')::UUID,
        100,
        v_order_item_id,
        NOW() + INTERVAL '1 year'
      );
    END IF;

    -- 10b. Handle course discounts (50% off)
    IF v_product.product_type = 'digital_course_discount' AND v_product.metadata ? 'course_id' THEN
      -- Create 50% discount coupon
      INSERT INTO course_discount_coupons (
        user_id,
        course_id,
        discount_percentage,
        order_item_id,
        expires_at
      )
      VALUES (
        p_user_id,
        (v_product.metadata->>'course_id')::UUID,
        50,
        v_order_item_id,
        NOW() + INTERVAL '6 months'
      );
    END IF;
  END IF;

  -- 11. Mark order as completed (XP deducted, digital items delivered)
  UPDATE shop_orders
  SET status = 'completed', completed_at = NOW()
  WHERE id = v_order_id;

  RETURN v_order_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION create_shop_order IS 'Atomically creates shop order: validates XP, reserves inventory, deducts XP, auto-delivers digital items. Now uses address_id instead of JSONB.';
