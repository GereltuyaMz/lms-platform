-- ================================================
-- Update submit RPC to calculate EYSH converted score
-- ================================================

CREATE OR REPLACE FUNCTION submit_mock_test_with_answers(
  p_attempt_id UUID,
  p_answers JSONB
)
RETURNS JSON AS $$
DECLARE
  v_total_score INTEGER := 0;
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
  -- Get test ID and total questions
  SELECT mock_test_id, total_questions INTO v_test_id, v_total_questions
  FROM mock_test_attempts
  WHERE id = p_attempt_id;

  IF v_test_id IS NULL THEN
    RAISE EXCEPTION 'Attempt not found';
  END IF;

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

  -- Percentage IS the score (already on 100-point scale)
  v_percentage := v_total_score;

  -- Calculate EYSH converted score
  -- Score is already on 100-point scale, compare directly against thresholds
  v_eysh_converted_score := NULL;  -- Default: no conversion or failed

  IF v_eysh_threshold_500 IS NOT NULL THEN
    -- Compare score directly against thresholds (60, 80, 90, 95)
    IF v_total_score >= v_eysh_threshold_800 THEN
      v_eysh_converted_score := 800;
    ELSIF v_total_score >= v_eysh_threshold_700 THEN
      v_eysh_converted_score := 700;
    ELSIF v_total_score >= v_eysh_threshold_600 THEN
      v_eysh_converted_score := 600;
    ELSIF v_total_score >= v_eysh_threshold_500 THEN
      v_eysh_converted_score := 500;
    -- ELSE: score below 500 threshold (< 60), remains NULL (failed)
    END IF;
  END IF;

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

  -- Update attempt with final scores including EYSH converted score
  UPDATE mock_test_attempts
  SET
    total_score = v_total_score,
    percentage = v_percentage,
    subject_scores = v_subject_scores,
    eysh_converted_score = v_eysh_converted_score,
    is_completed = true,
    completed_at = NOW(),
    updated_at = NOW()
  WHERE id = p_attempt_id;

  -- Return results including EYSH converted score
  RETURN json_build_object(
    'total_score', v_total_score,
    'total_questions', v_total_questions,
    'percentage', v_percentage,
    'subject_scores', v_subject_scores,
    'eysh_converted_score', v_eysh_converted_score
  );
END;
$$ LANGUAGE plpgsql;

-- ================================================
-- Update get_best_mock_test_attempt to include EYSH score
-- ================================================

CREATE OR REPLACE FUNCTION get_best_mock_test_attempt(
  p_user_id UUID,
  p_test_id UUID
)
RETURNS JSON AS $$
DECLARE
  v_best_attempt JSON;
BEGIN
  SELECT json_build_object(
    'id', a.id,
    'total_score', a.total_score,
    'total_questions', a.total_questions,
    'percentage', a.percentage,
    'xp_awarded', a.xp_awarded,
    'completed_at', a.completed_at,
    'subject_scores', a.subject_scores,
    'eysh_converted_score', a.eysh_converted_score
  ) INTO v_best_attempt
  FROM mock_test_attempts a
  WHERE a.user_id = p_user_id
    AND a.mock_test_id = p_test_id
    AND a.is_completed = true
  ORDER BY a.percentage DESC, a.total_score DESC, a.completed_at DESC
  LIMIT 1;

  RETURN v_best_attempt;
END;
$$ LANGUAGE plpgsql STABLE;
