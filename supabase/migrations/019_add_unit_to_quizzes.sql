-- =====================================================
-- ADD UNIT SUPPORT TO QUIZ TABLES
-- =====================================================
-- Adds unit_id to quiz_questions and quiz_attempts
-- for unit-level quizzes (instead of lesson-level)
-- Run after 018_add_unit_to_lessons.sql

-- =====================================================
-- MODIFY QUIZ_QUESTIONS TABLE
-- =====================================================

-- Add unit_id column
ALTER TABLE quiz_questions
  ADD COLUMN unit_id UUID REFERENCES units(id) ON DELETE CASCADE;

-- Make lesson_id nullable (quiz can belong to unit OR lesson)
ALTER TABLE quiz_questions
  ALTER COLUMN lesson_id DROP NOT NULL;

-- Add constraint: must have either lesson_id OR unit_id (not neither)
ALTER TABLE quiz_questions
  ADD CONSTRAINT quiz_question_parent_required
  CHECK (lesson_id IS NOT NULL OR unit_id IS NOT NULL);

-- =====================================================
-- MODIFY QUIZ_ATTEMPTS TABLE
-- =====================================================

-- Add unit_id column
ALTER TABLE quiz_attempts
  ADD COLUMN unit_id UUID REFERENCES units(id) ON DELETE CASCADE;

-- Make lesson_id nullable
ALTER TABLE quiz_attempts
  ALTER COLUMN lesson_id DROP NOT NULL;

-- Add constraint: must have either lesson_id OR unit_id
ALTER TABLE quiz_attempts
  ADD CONSTRAINT quiz_attempt_parent_required
  CHECK (lesson_id IS NOT NULL OR unit_id IS NOT NULL);

-- =====================================================
-- INDEXES
-- =====================================================

-- Index for unit-based quiz queries
CREATE INDEX idx_quiz_questions_unit ON quiz_questions(unit_id);
CREATE INDEX idx_quiz_questions_unit_order ON quiz_questions(unit_id, order_index);

-- Index for unit-based quiz attempt queries
CREATE INDEX idx_quiz_attempts_unit ON quiz_attempts(unit_id);
CREATE INDEX idx_quiz_attempts_enrollment_unit ON quiz_attempts(enrollment_id, unit_id);

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Get quiz questions for a unit with options
CREATE OR REPLACE FUNCTION get_unit_quiz_questions(unit_uuid UUID)
RETURNS TABLE (
  question_id UUID,
  question TEXT,
  explanation TEXT,
  order_index INTEGER,
  points INTEGER,
  option_id UUID,
  option_text TEXT,
  option_order INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    qq.id as question_id,
    qq.question,
    qq.explanation,
    qq.order_index,
    qq.points,
    qo.id as option_id,
    qo.option_text,
    qo.order_index as option_order
  FROM quiz_questions qq
  INNER JOIN quiz_options qo ON qq.id = qo.question_id
  WHERE qq.unit_id = unit_uuid
  ORDER BY qq.order_index, qo.order_index;
END;
$$ LANGUAGE plpgsql;

-- Get user's best quiz attempt for a unit
CREATE OR REPLACE FUNCTION get_best_unit_quiz_attempt(
  enroll_id UUID,
  unit_uuid UUID
)
RETURNS TABLE (
  attempt_id UUID,
  score INTEGER,
  total_questions INTEGER,
  points_earned INTEGER,
  completed_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    qa.id as attempt_id,
    qa.score,
    qa.total_questions,
    qa.points_earned,
    qa.completed_at
  FROM quiz_attempts qa
  WHERE qa.enrollment_id = enroll_id
    AND qa.unit_id = unit_uuid
  ORDER BY qa.score DESC, qa.points_earned DESC, qa.completed_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Check if unit has a quiz
CREATE OR REPLACE FUNCTION unit_has_quiz(unit_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS(SELECT 1 FROM quiz_questions WHERE unit_id = unit_uuid);
END;
$$ LANGUAGE plpgsql;

-- Get unit quiz stats
CREATE OR REPLACE FUNCTION get_unit_quiz_stats(unit_uuid UUID)
RETURNS TABLE (
  question_count INTEGER,
  total_points INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::INTEGER as question_count,
    COALESCE(SUM(points), 0)::INTEGER as total_points
  FROM quiz_questions
  WHERE unit_id = unit_uuid;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- COMMENTS
-- =====================================================
COMMENT ON COLUMN quiz_questions.unit_id IS 'Foreign key to units table for unit-level quizzes. Null for lesson-level quizzes.';
COMMENT ON COLUMN quiz_attempts.unit_id IS 'Foreign key to units table. Tracks which unit quiz was attempted.';

COMMENT ON CONSTRAINT quiz_question_parent_required ON quiz_questions IS 'Ensures quiz belongs to either a lesson or a unit';
COMMENT ON CONSTRAINT quiz_attempt_parent_required ON quiz_attempts IS 'Ensures quiz attempt belongs to either a lesson or a unit';

COMMENT ON FUNCTION get_unit_quiz_questions IS 'Retrieves all questions and options for a unit quiz';
COMMENT ON FUNCTION get_best_unit_quiz_attempt IS 'Gets the user''s best attempt at a specific unit quiz';
COMMENT ON FUNCTION unit_has_quiz IS 'Checks if a unit has quiz questions';
COMMENT ON FUNCTION get_unit_quiz_stats IS 'Returns question count and total points for a unit quiz';
