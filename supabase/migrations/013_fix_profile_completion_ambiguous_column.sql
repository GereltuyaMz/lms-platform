-- Migration: Fix ambiguous column reference in award_profile_completion_xp function
-- Description: Qualify user_id column references to avoid ambiguity

CREATE OR REPLACE FUNCTION award_profile_completion_xp(user_id UUID)
RETURNS TABLE(
  success BOOLEAN,
  xp_awarded INTEGER,
  message TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  profile_complete BOOLEAN;
  already_awarded BOOLEAN;
  new_transaction_id UUID;
BEGIN
  -- Check if profile is complete
  profile_complete := check_profile_completion(user_id);

  IF NOT profile_complete THEN
    RETURN QUERY SELECT FALSE, 0, 'Profile is not complete';
    RETURN;
  END IF;

  -- Check if XP already awarded (fixed: qualify column with table name)
  SELECT EXISTS(
    SELECT 1 FROM xp_transactions
    WHERE xp_transactions.user_id = award_profile_completion_xp.user_id
    AND source_type = 'profile_completion'
  ) INTO already_awarded;

  IF already_awarded THEN
    RETURN QUERY SELECT FALSE, 0, 'Profile completion XP already awarded';
    RETURN;
  END IF;

  -- Award 150 XP for profile completion
  INSERT INTO xp_transactions (
    user_id,
    amount,
    source_type,
    description
  ) VALUES (
    award_profile_completion_xp.user_id,
    150,
    'profile_completion',
    'Completed profile setup'
  )
  RETURNING id INTO new_transaction_id;

  -- Update profile completion timestamp
  UPDATE user_profiles
  SET
    profile_completed_at = NOW(),
    has_completed_onboarding = TRUE
  WHERE id = award_profile_completion_xp.user_id;

  RETURN QUERY SELECT TRUE, 150, 'Profile completion XP awarded successfully';
END;
$$;
