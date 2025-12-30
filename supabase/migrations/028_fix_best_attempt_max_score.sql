-- ================================================
-- Fix max_score: Add column, backfill data, update RPC
-- ================================================

BEGIN;

-- Step 1: Add max_score column to mock_test_attempts table
ALTER TABLE mock_test_attempts
ADD COLUMN IF NOT EXISTS max_score INTEGER;

-- Step 2: Backfill max_score for existing attempts
UPDATE mock_test_attempts a
SET max_score = (
  SELECT COALESCE(SUM(q.points), 0)
  FROM mock_test_questions q
  JOIN mock_test_problems p ON p.id = q.problem_id
  JOIN mock_test_sections s ON s.id = p.section_id
  WHERE s.mock_test_id = a.mock_test_id
)
WHERE max_score IS NULL;

-- Step 3: Update get_best_mock_test_attempt to read from column
CREATE OR REPLACE FUNCTION get_best_mock_test_attempt(
  p_user_id UUID,
  p_test_id UUID
)
RETURNS JSON AS $$
DECLARE
  v_best_attempt JSON;
BEGIN
  SELECT json_build_object(
    'id', a.id,
    'total_score', a.total_score,
    'total_questions', a.total_questions,
    'max_score', a.max_score,
    'percentage', a.percentage,
    'xp_awarded', a.xp_awarded,
    'completed_at', a.completed_at,
    'subject_scores', a.subject_scores
  ) INTO v_best_attempt
  FROM mock_test_attempts a
  WHERE a.user_id = p_user_id
    AND a.mock_test_id = p_test_id
    AND a.is_completed = true
  ORDER BY a.percentage DESC, a.total_score DESC, a.completed_at DESC
  LIMIT 1;

  RETURN v_best_attempt;
END;
$$ LANGUAGE plpgsql STABLE;

COMMIT;
