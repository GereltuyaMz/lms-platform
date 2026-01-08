-- ================================================
-- Consolidated Mock Test Details & Logic Fixes
-- ================================================
-- Replaces previous migrations 050-054.
-- Contains:
-- 1. Removal of EYSH and passing score logic
-- 2. Prevention of duplicate incomplete attempts
-- 3. Security fixes for submission functions (SECURITY DEFINER)
-- 4. Auto-completion logic for expired attempts

-- =================================================================
-- 1. SCHEMA UPDATES: Remove EYSH and Passing Score
-- =================================================================

-- Drop eysh_converted_score column from mock_test_attempts
ALTER TABLE mock_test_attempts 
DROP COLUMN IF EXISTS eysh_converted_score;

-- Drop EYSH threshold columns and passing_score from mock_tests
ALTER TABLE mock_tests
DROP COLUMN IF EXISTS eysh_threshold_500,
DROP COLUMN IF EXISTS eysh_threshold_600,
DROP COLUMN IF EXISTS eysh_threshold_700,
DROP COLUMN IF EXISTS eysh_threshold_800,
DROP COLUMN IF EXISTS passing_score_percentage;

-- =================================================================
-- 2. DATA CLEANUP & CONSTRAINTS: Prevent pattern of duplicate attempts
-- =================================================================

-- Remove duplicate incomplete attempts, keeping only the latest one
DELETE FROM mock_test_attempts a
WHERE is_completed = false
AND EXISTS (
  SELECT 1 FROM mock_test_attempts b
  WHERE b.user_id = a.user_id
  AND b.mock_test_id = a.mock_test_id
  AND b.is_completed = false
  AND b.started_at > a.started_at
);

-- Add unique index for incomplete attempts
-- This ensures a user can have at most ONE incomplete attempt per test at a time
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_incomplete_attempt
ON mock_test_attempts (user_id, mock_test_id)
WHERE is_completed = false;

-- =================================================================
-- 3. FUNCTIONS: Submit and Create Logic
-- =================================================================

-- Function to submit test answers and calculate scores
CREATE OR REPLACE FUNCTION submit_mock_test_with_answers(
  p_attempt_id UUID,
  p_answers JSONB
)
RETURNS JSON AS $$
DECLARE
  v_total_score INTEGER := 0;
  v_max_possible_score INTEGER;
  v_percentage DECIMAL(5,2);
  v_subject_scores JSONB;
  v_test_id UUID;
  v_total_questions INTEGER;
  v_answer_key TEXT;
  v_answer_value TEXT;
  v_question_id UUID;
  v_option_id UUID;
  v_is_correct BOOLEAN;
  v_points INTEGER;
  v_is_already_completed BOOLEAN;
