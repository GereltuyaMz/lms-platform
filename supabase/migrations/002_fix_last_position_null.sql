-- Update any NULL values in last_position_seconds to 0
UPDATE lesson_progress
SET last_position_seconds = 0
WHERE last_position_seconds IS NULL;

-- Add NOT NULL constraint to prevent future NULL values
ALTER TABLE lesson_progress
ALTER COLUMN last_position_seconds SET NOT NULL;
