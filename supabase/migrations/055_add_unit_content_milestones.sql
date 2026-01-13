-- ================================================
-- Add Unit Content Group Milestone System
-- ================================================
-- Awards progressive XP when users complete ALL units
-- within a unit_content group (e.g., "Тоо Тоолол")
--
-- Rewards:
-- - 1st group completed: 30 XP
-- - 2nd group completed: 50 XP
-- - 3rd group completed: 70 XP
-- - 4th+ group completed: 100 XP
-- ================================================

BEGIN;

-- =====================================================
-- 1. ADD TRACKING COLUMN
-- =====================================================

-- Add column to track completed unit_content groups
ALTER TABLE enrollments
ADD COLUMN IF NOT EXISTS unit_content_completed JSONB DEFAULT '[]'::jsonb;

-- Add index for efficient querying
CREATE INDEX IF NOT EXISTS idx_enrollments_unit_content_completed
ON enrollments USING GIN (unit_content_completed);

COMMENT ON COLUMN enrollments.unit_content_completed IS
'Array of unit_content values that have been claimed for milestone XP. E.g., ["Тоо Тоолол", "Алгебр"]';

-- =====================================================
-- 2. CREATE RPC FUNCTION TO CHECK GROUP COMPLETION
-- =====================================================

CREATE OR REPLACE FUNCTION is_unit_content_group_complete(
  p_enrollment_id UUID,
  p_course_id UUID,
  p_unit_content TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  total_units INTEGER;
  completed_units INTEGER;
BEGIN
  -- Handle NULL unit_content
  IF p_unit_content IS NULL THEN
    RETURN FALSE;
  END IF;

  -- Count total units with this unit_content in the course
  SELECT COUNT(*) INTO total_units
  FROM units
  WHERE course_id = p_course_id
    AND unit_content = p_unit_content;

  -- If no units found, return false
  IF total_units = 0 THEN
    RETURN FALSE;
  END IF;

  -- Count completed units (in units_completed array) with this unit_content
  SELECT COUNT(*) INTO completed_units
  FROM units u
  WHERE u.course_id = p_course_id
    AND u.unit_content = p_unit_content
    AND u.id::text IN (
      SELECT jsonb_array_elements_text(e.units_completed)
      FROM enrollments e
      WHERE e.id = p_enrollment_id
    );

  RETURN total_units = completed_units;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION is_unit_content_group_complete IS
'Checks if all units with the given unit_content have been completed (claimed) by the user';

-- =====================================================
-- 3. UPDATE XP SOURCE TYPE CONSTRAINT
-- =====================================================

-- Drop the existing CHECK constraint
ALTER TABLE xp_transactions
DROP CONSTRAINT IF EXISTS xp_transactions_source_type_check;

-- Add updated CHECK constraint with new source type
ALTER TABLE xp_transactions
ADD CONSTRAINT xp_transactions_source_type_check
CHECK (source_type IN (
  'lesson_complete',
  'quiz_complete',
  'unit_quiz_complete',
  'mock_test_complete',
  'milestone',
  'streak',
  'achievement',
  'shop_purchase',
  'profile_completion',
  'unit_complete',
  'course_complete',
  'lesson_theory_complete',
  'lesson_example_complete',
  'unit_content_milestone'    -- NEW: Unit content group completion
));

COMMIT;
