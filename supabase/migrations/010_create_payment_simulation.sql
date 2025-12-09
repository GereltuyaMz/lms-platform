-- Migration: Payment Simulation System
-- Description: Creates tables for simulated course purchases and shopping cart (UI/flow only, no real payment processing)
-- Dependencies: Requires courses, auth.users tables

-- ======================
-- COURSE PURCHASES TABLE
-- ======================

CREATE TABLE course_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  amount_paid DECIMAL(10, 2) NOT NULL,                    -- Price paid in Tugrik (₮)
  payment_method TEXT NOT NULL CHECK (payment_method IN (
    'qpay',
    'social_pay',
    'card'
  )),
  status TEXT DEFAULT 'pending' CHECK (status IN (
    'pending',
    'completed',
    'failed',
    'refunded'
  )),
  transaction_reference TEXT,                              -- Mock transaction ID
  purchased_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, course_id)                              -- User can purchase each course only once
);

-- ======================
-- SHOPPING CART TABLE
-- ======================

CREATE TABLE shopping_cart (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, course_id)                        -- Composite primary key
);

-- ======================
-- INDEXES
-- ======================

CREATE INDEX idx_purchases_user_id ON course_purchases(user_id);
CREATE INDEX idx_purchases_course_id ON course_purchases(course_id);
CREATE INDEX idx_purchases_status ON course_purchases(status);
CREATE INDEX idx_purchases_user_course ON course_purchases(user_id, course_id, status);
CREATE INDEX idx_cart_user_id ON shopping_cart(user_id);
CREATE INDEX idx_cart_course_id ON shopping_cart(course_id);

-- ======================
-- FUNCTIONS
-- ======================

-- Function: Check if user has purchased a course
CREATE OR REPLACE FUNCTION has_purchased_course(
  p_user_id UUID,
  p_course_id UUID
) RETURNS BOOLEAN AS $$
DECLARE
  v_purchase_exists BOOLEAN;
BEGIN
  SELECT EXISTS(
    SELECT 1
    FROM course_purchases
    WHERE user_id = p_user_id
    AND course_id = p_course_id
    AND status = 'completed'
  ) INTO v_purchase_exists;

  RETURN v_purchase_exists;
END;
$$ LANGUAGE plpgsql;

-- Function: Check if user has access to course (free OR purchased)
CREATE OR REPLACE FUNCTION has_course_access(
  p_user_id UUID,
  p_course_id UUID
) RETURNS BOOLEAN AS $$
DECLARE
  v_course_price DECIMAL;
  v_has_purchase BOOLEAN;
BEGIN
  -- Get course price
  SELECT price INTO v_course_price
  FROM courses
  WHERE id = p_course_id;

  -- If free course, grant access
  IF v_course_price = 0 THEN
    RETURN TRUE;
  END IF;

  -- Check if purchased
  SELECT has_purchased_course(p_user_id, p_course_id) INTO v_has_purchase;

  RETURN v_has_purchase;
END;
$$ LANGUAGE plpgsql;

-- Function: Get cart total
CREATE OR REPLACE FUNCTION get_cart_total(p_user_id UUID)
RETURNS DECIMAL AS $$
DECLARE
  v_total DECIMAL;
BEGIN
  SELECT COALESCE(SUM(c.price), 0)
  INTO v_total
  FROM shopping_cart sc
  INNER JOIN courses c ON sc.course_id = c.id
  WHERE sc.user_id = p_user_id;

  RETURN v_total;
END;
$$ LANGUAGE plpgsql;

