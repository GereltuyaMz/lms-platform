-- =====================================================
-- ADD UNIT SUPPORT TO LESSONS
-- =====================================================
-- Adds unit_id foreign key to lessons and new lesson types
-- for the unit-based content structure
-- Run after 017_create_units_table.sql

-- =====================================================
-- ADD NEW LESSON TYPES TO ENUM
-- =====================================================
-- New types: theory, easy_example, hard_example
-- These represent the 3 video lessons in each unit

ALTER TYPE lesson_type ADD VALUE 'theory';
ALTER TYPE lesson_type ADD VALUE 'easy_example';
ALTER TYPE lesson_type ADD VALUE 'hard_example';

-- =====================================================
-- MODIFY LESSONS TABLE
-- =====================================================

-- Add unit_id column (nullable for backward compatibility)
ALTER TABLE lessons
  ADD COLUMN unit_id UUID REFERENCES units(id) ON DELETE CASCADE;

-- Add order_in_unit column for ordering lessons within a unit
ALTER TABLE lessons
  ADD COLUMN order_in_unit INTEGER;

-- =====================================================
-- INDEXES
-- =====================================================

-- Index for unit-based queries
CREATE INDEX idx_lessons_unit ON lessons(unit_id);

-- Index for ordering within unit
CREATE INDEX idx_lessons_unit_order ON lessons(unit_id, order_in_unit);

-- =====================================================
-- CONSTRAINTS
-- =====================================================

-- Ensure unique order within a unit (only when unit_id is not null)
-- Using partial unique index since unit_id is nullable
CREATE UNIQUE INDEX unique_unit_lesson_order
  ON lessons(unit_id, order_in_unit)
  WHERE unit_id IS NOT NULL;

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Get lessons for a specific unit ordered by order_in_unit
CREATE OR REPLACE FUNCTION get_unit_lessons(unit_uuid UUID)
RETURNS TABLE (
  lesson_id UUID,
  lesson_title TEXT,
  lesson_description TEXT,
  lesson_slug TEXT,
  lesson_type lesson_type,
  duration_seconds INTEGER,
  order_in_unit INTEGER,
  is_preview BOOLEAN,
  video_url TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    l.id as lesson_id,
    l.title as lesson_title,
    l.description as lesson_description,
    l.slug as lesson_slug,
    l.lesson_type,
    l.duration_seconds,
    l.order_in_unit,
    l.is_preview,
    l.video_url
  FROM lessons l
  WHERE l.unit_id = unit_uuid
  ORDER BY l.order_in_unit NULLS LAST, l.order_index;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- COMMENTS
-- =====================================================
COMMENT ON COLUMN lessons.unit_id IS 'Foreign key to units table. Null for legacy lessons without unit assignment.';
COMMENT ON COLUMN lessons.order_in_unit IS 'Order within the unit (1=theory, 2=easy_example, 3=hard_example typically)';
COMMENT ON FUNCTION get_unit_lessons IS 'Returns all lessons for a unit ordered by order_in_unit';
