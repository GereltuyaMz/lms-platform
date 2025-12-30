-- Fix percentage calculation in submit_mock_test_attempt function
-- The issue: percentage was being calculated as (total_score / question_count) * 100
-- which gives wrong results when questions have points > 1
-- Correct: percentage should be (total_score / max_possible_score) * 100

CREATE OR REPLACE FUNCTION submit_mock_test_attempt(p_attempt_id UUID)
RETURNS JSON AS $$
DECLARE
  v_total_score INTEGER;
  v_answered_questions INTEGER;
  v_max_possible_score INTEGER;
  v_percentage DECIMAL(5,2);
  v_subject_scores JSONB;
  v_test_id UUID;
BEGIN
  -- Get test ID first
  SELECT mock_test_id INTO v_test_id
  FROM mock_test_attempts
  WHERE id = p_attempt_id;

  -- Calculate total score from answers
  SELECT COALESCE(SUM(points_earned), 0), COUNT(*)
  INTO v_total_score, v_answered_questions
  FROM mock_test_answers
  WHERE attempt_id = p_attempt_id;

  -- Calculate maximum possible score for this test
  SELECT COALESCE(SUM(q.points), 0)
  INTO v_max_possible_score
  FROM mock_test_questions q
  JOIN mock_test_problems p ON p.id = q.problem_id
  JOIN mock_test_sections s ON s.id = p.section_id
  WHERE s.mock_test_id = v_test_id;

  -- Calculate percentage correctly
  v_percentage := CASE
    WHEN v_max_possible_score > 0 THEN ROUND((v_total_score::DECIMAL / v_max_possible_score) * 100, 2)
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
    percentage = v_percentage,
    subject_scores = v_subject_scores,
    is_completed = true,
    completed_at = NOW(),
    updated_at = NOW()
  WHERE id = p_attempt_id;

  -- Return results with question count from test definition
  RETURN json_build_object(
    'total_score', v_total_score,
    'total_questions', (SELECT total_questions FROM mock_tests WHERE id = v_test_id),
    'percentage', v_percentage,
    'subject_scores', v_subject_scores
  );
END;
$$ LANGUAGE plpgsql;
