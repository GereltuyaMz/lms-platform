-- =====================================================
-- ADD UNIT_CONTENT TO UNITS TABLE
-- =====================================================
-- Adds unit_content field to units table for content type categorization
-- This allows categorizing units by their content type (theory, practice, etc.)

-- =====================================================
-- ALTER TABLE
-- =====================================================
ALTER TABLE units
ADD COLUMN unit_content TEXT;

-- =====================================================
-- ADD CHECK CONSTRAINT
-- =====================================================
-- Ensure only valid unit content types are used
ALTER TABLE units
ADD CONSTRAINT units_unit_content_check
CHECK (unit_content IS NULL OR unit_content IN (
  'Тоо Тоолол',           -- Онол
  'Алгебр',         -- Дадлага
  'Анализын эхлэл',            -- Холимог
  'Геометр ба тригонометр',             -- Тест
  'Магадлал, статистик'           -- Төсөл
));

-- =====================================================
-- CREATE INDEX
-- =====================================================
CREATE INDEX idx_units_content ON units(course_id, unit_content);

-- =====================================================
-- COMMENTS
-- =====================================================
COMMENT ON COLUMN units.unit_content IS 'Content type for unit categorization (theory, practice, mixed, quiz, project)';

ALTER TABLE units DROP CONSTRAINT units_unit_content_check;