-- ================================================
-- Update question points from 10 to 2
-- ================================================
-- Changes all mock test questions from 10 points to 2 points
-- This will change max scores from 360 to 72 for 36-question tests

UPDATE mock_test_questions
SET points = 2
WHERE points = 10;

-- Update existing attempts' max_score to reflect new point values
UPDATE mock_test_attempts mta
SET max_score = (
  SELECT COALESCE(SUM(q.points), 0)
  FROM mock_test_questions q
  JOIN mock_test_problems p ON p.id = q.problem_id
  JOIN mock_test_sections s ON s.id = p.section_id
  WHERE s.mock_test_id = mta.mock_test_id
)
WHERE is_completed = true;

-- Note: Existing percentages remain valid since they're calculated as (score/max_score)*100
-- Only the raw scores and max_score values will differ for future attempts
