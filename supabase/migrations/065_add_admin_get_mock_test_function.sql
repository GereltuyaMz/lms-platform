-- ================================================
-- Admin RPC for Mock Test Management
-- ================================================
-- Creates get_mock_test_admin RPC function for admin panel use.
-- Unlike get_mock_test_data (public-facing), this function:
-- - Returns ALL tests (published and unpublished)
-- - Includes is_correct field for editing
-- - Returns is_published status
-- - Uses COALESCE to ensure arrays never return null

CREATE OR REPLACE FUNCTION get_mock_test_admin(test_id UUID)
RETURNS JSON AS $$
  SELECT json_build_object(
    'id', mt.id,
    'title', mt.title,
    'description', mt.description,
    'category', mt.category,
    'time_limit_minutes', mt.time_limit_minutes,
    'total_questions', mt.total_questions,
    'is_published', mt.is_published,
    'sections', COALESCE(
      (
        SELECT json_agg(
          json_build_object(
            'id', s.id,
            'subject', s.subject,
            'title', s.title,
            'order_index', s.order_index,
            'problems', COALESCE(
              (
                SELECT json_agg(
                  json_build_object(
                    'id', p.id,
                    'problem_number', p.problem_number,
                    'title', p.title,
                    'context', p.context,
                    'image_url', p.image_url,
                    'order_index', p.order_index,
                    'questions', COALESCE(
                      (
                        SELECT json_agg(
                          json_build_object(
                            'id', q.id,
                            'question_number', q.question_number,
                            'question_text', q.question_text,
                            'image_url', q.image_url,
                            'explanation', q.explanation,
                            'points', q.points,
                            'order_index', q.order_index,
                            'options', COALESCE(
                              (
                                SELECT json_agg(
                                  json_build_object(
                                    'id', o.id,
                                    'option_text', o.option_text,
                                    'is_correct', o.is_correct,
                                    'image_url', o.image_url,
                                    'order_index', o.order_index
                                  ) ORDER BY o.order_index
                                )
                                FROM mock_test_options o
                                WHERE o.question_id = q.id
                              ),
                              '[]'::json
                            )
                          ) ORDER BY q.order_index
                        )
                        FROM mock_test_questions q
                        WHERE q.problem_id = p.id
                      ),
                      '[]'::json
                    )
                  ) ORDER BY p.order_index
                )
                FROM mock_test_problems p
                WHERE p.section_id = s.id
              ),
              '[]'::json
            )
          ) ORDER BY s.order_index
        )
        FROM mock_test_sections s
        WHERE s.mock_test_id = mt.id
      ),
      '[]'::json
    )
  )
  FROM mock_tests mt
  WHERE mt.id = test_id;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

COMMENT ON FUNCTION get_mock_test_admin IS
  'Admin-only RPC to fetch complete mock test data including is_correct field and unpublished tests. Uses COALESCE to prevent null arrays.';

-- Grant execute to authenticated users (RLS will still check admin role)
GRANT EXECUTE ON FUNCTION get_mock_test_admin TO authenticated;
