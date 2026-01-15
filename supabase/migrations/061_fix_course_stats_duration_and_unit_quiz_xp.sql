-- =====================================================
-- MIGRATION: Fix calculate_course_stats Duration and Unit Quiz XP
-- =====================================================
-- This migration fixes three issues in the calculate_course_stats function:
--
-- 1. Duration Calculation:
--    - Now prioritizes lesson_videos.duration_seconds when video is ready
--    - Falls back to lesson_content.duration_seconds for legacy URL videos
--
-- 2. Exercise Count (Quiz Questions):
--    - Now counts BOTH lesson quiz questions AND unit quiz questions
--    - Previous implementation only counted lesson quiz questions
--
-- 3. Unit Quiz XP Calculation:
--    - Fixed potential issue with INNER JOIN returning no rows
--    - Changed to LEFT JOIN to handle courses without unit quizzes
--
-- =====================================================

-- Step 1: Drop the view that depends on the function
DROP VIEW IF EXISTS courses_with_stats;

-- Step 2: Drop and recreate the function
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
      -- Fix: Prioritize lesson_videos duration when available and ready
      COALESCE(
        SUM(
          CASE
            -- Use Bunny video duration when lesson_video_id is set and video is ready
            WHEN lc.lesson_video_id IS NOT NULL AND lv.status = 'ready'
              THEN lv.duration_seconds
            -- Otherwise use lesson_content duration (for URL videos or fallback)
            ELSE lc.duration_seconds
          END
        ),
        0
      )::INTEGER as total_duration_seconds,
      COUNT(DISTINCT lc.id) as content_count
    FROM lessons l
    LEFT JOIN lesson_content lc ON l.id = lc.lesson_id
    -- Fix: Join to lesson_videos table to get Bunny Stream video duration
    LEFT JOIN lesson_videos lv ON lc.lesson_video_id = lv.id
    WHERE l.course_id = course_uuid
  ),
  quiz_question_stats AS (
    -- Fix: Count ALL quiz questions (both lesson and unit quizzes)
    SELECT COUNT(DISTINCT qq.id) as quiz_question_count
    FROM quiz_questions qq
    LEFT JOIN lessons l ON qq.lesson_id = l.id
    LEFT JOIN units u ON qq.unit_id = u.id
    WHERE l.course_id = course_uuid OR u.course_id = course_uuid
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
    -- Fix: Changed to LEFT JOIN to handle courses without unit quizzes
    -- Count units that have quiz questions (unit-level quizzes)
    SELECT COUNT(DISTINCT u.id) as unit_quiz_count
    FROM units u
    LEFT JOIN quiz_questions qq ON u.id = qq.unit_id
    WHERE u.course_id = course_uuid
      -- Only count units that actually have quiz questions
      AND qq.id IS NOT NULL
  )
  SELECT
    cs.lesson_count,
    cs.total_duration_seconds,
    qqs.quiz_question_count as exercise_count,
    (
      -- Content XP: 10 XP per lesson_content item
      (cs.content_count * 10)
      +
      -- Lesson Quiz XP: 22 XP per lesson with quiz (perfect score estimate)
      (lqs.lesson_quiz_count * 22)
      +
      -- Unit Quiz XP: 22 XP per unit with quiz (perfect score estimate)
      (COALESCE(uqs.unit_quiz_count, 0) * 22)
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
  CROSS JOIN quiz_question_stats qqs
  CROSS JOIN lesson_quiz_stats lqs
  CROSS JOIN unit_quiz_stats uqs;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION calculate_course_stats IS 'Calculates course stats with XP System V2: 10 XP per content, 22 XP per quiz (perfect), 50 XP per unit, 250 XP milestones, 150 XP course completion. Now correctly prioritizes lesson_videos duration and handles courses without unit quizzes.';

-- =====================================================
-- Step 3: Recreate the courses_with_stats view
-- =====================================================

CREATE VIEW courses_with_stats AS
SELECT
  c.*,
  COALESCE(stats.lesson_count, 0)::INTEGER as lesson_count,
  COALESCE(stats.total_duration_seconds, 0)::INTEGER as total_duration_seconds,
  COALESCE(stats.exercise_count, 0)::INTEGER as exercise_count,
  COALESCE(stats.total_xp, 0)::INTEGER as total_xp
FROM courses c
LEFT JOIN LATERAL calculate_course_stats(c.id) stats ON true;

COMMENT ON VIEW courses_with_stats IS 'Courses with pre-calculated stats using XP System V2 formula with fixed duration calculation from lesson_videos table.';
