-- =====================================================
-- MIGRATION: Add XP and Exercise Count to Course Stats
-- =====================================================
-- This migration updates calculate_course_stats to include:
-- 1. Total exercise/quiz question count
-- 2. Estimated total XP for completing the course
-- Updated to use lesson_content table instead of deleted lesson fields

DROP FUNCTION IF EXISTS calculate_course_stats(UUID);

CREATE OR REPLACE FUNCTION calculate_course_stats(course_uuid UUID)
RETURNS TABLE (
  lesson_count BIGINT,
  total_duration_seconds INTEGER,
  exercise_count BIGINT,
  total_xp INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(DISTINCT l.id) as lesson_count,
    COALESCE(SUM(lc.duration_seconds), 0)::INTEGER as total_duration_seconds,
    COUNT(DISTINCT qq.id) as exercise_count,
    (
      -- XP from lesson_content duration: 50 base + 5 per 5 minutes
      COALESCE(SUM(50 + (lc.duration_seconds / 300 * 5)), 0)
      +
      -- XP from quizzes: 100 per quiz question
      (COUNT(DISTINCT qq.id) * 100)
      +
      -- Milestone XP: 25% + 50% + 75% + 100% completion bonuses
      1400
    )::INTEGER as total_xp
  FROM lessons l
  LEFT JOIN lesson_content lc ON l.id = lc.lesson_id
  LEFT JOIN quiz_questions qq ON l.id = qq.lesson_id
  WHERE l.course_id = course_uuid
  GROUP BY l.course_id;
END;
$$ LANGUAGE plpgsql;

-- Add helpful comment
COMMENT ON FUNCTION calculate_course_stats IS 'Calculates comprehensive course statistics including lesson count, total duration, exercise count, and estimated total XP for completing the course';
