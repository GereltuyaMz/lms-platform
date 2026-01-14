-- =====================================================
-- MIGRATION: Fix progress calculation to count only lessons within units
-- =====================================================
-- Changes the progress formula to only count lessons that have unit_id
-- This aligns the database calculation with the frontend lesson detail view.
--
-- Before: total_lessons = COUNT(*) FROM lessons WHERE course_id = X
-- After:  total_lessons = COUNT(*) FROM lessons WHERE course_id = X AND unit_id IS NOT NULL

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

  -- Count total lessons in the course (ONLY lessons within units)
  SELECT COUNT(*) INTO total_lessons
  FROM lessons
  WHERE course_id = course_uuid
    AND unit_id IS NOT NULL;

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
Formula: (completed_lessons + passed_unit_quizzes) / (total_lessons_in_units + units_with_quizzes) * 100
NOTE: Only counts lessons that have unit_id (are organized into units).';
