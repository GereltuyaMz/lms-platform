-- Migration: Badge & Achievement System
-- Description: Creates tables and functions for the gamification badge system
-- Dependencies: Requires user_profiles, xp_transactions tables (from previous migrations)

-- ======================
-- TABLES
-- ======================

-- badges table: Defines all available achievement badges
CREATE TABLE badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,                  -- Internal identifier (e.g., "First Steps")
  name_mn TEXT NOT NULL,                      -- Mongolian display name (e.g., "Эхний алхам")
  description_mn TEXT NOT NULL,               -- Mongolian description
  category TEXT NOT NULL CHECK (category IN (
    'course_completion',
    'quiz_performance',
    'streak',
    'engagement',
    'milestone',
    'social'
  )),
  rarity TEXT NOT NULL CHECK (rarity IN (
    'bronze',
    'silver',
    'gold',
    'platinum'
  )),
  xp_bonus INTEGER NOT NULL,                  -- XP awarded when badge is unlocked
  icon TEXT NOT NULL,                         -- Emoji icon (e.g., "🔥", "🎓", "⭐")
  requirement_type TEXT NOT NULL,             -- Type of requirement to check
  requirement_value INTEGER NOT NULL,         -- Target value (e.g., 5 courses, 10 quizzes)
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- user_badges: Tracks user progress toward and unlocking of badges
CREATE TABLE user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  progress_current INTEGER DEFAULT 0,         -- Current progress value
  progress_target INTEGER NOT NULL,           -- Target value (copied from badge requirement_value)
  unlocked_at TIMESTAMPTZ,                    -- NULL = locked, timestamp = unlocked
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, badge_id)                   -- Each user can have each badge only once
);

-- ======================
-- INDEXES
-- ======================

CREATE INDEX idx_badges_category ON badges(category);
CREATE INDEX idx_badges_requirement ON badges(requirement_type, requirement_value);
CREATE INDEX idx_user_badges_user_id ON user_badges(user_id);
CREATE INDEX idx_user_badges_user_unlocked ON user_badges(user_id, unlocked_at);
CREATE INDEX idx_user_badges_badge_id ON user_badges(badge_id);

-- ======================
-- FUNCTIONS
-- ======================

-- Function: Initialize badge progress for a user
-- Called when checking a badge for the first time
CREATE OR REPLACE FUNCTION initialize_user_badge(
  p_user_id UUID,
  p_badge_name TEXT
) RETURNS UUID AS $$
DECLARE
  v_badge_id UUID;
  v_requirement_value INTEGER;
  v_user_badge_id UUID;
BEGIN
  -- Get badge details
  SELECT id, requirement_value
  INTO v_badge_id, v_requirement_value
  FROM badges
  WHERE name = p_badge_name;

  IF v_badge_id IS NULL THEN
    RAISE EXCEPTION 'Badge not found: %', p_badge_name;
  END IF;

  -- Insert or get existing user_badge
  INSERT INTO user_badges (user_id, badge_id, progress_current, progress_target)
  VALUES (p_user_id, v_badge_id, 0, v_requirement_value)
  ON CONFLICT (user_id, badge_id) DO NOTHING
  RETURNING id INTO v_user_badge_id;

  -- If conflict occurred, get existing id
  IF v_user_badge_id IS NULL THEN
    SELECT id INTO v_user_badge_id
    FROM user_badges
    WHERE user_id = p_user_id AND badge_id = v_badge_id;
  END IF;

  RETURN v_user_badge_id;
END;
$$ LANGUAGE plpgsql;

-- Function: Check and award a specific badge
-- Returns TRUE if badge was newly unlocked, FALSE otherwise
CREATE OR REPLACE FUNCTION check_and_award_badge(
  p_user_id UUID,
  p_badge_name TEXT,
  p_current_value INTEGER
) RETURNS BOOLEAN AS $$
DECLARE
  v_badge_id UUID;
  v_xp_bonus INTEGER;
  v_requirement_value INTEGER;
  v_was_unlocked BOOLEAN;
  v_newly_unlocked BOOLEAN := FALSE;
