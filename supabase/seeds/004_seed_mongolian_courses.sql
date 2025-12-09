-- Seed: Mongolian ЭЕШ-Aligned Courses
-- Description: Replaces existing courses with 10 ЭЕШ-focused Mongolian courses
-- Dependencies: Requires teachers table with seeded data

-- ======================
-- CLEANUP: Delete existing courses
-- ======================

-- Delete existing courses (cascades to lessons, enrollments, etc.)
DELETE FROM courses;

-- Reset sequence if needed
ALTER SEQUENCE IF EXISTS courses_id_seq RESTART WITH 1;

-- ======================
-- GET TEACHER IDs FOR REFERENCE
-- ======================

-- We'll use teacher names to get their IDs and assign courses

DO $$
DECLARE
  -- Teacher IDs
  batjargal_id UUID;
  ariunaa_id UUID;
  tomorbaatar_id UUID;
  sarantuya_id UUID;
  nominchimeg_id UUID;
  oyungerel_id UUID;
  erdene_id UUID;
  gantulga_id UUID;
BEGIN
  -- Fetch teacher IDs
  SELECT id INTO batjargal_id FROM teachers WHERE full_name = 'Batjargal Dorj';
  SELECT id INTO ariunaa_id FROM teachers WHERE full_name = 'Ariunaa Tsedev';
  SELECT id INTO tomorbaatar_id FROM teachers WHERE full_name = 'Tomorbaatar Ganbold';
  SELECT id INTO sarantuya_id FROM teachers WHERE full_name = 'Sarantuya Bat';
  SELECT id INTO nominchimeg_id FROM teachers WHERE full_name = 'Nominchimeg Enkh';
  SELECT id INTO oyungerel_id FROM teachers WHERE full_name = 'Oyungerel Davaa';
  SELECT id INTO erdene_id FROM teachers WHERE full_name = 'Erdene-Ochir Sukhbaatar';
  SELECT id INTO gantulga_id FROM teachers WHERE full_name = 'Gantulga Nyam';

  -- ======================
  -- MATHEMATICS COURSES (4)
  -- ======================

  -- Math: Algebra
  INSERT INTO courses (
    title,
    description,
    level,
    price,
    original_price,
    duration_hours,
    instructor_id,
    is_published
  ) VALUES (
    'Математик - Алгебр',
    'ЭЕШ-д бэлтгэх алгебрын суурь хичээл. Нэг болон олон хувьсагчтай тэгшитгэл, тэгшитгэлийн систем, функц, график, квадрат тэгшитгэл, тэнцэтгэл биш. Практик жишээнүүд болон дасгалуудтай. ЭЕШ-ийн хэв маягт нийцүүлсэн асуултууд.',
    'Intermediate',
    55000,
    95000,
    2.5,
    batjargal_id,
    true
  );

  -- Math: Geometry
  INSERT INTO courses (
    title,
    description,
    level,
    price,
    original_price,
    duration_hours,
    instructor_id,
    is_published
  ) VALUES (
    'Математик - Геометр',
    'Хавтгай болон огторгуйн геометр. Гурвалжин, дөрвөлжин, тойрог, цилиндр, бөмбөрцөг. Талбай болон эзлэхүүн тооцоолох аргууд. Огторгуйн геометрийн үндэс. ЭЕШ-ийн геометрийн хэсэгт бэлтгэнэ.',
    'Intermediate',
    58000,
    NULL,
    2.8,
    batjargal_id,
    true
  );

  -- Math: Number Theory
  INSERT INTO courses (
    title,
    description,
    level,
    price,
    original_price,
    duration_hours,
    instructor_id,
    is_published
  ) VALUES (
    'Математик - Тооны онол',
    'Анхны тоо, хуваагдах, хамгийн их нийтлэг хуваагч (ХИНХ), хамгийн бага нийтлэг хуваагдагч (ХБНХ), модулийн арифметик. ЭЕШ-ийн тооны онолын асуултууд. Олимпиадын жишээ асуултууд.',
    'Advanced',
    62000,
    110000,
    3.0,
    gantulga_id,
    true
  );

  -- Math: Probability & Statistics
  INSERT INTO courses (
    title,
    description,
    level,
    price,
    original_price,
    duration_hours,
    instructor_id,
    is_published
  ) VALUES (
    'Математик - Тохромол ба Статистик',
    'Магадлалын үндэс ойлголт, тохромлын тархалт, статистикийн үндсэн хэмжигдэхүүн. Дундаж, дисперси, стандарт хазайлт. ЭЕШ-ийн статистикийн асуултууд. Практик даалгаврууд.',
    'Beginner',
    48000,
    85000,
    2.0,
    oyungerel_id,
    true
  );

  -- ======================
  -- PHYSICS COURSES (3)
  -- ======================

  -- Physics: Mechanics
  INSERT INTO courses (
    title,
    description,
    level,
    price,
    original_price,
    duration_hours,
    instructor_id,
    is_published
  ) VALUES (
    'Физик - Механик',
    'Хөдөлгөөн, хурд, хурдатгал, хүч, Ньютоны хуулиуд. Ажил, энерги, чадал. Импульс, цохилт. Эргэх хөдөлгөөн. ЭЕШ-ийн механикийн асуултууд. Лаборатори туршилтууд.',
    'Intermediate',
    62000,
    105000,
    3.2,
    ariunaa_id,
    true
  );

  -- Physics: Electricity
  INSERT INTO courses (
    title,
    description,
    level,
    price,
    original_price,
    duration_hours,
    instructor_id,
    is_published
  ) VALUES (
    'Физик - Цахилгаан ба Соронзон',
    'Цахилгааны орон, потенциал, хүчдэл, гүйдэл, эсэргүүцэл, Омын хууль. Цахилгааны хэлхээ. Соронзон орон, цахилгаан соронзон индукц. ЭЕШ-ийн цахилгааны хэсэг.',
    'Advanced',
    65000,
    115000,
    3.5,
    ariunaa_id,
    true
  );

  -- Physics: Thermodynamics
  INSERT INTO courses (
    title,
    description,
    level,
    price,
    original_price,
    duration_hours,
    instructor_id,
    is_published
  ) VALUES (
    'Физик - Дулааны Физик',
    'Температур, дулаан, дотоод энерги. Термодинамикийн эхний ба хоёрдугаар хууль. Агаарын даралт. Хийн хуулиуд. ЭЕШ-ийн дулааны физикийн асуултууд.',
    'Intermediate',
    58000,
    100000,
    2.8,
    erdene_id,
    true
  );

  -- ======================
  -- CHEMISTRY COURSES (2)
  -- ======================

  -- Chemistry: General Chemistry
  INSERT INTO courses (
    title,
    description,
    level,
    price,
    original_price,
    duration_hours,
    instructor_id,
    is_published
  ) VALUES (
    'Хими - Энгийн Хими',
    'Атомын бүтэц, үелэх систем, химийн холбоо, молекулын бүтэц. Химийн урвал, урвалын хурд, тэнцвэр. Хүчил, суурь, давс. ЭЕШ-ийн хими. Лабораторийн ажил.',
    'Beginner',
    52000,
    90000,
    2.5,
    tomorbaatar_id,
    true
  );

  -- Chemistry: Organic Chemistry
  INSERT INTO courses (
    title,
    description,
    level,
    price,
    original_price,
    duration_hours,
    instructor_id,
    is_published
  ) VALUES (
    'Хими - Органик Хими',
    'Органик нэгдлүүдийн ангилал, нэрлэх, бүтэц. Алкан, алкен, алкин, ароматик нэгдэл. Спирт, альдегид, кетон, карбоны хүчил. Органик урвал. ЭЕШ-ийн органик хими.',
    'Advanced',
    68000,
    120000,
    3.8,
    tomorbaatar_id,
    true
  );

  -- ======================
  -- LANGUAGE COURSE (1)
  -- ======================

  -- English for ЭЕШ
  INSERT INTO courses (
    title,
    description,
    level,
    price,
    original_price,
    duration_hours,
    instructor_id,
    is_published
  ) VALUES (
    'Англи хэл - ЭЕШ Бэлтгэл',
    'ЭЕШ-ийн англи хэлний дүрэм, найруулга, уншлага, сонсох чадвар. Грамматикийн үндсэн хэсгүүд. Эссэ бичих арга барил. Үг сан өргөжүүлэх. ЭЕШ-ийн хэв маягт нийцсэн дасгалууд.',
    'Intermediate',
    55000,
    95000,
    3.0,
    sarantuya_id,
    true
  );

  -- Log completion
  RAISE NOTICE 'Successfully seeded % ЭЕШ-aligned Mongolian courses', (SELECT COUNT(*) FROM courses);
