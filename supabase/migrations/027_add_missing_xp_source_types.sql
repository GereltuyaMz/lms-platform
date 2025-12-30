-- ================================================
-- Add missing XP source types to constraint
-- ================================================
-- This migration adds 'mock_test_complete' and 'unit_quiz_complete'
-- to the allowed source_type values in xp_transactions table.
--
-- Background: These source types are used in the application code
-- but were not included in the original CHECK constraint, causing
-- XP insertions to fail silently.
-- ================================================

BEGIN;

-- Drop the existing CHECK constraint
ALTER TABLE xp_transactions
  DROP CONSTRAINT IF EXISTS xp_transactions_source_type_check;

-- Add updated CHECK constraint with new source types
ALTER TABLE xp_transactions
  ADD CONSTRAINT xp_transactions_source_type_check
  CHECK (
    source_type IN (
      'lesson_complete',
      'quiz_complete',
      'unit_quiz_complete',      -- NEW: For unit quiz completions
      'mock_test_complete',       -- NEW: For mock test completions
      'milestone',
      'streak',
      'achievement',
      'shop_purchase',
      'profile_completion'
    )
  );

COMMIT;
