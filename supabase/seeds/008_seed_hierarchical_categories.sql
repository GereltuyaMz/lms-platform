-- Seed: Hierarchical Categories
-- Description: Seeds exam types and subject categories
-- Dependencies: Requires migration 016_add_category_hierarchy.sql

-- =====================================================
-- 1. CLEAR EXISTING DATA (in correct order)
-- =====================================================

-- Delete course-category links
DELETE FROM course_categories;

-- Delete all categories (will cascade)
DELETE FROM categories;

-- =====================================================
-- 2. SEED EXAM TYPES (Top-level categories)
-- =====================================================

INSERT INTO categories (id, name, name_mn, slug, description, category_type, icon, order_index) VALUES
  -- ЭЕШ (Mongolian National Exam)
  (
    'a1000000-0000-0000-0000-000000000001',
    'ЭЕШ',
    'Элсэлтийн Ерөнхий Шалгалт',
    'esh',
    'Монгол улсын их, дээд сургуульд элсэх шалгалт',
    'exam',
    '🎓',
    1
  ),
  -- SAT
  (
    'a2000000-0000-0000-0000-000000000001',
    'SAT',
    'SAT шалгалт',
    'sat',
    'Scholastic Assessment Test - АНУ-ын их сургуулийн элсэлтийн шалгалт',
    'exam',
    '📝',
    2
  ),
  -- IELTS
  (
    'a3000000-0000-0000-0000-000000000001',
    'IELTS',
    'IELTS шалгалт',
    'ielts',
    'International English Language Testing System',
    'exam',
    '🌍',
    3
  );

-- =====================================================
-- 3. SEED SUBJECT CATEGORIES (Under each exam type)
-- =====================================================

INSERT INTO categories (id, name, name_mn, slug, description, category_type, parent_id, icon, order_index) VALUES
  -- ЭЕШ Subjects
  (
    'b1000000-0000-0000-0000-000000000001',
    'Mathematics',
    'Математик',
    'esh-matematik',
    'ЭЕШ-ийн математикийн хичээлүүд',
    'subject',
    'a1000000-0000-0000-0000-000000000001',
    '📐',
    1
  ),
  (
    'b1000000-0000-0000-0000-000000000002',
    'Physics',
    'Физик',
    'esh-fizik',
    'ЭЕШ-ийн физикийн хичээлүүд',
    'subject',
    'a1000000-0000-0000-0000-000000000001',
    '⚡',
    2
  ),
  (
    'b1000000-0000-0000-0000-000000000003',
    'Chemistry',
    'Хими',
    'esh-khimi',
    'ЭЕШ-ийн химийн хичээлүүд',
    'subject',
    'a1000000-0000-0000-0000-000000000001',
    '🧪',
    3
  ),
  (
    'b1000000-0000-0000-0000-000000000004',
    'English',
    'Англи хэл',
    'esh-english',
    'ЭЕШ-ийн англи хэлний хичээлүүд',
    'subject',
    'a1000000-0000-0000-0000-000000000001',
    '🌐',
    4
  ),
  (
    'b1000000-0000-0000-0000-000000000005',
    'Mongolian',
    'Монгол хэл',
    'esh-mongol',
    'ЭЕШ-ийн монгол хэлний хичээлүүд',
    'subject',
    'a1000000-0000-0000-0000-000000000001',
    '🇲🇳',
    5
  ),

  -- SAT Subjects
  (
    'b2000000-0000-0000-0000-000000000001',
    'SAT Math',
    'SAT Математик',
    'sat-math',
    'SAT математикийн хэсэг',
    'subject',
    'a2000000-0000-0000-0000-000000000001',
    '📊',
    1
  ),
  (
    'b2000000-0000-0000-0000-000000000002',
    'SAT Reading & Writing',
    'SAT Унших & Бичих',
    'sat-reading-writing',
    'SAT унших, бичих хэсэг',
    'subject',
    'a2000000-0000-0000-0000-000000000001',
    '📚',
    2
  ),

  -- IELTS Subjects
  (
    'b3000000-0000-0000-0000-000000000001',
    'IELTS Listening',
    'IELTS Сонсох',
    'ielts-listening',
    'IELTS сонсох чадварын хэсэг',
    'subject',
    'a3000000-0000-0000-0000-000000000001',
    '👂',
    1
  ),
  (
    'b3000000-0000-0000-0000-000000000002',
    'IELTS Reading',
    'IELTS Унших',
    'ielts-reading',
    'IELTS унших чадварын хэсэг',
    'subject',
    'a3000000-0000-0000-0000-000000000001',
    '📖',
    2
  ),
  (
    'b3000000-0000-0000-0000-000000000003',
    'IELTS Writing',
    'IELTS Бичих',
    'ielts-writing',
    'IELTS бичих чадварын хэсэг',
    'subject',
    'a3000000-0000-0000-0000-000000000001',
    '✍️',
    3
  ),
  (
    'b3000000-0000-0000-0000-000000000004',
    'IELTS Speaking',
    'IELTS Ярих',
    'ielts-speaking',
    'IELTS ярих чадварын хэсэг',
    'subject',
    'a3000000-0000-0000-0000-000000000001',
    '🗣️',
    4
  );

-- =====================================================
-- 4. LOG COMPLETION
-- =====================================================

DO $$
DECLARE
  exam_count INTEGER;
  subject_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO exam_count FROM categories WHERE category_type = 'exam';
  SELECT COUNT(*) INTO subject_count FROM categories WHERE category_type = 'subject';

  RAISE NOTICE 'Seeded % exam types and % subjects', exam_count, subject_count;
END $$;
