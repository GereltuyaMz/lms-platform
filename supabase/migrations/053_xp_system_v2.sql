-- =====================================================
-- XP SYSTEM V2 MIGRATION
-- =====================================================
-- Implements granular XP rewards for lesson components
-- Run after 052_create_lesson_videos.sql
--
-- Key Changes:
-- 1. New table: lesson_content_progress (tracks theory/example videos individually)
-- 2. New table: level_thresholds (Level 1-20 system with non-linear progression)
-- 3. New column: enrollments.units_completed (tracks unit completion bonuses)
-- 4. Remove column: lesson_progress.last_position_seconds (moved to content level)
-- 5. New functions: calculate_lesson_quiz_xp, calculate_mock_test_xp, get_user_level, is_unit_complete
-- 6. Update constraint: xp_transactions.source_type (add new types)

-- =====================================================
-- 1. CREATE LESSON_CONTENT_PROGRESS TABLE
-- =====================================================
-- Tracks completion and playback position for individual content items
-- One row per (enrollment, lesson_content) combination

CREATE TABLE lesson_content_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id UUID REFERENCES enrollments(id) ON DELETE CASCADE NOT NULL,
  lesson_content_id UUID REFERENCES lesson_content(id) ON DELETE CASCADE NOT NULL,
  is_completed BOOLEAN DEFAULT false NOT NULL,
  completed_at TIMESTAMPTZ,
  last_position_seconds INTEGER DEFAULT 0 NOT NULL,
  xp_awarded INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  UNIQUE(enrollment_id, lesson_content_id),
  CONSTRAINT position_non_negative CHECK (last_position_seconds >= 0),
  CONSTRAINT xp_non_negative CHECK (xp_awarded >= 0)
);

CREATE INDEX idx_content_progress_enrollment ON lesson_content_progress(enrollment_id);
CREATE INDEX idx_content_progress_content ON lesson_content_progress(lesson_content_id);
CREATE INDEX idx_content_progress_completed ON lesson_content_progress(enrollment_id, is_completed);

COMMENT ON TABLE lesson_content_progress IS 'Tracks completion status and playback position for individual lesson content items (theory, example videos)';
COMMENT ON COLUMN lesson_content_progress.last_position_seconds IS 'Video playback position for resume - tracked per content item';
COMMENT ON COLUMN lesson_content_progress.xp_awarded IS 'XP awarded for this content item (10 for theory/example, 0 if rewatching)';

-- Auto-update timestamp
CREATE TRIGGER update_lesson_content_progress_updated_at
  BEFORE UPDATE ON lesson_content_progress FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 2. CREATE LEVEL_THRESHOLDS TABLE
-- =====================================================
-- Defines Level 1-20 system with non-linear XP progression

CREATE TABLE level_thresholds (
  level INTEGER PRIMARY KEY,
  xp_required INTEGER NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  CONSTRAINT level_positive CHECK (level > 0),
  CONSTRAINT xp_non_negative CHECK (xp_required >= 0)
);

-- Insert level progression from specification
INSERT INTO level_thresholds (level, xp_required) VALUES
  (1, 0),
  (2, 200),
  (3, 450),
  (4, 750),
  (5, 1100),
  (6, 1500),
  (7, 1950),
  (8, 2450),
  (9, 3000),
  (10, 4500),
  (11, 5500),
  (12, 6750),
  (13, 8250),
  (14, 10000),
  (15, 12000),
  (16, 14250),
  (17, 16750),
  (18, 19500),
  (19, 22500),
  (20, 25750);

COMMENT ON TABLE level_thresholds IS 'Defines XP required for each level (1-20). Level is calculated on-the-fly, not stored.';
COMMENT ON COLUMN level_thresholds.xp_required IS 'Minimum XP required to reach this level';

-- =====================================================
-- 3. ADD UNITS_COMPLETED TO ENROLLMENTS
-- =====================================================
-- Tracks which units have received the 50 XP completion bonus

ALTER TABLE enrollments
  ADD COLUMN units_completed JSONB DEFAULT '[]'::jsonb;

CREATE INDEX idx_enrollments_units_completed ON enrollments USING GIN (units_completed);

COMMENT ON COLUMN enrollments.units_completed IS 'Array of unit IDs that have received 50 XP unit completion bonus (prevents duplicates)';

-- =====================================================
-- 4. REMOVE LAST_POSITION_SECONDS FROM LESSON_PROGRESS
-- =====================================================
-- Playback position now tracked per content item in lesson_content_progress

-- NOTE: This is optional for backward compatibility
-- Uncomment if you want to remove the column:
-- ALTER TABLE lesson_progress DROP COLUMN IF EXISTS last_position_seconds;

COMMENT ON TABLE lesson_progress IS 'Tracks overall lesson completion status (quiz passed). Individual content progress tracked in lesson_content_progress.';

-- =====================================================
-- 5. UPDATE XP_TRANSACTIONS SOURCE_TYPE CONSTRAINT
-- =====================================================
-- Add new source types for granular XP tracking
-- First check what source_types currently exist to ensure we don't break existing data

DO $$
DECLARE
  existing_types TEXT[];
