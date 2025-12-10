-- Migration: Add Profile Completion Tracking
-- Description: Add columns to track profile completion status and award 150 XP bonus

-- Add profile completion columns to user_profiles table
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS profile_completed_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS has_completed_onboarding BOOLEAN DEFAULT FALSE;

-- Add comment for documentation
COMMENT ON COLUMN user_profiles.profile_completed_at IS 'Timestamp when user completed their profile (avatar, DOB, learning goals)';
COMMENT ON COLUMN user_profiles.has_completed_onboarding IS 'Whether user has completed the onboarding flow';

-- Create function to check if profile is complete
CREATE OR REPLACE FUNCTION check_profile_completion(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  profile_record RECORD;
BEGIN
  SELECT
    avatar_url,
    date_of_birth,
    learning_goals
  INTO profile_record
  FROM user_profiles
  WHERE id = user_id;

  -- Profile is complete if all three fields are filled
  -- Note: learning_goals is a TEXT[] array, so we check if it has elements
  RETURN (
    profile_record.avatar_url IS NOT NULL AND
    profile_record.avatar_url != '' AND
    profile_record.date_of_birth IS NOT NULL AND
    profile_record.learning_goals IS NOT NULL AND
    array_length(profile_record.learning_goals, 1) > 0
  );
END;
$$;

-- Create function to award profile completion XP
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

  -- Check if XP already awarded
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

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION check_profile_completion(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION award_profile_completion_xp(UUID) TO authenticated;
