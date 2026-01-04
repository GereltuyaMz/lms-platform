-- Fix: Add shipping address to product snapshot in create_shop_order function
-- This migration updates the create_shop_order function to include the shipping address
-- in the product_snapshot JSONB field when creating an order.

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

  -- 5. Create product snapshot (now includes shipping address)
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
  IF p_shipping_address IS NOT NULL THEN
    v_product_snapshot := v_product_snapshot || jsonb_build_object('shipping_address', p_shipping_address);
  END IF;

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
        NOW() + INTERVAL '1 year'
      );
    END IF;

    -- 9b. Handle course discounts (50% off)
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

  -- 10. Mark order as completed (XP deducted, digital items delivered)
  UPDATE shop_orders
  SET status = 'completed', completed_at = NOW()
  WHERE id = v_order_id;

  RETURN v_order_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
