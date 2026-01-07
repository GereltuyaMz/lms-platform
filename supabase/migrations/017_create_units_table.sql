-- =====================================================
-- UNITS TABLE
-- =====================================================
-- Creates the units table for course content hierarchy
-- Structure: Course → Units → Lessons + Quiz per unit
-- Run after existing migrations

-- =====================================================
-- CREATE UNITS TABLE
-- =====================================================
CREATE TABLE units (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  title_mn TEXT,                    -- Mongolian title
  description TEXT,
  slug TEXT NOT NULL,
  order_index INTEGER NOT NULL,     -- Order within course
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Each unit must have unique slug within a course
  UNIQUE(course_id, slug),
  -- Each unit must have unique order within a course
  UNIQUE(course_id, order_index)
);

-- =====================================================
-- INDEXES
-- =====================================================
CREATE INDEX idx_units_course ON units(course_id);
CREATE INDEX idx_units_order ON units(course_id, order_index);

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Auto-update updated_at timestamp
CREATE TRIGGER update_units_updated_at
  BEFORE UPDATE ON units
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Auto-generate slug from title (uses existing function)
CREATE TRIGGER generate_unit_slug
  BEFORE INSERT OR UPDATE OF title ON units
  FOR EACH ROW
  EXECUTE FUNCTION generate_slug_from_name();

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Get all units for a course with lesson count
CREATE OR REPLACE FUNCTION get_course_units(course_uuid UUID)
RETURNS TABLE (
  unit_id UUID,
  unit_title TEXT,
  unit_title_mn TEXT,
  unit_description TEXT,
  unit_slug TEXT,
  unit_order INTEGER,
  lesson_count BIGINT,
  total_duration_seconds BIGINT,
  has_quiz BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    u.id as unit_id,
    u.title as unit_title,
    u.title_mn as unit_title_mn,
    u.description as unit_description,
    u.slug as unit_slug,
    u.order_index as unit_order,
    COUNT(l.id) as lesson_count,
    COALESCE(SUM(l.duration_seconds), 0) as total_duration_seconds,
    EXISTS(SELECT 1 FROM quiz_questions qq WHERE qq.unit_id = u.id) as has_quiz
  FROM units u
  LEFT JOIN lessons l ON l.unit_id = u.id
  WHERE u.course_id = course_uuid
  GROUP BY u.id
  ORDER BY u.order_index;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- COMMENTS
-- =====================================================
COMMENT ON TABLE units IS 'Units within courses containing grouped lessons and a quiz';
COMMENT ON COLUMN units.title IS 'Unit title in English';
COMMENT ON COLUMN units.title_mn IS 'Unit title in Mongolian';
COMMENT ON COLUMN units.order_index IS 'Display order within the course (1-based)';
COMMENT ON FUNCTION get_course_units IS 'Returns all units for a course with lesson stats';

-- =====================================================
-- ADD UNIT_CONTENT COLUMN TO UNITS TABLE
-- =====================================================
-- Adds a unit_content field to group units within a course
-- under content sections (e.g., "ТОО ТООЛОЛ", "АЛГЕБР")

-- Add unit_content column
ALTER TABLE units
ADD COLUMN IF NOT EXISTS unit_content TEXT;

-- Add index for efficient grouping queries
CREATE INDEX IF NOT EXISTS idx_units_content ON units(course_id, unit_content);

-- Drop existing function first (required when changing return type)
DROP FUNCTION IF EXISTS get_course_units(uuid);

-- Recreate the get_course_units function with unit_content
CREATE OR REPLACE FUNCTION get_course_units(course_uuid UUID)
RETURNS TABLE (
  unit_id UUID,
  unit_title TEXT,
  unit_title_mn TEXT,
  unit_description TEXT,
  unit_slug TEXT,
  unit_order INTEGER,
  unit_content TEXT,
  lesson_count BIGINT,
  total_duration_seconds BIGINT,
  has_quiz BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    u.id as unit_id,
    u.title as unit_title,
    u.title_mn as unit_title_mn,
    u.description as unit_description,
    u.slug as unit_slug,
    u.order_index as unit_order,
    u.unit_content as unit_content,
    COUNT(l.id) as lesson_count,
    COALESCE(SUM(l.duration_seconds), 0) as total_duration_seconds,
    EXISTS(SELECT 1 FROM quiz_questions qq WHERE qq.unit_id = u.id) as has_quiz
  FROM units u
  LEFT JOIN lessons l ON l.unit_id = u.id
  WHERE u.course_id = course_uuid
  GROUP BY u.id
  ORDER BY u.order_index;
END;
$$ LANGUAGE plpgsql;

-- Add comment
COMMENT ON COLUMN units.unit_content IS 'Content section grouping for units within a course (e.g., ТОО ТООЛОЛ, АЛГЕБР)';
