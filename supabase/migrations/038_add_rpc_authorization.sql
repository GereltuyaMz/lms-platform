-- ================================================
-- Add Authorization Checks to Mock Test RPC Functions
-- ================================================
-- SECURITY FIX: RPC functions bypass RLS and need explicit ownership checks
-- This prevents users from submitting answers to other users' test attempts

-- ==================================================
-- Fix 1: submit_mock_test_with_answers
-- ==================================================
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
  -- EYSH conversion variables
  v_eysh_converted_score INTEGER;
  v_eysh_threshold_500 INTEGER;
  v_eysh_threshold_600 INTEGER;
  v_eysh_threshold_700 INTEGER;
  v_eysh_threshold_800 INTEGER;
BEGIN
  -- SECURITY: Verify user owns this attempt
  IF NOT EXISTS (
    SELECT 1 FROM mock_test_attempts
    WHERE id = p_attempt_id
    AND user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Unauthorized: You do not own this attempt';
  END IF;

  -- Get test ID and total questions
  SELECT mock_test_id, total_questions INTO v_test_id, v_total_questions
  FROM mock_test_attempts
  WHERE id = p_attempt_id;

  IF v_test_id IS NULL THEN
    RAISE EXCEPTION 'Attempt not found';
  END IF;

  -- Calculate maximum possible score for this test
  SELECT COALESCE(SUM(q.points), 0)
  INTO v_max_possible_score
  FROM mock_test_questions q
  JOIN mock_test_problems p ON p.id = q.problem_id
  JOIN mock_test_sections s ON s.id = p.section_id
  WHERE s.mock_test_id = v_test_id;

  -- Get EYSH thresholds for this test
  SELECT
    eysh_threshold_500,
    eysh_threshold_600,
    eysh_threshold_700,
    eysh_threshold_800
  INTO
    v_eysh_threshold_500,
    v_eysh_threshold_600,
    v_eysh_threshold_700,
    v_eysh_threshold_800
  FROM mock_tests
  WHERE id = v_test_id;

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

    -- Count score
    IF v_is_correct THEN
      v_total_score := v_total_score + v_points;
    END IF;

    -- Insert answer record
    INSERT INTO mock_test_answers (
      attempt_id,
      question_id,
      selected_option_id,
      is_correct,
      points_earned
    ) VALUES (
      p_attempt_id,
      v_question_id,
      v_option_id,
      v_is_correct,
      CASE WHEN v_is_correct THEN v_points ELSE 0 END
    )
    ON CONFLICT (attempt_id, question_id)
    DO UPDATE SET
      selected_option_id = EXCLUDED.selected_option_id,
      is_correct = EXCLUDED.is_correct,
      points_earned = EXCLUDED.points_earned,
      answered_at = NOW();
  END LOOP;

  -- Calculate percentage (0-100 scale)
  v_percentage := ROUND((v_total_score::DECIMAL / v_max_possible_score) * 100, 2);

  -- Calculate EYSH converted score
  v_eysh_converted_score := NULL;  -- Default: no conversion or failed

  IF v_eysh_threshold_500 IS NOT NULL THEN
    -- Compare percentage against thresholds
    IF v_percentage >= v_eysh_threshold_800 THEN
      v_eysh_converted_score := 800;
    ELSIF v_percentage >= v_eysh_threshold_700 THEN
      v_eysh_converted_score := 700;
    ELSIF v_percentage >= v_eysh_threshold_600 THEN
      v_eysh_converted_score := 600;
    ELSIF v_percentage >= v_eysh_threshold_500 THEN
      v_eysh_converted_score := 500;
    -- ELSE: percentage below 500 threshold, remains NULL (failed)
    END IF;
  END IF;

  -- Update attempt as completed
  UPDATE mock_test_attempts
  SET
    is_completed = true,
    completed_at = NOW(),
    total_score = v_total_score,
    max_score = v_max_possible_score,
    percentage = v_percentage,
    eysh_converted_score = v_eysh_converted_score
  WHERE id = p_attempt_id;

  -- Return results
  RETURN json_build_object(
    'total_score', v_total_score,
    'max_score', v_max_possible_score,
    'total_questions', v_total_questions,
    'percentage', v_percentage,
    'eysh_converted_score', v_eysh_converted_score
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ==================================================
-- Fix 2: save_mock_test_answer (if still in use)
-- ==================================================
CREATE OR REPLACE FUNCTION save_mock_test_answer(
  p_attempt_id UUID,
  p_question_id UUID,
  p_option_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
  v_is_correct BOOLEAN;
  v_points INTEGER;
BEGIN
  -- SECURITY: Verify user owns this attempt
  IF NOT EXISTS (
    SELECT 1 FROM mock_test_attempts
    WHERE id = p_attempt_id
    AND user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Unauthorized: You do not own this attempt';
  END IF;

  -- Get option correctness and points
  SELECT o.is_correct, q.points INTO v_is_correct, v_points
  FROM mock_test_options o
  JOIN mock_test_questions q ON q.id = o.question_id
  WHERE o.id = p_option_id AND q.id = p_question_id;

  -- Insert or update the answer
  INSERT INTO mock_test_answers (
    attempt_id,
    question_id,
    selected_option_id,
    is_correct,
    points_earned
  ) VALUES (
    p_attempt_id,
    p_question_id,
    p_option_id,
    v_is_correct,
    CASE WHEN v_is_correct THEN v_points ELSE 0 END
  )
  ON CONFLICT (attempt_id, question_id)
  DO UPDATE SET
    selected_option_id = EXCLUDED.selected_option_id,
    is_correct = EXCLUDED.is_correct,
    points_earned = EXCLUDED.points_earned,
    answered_at = NOW();

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ==================================================
-- Fix 3: submit_mock_test_attempt (if exists)
-- ==================================================
-- Note: This function may not exist in current schema
-- Keeping for completeness if it's added in future
