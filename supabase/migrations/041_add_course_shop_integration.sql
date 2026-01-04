-- Course Shop Integration
-- Adds support for course unlocks and discount coupons in XP shop

-- ============================================
-- 1. Update shop_products product_type enum
-- ============================================

-- First, migrate existing 'digital_course' products to 'digital_course_unlock'
-- (Backward compatibility: treat old digital courses as full unlocks)
UPDATE shop_products
SET product_type = 'digital_course_unlock'
WHERE product_type = 'digital_course';

-- Add new product types for courses
ALTER TABLE shop_products DROP CONSTRAINT IF EXISTS shop_products_product_type_check;

ALTER TABLE shop_products ADD CONSTRAINT shop_products_product_type_check
CHECK (product_type IN (
  'physical_merch',
  'physical_gift_card',
  'digital_course_unlock',    -- 100% free course unlock
  'digital_course_discount',  -- 50% discount coupon
  'digital_boost'
));

-- ============================================
-- 2. Remove UNIQUE constraint for multiple redemptions
-- ============================================

-- Allow users to redeem same product multiple times (for gifting)
ALTER TABLE user_digital_inventory DROP CONSTRAINT IF EXISTS user_digital_inventory_user_id_product_id_key;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_digital_inventory_user_product ON user_digital_inventory(user_id, product_id);

-- ============================================
-- 3. Create course_discount_coupons table
-- ============================================

CREATE TABLE course_discount_coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  discount_percentage INTEGER NOT NULL CHECK (discount_percentage IN (50, 100)),

  -- Coupon tracking
  is_used BOOLEAN DEFAULT false,
  used_at TIMESTAMPTZ,
  order_item_id UUID REFERENCES shop_order_items(id),

  -- Expiration (30 days for 50% discounts, no expiry for 100% unlocks)
  expires_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_coupons_user ON course_discount_coupons(user_id, is_used);
CREATE INDEX idx_coupons_course ON course_discount_coupons(course_id);
CREATE INDEX idx_coupons_user_course ON course_discount_coupons(user_id, course_id, is_used);

COMMENT ON TABLE course_discount_coupons IS 'Course discount coupons earned from XP shop (50% or 100% off)';
COMMENT ON COLUMN course_discount_coupons.discount_percentage IS '50 = 50% discount, 100 = free unlock';
COMMENT ON COLUMN course_discount_coupons.expires_at IS 'NULL for 100% unlocks (no expiry), 30 days for 50% discounts';

-- ============================================
-- 4. Update create_shop_order function
-- ============================================

CREATE OR REPLACE FUNCTION create_shop_order(
  p_user_id UUID,
  p_product_id UUID,
  p_quantity INTEGER,
  p_shipping_address JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_order_id UUID;
  v_order_item_id UUID;
  v_product RECORD;
  v_total_cost INTEGER;
  v_user_xp INTEGER;
  v_product_snapshot JSONB;
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

  -- 5. Create product snapshot
  v_product_snapshot := jsonb_build_object(
    'name', v_product.name,
    'name_mn', v_product.name_mn,
    'description_mn', v_product.description_mn,
    'product_type', v_product.product_type,
    'xp_cost', v_product.xp_cost,
    'image_url', v_product.image_url,
    'metadata', v_product.metadata
  );

  -- 6. Create order
  INSERT INTO shop_orders (user_id, total_xp_cost, status)
  VALUES (p_user_id, v_total_cost, 'pending')
  RETURNING id INTO v_order_id;

  -- 7. Create order item
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

  -- 8. Deduct XP (creates negative xp_transaction)
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

  -- 9. Auto-deliver digital items
  IF v_product.product_type LIKE 'digital%' THEN
    -- Add to user inventory
    INSERT INTO user_digital_inventory (user_id, product_id, order_item_id)
    VALUES (p_user_id, p_product_id, v_order_item_id);

    -- 9a. Handle course unlocks (100% free)
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
        NULL  -- No expiration for 100% unlocks
      );

      -- Auto-enroll with free access
      INSERT INTO enrollments (user_id, course_id, enrolled_at)
      VALUES (p_user_id, (v_product.metadata->>'course_id')::UUID, NOW())
      ON CONFLICT (user_id, course_id) DO NOTHING;
    END IF;

    -- 9b. Handle course discounts (50% off)
    IF v_product.product_type = 'digital_course_discount' AND v_product.metadata ? 'course_id' THEN
      -- Create 50% discount coupon with 30-day expiration
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
        NOW() + INTERVAL '30 days'
      );
    END IF;

    -- Mark order as completed
    UPDATE shop_orders
    SET status = 'completed', completed_at = NOW()
    WHERE id = v_order_id;
  END IF;

  -- 10. Store shipping address for physical items
  IF p_shipping_address IS NOT NULL AND v_product.product_type LIKE 'physical%' THEN
    UPDATE shop_order_items
    SET product_snapshot = product_snapshot || jsonb_build_object('shipping_address', p_shipping_address)
    WHERE id = v_order_item_id;
  END IF;

  RETURN v_order_id;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION create_shop_order IS 'Atomically creates shop order with course unlock/discount support';
