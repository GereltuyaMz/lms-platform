-- =====================================================
-- SEED DATA: Sample Courses for LMS Platform
-- =====================================================
-- Run this after running the main migration
-- Note: Slugs are auto-generated from titles

-- Insert Sample Courses
INSERT INTO courses (title, description, level, price, original_price, duration_hours, is_published) VALUES
  (
    'Basic Geometry and Measurement',
    'Learn everything from Calculus 1, then test your knowledge with 600+ practice questions. Perfect for high school students preparing for exams.',
    'Beginner',
    50000,
    90000,
    1.5,
    true
  ),
  (
    'Introduction to Algebra',
    'Explore the foundations of algebra with clear explanations and practical examples. Master equations, functions, and graphing.',
    'Intermediate',
    65000,
    NULL,
    2.0,
    true
  ),
  (
    'Advanced Calculus',
    'Dive deep into limits, derivatives, integrals, and their applications. Comprehensive lectures with real-world problem solving.',
    'Advanced',
    85000,
    150000,
    3.5,
    true
  ),
  (
    'Statistics Essentials',
    'Learn about data analysis, probability, and statistical concepts in a simple way. Prepare for university-level statistics.',
    'Beginner',
    55000,
    100000,
    1.8,
    true
  ),
  (
    'Linear Algebra Fundamentals',
    'Master vectors, matrices, linear transformations, and eigenvalues. Essential for advanced mathematics and computer science.',
    'Advanced',
    78000,
    140000,
    3.0,
    true
  ),
  (
    'Математикийн үндэс',
    'Математикийн үндсэн ойлголтууд, тооны систем, үйлдлүүд. ЭЕШ-д бэлтгэхэд тохиромжтой.',
    'Beginner',
    45000,
    80000,
    2.0,
    true
  ),
  (
    'Геометрийн суурь',
    'Хавтгай болон огторгуйн геометр, хэмжээс тооцоолол. Практик жишээнүүдтэй.',
    'Intermediate',
    55000,
    NULL,
    2.5,
    true
  ),
  (
    'Физикийн үндэс',
    'Механик, хөдөлгөөн, хүч, энерги. Лабораторийн туршилтуудтай хослуулсан.',
    'Beginner',
    60000,
    110000,
    2.2,
    true
  ),
  (
    'Монгол хэл бичиг',
    'Дүрэм зүй, үг зүй, өгүүлбэр зохиох арга. ЭЕШ-ийн бэлтгэлд зориулсан.',
    'Intermediate',
    48000,
    NULL,
    1.8,
    true
  ),
  (
    'Химийн үндэс',
    'Атом, молекул, химийн урвал, үелэх систем. Лабораторийн ажлуудтай.',
    'Beginner',
    52000,
    92000,
    2.1,
    true
  ),
  (
    'English Grammar Fundamentals',
    'Master essential English grammar rules, sentence structure, and common mistakes. Perfect for ЭЕШ preparation.',
    'Beginner',
    52000,
    92000,
    2.0,
    true
  ),
  (
    'Academic English Writing',
    'Learn to write essays, reports, and academic papers in English. Improve vocabulary and writing style.',
    'Intermediate',
    68000,
    125000,
    2.5,
    true
  ),
  (
    'English Conversation Practice',
    'Develop speaking and listening skills through interactive lessons and real-life scenarios.',
    'Intermediate',
    62000,
    115000,
    2.2,
    true
  ),
  (
    'Chemistry for Beginners',
    'Introduction to atoms, molecules, chemical reactions, and the periodic table. Laboratory experiments included.',
    'Beginner',
    58000,
    NULL,
    2.3,
    true
  ),
  (
    'Physics Mechanics',
    'Study motion, forces, energy, and momentum with practical examples and problem-solving techniques.',
    'Intermediate',
    72000,
    130000,
    2.8,
    true
  ),
  (
    'Logic and Problem Solving',
    'Develop critical thinking skills through logic puzzles, patterns, and mathematical reasoning.',
    'Intermediate',
    50000,
    88000,
    1.5,
    true
  ),
  (
    'Algorithm Design',
    'Learn algorithmic thinking, problem-solving strategies, and computational logic.',
    'Advanced',
    80000,
    145000,
    3.2,
    true
  )
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- LINK COURSES TO CATEGORIES
-- =====================================================
-- Note: Run this after courses are inserted to get the correct UUIDs

