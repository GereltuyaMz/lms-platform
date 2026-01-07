-- =====================================================
-- ADD UNIT SUPPORT TO LESSONS
-- =====================================================
-- Adds unit_id foreign key to lessons
-- for the unit-based content structure
-- Run after 017_create_units_table.sql

-- =====================================================
-- MODIFY LESSONS TABLE
-- =====================================================

-- Add unit_id column (nullable for backward compatibility)
ALTER TABLE lessons
  ADD COLUMN IF NOT EXISTS unit_id UUID REFERENCES units(id) ON DELETE CASCADE;

-- Add order_in_unit column for ordering lessons within a unit
ALTER TABLE lessons
  ADD COLUMN IF NOT EXISTS order_in_unit INTEGER;

-- =====================================================
-- INDEXES
-- =====================================================

-- Index for unit-based queries
CREATE INDEX IF NOT EXISTS idx_lessons_unit ON lessons(unit_id);

-- Index for ordering within unit
CREATE INDEX IF NOT EXISTS idx_lessons_unit_order ON lessons(unit_id, order_in_unit);

-- =====================================================
-- CONSTRAINTS
-- =====================================================

-- Ensure unique order within a unit (only when unit_id is not null)
-- Using partial unique index since unit_id is nullable
CREATE UNIQUE INDEX IF NOT EXISTS unique_unit_lesson_order
  ON lessons(unit_id, order_in_unit)
  WHERE unit_id IS NOT NULL;

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Get lessons for a specific unit ordered by order_in_unit
-- Updated to use lesson_content table instead of deleted fields
DROP FUNCTION IF EXISTS get_unit_lessons(UUID);

CREATE OR REPLACE FUNCTION get_unit_lessons(unit_uuid UUID)
RETURNS TABLE (
  lesson_id UUID,
  lesson_title TEXT,
  lesson_description TEXT,
  lesson_slug TEXT,
  order_in_unit INTEGER,
  content_count BIGINT,
  quiz_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    l.id as lesson_id,
    l.title as lesson_title,
    l.description as lesson_description,
    l.slug as lesson_slug,
    l.order_in_unit,
    COUNT(DISTINCT lc.id) as content_count,
    COUNT(DISTINCT qq.id) as quiz_count
  FROM lessons l
  LEFT JOIN lesson_content lc ON l.id = lc.lesson_id
  LEFT JOIN quiz_questions qq ON l.id = qq.lesson_id
  WHERE l.unit_id = unit_uuid
  GROUP BY l.id, l.title, l.description, l.slug, l.order_in_unit
  ORDER BY l.order_in_unit NULLS LAST;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- COMMENTS
-- =====================================================
COMMENT ON COLUMN lessons.unit_id IS 'Foreign key to units table. Null for legacy lessons without unit assignment.';
COMMENT ON COLUMN lessons.order_in_unit IS 'Order within the unit (1, 2, 3, etc.)';
COMMENT ON FUNCTION get_unit_lessons IS 'Returns all lessons for a unit ordered by order_in_unit with content and quiz counts';
