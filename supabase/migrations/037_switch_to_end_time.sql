-- ================================================
-- Switch from time_remaining_seconds to end_time
-- ================================================
-- This migration adds an absolute end_time timestamp instead of tracking
-- remaining seconds, eliminating time drift and simplifying timer logic.

-- Step 1: Add end_time column
ALTER TABLE mock_test_attempts
ADD COLUMN IF NOT EXISTS end_time TIMESTAMPTZ;

-- Step 2: Migrate existing incomplete attempts
-- Calculate end_time from current time_remaining_seconds
UPDATE mock_test_attempts
SET end_time = NOW() + (time_remaining_seconds * INTERVAL '1 second')
WHERE is_completed = false
  AND time_remaining_seconds IS NOT NULL
  AND end_time IS NULL;

-- Step 3: Update create_mock_test_attempt function
CREATE OR REPLACE FUNCTION create_mock_test_attempt(
  p_user_id UUID,
  p_test_id UUID
)
RETURNS UUID AS $$
DECLARE
  v_attempt_id UUID;
  v_existing_attempt UUID;
  v_total_questions INTEGER;
  v_time_limit_minutes INTEGER;
BEGIN
  -- Check for existing incomplete attempt
  SELECT id INTO v_existing_attempt
  FROM mock_test_attempts
  WHERE user_id = p_user_id
    AND mock_test_id = p_test_id
    AND is_completed = false
  ORDER BY started_at DESC
  LIMIT 1;

  -- Return existing attempt if found (resume)
  IF v_existing_attempt IS NOT NULL THEN
    RETURN v_existing_attempt;
  END IF;

  -- Get test details
  SELECT total_questions, time_limit_minutes INTO v_total_questions, v_time_limit_minutes
  FROM mock_tests
  WHERE id = p_test_id;

  -- Create new attempt with absolute end_time
  INSERT INTO mock_test_attempts (
    user_id,
    mock_test_id,
    total_questions,
    end_time  -- Use end_time instead of time_remaining_seconds
  )
  VALUES (
    p_user_id,
    p_test_id,
    v_total_questions,
    NOW() + (v_time_limit_minutes * INTERVAL '1 minute')  -- Set absolute end time
  )
  RETURNING id INTO v_attempt_id;

  RETURN v_attempt_id;
END;
$$ LANGUAGE plpgsql;

-- Step 4: Deprecate update_timer_state function
-- Keep it for backward compatibility but make it a no-op
CREATE OR REPLACE FUNCTION update_timer_state(
  p_attempt_id UUID,
  p_time_remaining_seconds INTEGER
)
RETURNS VOID AS $$
BEGIN
  -- This function is deprecated and does nothing
  -- Kept for backward compatibility during migration period
  -- Can be removed in future migration
  NULL;
END;
$$ LANGUAGE plpgsql;

-- Step 5: Add comment to time_remaining_seconds column
COMMENT ON COLUMN mock_test_attempts.time_remaining_seconds IS
  'DEPRECATED: Use end_time instead. Kept for backward compatibility.';

COMMENT ON COLUMN mock_test_attempts.end_time IS
  'Absolute timestamp when the test expires. Timer calculates remaining time as (end_time - NOW()).';