BEGIN
  -- SECURITY: Verify user owns this attempt
  IF NOT EXISTS (
    SELECT 1 FROM mock_test_attempts
    WHERE id = p_attempt_id
    AND user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Unauthorized: You do not own this attempt';
  END IF;

  -- Get test ID, total questions, and completion status
  SELECT mock_test_id, total_questions, is_completed
  INTO v_test_id, v_total_questions, v_is_already_completed
  FROM mock_test_attempts
  WHERE id = p_attempt_id;

  IF v_test_id IS NULL THEN
    RAISE EXCEPTION 'Attempt not found';
  END IF;

  -- Prevent duplicate submissions
  IF v_is_already_completed THEN
    RAISE EXCEPTION 'Test already submitted';
  END IF;

  -- Calculate maximum possible score for this test
  SELECT COALESCE(SUM(q.points), 0)
  INTO v_max_possible_score
  FROM mock_test_questions q
  JOIN mock_test_problems p ON p.id = q.problem_id
  JOIN mock_test_sections s ON s.id = p.section_id
  WHERE s.mock_test_id = v_test_id;

  -- Insert all answers in batch
  FOR v_answer_key, v_answer_value IN SELECT * FROM jsonb_each_text(p_answers)
  LOOP
    v_question_id := v_answer_key::UUID;
    v_option_id := v_answer_value::UUID;

    -- Get option correctness and question points
    SELECT o.is_correct, q.points INTO v_is_correct, v_points
    FROM mock_test_options o
    JOIN mock_test_questions q ON q.id = o.question_id
    WHERE o.id = v_option_id AND q.id = v_question_id;

    -- Skip invalid question/option combinations
    IF v_is_correct IS NULL THEN
      CONTINUE;
    END IF;

    -- Insert or update answer (idempotent)
    INSERT INTO mock_test_answers (
      attempt_id,
      question_id,
      selected_option_id,
      is_correct,
      points_earned
    )
    VALUES (
      p_attempt_id,
      v_question_id,
      v_option_id,
      v_is_correct,
      CASE WHEN v_is_correct THEN v_points ELSE 0 END
    )
    ON CONFLICT (attempt_id, question_id) DO UPDATE SET
      selected_option_id = v_option_id,
      is_correct = v_is_correct,
      points_earned = CASE WHEN EXCLUDED.is_correct THEN v_points ELSE 0 END,
      answered_at = NOW();

    -- Accumulate score
    IF v_is_correct THEN
      v_total_score := v_total_score + v_points;
    END IF;
  END LOOP;

  -- Calculate percentage (total_score / max_possible_score * 100)
  v_percentage := CASE
    WHEN v_max_possible_score > 0
    THEN ROUND((v_total_score::DECIMAL / v_max_possible_score) * 100, 2)
    ELSE 0
  END;

  -- Calculate subject-wise scores
  SELECT json_object_agg(
    subject,
    json_build_object(
      'score', subject_score,
      'total', subject_max_score,
      'percentage', ROUND((subject_score::DECIMAL / NULLIF(subject_max_score, 0)) * 100, 2)
    )
  )::JSONB INTO v_subject_scores
  FROM (
    SELECT
      s.subject,
      COALESCE(SUM(ans.points_earned), 0) as subject_score,
      COALESCE(SUM(q.points), 0) as subject_max_score
    FROM mock_test_sections s
    JOIN mock_test_problems p ON p.section_id = s.id
    JOIN mock_test_questions q ON q.problem_id = p.id
    LEFT JOIN mock_test_answers ans ON ans.question_id = q.id AND ans.attempt_id = p_attempt_id
    WHERE s.mock_test_id = v_test_id
    GROUP BY s.subject
  ) subject_stats;

  -- Update attempt with final scores
  UPDATE mock_test_attempts
  SET
    total_score = v_total_score,
    max_score = v_max_possible_score,
    percentage = v_percentage,
    subject_scores = v_subject_scores,
    is_completed = true,
    completed_at = NOW(),
    updated_at = NOW()
  WHERE id = p_attempt_id;

  -- Return results
  RETURN json_build_object(
    'total_score', v_total_score,
    'max_score', v_max_possible_score,
    'total_questions', v_total_questions,
    'percentage', v_percentage,
    'subject_scores', v_subject_scores
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION submit_mock_test_with_answers IS
  'Batch submits answers and calculates scores. Includes security checks and prevents duplicates.';

-- Function to create or resume mock test attempt
CREATE OR REPLACE FUNCTION create_mock_test_attempt(
  p_user_id UUID,
  p_test_id UUID
)
RETURNS UUID AS $$
DECLARE
  v_attempt_id UUID;
  v_existing_attempt UUID;
  v_end_time TIMESTAMPTZ;
  v_total_questions INTEGER;
  v_time_limit_minutes INTEGER;
  v_saved_answers JSONB;
BEGIN
  -- SECURITY: Verify caller is the user
  IF p_user_id != auth.uid() THEN
    RAISE EXCEPTION 'Unauthorized: Cannot create attempt for another user';
  END IF;

  -- Check for existing incomplete attempt
  SELECT id, end_time INTO v_existing_attempt, v_end_time
  FROM mock_test_attempts
  WHERE user_id = p_user_id
    AND mock_test_id = p_test_id
    AND is_completed = false
  LIMIT 1;

  -- Handle existing attempt
  IF v_existing_attempt IS NOT NULL THEN
    -- Check if expired
    IF v_end_time < NOW() THEN
      -- Get saved answers
      SELECT jsonb_object_agg(question_id::text, selected_option_id::text)
      INTO v_saved_answers
      FROM mock_test_answers
      WHERE attempt_id = v_existing_attempt;

      -- Auto-complete expired attempt
      PERFORM submit_mock_test_with_answers(
        v_existing_attempt,
        COALESCE(v_saved_answers, '{}'::JSONB)
      );

      -- Reset so we create a new one below
      v_existing_attempt := NULL;
    ELSE
      -- Valid attempt exists, return it
      RETURN v_existing_attempt;
    END IF;
  END IF;

  -- Get test details
  SELECT total_questions, time_limit_minutes INTO v_total_questions, v_time_limit_minutes
  FROM mock_tests
  WHERE id = p_test_id;

  BEGIN
    -- Try to create new attempt
    INSERT INTO mock_test_attempts (
      user_id,
      mock_test_id,
      total_questions,
      end_time
    )
    VALUES (
      p_user_id,
      p_test_id,
      v_total_questions,
      NOW() + (v_time_limit_minutes * INTERVAL '1 minute')
    )
    RETURNING id INTO v_attempt_id;
  EXCEPTION WHEN unique_violation THEN
    -- Race condition: another request created an attempt
    SELECT id INTO v_attempt_id
    FROM mock_test_attempts
    WHERE user_id = p_user_id
      AND mock_test_id = p_test_id
      AND is_completed = false
    LIMIT 1;
    
    IF v_attempt_id IS NULL THEN
      RAISE;
    END IF;
  END;

  RETURN v_attempt_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION create_mock_test_attempt IS
  'Creates new attempt or resumes existing. Uses SECURITY DEFINER and handles race conditions.';
