-- ================================================
-- Fix get_mock_test_data RPC
-- ================================================
-- Migration 049 dropped passing_score_percentage and EYSH columns.
-- This migration updates get_mock_test_data to stop selecting those columns.

CREATE OR REPLACE FUNCTION get_mock_test_data(test_id UUID)
RETURNS JSON AS $$
  SELECT json_build_object(
    'id', mt.id,
    'title', mt.title,
    'description', mt.description,
    'time_limit_minutes', mt.time_limit_minutes,
    'total_questions', mt.total_questions,
    -- Removed dropped columns: passing_score_percentage, eysh_thresholds
    'sections', (
      SELECT json_agg(
        json_build_object(
          'id', s.id,
          'subject', s.subject,
          'title', s.title,
          'order_index', s.order_index,
          'problems', (
            SELECT json_agg(
              json_build_object(
                'id', p.id,
                'problem_number', p.problem_number,
                'title', p.title,
                'context', p.context,
                'order_index', p.order_index,
                'questions', (
                  SELECT json_agg(
                    json_build_object(
                      'id', q.id,
                      'question_number', q.question_number,
                      'question_text', q.question_text,
                      'explanation', q.explanation,
                      'points', q.points,
                      'order_index', q.order_index,
                      'options', (
                        SELECT json_agg(
                          json_build_object(
                            'id', o.id,
                            'option_text', o.option_text,
                            -- is_correct is explicitly excluded for security
                            'order_index', o.order_index
                          ) ORDER BY o.order_index
                        )
                        FROM mock_test_options o
                        WHERE o.question_id = q.id
                      )
                    ) ORDER BY q.order_index
                  )
                  FROM mock_test_questions q
                  WHERE q.problem_id = p.id
                )
              ) ORDER BY p.order_index
            )
            FROM mock_test_problems p
            WHERE p.section_id = s.id
          )
        ) ORDER BY s.order_index
      )
      FROM mock_test_sections s
      WHERE s.mock_test_id = mt.id
    )
  )
  FROM mock_tests mt
  WHERE mt.id = test_id AND mt.is_published = true;
$$ LANGUAGE sql STABLE;

COMMENT ON FUNCTION get_mock_test_data IS
  'Fetches full test data structure for client. Excludes correct answers (security) and removed legacy scoring fields.';


-- Fix calculate_course_stats to work correctly with lesson_content table
-- The lessons table does NOT have duration_seconds - only lesson_content has it
-- Each lesson can have multiple lesson_content items, we need to sum them all

CREATE OR REPLACE FUNCTION calculate_course_stats(course_uuid UUID)
RETURNS TABLE (
  lesson_count BIGINT,
  total_duration_seconds INTEGER,
  exercise_count BIGINT,
  total_xp INTEGER
) AS $$
DECLARE
  v_lesson_count BIGINT;
  v_total_duration INTEGER;
  v_exercise_count BIGINT;
  v_total_xp INTEGER;
BEGIN
  -- Count lessons
  SELECT COUNT(DISTINCT l.id)
  INTO v_lesson_count
  FROM lessons l
  WHERE l.course_id = course_uuid;

  -- Calculate total duration from lesson_content (sum ALL content items)
  SELECT COALESCE(SUM(lc.duration_seconds), 0)::INTEGER
  INTO v_total_duration
  FROM lessons l
  LEFT JOIN lesson_content lc ON l.id = lc.lesson_id
  WHERE l.course_id = course_uuid;

  -- Count exercises (quiz questions)
  SELECT COUNT(DISTINCT qq.id)
  INTO v_exercise_count
  FROM lessons l
  LEFT JOIN quiz_questions qq ON l.id = qq.lesson_id
  WHERE l.course_id = course_uuid;

  -- Calculate total XP
  -- Video XP: 50 base + (duration_seconds / 300 * 5) per content item
  -- Quiz XP: 100 per question
  -- Milestone bonus: 1400 (if course has lessons)
  SELECT (
    COALESCE(SUM(50 + (COALESCE(lc.duration_seconds, 0) / 300 * 5)), 0) +
    (v_exercise_count * 100) +
    CASE WHEN v_lesson_count > 0 THEN 1400 ELSE 0 END
  )::INTEGER
  INTO v_total_xp
  FROM lessons l
  LEFT JOIN lesson_content lc ON l.id = lc.lesson_id
  WHERE l.course_id = course_uuid;

  RETURN QUERY
  SELECT
    COALESCE(v_lesson_count, 0),
    COALESCE(v_total_duration, 0),
    COALESCE(v_exercise_count, 0),
    COALESCE(v_total_xp, 0);
END;
$$ LANGUAGE plpgsql;
