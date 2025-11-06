-- =====================================================
-- CREATE MATERIALIZED VIEW FOR COURSE STATS
-- =====================================================
-- This view pre-calculates lesson counts and total duration
-- to avoid N+1 queries when listing courses

CREATE OR REPLACE VIEW courses_with_stats AS
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
COMMENT ON VIEW courses_with_stats IS 'Courses with pre-calculated lesson count and total duration to optimize queries';