-- Link Mathematics courses to Mathematics category
INSERT INTO course_categories (course_id, category_id)
SELECT c.id, cat.id
FROM courses c
CROSS JOIN categories cat
WHERE cat.slug = 'mathematics'
  AND c.slug IN (
    'basic-geometry-and-measurement',
    'introduction-to-algebra',
    'advanced-calculus',
    'statistics-essentials',
    'linear-algebra-fundamentals',
    'matematikiyn-undes',
    'geometriyn-suur'
  )
ON CONFLICT DO NOTHING;

-- Link Algebra courses to Algebra category
INSERT INTO course_categories (course_id, category_id)
SELECT c.id, cat.id
FROM courses c
CROSS JOIN categories cat
WHERE cat.slug = 'algebra'
  AND c.slug IN (
    'introduction-to-algebra',
    'linear-algebra-fundamentals'
  )
ON CONFLICT DO NOTHING;

-- Link Calculus courses to Calculus category
INSERT INTO course_categories (course_id, category_id)
SELECT c.id, cat.id
FROM courses c
CROSS JOIN categories cat
WHERE cat.slug = 'calculus'
  AND c.slug IN (
    'advanced-calculus'
  )
ON CONFLICT DO NOTHING;

-- Link Statistics courses to Statistics category
INSERT INTO course_categories (course_id, category_id)
SELECT c.id, cat.id
FROM courses c
CROSS JOIN categories cat
WHERE cat.slug = 'statistics'
  AND c.slug IN (
    'statistics-essentials'
  )
ON CONFLICT DO NOTHING;

-- Link Logic courses to Logic category
INSERT INTO course_categories (course_id, category_id)
SELECT c.id, cat.id
FROM courses c
CROSS JOIN categories cat
WHERE cat.slug = 'logic'
  AND c.slug IN (
    'logic-and-problem-solving',
    'algorithm-design'
  )
ON CONFLICT DO NOTHING;

-- Link Physics courses to Physics category
INSERT INTO course_categories (course_id, category_id)
SELECT c.id, cat.id
FROM courses c
CROSS JOIN categories cat
WHERE cat.slug = 'physics'
  AND c.slug IN (
    'fizikin-undes',
    'physics-mechanics'
  )
ON CONFLICT DO NOTHING;

-- Link Chemistry courses to Chemistry category
INSERT INTO course_categories (course_id, category_id)
SELECT c.id, cat.id
FROM courses c
CROSS JOIN categories cat
WHERE cat.slug = 'chemistry'
  AND c.slug IN (
    'khimiyn-undes',
    'chemistry-for-beginners'
  )
ON CONFLICT DO NOTHING;

-- Link English courses to English category
INSERT INTO course_categories (course_id, category_id)
SELECT c.id, cat.id
FROM courses c
CROSS JOIN categories cat
WHERE cat.slug = 'english'
  AND c.slug IN (
    'english-grammar-fundamentals',
    'academic-english-writing',
    'english-conversation-practice'
  )
ON CONFLICT DO NOTHING;

-- Link Mongolian language courses to Mongolian category
INSERT INTO course_categories (course_id, category_id)
SELECT c.id, cat.id
FROM courses c
CROSS JOIN categories cat
WHERE cat.slug = 'mongol-khel'
  AND c.slug IN (
    'mongol-khel-bichig'
  )
ON CONFLICT DO NOTHING;
