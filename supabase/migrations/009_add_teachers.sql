-- Migration: Teachers/Instructors System
-- Description: Creates teachers table and links courses to instructors
-- Dependencies: Requires courses table from 001_create_courses_schema migration

-- ======================
-- CREATE TEACHERS TABLE
-- ======================

CREATE TABLE teachers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,                    -- English name (for internal use)
  full_name_mn TEXT NOT NULL,                 -- Mongolian name (display)
  bio_mn TEXT,                                -- Mongolian biography
  avatar_url TEXT,                            -- Profile picture URL
  specialization TEXT[],                      -- Array of specialties (e.g., ['Математик', 'Физик'])
  credentials_mn TEXT,                        -- Education and experience in Mongolian
  years_experience INTEGER,                   -- Years of teaching experience
  is_active BOOLEAN DEFAULT true,             -- Active status
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ======================
-- ADD INSTRUCTOR RELATIONSHIP TO COURSES
-- ======================

-- Add instructor_id column to courses table
ALTER TABLE courses
  ADD COLUMN instructor_id UUID REFERENCES teachers(id) ON DELETE SET NULL;

-- Create index for faster lookups
CREATE INDEX idx_courses_instructor ON courses(instructor_id);

-- ======================
-- INDEXES
-- ======================

CREATE INDEX idx_teachers_active ON teachers(is_active);
CREATE INDEX idx_teachers_specialization ON teachers USING GIN(specialization);

-- ======================
-- TRIGGERS
-- ======================

-- Update teachers.updated_at timestamp
CREATE OR REPLACE FUNCTION update_teachers_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_teachers_updated_at
  BEFORE UPDATE ON teachers
  FOR EACH ROW
  EXECUTE FUNCTION update_teachers_timestamp();

-- ======================
-- SEED DATA: Realistic Mongolian Teachers
-- ======================

INSERT INTO teachers (
  full_name,
  full_name_mn,
  bio_mn,
  specialization,
  credentials_mn,
  years_experience,
  avatar_url
) VALUES
(
  'Batjargal Dorj',
  'Батжаргал Дорж',
  'МУИС-ийн математикийн тэнхимийн ахлах багш. 15 жилийн туршлагатай. ЭЕШ-ийн математикийн хичээлд мэргэшсэн. Олон жил математикийн олимпиадын дасгалжуулагчаар ажилласан. Алгебр, геометр, тооны онолын чиглэлээр судалгааны ажил хийж байна.',
  ARRAY['Математик', 'Алгебр', 'Геометр'],
  'МУИС математикийн магистр, Математикийн олимпиадын дасгалжуулагч, 15 жилийн багшлах туршлага',
  15,
  '/teachers/batjargal.jpg'
),
(
  'Ariunaa Tsedev',
  'Ариунаа Цэдэв',
  'ШУТИС-ийн физикийн багш. 12 жилийн туршлагатай. ЭЕШ-д бэлтгэх хичээлийг амжилттай заадаг. Физикийн олимпиадын шалгаруулагч. Механик, цахилгаан, дулааны физикийн чиглэлээр мэргэшсэн. 2023 онд шилдэг багшаар шалгарсан.',
  ARRAY['Физик', 'Механик', 'Цахилгаан'],
  'ШУТИС физикийн магистр, Физикийн олимпиадын шалгаруулагч, Шилдэг багш 2023',
  12,
  '/teachers/ariunaa.jpg'
),
(
  'Tomorbaatar Ganbold',
  'Төмөрбаатар Ганболд',
  'МУИС-ийн химийн тэнхимийн багш. Органик болон энгийн химийн хичээлийг зааж байна. ЭЕШ-ийн химийн хичээлд мэргэшсэн. 10 жилийн туршлагатай. Оюутнуудыг химийн хичээлд сонирхуулах өвөрмөц аргуудтай.',
  ARRAY['Хими', 'Органик хими', 'Энгийн хими'],
  'МУИС химийн магистр, 10 жилийн туршлага',
  10,
  '/teachers/tomorbaatar.jpg'
),
(
  'Sarantuya Bat',
  'Сарантуяа Бат',
  'Англи хэлний мэргэжилтэн багш. 8 жилийн туршлагатай. ЭЕШ-ийн англи хэлний дүрэм, найруулга, уншлага зааж байна. IELTS сорилд бэлтгэх хичээлийг мөн зааж байна. Кембриджийн багшийн гэрчилгээтэй.',
  ARRAY['Англи хэл', 'IELTS', 'Дүрэм'],
  'Кембриджийн CELTA гэрчилгээтэй, 8 жилийн туршлага',
  8,
  '/teachers/sarantuya.jpg'
),
(
  'Nominchimeg Enkh',
  'Номинчимэг Энх',
  'Монгол хэл бичгийн багш. 14 жилийн туршлагатай. ЭЕШ-ийн монгол хэлний дүрэм зүй, уран зохиолын хичээлийг заадаг. МУИС-ийн монгол хэл, уран зохиолын тэнхимд суралцсан. Олон оюутнуудыг ЭЕШ-д амжилттай бэлтгэсэн.',
  ARRAY['Монгол хэл', 'Дүрэм зүй', 'Уран зохиол'],
  'МУИС монгол хэл, уран зохиолын магистр, 14 жилийн туршлага',
  14,
  '/teachers/nominchimeg.jpg'
),
(
  'Oyungerel Davaa',
  'Оюунгэрэл Даваа',
  'МУИС-ийн математикийн тэнхимийн багш. Тохромол, статистикийн хичээлийг зааж байна. 7 жилийн туршлагатай. Магадлал, статистикийн чиглэлээр судалгааны ажил хийж байна.',
  ARRAY['Математик', 'Тохромол', 'Статистик'],
  'МУИС статистикийн магистр, 7 жилийн туршлага',
  7,
  '/teachers/oyungerel.jpg'
),
(
  'Erdene-Ochir Sukhbaatar',
  'Эрдэнэ-Очир Сүхбаатар',
  'ШУТИС-ийн физикийн тэнхимийн багш. Дулааны физик, термодинамикийн хичээлийг зааж байна. 9 жилийн туршлагатай. ЭЕШ-ийн физикийн хичээлд мэргэшсэн.',
  ARRAY['Физик', 'Дулааны физик', 'Термодинамик'],
  'ШУТИС физикийн магистр, 9 жилийн туршлага',
  9,
  '/teachers/erdene-ochir.jpg'
),
(
  'Gantulga Nyam',
  'Гантулга Ням',
  'Математикийн тооны онолын багш. МУИС-д төгссөн. Анхны тоо, хуваагдах, модулын хичээлийг зааж байна. 11 жилийн туршлагатай. Олимпиадын дасгалжуулагч.',
  ARRAY['Математик', 'Тооны онол'],
  'МУИС математикийн магистр, Олимпиадын дасгалжуулагч, 11 жилийн туршлага',
  11,
  '/teachers/gantulga.jpg'
);

-- Log completion
DO $$
DECLARE
  teacher_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO teacher_count FROM teachers;
  RAISE NOTICE 'Successfully created teachers table and seeded % teachers', teacher_count;
END $$;

-- ======================
-- COMMENTS
-- ======================

COMMENT ON TABLE teachers IS 'Stores instructor/teacher profiles with Mongolian biographical information';
COMMENT ON COLUMN teachers.specialization IS 'Array of subject specializations in Mongolian';
COMMENT ON COLUMN courses.instructor_id IS 'Links course to its instructor';
