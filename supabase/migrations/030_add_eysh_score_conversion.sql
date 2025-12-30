-- ================================================
-- Add EYSH 800-point score conversion system
-- ================================================
-- This migration adds support for converting raw test scores
-- to standardized EYSH scores (500/600/700/800 points) based
-- on custom thresholds per test.

-- Add threshold columns to mock_tests table
ALTER TABLE mock_tests
ADD COLUMN IF NOT EXISTS eysh_threshold_500 INTEGER,
ADD COLUMN IF NOT EXISTS eysh_threshold_600 INTEGER,
ADD COLUMN IF NOT EXISTS eysh_threshold_700 INTEGER,
ADD COLUMN IF NOT EXISTS eysh_threshold_800 INTEGER;

-- Add converted score column to mock_test_attempts table
ALTER TABLE mock_test_attempts
ADD COLUMN IF NOT EXISTS eysh_converted_score INTEGER;

-- Add comments for documentation
COMMENT ON COLUMN mock_tests.eysh_threshold_500 IS 'Minimum raw score required for 500 EYSH points';
COMMENT ON COLUMN mock_tests.eysh_threshold_600 IS 'Minimum raw score required for 600 EYSH points';
COMMENT ON COLUMN mock_tests.eysh_threshold_700 IS 'Minimum raw score required for 700 EYSH points';
COMMENT ON COLUMN mock_tests.eysh_threshold_800 IS 'Minimum raw score required for 800 EYSH points';
COMMENT ON COLUMN mock_test_attempts.eysh_converted_score IS 'EYSH standardized score (500/600/700/800 or NULL if failed or not applicable)';
