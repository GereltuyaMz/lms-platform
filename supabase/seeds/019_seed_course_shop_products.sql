-- Dynamic Course Shop Products Generation
-- Generates shop products from actual courses table
-- Formula: 10,000 XP = 50,000₮ → 1 XP = 5₮

-- ============================================
-- Course Unlocks (100% Free)
-- ============================================

INSERT INTO shop_products (
  name,
  name_mn,
  description,
  description_mn,
  product_type,
  xp_cost,
  inventory_total,
  inventory_available,
  metadata,
  image_url,
  display_order,
  is_active
)
SELECT
  'Free Course: ' || c.title AS name,
  'Үнэгүй Хичээл: ' || c.title AS name_mn,
  'Unlock full course access for free using XP. Save money while learning!' AS description,
  c.description || ' - XP ашиглан үнэгүй эзэмшээрэй!' AS description_mn,
  'digital_course_unlock' AS product_type,
  ROUND(c.price / 5)::INTEGER AS xp_cost,  -- 50,000₮ → 10,000 XP
  NULL AS inventory_total,  -- Unlimited
  NULL AS inventory_available,
  jsonb_build_object(
    'course_id', c.id,
    'course_slug', c.slug,
    'level', c.level,
    'duration_hours', c.duration_hours,
    'discount_percentage', 100,
    'original_price', c.price
  ) AS metadata,
  COALESCE(c.thumbnail_url, '/images/shop/course-default.png') AS image_url,
  1000 + ROW_NUMBER() OVER (ORDER BY c.price DESC)::INTEGER AS display_order,
  true AS is_active
FROM courses c
WHERE c.is_published = true
  AND c.price > 0;  -- Only paid courses

-- ============================================
-- Course Discounts (50% Off)
-- ============================================

INSERT INTO shop_products (
  name,
  name_mn,
  description,
  description_mn,
  product_type,
  xp_cost,
  inventory_total,
  inventory_available,
  metadata,
  image_url,
  display_order,
  is_active
)
SELECT
  '50% Discount: ' || c.title AS name,
  '50% Хямдрал: ' || c.title AS name_mn,
  'Get 50% off this course with a 30-day coupon. Great for trying new subjects!' AS description,
  c.description || ' - 30 хоногийн хугацаатай 50% хямдралтай худалдан авах боломж!' AS description_mn,
  'digital_course_discount' AS product_type,
  ROUND(c.price / 10)::INTEGER AS xp_cost,  -- 50,000₮ → 5,000 XP for 50% discount
  NULL AS inventory_total,  -- Unlimited
  NULL AS inventory_available,
  jsonb_build_object(
    'course_id', c.id,
    'course_slug', c.slug,
    'level', c.level,
    'duration_hours', c.duration_hours,
    'discount_percentage', 50,
    'original_price', c.price,
    'discounted_price', c.price * 0.5,
    'expiry_days', 30
  ) AS metadata,
  COALESCE(c.thumbnail_url, '/images/shop/course-default.png') AS image_url,
  2000 + ROW_NUMBER() OVER (ORDER BY c.price DESC)::INTEGER AS display_order,
  true AS is_active
FROM courses c
WHERE c.is_published = true
  AND c.price > 0;  -- Only paid courses

-- ============================================
-- Comments & Statistics
-- ============================================

DO $$
DECLARE
  v_unlock_count INTEGER;
  v_discount_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_unlock_count
  FROM shop_products
  WHERE product_type = 'digital_course_unlock';

  SELECT COUNT(*) INTO v_discount_count
  FROM shop_products
  WHERE product_type = 'digital_course_discount';

  RAISE NOTICE 'Course shop products seeded successfully:';
  RAISE NOTICE '  - % free course unlocks (100%% off)', v_unlock_count;
  RAISE NOTICE '  - % discount coupons (50%% off)', v_discount_count;
  RAISE NOTICE '  - Total: % course-related products', v_unlock_count + v_discount_count;
END $$;

-- Example pricing based on current courses:
-- Course: Basic Geometry (50,000₮)
--   - Unlock: 10,000 XP (100% free)
--   - Discount: 5,000 XP (pay 25,000₮)
--
-- Course: Advanced Calculus (85,000₮)
--   - Unlock: 17,000 XP (100% free)
--   - Discount: 8,500 XP (pay 42,500₮)