END $$;

-- ======================
-- CREATE CATEGORIES
-- ======================

-- Delete existing categories
DELETE FROM categories;

-- Insert Mongolian categories
INSERT INTO categories (name, slug, description) VALUES
  ('Математик', 'matematikiin', 'Математикийн хичээлүүд'),
  ('Физик', 'fizik', 'Физикийн хичээлүүд'),
  ('Хими', 'khimi', 'Химийн хичээлүүд'),
  ('Хэл', 'khel', 'Хэлний хичээлүүд');

-- ======================
-- LINK COURSES TO CATEGORIES
-- ======================

DO $$
DECLARE
  math_cat_id UUID;
  physics_cat_id UUID;
  chem_cat_id UUID;
  lang_cat_id UUID;
BEGIN
  -- Get category IDs
  SELECT id INTO math_cat_id FROM categories WHERE slug = 'matematikiin';
  SELECT id INTO physics_cat_id FROM categories WHERE slug = 'fizik';
  SELECT id INTO chem_cat_id FROM categories WHERE slug = 'khimi';
  SELECT id INTO lang_cat_id FROM categories WHERE slug = 'khel';

  -- Delete existing course-category links
  DELETE FROM course_categories;

  -- Link math courses
  INSERT INTO course_categories (course_id, category_id)
  SELECT c.id, math_cat_id
  FROM courses c
  WHERE c.title LIKE 'Математик%';

  -- Link physics courses
  INSERT INTO course_categories (course_id, category_id)
  SELECT c.id, physics_cat_id
  FROM courses c
  WHERE c.title LIKE 'Физик%';

  -- Link chemistry courses
  INSERT INTO course_categories (course_id, category_id)
  SELECT c.id, chem_cat_id
  FROM courses c
  WHERE c.title LIKE 'Хими%';

  -- Link language course
  INSERT INTO course_categories (course_id, category_id)
  SELECT c.id, lang_cat_id
  FROM courses c
  WHERE c.title LIKE 'Англи%';

  RAISE NOTICE 'Successfully linked courses to categories';
END $$;
