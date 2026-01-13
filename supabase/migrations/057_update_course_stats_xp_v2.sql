-- =====================================================
-- MIGRATION: Update calculate_course_stats for XP System V2
-- =====================================================
-- Updates the XP calculation to match the new XP system:
--
-- Content XP:
-- - Each lesson_content completion: 10 XP (theory or example video)
--
-- Quiz XP (assuming perfect score for estimate):
-- - Lesson quiz: 22 XP per quiz (perfect score)
-- - Unit quiz: 22 XP per quiz (perfect score)
--
-- Completion Bonuses:
-- - Unit completion: 50 XP per unit
-- - Course milestones (25%, 50%, 75%, 100%): 30 + 50 + 70 + 100 = 250 XP
-- - Course completion achievement: 150 XP
--
-- Total milestone bonuses = 250 + 150 = 400 XP

-- Drop the view first since it depends on the function
DROP VIEW IF EXISTS courses_with_stats;

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
  WITH content_stats AS (
    SELECT
      COUNT(DISTINCT l.id) as lesson_count,
      COALESCE(SUM(lc.duration_seconds), 0)::INTEGER as total_duration_seconds,
      COUNT(DISTINCT lc.id) as content_count,
      COUNT(DISTINCT qq.id) as quiz_question_count
    FROM lessons l
    LEFT JOIN lesson_content lc ON l.id = lc.lesson_id
    LEFT JOIN quiz_questions qq ON l.id = qq.lesson_id
    WHERE l.course_id = course_uuid
  ),
  unit_stats AS (
    SELECT COUNT(*) as unit_count
    FROM units
    WHERE course_id = course_uuid
  ),
  lesson_quiz_stats AS (
    -- Count lessons that have quiz questions (lesson-level quizzes)
    SELECT COUNT(DISTINCT l.id) as lesson_quiz_count
    FROM lessons l
    INNER JOIN quiz_questions qq ON l.id = qq.lesson_id
    WHERE l.course_id = course_uuid
  ),
  unit_quiz_stats AS (
    -- Count units that have quiz questions (unit-level quizzes)
    SELECT COUNT(DISTINCT u.id) as unit_quiz_count
    FROM units u
    INNER JOIN quiz_questions qq ON u.id = qq.unit_id
    WHERE u.course_id = course_uuid
  )
  SELECT
    cs.lesson_count,
    cs.total_duration_seconds,
    cs.quiz_question_count as exercise_count,
    (
      -- Content XP: 10 XP per lesson_content item
      (cs.content_count * 10)
      +
      -- Lesson Quiz XP: 22 XP per lesson with quiz (perfect score estimate)
      (lqs.lesson_quiz_count * 22)
      +
      -- Unit Quiz XP: 22 XP per unit with quiz (perfect score estimate)
      (uqs.unit_quiz_count * 22)
      +
      -- Unit Completion XP: 50 XP per unit
      (us.unit_count * 50)
      +
      -- Course Milestones (25%, 50%, 75%, 100%): 30 + 50 + 70 + 100 = 250 XP
      250
      +
      -- Course Completion Achievement: 150 XP
      150
    )::INTEGER as total_xp
  FROM content_stats cs
  CROSS JOIN unit_stats us
  CROSS JOIN lesson_quiz_stats lqs
  CROSS JOIN unit_quiz_stats uqs;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION calculate_course_stats IS 'Calculates course stats with XP System V2: 10 XP per content, 22 XP per quiz (perfect), 50 XP per unit, 250 XP milestones, 150 XP course completion';

-- =====================================================
-- Refresh the courses_with_stats view to use updated function
-- =====================================================
DROP VIEW IF EXISTS courses_with_stats;

CREATE VIEW courses_with_stats AS
SELECT
  c.*,
  COALESCE(stats.lesson_count, 0)::INTEGER as lesson_count,
  COALESCE(stats.total_duration_seconds, 0)::INTEGER as total_duration_seconds,
  COALESCE(stats.total_xp, 0)::INTEGER as total_xp
FROM courses c
LEFT JOIN LATERAL calculate_course_stats(c.id) stats ON true;

COMMENT ON VIEW courses_with_stats IS 'Courses with pre-calculated stats using XP System V2 formula.';

-- Migration: Add total_xp to courses_with_stats view
-- NOTE: This migration is superseded by 058_update_course_stats_xp_v2.sql
-- which updates the XP calculation to match XP System V2
--
-- This file adds the total_xp column structure; 058 updates the formula.

DROP VIEW IF EXISTS courses_with_stats;

CREATE VIEW courses_with_stats AS
SELECT
  c.*,
  COALESCE(stats.lesson_count, 0)::INTEGER as lesson_count,
  COALESCE(stats.total_duration_seconds, 0)::INTEGER as total_duration_seconds,
  COALESCE(stats.total_xp, 0)::INTEGER as total_xp
FROM courses c
LEFT JOIN LATERAL calculate_course_stats(c.id) stats ON true;

COMMENT ON VIEW courses_with_stats IS 'Courses with pre-calculated stats from calculate_course_stats RPC.';

