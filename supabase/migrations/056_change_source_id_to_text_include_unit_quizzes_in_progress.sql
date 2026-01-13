-- ================================================
-- Change source_id from UUID to TEXT
-- ================================================
-- The source_id column was originally UUID but the codebase
-- uses composite string identifiers like:
-- - "enrollment-id-25" for milestones
-- - "course-id-Тоо Тоолол" for unit content milestones
-- - "first-course-user-id" for achievements
--
-- This migration changes the column to TEXT to support
-- these composite identifiers.
-- ================================================

BEGIN;

-- Change source_id column type from UUID to TEXT
-- Uses USING to cast existing UUID values to TEXT
ALTER TABLE xp_transactions
ALTER COLUMN source_id TYPE TEXT USING source_id::TEXT;

-- Update the column comment
COMMENT ON COLUMN xp_transactions.source_id IS 'String identifier for the source entity. Can be UUID or composite key like "enrollment-id-threshold"';

COMMIT;

-- =====================================================
-- INCLUDE UNIT QUIZZES IN COURSE PROGRESS CALCULATION
-- =====================================================
-- Updates progress calculation to include unit quizzes:
--
-- OLD: progress = completed_lessons / total_lessons * 100
-- NEW: progress = (completed_lessons + passed_unit_quizzes) / (total_lessons + units_with_quizzes) * 100
--
-- Changes:
-- 1. New core function: update_enrollment_progress_for_enrollment()
-- 2. Updated lesson_progress trigger to use new function
-- 3. New trigger on quiz_attempts for unit quizzes
-- 4. Backfill existing enrollments
-- =====================================================

BEGIN;

-- =====================================================
-- 1. CREATE CORE PROGRESS CALCULATION FUNCTION
-- =====================================================
-- Reusable function that calculates progress including unit quizzes

CREATE OR REPLACE FUNCTION update_enrollment_progress_for_enrollment(enroll_id UUID)
RETURNS VOID AS $$
DECLARE
  course_uuid UUID;
  total_lessons INTEGER;
  completed_lessons INTEGER;
  units_with_quizzes INTEGER;
  passed_unit_quizzes INTEGER;
  total_items INTEGER;
  completed_items INTEGER;
  new_progress INTEGER;
BEGIN
  -- Get course_id from enrollment
  SELECT course_id INTO course_uuid
  FROM enrollments
  WHERE id = enroll_id;

  -- Exit if enrollment not found
  IF course_uuid IS NULL THEN
    RETURN;
  END IF;

  -- Count total lessons in the course
  SELECT COUNT(*) INTO total_lessons
  FROM lessons
  WHERE course_id = course_uuid;

  -- Count units that have quizzes (at least one quiz question)
  SELECT COUNT(DISTINCT u.id) INTO units_with_quizzes
  FROM units u
  WHERE u.course_id = course_uuid
    AND EXISTS (SELECT 1 FROM quiz_questions qq WHERE qq.unit_id = u.id);

  -- Count completed lessons for this enrollment
  SELECT COUNT(*) INTO completed_lessons
  FROM lesson_progress
  WHERE enrollment_id = enroll_id
    AND is_completed = true;

  -- Count passed unit quizzes (distinct by unit_id to avoid counting retries)
  SELECT COUNT(DISTINCT qa.unit_id) INTO passed_unit_quizzes
  FROM quiz_attempts qa
  WHERE qa.enrollment_id = enroll_id
    AND qa.unit_id IS NOT NULL
    AND qa.passed = true;

  -- Calculate totals
  total_items := total_lessons + units_with_quizzes;
  completed_items := completed_lessons + passed_unit_quizzes;

  -- Calculate progress percentage
  IF total_items > 0 THEN
    new_progress := ROUND((completed_items::DECIMAL / total_items) * 100);
  ELSE
    new_progress := 0;
  END IF;

  -- Update enrollment
  UPDATE enrollments
  SET
    progress_percentage = new_progress,
    completed_at = CASE WHEN new_progress = 100 THEN NOW() ELSE NULL END
  WHERE id = enroll_id;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION update_enrollment_progress_for_enrollment IS
'Calculates and updates progress_percentage including both lessons and unit quizzes.
Formula: (completed_lessons + passed_unit_quizzes) / (total_lessons + units_with_quizzes) * 100';

-- =====================================================
-- 2. UPDATE LESSON PROGRESS TRIGGER FUNCTION
-- =====================================================
-- Modified to use the new core function

CREATE OR REPLACE FUNCTION update_enrollment_progress()
RETURNS TRIGGER AS $$
BEGIN
  -- Call the core progress calculation function
  PERFORM update_enrollment_progress_for_enrollment(NEW.enrollment_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 3. CREATE QUIZ ATTEMPTS TRIGGER FUNCTION
-- =====================================================
-- Wrapper function for quiz_attempts trigger

CREATE OR REPLACE FUNCTION update_enrollment_progress_from_quiz()
RETURNS TRIGGER AS $$
BEGIN
  -- Call the core progress calculation function
  PERFORM update_enrollment_progress_for_enrollment(NEW.enrollment_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION update_enrollment_progress_from_quiz IS
'Trigger function to update progress when a unit quiz is passed';

-- =====================================================
-- 4. CREATE TRIGGER ON QUIZ_ATTEMPTS
-- =====================================================
-- Only fires for unit quizzes (not lesson quizzes)

DROP TRIGGER IF EXISTS trigger_update_progress_on_unit_quiz ON quiz_attempts;

CREATE TRIGGER trigger_update_progress_on_unit_quiz
  AFTER INSERT OR UPDATE OF passed ON quiz_attempts
  FOR EACH ROW
  WHEN (NEW.unit_id IS NOT NULL AND NEW.passed = true)
  EXECUTE FUNCTION update_enrollment_progress_from_quiz();

COMMENT ON TRIGGER trigger_update_progress_on_unit_quiz ON quiz_attempts IS
'Updates enrollment progress when a unit quiz is passed';

-- =====================================================
-- 5. BACKFILL EXISTING ENROLLMENTS
-- =====================================================
-- Recalculate progress for all enrollments to include passed unit quizzes

DO $$
DECLARE
  enrollment_record RECORD;
BEGIN
  FOR enrollment_record IN SELECT id FROM enrollments LOOP
    PERFORM update_enrollment_progress_for_enrollment(enrollment_record.id);
  END LOOP;
END $$;

COMMIT;

-- Step 1: Preview old transactions
SELECT id, user_id, amount, description, created_at
FROM xp_transactions
WHERE source_type = 'mock_test_complete'
ORDER BY created_at DESC;

-- Step 2: Delete old XP transactions
DELETE FROM xp_transactions WHERE source_type = 'mock_test_complete';

-- Step 3: Reset xp_awarded in attempts table
UPDATE mock_test_attempts SET xp_awarded = 0 WHERE xp_awarded > 0;