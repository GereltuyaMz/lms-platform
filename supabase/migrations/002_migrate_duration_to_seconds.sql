-- =====================================================
-- MIGRATION: Convert duration_minutes to duration_seconds
-- =====================================================
-- This migration updates the lessons table to store duration in seconds
-- instead of minutes for more precise video duration display (e.g., 8:10, 16:23)
--
-- IMPORTANT: Run this migration ONLY if you have an existing database
-- with duration_minutes. If you're starting fresh, use the updated
-- 001_create_courses_schema.sql instead.

-- Step 1: Add new duration_seconds column
ALTER TABLE lessons
ADD COLUMN IF NOT EXISTS duration_seconds INTEGER;

-- Step 2: Convert existing duration_minutes data to seconds
-- Multiply minutes by 60 to get seconds
UPDATE lessons
SET duration_seconds = duration_minutes * 60
WHERE duration_minutes IS NOT NULL;

-- Step 3: Drop old duration_minutes column
ALTER TABLE lessons
DROP COLUMN IF EXISTS duration_minutes;

-- Step 4: Update constraint to use duration_seconds
ALTER TABLE lessons
DROP CONSTRAINT IF EXISTS duration_positive;

ALTER TABLE lessons
ADD CONSTRAINT duration_seconds_positive
CHECK (duration_seconds IS NULL OR duration_seconds > 0);

-- Step 5: Update calculate_course_stats function
DROP FUNCTION IF EXISTS calculate_course_stats(UUID);

CREATE OR REPLACE FUNCTION calculate_course_stats(course_uuid UUID)
RETURNS TABLE (
  lesson_count BIGINT,
  total_duration_seconds INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*) as lesson_count,
    COALESCE(SUM(duration_seconds), 0)::INTEGER as total_duration_seconds
  FROM lessons
  WHERE course_id = course_uuid;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- COMMENTS
-- =====================================================
COMMENT ON COLUMN lessons.duration_seconds IS 'Duration of the lesson in seconds (for videos). Example: 490 seconds = 8:10';
