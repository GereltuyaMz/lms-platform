-- Update quiz XP calculation to hybrid system
-- Base XP: 10 XP per correct answer
-- Mastery Bonus based on score percentage

DROP FUNCTION IF EXISTS calculate_quiz_xp(DECIMAL, BOOLEAN);

CREATE OR REPLACE FUNCTION calculate_quiz_xp(
  score_correct INTEGER,
  total_questions INTEGER,
  is_retry BOOLEAN DEFAULT false
)
RETURNS INTEGER AS $$
DECLARE
  base_xp INTEGER;
  mastery_bonus INTEGER := 0;
  score_percentage DECIMAL;
BEGIN
  -- No XP for retries
  IF is_retry THEN
    RETURN 0;
  END IF;

  -- Base XP: 10 XP per correct answer
  base_xp := score_correct * 10;

  -- Calculate percentage for mastery bonus
  IF total_questions > 0 THEN
    score_percentage := (score_correct::DECIMAL / total_questions) * 100;

    -- Add mastery bonus based on percentage
    IF score_percentage >= 100 THEN
      mastery_bonus := 100; -- Perfect score
    ELSIF score_percentage >= 95 THEN
      mastery_bonus := 75; -- Excellent
    ELSIF score_percentage >= 90 THEN
      mastery_bonus := 50; -- Good
    ELSIF score_percentage >= 80 THEN
      mastery_bonus := 25; -- Pass
    ELSE
      mastery_bonus := 0; -- Below passing, no bonus
    END IF;
  END IF;

  RETURN base_xp + mastery_bonus;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

COMMENT ON FUNCTION calculate_quiz_xp IS 'Calculate quiz XP with hybrid system: 10 XP per correct answer + mastery bonus (100/75/50/25 for 100%/95%/90%/80%+). No XP for retries.';
