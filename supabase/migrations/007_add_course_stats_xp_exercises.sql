-- =====================================================
-- MIGRATION: Add XP and Exercise Count to Course Stats
-- =====================================================
-- This migration updates calculate_course_stats to include:
-- 1. Total exercise/quiz question count
-- 2. Estimated total XP for completing the course

DROP FUNCTION IF EXISTS calculate_course_stats(UUID);

CREATE OR REPLACE FUNCTION calculate_course_stats(course_uuid UUID)
RETURNS TABLE (
  lesson_count BIGINT,
  total_duration_seconds INTEGER,
  exercise_count BIGINT,
  total_xp INTEGER
) AS $$
DECLARE
  video_xp INTEGER := 0;
  quiz_xp INTEGER := 0;
  text_xp INTEGER := 0;
  milestone_xp INTEGER := 1400; -- 25% + 50% + 75% + 100% milestones
BEGIN
  -- Calculate video lesson XP
  -- Base 50 XP + 5 XP per 5 minutes (duration_seconds / 300 * 5)
  SELECT
    COALESCE(SUM(
      50 + (COALESCE(duration_seconds, 0) / 300 * 5)
    ), 0)::INTEGER
  INTO video_xp
  FROM lessons
  WHERE course_id = course_uuid
    AND lesson_type = 'video';

  -- Calculate quiz XP (average 125 XP per quiz)
  SELECT
    COALESCE(COUNT(*) * 125, 0)::INTEGER
  INTO quiz_xp
  FROM lessons
  WHERE course_id = course_uuid
    AND lesson_type = 'quiz';

  -- Calculate text lesson XP (30 XP each)
  SELECT
    COALESCE(COUNT(*) * 30, 0)::INTEGER
  INTO text_xp
  FROM lessons
  WHERE course_id = course_uuid
    AND lesson_type = 'text';

  RETURN QUERY
  SELECT
    COUNT(l.id) as lesson_count,
    COALESCE(SUM(l.duration_seconds), 0)::INTEGER as total_duration_seconds,
    COALESCE(
      (SELECT COUNT(*)
       FROM lessons
       WHERE course_id = course_uuid
         AND lesson_type IN ('quiz', 'assignment')),
      0
    ) as exercise_count,
    (video_xp + quiz_xp + text_xp + milestone_xp)::INTEGER as total_xp
  FROM lessons l
  WHERE l.course_id = course_uuid;
END;
$$ LANGUAGE plpgsql;

-- Add helpful comment
COMMENT ON FUNCTION calculate_course_stats IS 'Calculates comprehensive course statistics including lesson count, total duration, exercise count, and estimated total XP for completing the course';