BEGIN
  -- Get all unique source_type values from existing data
  SELECT ARRAY_AGG(DISTINCT source_type) INTO existing_types
  FROM xp_transactions;

  -- Log existing types for debugging
  RAISE NOTICE 'Existing source_types in database: %', existing_types;
END $$;

-- Drop old constraint FIRST (before any data changes)
-- This allows new inserts to happen without constraint during migration
ALTER TABLE xp_transactions
  DROP CONSTRAINT IF EXISTS xp_transactions_source_type_check;

-- Migrate old naming convention to standardized naming
UPDATE xp_transactions
  SET source_type = 'profile_complete'
  WHERE source_type = 'profile_completion';

-- Add new constraint with standardized source types
-- Use NOT VALID to avoid checking existing rows during constraint creation
-- This allows the migration to complete even if there are concurrent inserts
ALTER TABLE xp_transactions
  ADD CONSTRAINT xp_transactions_source_type_check
  CHECK (source_type IN (
    -- NEW: Granular lesson content tracking
    'lesson_theory_complete',     -- Theory video (10 XP)
    'lesson_example_complete',    -- Example video (10 XP)
    'lesson_quiz_complete',       -- Lesson quiz (15-22 XP based on score)

    -- NEW: Completion bonuses
    'unit_complete',              -- Unit completion (50 XP)
    'course_complete',            -- Course completion (150 XP)

    -- NEW: Mock test
    'mock_test_complete',         -- Mock test (10-80 XP based on score)

    -- EXISTING: Keep for backward compatibility
    'quiz_complete',              -- Old quiz system
    'unit_quiz_complete',         -- Old unit quiz system
    'milestone',                  -- Course progress milestones (updated values)
    'streak',                     -- Streak bonuses (updated values)
    'achievement',                -- Special achievements
    'profile_complete',           -- Profile completion (50 XP)
    'shop_purchase',              -- XP deductions
    'lesson_complete',            -- DEPRECATED: Old video completion (keep for old records)

    -- Add any other types that might exist in your database:
    'video_complete',             -- Alternative naming for lesson_complete
    'course_milestone',           -- Alternative naming for milestone
    'daily_streak',               -- Alternative naming for streak
    'badge_earned'                -- Alternative naming for achievement
  )) NOT VALID;

-- Validate constraint on existing rows (this can be slow on large tables but is safer)
ALTER TABLE xp_transactions VALIDATE CONSTRAINT xp_transactions_source_type_check;

-- =====================================================
-- 6. DATABASE FUNCTIONS FOR XP CALCULATION
-- =====================================================

-- =====================================================
-- 6.1 Calculate Lesson Quiz XP
-- =====================================================
-- Awards XP based on quiz score percentage (first attempt only)
--
-- Score Tiers:
-- - Perfect (100%): 22 XP
-- - Excellent (95-99%): 20 XP
-- - Good (90-94%): 18 XP
-- - Pass (80-89%): 15 XP
-- - Fail (<80%): 0 XP
-- - Retry: 0 XP

CREATE OR REPLACE FUNCTION calculate_lesson_quiz_xp(
  score_correct INTEGER,
  total_questions INTEGER,
  is_retry BOOLEAN DEFAULT false
)
RETURNS INTEGER AS $$
DECLARE
  xp_amount INTEGER;
  score_percentage DECIMAL;
BEGIN
  -- No XP for retries
  IF is_retry THEN
    RETURN 0;
  END IF;

  -- Calculate percentage
  IF total_questions <= 0 THEN
    RETURN 0;
  END IF;

  score_percentage := (score_correct::DECIMAL / total_questions) * 100;

  -- Award based on spec
  IF score_percentage >= 100 THEN
    xp_amount := 22; -- Perfect
  ELSIF score_percentage >= 95 THEN
    xp_amount := 20; -- Excellent
  ELSIF score_percentage >= 90 THEN
    xp_amount := 18; -- Good
  ELSIF score_percentage >= 80 THEN
    xp_amount := 15; -- Pass
  ELSE
    xp_amount := 0; -- Failed (below 80%)
  END IF;

  RETURN xp_amount;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

COMMENT ON FUNCTION calculate_lesson_quiz_xp IS 'Calculates XP for lesson quiz based on score percentage. Returns 0 for retries or scores below 80%.';

-- =====================================================
-- 6.2 Calculate Mock Test XP
-- =====================================================
-- Awards XP for EYSH mock tests (first attempt only)
--
-- Rules:
-- - Pass (80%+): 80 XP
-- - Attempt (<80%): 10 XP (participation)
-- - Retry: 0 XP

CREATE OR REPLACE FUNCTION calculate_mock_test_xp(
  score_percentage DECIMAL,
  is_retry BOOLEAN DEFAULT false
)
RETURNS INTEGER AS $$
BEGIN
  -- No XP for retries
  IF is_retry THEN
    RETURN 0;
  END IF;

  -- Award based on spec
  IF score_percentage >= 80 THEN
    RETURN 80; -- Passed with 80%+
  ELSE
    RETURN 10; -- Participation XP
  END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

