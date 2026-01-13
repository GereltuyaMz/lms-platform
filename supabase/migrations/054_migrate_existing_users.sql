-- =====================================================
-- XP SYSTEM V2 - USER DATA MIGRATION
-- =====================================================
-- Fresh start approach: Reset all XP and progress to 0
-- Run after 053_xp_system_v2.sql
--
-- WARNING: This script will DELETE all existing:
-- - XP transactions
-- - Lesson progress
-- - Quiz attempts
-- - Enrollment progress
--
-- Optional: Archive old data before deletion

-- =====================================================
-- 1. ARCHIVE OLD XP TRANSACTIONS (OPTIONAL)
-- =====================================================
-- Uncomment if you want to keep a backup of old XP data

/*
CREATE TABLE IF NOT EXISTS xp_transactions_archive AS
SELECT * FROM xp_transactions;

COMMENT ON TABLE xp_transactions_archive IS 'Archived XP transactions from before XP System V2 migration';
*/

-- =====================================================
-- 2. RESET USER PROFILES
-- =====================================================
-- Reset all XP, streaks, and activity dates to 0/NULL

UPDATE user_profiles
SET
  total_xp = 0,
  current_streak = 0,
  longest_streak = 0,
  last_activity_date = NULL
WHERE true; -- Reset for all users

-- =====================================================
-- 3. CLEAR XP TRANSACTIONS
-- =====================================================
-- Delete all XP transaction records (archive created above)

DELETE FROM xp_transactions;

-- =====================================================
-- 4. RESET ENROLLMENTS
-- =====================================================
-- Reset course progress and clear completed units

UPDATE enrollments
SET
  progress_percentage = 0,
  completed_at = NULL,
  units_completed = '[]'::jsonb
WHERE true; -- Reset for all enrollments

-- =====================================================
-- 5. CLEAR LESSON PROGRESS
-- =====================================================
-- Delete all lesson completion records

DELETE FROM lesson_progress;

-- =====================================================
-- 6. CLEAR QUIZ ATTEMPTS
-- =====================================================
-- Delete all quiz attempt records

DELETE FROM quiz_attempts;

-- =====================================================
-- 7. CLEAR USER BADGES (OPTIONAL)
-- =====================================================
-- Reset badge progress if you want users to re-earn them
-- Uncomment if you want to reset badges:

/*
UPDATE user_badges
SET
  progress_current = 0,
  unlocked_at = NULL
WHERE true;
*/

-- =====================================================
-- 8. VERIFICATION QUERIES
-- =====================================================
-- Run these to verify the migration was successful

-- Check that all users have 0 XP
DO $$
DECLARE
  non_zero_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO non_zero_count
  FROM user_profiles
  WHERE total_xp != 0;

  IF non_zero_count > 0 THEN
    RAISE WARNING 'Warning: % users still have non-zero XP', non_zero_count;
  ELSE
    RAISE NOTICE 'Success: All users reset to 0 XP';
  END IF;
END $$;

-- Check that XP transactions table is empty
DO $$
DECLARE
  transaction_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO transaction_count
  FROM xp_transactions;

  IF transaction_count > 0 THEN
    RAISE WARNING 'Warning: xp_transactions still has % records', transaction_count;
  ELSE
    RAISE NOTICE 'Success: xp_transactions table is empty';
  END IF;
END $$;

-- Check that enrollments are reset
DO $$
DECLARE
  non_zero_progress INTEGER;
BEGIN
  SELECT COUNT(*) INTO non_zero_progress
  FROM enrollments
  WHERE progress_percentage != 0 OR completed_at IS NOT NULL;

  IF non_zero_progress > 0 THEN
    RAISE WARNING 'Warning: % enrollments still have progress', non_zero_progress;
  ELSE
    RAISE NOTICE 'Success: All enrollments reset to 0 percent';
  END IF;
END $$;

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================
-- All users now start fresh with XP System V2
-- They can begin earning XP through the new granular system:
-- - Theory video: 10 XP
-- - Example video: 10 XP
-- - Quiz (15-22 XP based on score)
-- - Unit completion: 50 XP
-- - Milestones: 30/50/70/100 XP at 25%/50%/75%/100%
-- - Streaks: 20/50/150 XP at 3/7/30 days
