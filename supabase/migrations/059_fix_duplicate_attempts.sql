-- ================================================
-- Fix duplicate attempt creation race condition
-- ================================================
-- Problem: Concurrent requests can both pass the initial check and create duplicates
-- Solution: Add FOR UPDATE row locking to serialize concurrent requests

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

  -- Check for existing incomplete attempt WITH ROW LOCK
  -- FOR UPDATE prevents race conditions by locking the row until transaction commits
  -- This ensures only one concurrent request can proceed at a time
  SELECT id, end_time INTO v_existing_attempt, v_end_time
  FROM mock_test_attempts
  WHERE user_id = p_user_id
    AND mock_test_id = p_test_id
    AND is_completed = false
  FOR UPDATE
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
  'Creates new attempt or resumes existing. Uses FOR UPDATE locking to prevent race conditions.';
