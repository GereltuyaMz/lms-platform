-- Migration: Refresh courses_with_stats view to include instructor_id
-- Description: Recreates the view to include the instructor_id column added in migration 009
-- Dependencies: Requires courses table with instructor_id column (migration 009)

-- Drop and recreate the view to pick up new columns
DROP VIEW IF EXISTS courses_with_stats;

CREATE VIEW courses_with_stats AS
SELECT
  c.*,
  COALESCE(l.lesson_count, 0)::INTEGER as lesson_count,
  COALESCE(l.total_duration_seconds, 0)::INTEGER as total_duration_seconds
FROM courses c
LEFT JOIN (
  SELECT
    course_id,
    COUNT(*) as lesson_count,
    SUM(duration_seconds) as total_duration_seconds
  FROM lessons
  GROUP BY course_id
) l ON c.id = l.course_id;

-- Add comment
COMMENT ON VIEW courses_with_stats IS 'Courses with pre-calculated lesson count and total duration. Includes instructor_id.';
