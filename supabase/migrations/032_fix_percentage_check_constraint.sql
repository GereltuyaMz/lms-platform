-- ================================================
-- Fix percentage check constraint for 100-point scale
-- ================================================
-- Since we're now using total_score directly as percentage,
-- and total_score is capped at 100, we need to ensure the
-- check constraint allows this

-- Drop the old constraint
ALTER TABLE mock_test_attempts
DROP CONSTRAINT IF EXISTS mock_test_attempts_percentage_check;

-- Add new constraint that allows percentage = total_score (0-100)
ALTER TABLE mock_test_attempts
ADD CONSTRAINT mock_test_attempts_percentage_check
CHECK (percentage >= 0 AND percentage <= 100);

-- Note: The percentage column now stores the actual score (0-100)
-- not a calculated percentage, making the constraint straightforward
