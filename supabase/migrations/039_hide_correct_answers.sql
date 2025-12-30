-- ================================================
-- Hide Correct Answers from Client-Side Test Data
-- ================================================
-- SECURITY FIX: Remove is_correct field from get_mock_test_data RPC
-- This prevents users from inspecting browser dev tools to see correct answers

CREATE OR REPLACE FUNCTION get_mock_test_data(test_id UUID)
RETURNS JSON AS $$
  SELECT json_build_object(
    'id', mt.id,
    'title', mt.title,
    'description', mt.description,
    'time_limit_minutes', mt.time_limit_minutes,
    'total_questions', mt.total_questions,
    'passing_score_percentage', mt.passing_score_percentage,
    'eysh_threshold_500', mt.eysh_threshold_500,
    'eysh_threshold_600', mt.eysh_threshold_600,
    'eysh_threshold_700', mt.eysh_threshold_700,
    'eysh_threshold_800', mt.eysh_threshold_800,
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
                            -- SECURITY FIX: Removed 'is_correct' field
                            -- This prevents clients from seeing correct answers before submission
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

-- Note: The is_correct field is still available server-side in:
-- 1. save_mock_test_answer - to check if answer is correct
-- 2. submit_mock_test_with_answers - to calculate scores
-- 3. Results page - to show which answers were correct AFTER submission
--
-- This change only affects the initial test data sent to the client