-- Function: Get cart item count
CREATE OR REPLACE FUNCTION get_cart_count(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_count INTEGER;
BEGIN
  SELECT COUNT(*)::INTEGER
  INTO v_count
  FROM shopping_cart
  WHERE user_id = p_user_id;

  RETURN v_count;
END;
$$ LANGUAGE plpgsql;

-- Function: Simulate course purchase
CREATE OR REPLACE FUNCTION simulate_purchase(
  p_user_id UUID,
  p_course_ids UUID[],
  p_payment_method TEXT
) RETURNS TABLE (
  purchase_id UUID,
  course_id UUID,
  amount_paid DECIMAL,
  status TEXT
) AS $$
DECLARE
  v_course_id UUID;
  v_course_price DECIMAL;
  v_purchase_id UUID;
  v_transaction_ref TEXT;
BEGIN
  -- Generate mock transaction reference
  v_transaction_ref := 'MOCK-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || SUBSTRING(gen_random_uuid()::TEXT, 1, 8);

  -- Process each course
  FOREACH v_course_id IN ARRAY p_course_ids LOOP
    -- Get course price
    SELECT price INTO v_course_price
    FROM courses
    WHERE id = v_course_id;

    -- Create purchase record
    INSERT INTO course_purchases (
      user_id,
      course_id,
      amount_paid,
      payment_method,
      status,
      transaction_reference
    ) VALUES (
      p_user_id,
      v_course_id,
      v_course_price,
      p_payment_method,
      'completed',  -- Simulated purchases are always successful
      v_transaction_ref
    )
    ON CONFLICT (user_id, course_id) DO UPDATE
      SET status = 'completed',
          transaction_reference = v_transaction_ref,
          purchased_at = NOW()
    RETURNING id, course_id, amount_paid, status
    INTO v_purchase_id, v_course_id, v_course_price, status;

    -- Create enrollment for purchased course
    INSERT INTO enrollments (user_id, course_id)
    VALUES (p_user_id, v_course_id)
    ON CONFLICT (user_id, course_id) DO NOTHING;

    -- Return purchase details
    RETURN QUERY SELECT v_purchase_id, v_course_id, v_course_price, status;
  END LOOP;

  -- Clear shopping cart for purchased courses
  DELETE FROM shopping_cart
  WHERE user_id = p_user_id
  AND course_id = ANY(p_course_ids);

  RETURN;
END;
$$ LANGUAGE plpgsql;

-- ======================
-- TRIGGERS
-- ======================

-- Prevent adding free courses to cart
CREATE OR REPLACE FUNCTION check_cart_item_price()
RETURNS TRIGGER AS $$
DECLARE
  v_course_price DECIMAL;
BEGIN
  -- Get course price
  SELECT price INTO v_course_price
  FROM courses
  WHERE id = NEW.course_id;

  -- Reject if course is free
  IF v_course_price = 0 THEN
    RAISE EXCEPTION 'Cannot add free course to cart. Enroll directly instead.';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER before_cart_insert_check_price
  BEFORE INSERT ON shopping_cart
  FOR EACH ROW
  EXECUTE FUNCTION check_cart_item_price();

-- Prevent duplicate purchases
CREATE OR REPLACE FUNCTION check_duplicate_purchase()
RETURNS TRIGGER AS $$
DECLARE
  v_existing_purchase UUID;
BEGIN
  -- Check for existing completed purchase
  SELECT id INTO v_existing_purchase
  FROM course_purchases
  WHERE user_id = NEW.user_id
  AND course_id = NEW.course_id
  AND status = 'completed';

  IF v_existing_purchase IS NOT NULL THEN
    RAISE NOTICE 'Course already purchased: %', NEW.course_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER before_purchase_check_duplicate
  BEFORE INSERT ON course_purchases
  FOR EACH ROW
  EXECUTE FUNCTION check_duplicate_purchase();

-- ======================
-- ROW LEVEL SECURITY (RLS)
-- ======================

-- Enable RLS on tables
ALTER TABLE course_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_cart ENABLE ROW LEVEL SECURITY;

-- Purchases: Users can only see their own purchases
CREATE POLICY purchases_select_own ON course_purchases
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY purchases_insert_own ON course_purchases
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Cart: Users can only manage their own cart
CREATE POLICY cart_select_own ON shopping_cart
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY cart_insert_own ON shopping_cart
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY cart_delete_own ON shopping_cart
  FOR DELETE
  USING (auth.uid() = user_id);

-- ======================
-- COMMENTS
-- ======================

COMMENT ON TABLE course_purchases IS 'Stores simulated course purchases (UI/flow only, no real payment processing)';
COMMENT ON TABLE shopping_cart IS 'Temporary shopping cart for users to collect courses before checkout';
COMMENT ON FUNCTION has_course_access IS 'Checks if user can access a course (free or purchased)';
COMMENT ON FUNCTION simulate_purchase IS 'Simulates course purchase and creates enrollment';

-- Log completion
DO $$
BEGIN
  RAISE NOTICE 'Successfully created payment simulation system (course_purchases, shopping_cart tables)';
END $$;
