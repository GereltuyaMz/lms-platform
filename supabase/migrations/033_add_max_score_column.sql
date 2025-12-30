-- ================================================
-- Add max_score column to mock_test_attempts
-- ================================================
-- This column stores the maximum possible score for the test
-- Used to calculate percentage correctly

ALTER TABLE mock_test_attempts
ADD COLUMN IF NOT EXISTS max_score INTEGER;

-- Update existing attempts with calculated max_score
UPDATE mock_test_attempts mta
SET max_score = (
  SELECT COALESCE(SUM(q.points), 0)
  FROM mock_test_questions q
  JOIN mock_test_problems p ON p.id = q.problem_id
  JOIN mock_test_sections s ON s.id = p.section_id
  WHERE s.mock_test_id = mta.mock_test_id
)
WHERE max_score IS NULL;
