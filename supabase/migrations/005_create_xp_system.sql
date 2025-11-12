-- Phase 4A: XP System Implementation
-- Creates xp_transactions table and updates user_profiles for gamification

-- ============================================
-- 1. Add XP columns to user_profiles
-- ============================================

ALTER TABLE user_profiles
  ADD COLUMN total_xp INTEGER DEFAULT 0,
  ADD COLUMN current_streak INTEGER DEFAULT 0,
  ADD COLUMN longest_streak INTEGER DEFAULT 0,
  ADD COLUMN last_activity_date DATE;

CREATE INDEX idx_user_profiles_total_xp ON user_profiles(total_xp DESC);
CREATE INDEX idx_user_profiles_streak ON user_profiles(current_streak DESC);

-- ============================================
-- 2. Create xp_transactions table
-- ============================================

CREATE TABLE xp_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  -- Transaction details
  amount INTEGER NOT NULL,
  source_type TEXT NOT NULL CHECK (
    source_type IN (
      'lesson_complete',
      'quiz_complete',
      'milestone',
      'streak',
      'achievement',
      'shop_purchase'
    )
  ),

  -- Reference to source entityf
  source_id UUID,

  -- Human-readable description
  description TEXT,

  -- Additional metadata (JSON)
  metadata JSONB DEFAULT '{}'::jsonb,

  -- Timestamp
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX idx_xp_transactions_user_id ON xp_transactions(user_id);
CREATE INDEX idx_xp_transactions_created_at ON xp_transactions(created_at DESC);
CREATE INDEX idx_xp_transactions_source_type ON xp_transactions(source_type);
CREATE INDEX idx_xp_transactions_user_created ON xp_transactions(user_id, created_at DESC);

-- ============================================
-- 3. Enable Row Level Security (TODO: Implement later with all tables)
-- ============================================

-- ALTER TABLE xp_transactions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own XP transactions
-- CREATE POLICY "Users can view own XP transactions"
--   ON xp_transactions
--   FOR SELECT
--   USING (auth.uid() = user_id);

-- Policy: Only system can insert XP transactions (via server actions)
-- CREATE POLICY "Authenticated users can insert XP transactions"
--   ON xp_transactions
--   FOR INSERT
--   TO authenticated
--   WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 4. Create trigger to auto-update total_xp
-- ============================================

CREATE OR REPLACE FUNCTION update_user_total_xp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE user_profiles
  SET total_xp = (
    SELECT COALESCE(SUM(amount), 0)
    FROM xp_transactions
    WHERE user_id = NEW.user_id
  )
  WHERE id = NEW.user_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_update_total_xp
  AFTER INSERT ON xp_transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_user_total_xp();

-- ============================================
-- 5. Create helper functions for XP system
-- ============================================

-- Function to calculate video XP based on duration
CREATE OR REPLACE FUNCTION calculate_video_xp(
  duration_seconds INTEGER,
  is_first_lesson BOOLEAN DEFAULT false
)
RETURNS INTEGER AS $$
DECLARE
  base_xp INTEGER := 50;
  duration_bonus INTEGER;
  first_lesson_bonus INTEGER := 0;
BEGIN
  -- Add 5 XP per 5 minutes (300 seconds)
  duration_bonus := (duration_seconds / 300) * 5;

  -- Add first lesson bonus
  IF is_first_lesson THEN
    first_lesson_bonus := 25;
  END IF;

  RETURN base_xp + duration_bonus + first_lesson_bonus;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to calculate quiz XP based on score
CREATE OR REPLACE FUNCTION calculate_quiz_xp(
  score_percentage DECIMAL,
  is_retry BOOLEAN DEFAULT false
)
RETURNS INTEGER AS $$
DECLARE
  base_xp INTEGER;
BEGIN
  -- No XP for retries
  IF is_retry THEN
    RETURN 0;
  END IF;

  -- Determine base XP based on score (first attempt only)
  IF score_percentage >= 100 THEN
    base_xp := 200; -- Perfect score
  ELSIF score_percentage >= 95 THEN
    base_xp := 150; -- Excellent
  ELSIF score_percentage >= 90 THEN
    base_xp := 125; -- Good
  ELSIF score_percentage >= 80 THEN
    base_xp := 100; -- Pass
  ELSE
    base_xp := 0; -- No XP for failing scores
  END IF;

  RETURN base_xp;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to get user's total XP
CREATE OR REPLACE FUNCTION get_user_total_xp(p_user_id UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COALESCE(total_xp, 0)
    FROM user_profiles
    WHERE id = p_user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 6. Comments for documentation
-- ============================================

COMMENT ON TABLE xp_transactions IS 'Tracks all XP awards and deductions for gamification system';
COMMENT ON COLUMN xp_transactions.amount IS 'XP amount (positive for awards, negative for shop purchases)';
COMMENT ON COLUMN xp_transactions.source_type IS 'Type of action that triggered XP: lesson_complete, quiz_complete, milestone, streak, achievement, shop_purchase';
COMMENT ON COLUMN xp_transactions.source_id IS 'UUID reference to source entity (lesson_id, quiz_attempt_id, etc.)';
COMMENT ON COLUMN xp_transactions.metadata IS 'Additional data: quiz_score, streak_days, course_id, etc.';

COMMENT ON COLUMN user_profiles.total_xp IS 'Total XP earned by user (calculated from xp_transactions)';
COMMENT ON COLUMN user_profiles.current_streak IS 'Current consecutive days of learning activity';
COMMENT ON COLUMN user_profiles.longest_streak IS 'Longest streak ever achieved by user';
COMMENT ON COLUMN user_profiles.last_activity_date IS 'Date of last learning activity (for streak calculation)';
