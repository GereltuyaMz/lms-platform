-- ================================================
-- Add EYSH Score Thresholds to Mock Tests
-- ================================================
-- This seed adds EYSH conversion thresholds to existing mock tests
-- EYSH scoring system normalizes all tests to a 100-point scale where:
-- - 60-79 points → 500 EYSH score
-- - 80-89 points → 600 EYSH score
-- - 90-94 points → 700 EYSH score
-- - 95-100 points → 800 EYSH score

-- The thresholds below are based on a normalized 100-point scale
-- regardless of the actual number of questions or max raw score

-- ================================================
-- Update All Mock Tests with Standard EYSH Thresholds
-- ================================================
-- Apply standard 100-point scale thresholds to all mock tests
UPDATE mock_tests
SET
  eysh_threshold_500 = 60,   -- 60/100 points
  eysh_threshold_600 = 80,   -- 80/100 points
  eysh_threshold_700 = 90,   -- 90/100 points
  eysh_threshold_800 = 95    -- 95/100 points
WHERE category IN ('math', 'physics', 'chemistry', 'english');

-- ================================================
-- Verify Updates
-- ================================================
-- Uncomment to see the updated thresholds:
-- SELECT
--   title,
--   category,
--   total_questions,
--   eysh_threshold_500,
--   eysh_threshold_600,
--   eysh_threshold_700,
--   eysh_threshold_800
-- FROM mock_tests
-- ORDER BY category, total_questions;
