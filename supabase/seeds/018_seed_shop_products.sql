-- Seed Shop Products
-- Sample products for testing the XP shop system

-- ============================================
-- Physical Merchandise
-- ============================================

INSERT INTO shop_products (name, name_mn, description, description_mn, product_type, xp_cost, inventory_total, inventory_available, image_url, display_order) VALUES
(
  'LMS Hoodie',
  'LMS Цамц',
  'Premium quality hoodie with LMS platform branding',
  'LMS платформын брэндтэй чанартай цамц. Өвлийн улиралд тааламжтай дулаан.',
  'physical_merch',
  10000,
  50,
  50,
  '/images/shop/hoodie.png',
  1
),
(
  'LMS T-Shirt',
  'LMS Футболк',
  'Comfortable cotton t-shirt with LMS logo',
  'LMS логотой тав тухтай хөвөн футболк. Өдөр тутмын хувцаслалтад тохиромжтой.',
  'physical_merch',
  5000,
  100,
  100,
  '/images/shop/tshirt.png',
  2
),
(
  'Student Backpack',
  'Суралцагчийн Цүнх',
  'Durable backpack perfect for students',
  'Суралцагчдад зориулсан бат бөх цүнх. Ном, зүүн тавьж явахад тохиромжтой.',
  'physical_merch',
  15000,
  30,
  30,
  '/images/shop/backpack.png',
  3
),
(
  'Water Bottle',
  'Усны Сав',
  'Insulated water bottle with LMS branding',
  'LMS брэндтэй дулаан хадгалагч усны сав. Эрүүл амьдралын хэв маягт.',
  'physical_merch',
  6500,
  75,
  75,
  '/images/shop/bottle.png',
  4
),
(
  'Notebook Set',
  'Дэвтэр Багц',
  'Set of 3 premium notebooks',
  '3 ширхэг чанартай дэвтэр. Хичээлийн тэмдэглэл хийхэд тохиромжтой.',
  'physical_merch',
  3000,
  150,
  150,
  '/images/shop/notebook.png',
  5
),
(
  'Sticker Pack',
  'Наалт Багц',
  'Collection of 10 LMS-themed stickers',
  '10 ширхэг LMS сэдэвтэй наалт. Зүүн, ном, компьютер чимэглэнэ.',
  'physical_merch',
  2500,
  200,
  200,
  '/images/shop/stickers.png',
  6
);

-- ============================================
-- Gift Cards
-- ============================================

INSERT INTO shop_products (name, name_mn, description, description_mn, product_type, xp_cost, inventory_total, inventory_available, image_url, display_order) VALUES
(
  'Coffee Shop Gift Card - 10,000₮',
  'Кофе Бэлэг Карт - 10,000₮',
  'Enjoy your favorite coffee on us',
  '10,000₮ үнэ бүхий кофены дэлгүүрийн бэлэг карт. Дуртай коф уугаарай.',
  'physical_gift_card',
  2500,
  200,
  200,
  '/images/shop/gift-card-coffee.png',
  7
),
(
  'Bookstore Gift Card - 20,000₮',
  'Номын Дэлгүүр Бэлэг Карт - 20,000₮',
  'Buy books to continue your learning journey',
  '20,000₮ үнэ бүхий номын дэлгүүрийн бэлэг карт. Суралцах аялалаа үргэлжлүүлээрэй.',
  'physical_gift_card',
  5000,
  100,
  100,
  '/images/shop/gift-card-books.png',
  8
),
(
  'Restaurant Gift Card - 50,000₮',
  'Ресторан Бэлэг Карт - 50,000₮',
  'Celebrate your achievements with a nice meal',
  '50,000₮ үнэ бүхий ресторанын бэлэг карт. Амжилтаа тэмдэглээрэй.',
  'physical_gift_card',
  12000,
  50,
  50,
  '/images/shop/gift-card-restaurant.png',
  9
);

-- ============================================
-- Digital Course Unlocks
-- ============================================

-- NOTE: Course products are now dynamically generated in 019_seed_course_shop_products.sql
-- This section has been removed to prevent conflicts with the new course integration system

-- ============================================
-- Digital Boosts (Future Implementation)
-- ============================================

INSERT INTO shop_products (name, name_mn, description, description_mn, product_type, xp_cost, inventory_total, inventory_available, metadata, image_url, display_order, is_active) VALUES
(
  '2x XP Boost (24 hours)',
  '2x XP Өсгөгч (24 цаг)',
  'Double your XP earnings for 24 hours',
  '24 цагийн турш хичээл сурахдаа 2 дахин их XP авах боломж.',
  'digital_boost',
  8000,
  NULL,
  NULL,
  '{"duration_hours": 24, "multiplier": 2}',
  '/images/shop/boost-2x.png',
  13,
  false  -- Not active yet, future feature
),
(
  'Quiz Hint Pack (5 hints)',
  'Асуулт Заалт Багц (5 заалт)',
  'Get hints for difficult quiz questions',
  '5 ширхэг хүнд асуултад заалт авах боломж. Тест өгөхөд туслана.',
  'digital_boost',
  3000,
  NULL,
  NULL,
  '{"hint_count": 5}',
  '/images/shop/hints.png',
  14,
  false  -- Not active yet, future feature
);

-- ============================================
-- Comments
-- ============================================

COMMENT ON TABLE shop_products IS 'Seeded with 11 sample products: 6 physical merch, 3 gift cards, 2 future boosts. Course products added via 019_seed_course_shop_products.sql';