BEGIN
  -- Get badge details
  SELECT id, xp_bonus, requirement_value
  INTO v_badge_id, v_xp_bonus, v_requirement_value
  FROM badges
  WHERE name = p_badge_name;

  IF v_badge_id IS NULL THEN
    RAISE NOTICE 'Badge not found: %', p_badge_name;
    RETURN FALSE;
  END IF;

  -- Check if already unlocked
  SELECT (unlocked_at IS NOT NULL) INTO v_was_unlocked
  FROM user_badges
  WHERE user_id = p_user_id AND badge_id = v_badge_id;

  -- If no record exists, create it
  IF NOT FOUND THEN
    INSERT INTO user_badges (user_id, badge_id, progress_current, progress_target)
    VALUES (p_user_id, v_badge_id, p_current_value, v_requirement_value);
    v_was_unlocked := FALSE;
  END IF;

  -- If already unlocked, don't award again
  IF v_was_unlocked THEN
    RETURN FALSE;
  END IF;

  -- Update progress
  UPDATE user_badges
  SET
    progress_current = p_current_value,
    updated_at = NOW(),
    unlocked_at = CASE
      WHEN p_current_value >= progress_target AND unlocked_at IS NULL
      THEN NOW()
      ELSE unlocked_at
    END
  WHERE user_id = p_user_id AND badge_id = v_badge_id
  RETURNING (unlocked_at = NOW()) INTO v_newly_unlocked;

  -- Award XP if newly unlocked
  IF v_newly_unlocked THEN
    INSERT INTO xp_transactions (user_id, amount, source_type, description)
    VALUES (
      p_user_id,
      v_xp_bonus,
      'achievement',
      'Badge unlocked: ' || p_badge_name
    );

    RAISE NOTICE 'Badge unlocked: % (+% XP)', p_badge_name, v_xp_bonus;
    RETURN TRUE;
  END IF;

  RETURN FALSE;
END;
$$ LANGUAGE plpgsql;

