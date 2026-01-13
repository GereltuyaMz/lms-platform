-- ================================================
-- Add category to get_mock_test_data RPC
-- ================================================
-- The mock test results page needs the category to build the correct retry URL.
-- Route structure: /mock-test/[category]/[testId]

CREATE OR REPLACE FUNCTION get_mock_test_data(test_id UUID)
RETURNS JSON AS $$
  SELECT json_build_object(
    'id', mt.id,
    'title', mt.title,
    'description', mt.description,
    'category', mt.category,
    'time_limit_minutes', mt.time_limit_minutes,
    'total_questions', mt.total_questions,
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
  'Fetches full test data structure for client. Includes category for routing. Excludes correct answers for security.';
