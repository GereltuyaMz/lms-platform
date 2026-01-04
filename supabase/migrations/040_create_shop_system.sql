-- Shop System Implementation
-- Creates tables for XP-based shop with physical items, gift cards, and course unlocks

-- ============================================
-- 1. Create shop_products table
-- ============================================

CREATE TABLE shop_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_mn TEXT NOT NULL,
  description TEXT,
  description_mn TEXT,

  -- Product categorization
  product_type TEXT NOT NULL CHECK (product_type IN (
    'physical_merch',           -- Hoodies, t-shirts, backpacks
    'physical_gift_card',       -- Gift cards
    'digital_course_unlock',    -- Course 100% free unlock
    'digital_course_discount',  -- Course 50% discount coupon
    'digital_boost'             -- Future: XP multipliers, hints
  )),

  -- Pricing & Inventory
  xp_cost INTEGER NOT NULL CHECK (xp_cost > 0),
  inventory_total INTEGER DEFAULT NULL,      -- NULL = unlimited (digital items)
  inventory_available INTEGER DEFAULT NULL,  -- Decrements on purchase

  -- Product details
  image_url TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,  -- Size, color, course_id for unlocks, etc.

  -- Status
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_shop_products_active ON shop_products(is_active, display_order);
CREATE INDEX idx_shop_products_type ON shop_products(product_type);

COMMENT ON TABLE shop_products IS 'Products available in XP shop (physical merch, gift cards, course unlocks)';
COMMENT ON COLUMN shop_products.inventory_available IS 'Current available stock, NULL for unlimited digital items';
COMMENT ON COLUMN shop_products.metadata IS 'Flexible JSONB for product-specific data: sizes, colors, course_id, etc.';

-- ============================================
-- 2. Create shop_orders table
-- ============================================

CREATE TABLE shop_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Order status workflow
  status TEXT DEFAULT 'pending' CHECK (status IN (
    'pending',      -- Order created
    'processing',   -- Being prepared
    'completed',    -- Digital items delivered or physical shipped
    'cancelled'     -- Order cancelled
  )),

  -- Total XP spent on this order
  total_xp_cost INTEGER NOT NULL,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX idx_shop_orders_user_id ON shop_orders(user_id, created_at DESC);
CREATE INDEX idx_shop_orders_status ON shop_orders(status);

COMMENT ON TABLE shop_orders IS 'User orders from XP shop';
COMMENT ON COLUMN shop_orders.status IS 'Order lifecycle: pending → processing → completed/cancelled';

-- ============================================
-- 3. Create shop_order_items table
-- ============================================

CREATE TABLE shop_order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES shop_orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES shop_products(id),

  -- Snapshot product details at time of purchase (in case product changes)
  product_snapshot JSONB NOT NULL,  -- {name, name_mn, xp_cost, metadata}
  quantity INTEGER DEFAULT 1 CHECK (quantity > 0),
  xp_cost_per_item INTEGER NOT NULL,

  -- Fulfillment tracking (for physical items)
  fulfillment_status TEXT CHECK (fulfillment_status IN (
    'pending',
    'shipped',
    'delivered'
  )),
  tracking_number TEXT,
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_order_items_order_id ON shop_order_items(order_id);
CREATE INDEX idx_order_items_product_id ON shop_order_items(product_id);

COMMENT ON TABLE shop_order_items IS 'Line items for shop orders with fulfillment tracking';
COMMENT ON COLUMN shop_order_items.product_snapshot IS 'Product details at purchase time (preserves info if product changes)';
COMMENT ON COLUMN shop_order_items.fulfillment_status IS 'Physical item shipping status (NULL for digital items)';

-- ============================================
-- 4. Create shop_shipping_addresses table
-- ============================================

CREATE TABLE shop_shipping_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Address details (Mongolian format)
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  city TEXT,           -- Улаанбаатар, etc.
  district TEXT,       -- Дүүрэг
  khoroo TEXT,         -- Хороо
  address_line TEXT NOT NULL,  -- Detailed address

  -- Default flag
  is_default BOOLEAN DEFAULT false,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_shipping_user_id ON shop_shipping_addresses(user_id);
CREATE UNIQUE INDEX idx_shipping_user_default
  ON shop_shipping_addresses(user_id)
  WHERE is_default = true;  -- Only one default per user

COMMENT ON TABLE shop_shipping_addresses IS 'User shipping addresses for physical product delivery';
COMMENT ON COLUMN shop_shipping_addresses.is_default IS 'User can only have one default address';

-- ============================================
-- 5. Create user_digital_inventory table
-- ============================================

CREATE TABLE user_digital_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES shop_products(id),
  order_item_id UUID NOT NULL REFERENCES shop_order_items(id),

  -- When item was delivered
  acquired_at TIMESTAMPTZ DEFAULT NOW(),

  -- Prevent duplicate digital item purchases
  UNIQUE(user_id, product_id)
);

CREATE INDEX idx_digital_inventory_user ON user_digital_inventory(user_id);

COMMENT ON TABLE user_digital_inventory IS 'Digital items owned by users (course unlocks, boosts, etc.)';
COMMENT ON COLUMN user_digital_inventory.order_item_id IS 'Reference to purchase transaction';

-- ============================================
-- 6. Database Functions for Atomic Operations
-- ============================================

-- Reserve Inventory (Prevents Overselling)
CREATE OR REPLACE FUNCTION reserve_product_inventory(
  p_product_id UUID,
  p_quantity INTEGER DEFAULT 1
)
RETURNS BOOLEAN AS $$
DECLARE
  rows_updated INTEGER;
BEGIN
  -- Atomic UPDATE with WHERE clause to prevent overselling
  UPDATE shop_products
  SET
    inventory_available = inventory_available - p_quantity,
    updated_at = NOW()
  WHERE
    id = p_product_id
    AND inventory_available >= p_quantity  -- Critical: prevents negative inventory
    AND is_active = true;

  GET DIAGNOSTICS rows_updated = ROW_COUNT;

  RETURN rows_updated > 0;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION reserve_product_inventory IS 'Atomically reserves inventory, returns false if insufficient stock';

-- Create Order (All-or-Nothing Transaction)
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
    VALUES (p_user_id, p_product_id, v_order_item_id)
    ON CONFLICT (user_id, product_id) DO NOTHING;

    -- Auto-enroll in course if it's a course unlock
    IF v_product.product_type = 'digital_course' AND v_product.metadata ? 'course_id' THEN
      INSERT INTO enrollments (user_id, course_id, enrolled_at)
      VALUES (p_user_id, (v_product.metadata->>'course_id')::UUID, NOW())
      ON CONFLICT (user_id, course_id) DO NOTHING;
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

COMMENT ON FUNCTION create_shop_order IS 'Atomically creates shop order: validates XP, reserves inventory, deducts XP, auto-delivers digital items';

-- ============================================
-- 7. Update xp_transactions source_type enum
-- ============================================

-- Note: The source_type CHECK constraint in migration 005 already includes 'shop_purchase'
-- If it doesn't, we would need to alter the table to add it:
-- ALTER TABLE xp_transactions DROP CONSTRAINT IF EXISTS xp_transactions_source_type_check;
-- ALTER TABLE xp_transactions ADD CONSTRAINT xp_transactions_source_type_check
--   CHECK (source_type IN ('lesson_complete', 'quiz_complete', 'milestone', 'streak', 'achievement', 'shop_purchase', 'unit_quiz_complete', 'profile_completion'));

-- ============================================
-- 8. Grant permissions (optional, for RLS setup)
-- ============================================

-- Will be configured later when RLS is enabled across all tables