-- Function: Get user stats for badge checking
CREATE OR REPLACE FUNCTION get_user_badge_stats(p_user_id UUID)
RETURNS TABLE (
  completed_courses INTEGER,
  completed_lessons INTEGER,
  perfect_quiz_count INTEGER,
  quiz_90_plus_count INTEGER,
  current_streak INTEGER,
  total_learning_hours DECIMAL,
  total_xp INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    -- Completed courses
    (SELECT COUNT(*)::INTEGER FROM enrollments
     WHERE user_id = p_user_id AND completed_at IS NOT NULL),

    -- Completed lessons
    (SELECT COUNT(*)::INTEGER FROM lesson_progress lp
     INNER JOIN enrollments e ON lp.enrollment_id = e.id
     WHERE e.user_id = p_user_id AND lp.is_completed = true),

    -- Perfect quizzes (100% score)
    (SELECT COUNT(*)::INTEGER FROM quiz_attempts qa
     INNER JOIN enrollments e ON qa.enrollment_id = e.id
     WHERE e.user_id = p_user_id
     AND qa.score = qa.total_questions),

    -- High-score quizzes (90%+ score)
    (SELECT COUNT(*)::INTEGER FROM quiz_attempts qa
     INNER JOIN enrollments e ON qa.enrollment_id = e.id
     WHERE e.user_id = p_user_id
     AND (qa.score::DECIMAL / qa.total_questions) >= 0.9),

    -- Current streak
    (SELECT current_streak FROM user_profiles WHERE id = p_user_id),

    -- Total learning hours
    (SELECT total_learning_hours FROM user_profiles WHERE id = p_user_id),

    -- Total XP
    (SELECT total_xp FROM user_profiles WHERE id = p_user_id);
END;
$$ LANGUAGE plpgsql;

-- ======================
-- TRIGGERS
-- ======================

-- Trigger: Update user_badges.updated_at on modification
CREATE OR REPLACE FUNCTION update_user_badges_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_user_badges_updated_at
  BEFORE UPDATE ON user_badges
  FOR EACH ROW
  EXECUTE FUNCTION update_user_badges_timestamp();

-- Trigger: Check badges after lesson completion
CREATE OR REPLACE FUNCTION trigger_badges_after_lesson()
RETURNS TRIGGER AS $$
DECLARE
  v_user_id UUID;
  v_completed_count INTEGER;
  v_completed_today INTEGER;
BEGIN
  -- Only trigger when lesson is newly completed
  IF NEW.is_completed = FALSE OR (OLD.is_completed = TRUE AND NEW.is_completed = TRUE) THEN
    RETURN NEW;
  END IF;

  -- Get user_id
  SELECT e.user_id INTO v_user_id
  FROM enrollments e
  WHERE e.id = NEW.enrollment_id;

  -- Count total completed lessons
  SELECT COUNT(*)::INTEGER INTO v_completed_count
  FROM lesson_progress lp
  INNER JOIN enrollments e ON lp.enrollment_id = e.id
  WHERE e.user_id = v_user_id AND lp.is_completed = true;

  -- Check engagement badges
  PERFORM check_and_award_badge(v_user_id, 'Century', v_completed_count);

  -- Count lessons completed today
  SELECT COUNT(*)::INTEGER INTO v_completed_today
  FROM lesson_progress lp
  INNER JOIN enrollments e ON lp.enrollment_id = e.id
  WHERE e.user_id = v_user_id
  AND lp.is_completed = true
  AND lp.completed_at::DATE = CURRENT_DATE;

  -- Check daily engagement badges
  IF v_completed_today >= 5 THEN
    PERFORM check_and_award_badge(v_user_id, 'Marathon Learner', v_completed_today);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_lesson_complete_check_badges
  AFTER UPDATE OF is_completed ON lesson_progress
  FOR EACH ROW
  EXECUTE FUNCTION trigger_badges_after_lesson();

-- Trigger: Check badges after quiz completion
CREATE OR REPLACE FUNCTION trigger_badges_after_quiz()
RETURNS TRIGGER AS $$
DECLARE
  v_user_id UUID;
  v_perfect_count INTEGER;
  v_high_score_count INTEGER;
BEGIN
  -- Get user_id
  SELECT e.user_id INTO v_user_id
  FROM enrollments e
  WHERE e.id = NEW.enrollment_id;

  -- If perfect score (100%)
  IF NEW.score = NEW.total_questions THEN
    -- Count total perfect scores
    SELECT COUNT(*)::INTEGER INTO v_perfect_count
    FROM quiz_attempts qa
    INNER JOIN enrollments e ON qa.enrollment_id = e.id
    WHERE e.user_id = v_user_id
    AND qa.score = qa.total_questions;

    -- Check quiz performance badges
    PERFORM check_and_award_badge(v_user_id, 'Perfect Score', v_perfect_count);
    PERFORM check_and_award_badge(v_user_id, 'Quiz Ace', v_perfect_count);
    PERFORM check_and_award_badge(v_user_id, 'Quiz Master', v_perfect_count);
  END IF;

  -- If high score (90%+)
  IF (NEW.score::DECIMAL / NEW.total_questions) >= 0.9 THEN
    SELECT COUNT(*)::INTEGER INTO v_high_score_count
    FROM quiz_attempts qa
    INNER JOIN enrollments e ON qa.enrollment_id = e.id
    WHERE e.user_id = v_user_id
    AND (qa.score::DECIMAL / qa.total_questions) >= 0.9;

    PERFORM check_and_award_badge(v_user_id, 'Genius', v_high_score_count);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_quiz_attempt_check_badges
  AFTER INSERT ON quiz_attempts
  FOR EACH ROW
  EXECUTE FUNCTION trigger_badges_after_quiz();

-- Trigger: Check badges after course completion
CREATE OR REPLACE FUNCTION trigger_badges_after_course()
RETURNS TRIGGER AS $$
DECLARE
  v_completed_count INTEGER;
BEGIN
  -- Only trigger when course is newly completed
  IF NEW.completed_at IS NULL OR (OLD.completed_at IS NOT NULL AND NEW.completed_at IS NOT NULL) THEN
    RETURN NEW;
  END IF;

  -- Count total completed courses
  SELECT COUNT(*)::INTEGER INTO v_completed_count
  FROM enrollments
  WHERE user_id = NEW.user_id AND completed_at IS NOT NULL;

  -- Check course completion badges
  PERFORM check_and_award_badge(NEW.user_id, 'First Steps', v_completed_count);
  PERFORM check_and_award_badge(NEW.user_id, 'Knowledge Seeker', v_completed_count);
  PERFORM check_and_award_badge(NEW.user_id, 'Course Master', v_completed_count);
  PERFORM check_and_award_badge(NEW.user_id, 'Learning Legend', v_completed_count);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_course_complete_check_badges
  AFTER UPDATE OF completed_at ON enrollments
  FOR EACH ROW
  EXECUTE FUNCTION trigger_badges_after_course();

-- Trigger: Check streak badges when streak is updated
CREATE OR REPLACE FUNCTION trigger_badges_after_streak_update()
RETURNS TRIGGER AS $$
BEGIN
  -- Only check if streak increased
  IF NEW.current_streak > OLD.current_streak THEN
    PERFORM check_and_award_badge(NEW.id, 'Starting Streak', NEW.current_streak);
    PERFORM check_and_award_badge(NEW.id, 'Week Warrior', NEW.current_streak);
    PERFORM check_and_award_badge(NEW.id, 'Month Master', NEW.current_streak);
    PERFORM check_and_award_badge(NEW.id, 'Unstoppable', NEW.current_streak);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_streak_update_check_badges
  AFTER UPDATE OF current_streak ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION trigger_badges_after_streak_update();

-- Trigger: Check XP milestone badges when XP is updated
CREATE OR REPLACE FUNCTION trigger_badges_after_xp_update()
RETURNS TRIGGER AS $$
BEGIN
  -- Only check if XP increased
  IF NEW.total_xp > OLD.total_xp THEN
    PERFORM check_and_award_badge(NEW.id, 'XP Collector', NEW.total_xp);
    PERFORM check_and_award_badge(NEW.id, 'XP Enthusiast', NEW.total_xp);
    PERFORM check_and_award_badge(NEW.id, 'XP Master', NEW.total_xp);
    PERFORM check_and_award_badge(NEW.id, 'XP Legend', NEW.total_xp);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_xp_update_check_badges
  AFTER UPDATE OF total_xp ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION trigger_badges_after_xp_update();

-- ======================
-- COMMENTS
-- ======================

COMMENT ON TABLE badges IS 'Defines all achievement badges available in the system';
COMMENT ON TABLE user_badges IS 'Tracks user progress and unlocking status for each badge';
COMMENT ON FUNCTION check_and_award_badge IS 'Core function to check badge requirements and award if met';
COMMENT ON FUNCTION get_user_badge_stats IS 'Retrieves aggregated user statistics for badge checking';
