-- =====================================================
-- ADD TRIGGER TO COMPUTE PASSED STATUS
-- =====================================================
-- The 'passed' column already exists (added manually)
-- This migration adds the trigger to automatically compute it

-- Create function to compute passed status (80% threshold)
CREATE OR REPLACE FUNCTION compute_quiz_passed()
RETURNS TRIGGER AS $$
BEGIN
  -- 80% passing threshold for both lesson and unit quizzes
  NEW.passed := (NEW.score::FLOAT / NEW.total_questions::FLOAT) >= 0.8;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-compute passed on insert/update
DROP TRIGGER IF EXISTS trigger_compute_quiz_passed ON quiz_attempts;

CREATE TRIGGER trigger_compute_quiz_passed
  BEFORE INSERT OR UPDATE OF score, total_questions
  ON quiz_attempts
  FOR EACH ROW
  EXECUTE FUNCTION compute_quiz_passed();

-- Backfill existing quiz attempts with correct passed value
UPDATE quiz_attempts
SET passed = ((score::FLOAT / total_questions::FLOAT) >= 0.8)
WHERE passed IS NULL OR passed = false;

-- Add comment
COMMENT ON FUNCTION compute_quiz_passed IS 'Automatically computes passed status (≥80% = true) for quiz attempts';
COMMENT ON TRIGGER trigger_compute_quiz_passed ON quiz_attempts IS 'Auto-computes passed column before insert/update';