COMMENT ON FUNCTION calculate_mock_test_xp IS 'Calculates XP for mock tests. 80 XP for passing (80%+), 10 XP for attempt, 0 XP for retries.';

-- =====================================================
-- 6.3 Get User Level from XP
-- =====================================================
-- Calculates user level based on total XP
-- Uses level_thresholds table for non-linear progression

CREATE OR REPLACE FUNCTION get_user_level(user_xp INTEGER)
RETURNS INTEGER AS $$
DECLARE
  user_level INTEGER;
BEGIN
  -- Find highest level where xp_required <= user_xp
  SELECT COALESCE(MAX(level), 1) INTO user_level
  FROM level_thresholds
  WHERE xp_required <= user_xp;

  RETURN user_level;
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION get_user_level IS 'Returns user level for given XP amount. Level 1 = 0 XP, Level 2 = 200 XP, etc.';

-- =====================================================
-- 6.4 Check if Unit is Complete
-- =====================================================
-- Returns true if all lessons in a unit are completed
-- Used to trigger unit completion bonus (50 XP)

CREATE OR REPLACE FUNCTION is_unit_complete(
  p_enrollment_id UUID,
  p_unit_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
  total_lessons INTEGER;
  completed_lessons INTEGER;
BEGIN
  -- Count total lessons in unit
  SELECT COUNT(*) INTO total_lessons
  FROM lessons
  WHERE unit_id = p_unit_id;

  -- If no lessons in unit, return false
  IF total_lessons = 0 THEN
    RETURN false;
  END IF;

  -- Count completed lessons for this enrollment
  SELECT COUNT(*) INTO completed_lessons
  FROM lesson_progress lp
  INNER JOIN lessons l ON l.id = lp.lesson_id
  WHERE lp.enrollment_id = p_enrollment_id
    AND l.unit_id = p_unit_id
    AND lp.is_completed = true;

  -- Unit is complete if all lessons are completed
  RETURN total_lessons = completed_lessons;
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION is_unit_complete IS 'Returns true if all lessons in a unit are completed for the given enrollment.';

-- =====================================================
-- 7. HELPER FUNCTION: Get XP Progress to Next Level
-- =====================================================
-- Returns detailed level progression information

CREATE OR REPLACE FUNCTION get_level_progress(user_xp INTEGER)
RETURNS TABLE (
  current_level INTEGER,
  next_level INTEGER,
  current_level_xp INTEGER,
  next_level_xp INTEGER,
  xp_in_current_level INTEGER,
  xp_needed_for_next INTEGER,
  progress_percentage DECIMAL
) AS $$
DECLARE
  v_current_level INTEGER;
  v_next_level INTEGER;
  v_current_level_xp INTEGER;
  v_next_level_xp INTEGER;
BEGIN
  -- Get current level
  v_current_level := get_user_level(user_xp);
  v_next_level := v_current_level + 1;

  -- Get XP thresholds
  SELECT xp_required INTO v_current_level_xp
  FROM level_thresholds
  WHERE level = v_current_level;

  SELECT xp_required INTO v_next_level_xp
  FROM level_thresholds
  WHERE level = v_next_level;

  -- Handle max level case
  IF v_next_level_xp IS NULL THEN
    v_next_level_xp := v_current_level_xp;
  END IF;

  RETURN QUERY SELECT
    v_current_level,
    v_next_level,
    v_current_level_xp,
    v_next_level_xp,
    user_xp - v_current_level_xp AS xp_in_current_level,
    v_next_level_xp - user_xp AS xp_needed_for_next,
    CASE
      WHEN v_next_level_xp > v_current_level_xp THEN
        ROUND(
          ((user_xp - v_current_level_xp)::DECIMAL / (v_next_level_xp - v_current_level_xp)) * 100,
          2
        )
      ELSE
        100.00
    END AS progress_percentage;
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION get_level_progress IS 'Returns detailed level progression info including current level, XP needed for next level, and progress percentage.';

-- =====================================================
-- 8. GRANT PERMISSIONS
-- =====================================================

-- Grant access to authenticated users
GRANT SELECT ON lesson_content_progress TO authenticated;
GRANT INSERT, UPDATE ON lesson_content_progress TO authenticated;
GRANT SELECT ON level_thresholds TO authenticated;

-- =====================================================
-- 9. ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE lesson_content_progress ENABLE ROW LEVEL SECURITY;

-- Users can only see and modify their own content progress
CREATE POLICY "Users can view their own content progress"
  ON lesson_content_progress FOR SELECT
  USING (
    enrollment_id IN (
      SELECT id FROM enrollments WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own content progress"
  ON lesson_content_progress FOR INSERT
  WITH CHECK (
    enrollment_id IN (
      SELECT id FROM enrollments WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own content progress"
  ON lesson_content_progress FOR UPDATE
  USING (
    enrollment_id IN (
      SELECT id FROM enrollments WHERE user_id = auth.uid()
    )
  );

-- Level thresholds are public (read-only)
ALTER TABLE level_thresholds ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Level thresholds are public"
  ON level_thresholds FOR SELECT
  USING (true);

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================
-- Next: Run 054_migrate_existing_users.sql to reset XP data


