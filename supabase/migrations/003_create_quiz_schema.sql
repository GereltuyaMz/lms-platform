-- =====================================================
-- QUIZ SCHEMA
-- =====================================================
-- Creates tables for quiz questions, options, and user attempts
-- Run this after 001_create_courses_schema.sql

-- =====================================================
-- QUIZ_QUESTIONS TABLE
-- =====================================================
-- Stores questions for quiz-type lessons
CREATE TABLE quiz_questions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE NOT NULL,
  question TEXT NOT NULL,
  explanation TEXT NOT NULL, -- Explanation shown after answering
  order_index INTEGER NOT NULL, -- Order within the quiz
  points INTEGER DEFAULT 10 NOT NULL, -- Points awarded for correct answer
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  UNIQUE(lesson_id, order_index),
  CONSTRAINT points_positive CHECK (points > 0)
);

-- =====================================================
-- QUIZ_OPTIONS TABLE
-- =====================================================
-- Stores multiple choice options for each question
CREATE TABLE quiz_options (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  question_id UUID REFERENCES quiz_questions(id) ON DELETE CASCADE NOT NULL,
  option_text TEXT NOT NULL,
  is_correct BOOLEAN DEFAULT false NOT NULL,
  order_index INTEGER NOT NULL, -- Order within the question (0-3 typically)
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  UNIQUE(question_id, order_index)
);

-- =====================================================
-- QUIZ_ATTEMPTS TABLE
-- =====================================================
-- Tracks user attempts at quizzes
CREATE TABLE quiz_attempts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  enrollment_id UUID REFERENCES enrollments(id) ON DELETE CASCADE NOT NULL,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE NOT NULL,
  score INTEGER NOT NULL, -- Number of correct answers
  total_questions INTEGER NOT NULL, -- Total questions in quiz
  points_earned INTEGER DEFAULT 0 NOT NULL, -- Total points earned
  completed_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  CONSTRAINT score_range CHECK (score >= 0 AND score <= total_questions)
);

-- =====================================================
-- QUIZ_ANSWERS TABLE
-- =====================================================
-- Stores individual answers for each question in an attempt
CREATE TABLE quiz_answers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  attempt_id UUID REFERENCES quiz_attempts(id) ON DELETE CASCADE NOT NULL,
  question_id UUID REFERENCES quiz_questions(id) ON DELETE CASCADE NOT NULL,
  selected_option_id UUID REFERENCES quiz_options(id) ON DELETE CASCADE NOT NULL,
  is_correct BOOLEAN NOT NULL,
  points_earned INTEGER DEFAULT 0 NOT NULL,
  answered_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  UNIQUE(attempt_id, question_id)
);

-- =====================================================
-- INDEXES
-- =====================================================
CREATE INDEX idx_quiz_questions_lesson ON quiz_questions(lesson_id);
CREATE INDEX idx_quiz_questions_order ON quiz_questions(lesson_id, order_index);
CREATE INDEX idx_quiz_options_question ON quiz_options(question_id);
CREATE INDEX idx_quiz_attempts_enrollment ON quiz_attempts(enrollment_id);
CREATE INDEX idx_quiz_attempts_lesson ON quiz_attempts(lesson_id);
CREATE INDEX idx_quiz_answers_attempt ON quiz_answers(attempt_id);
CREATE INDEX idx_quiz_answers_question ON quiz_answers(question_id);

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to get quiz questions with options for a lesson
CREATE OR REPLACE FUNCTION get_quiz_questions(lesson_uuid UUID)
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
  WHERE qq.lesson_id = lesson_uuid
  ORDER BY qq.order_index, qo.order_index;
END;
$$ LANGUAGE plpgsql;

-- Function to validate quiz answer and return correctness
CREATE OR REPLACE FUNCTION validate_quiz_answer(
  question_uuid UUID,
  option_uuid UUID
)
RETURNS BOOLEAN AS $$
DECLARE
  is_correct_answer BOOLEAN;
BEGIN
  SELECT is_correct INTO is_correct_answer
  FROM quiz_options
  WHERE id = option_uuid AND question_id = question_uuid;

  RETURN COALESCE(is_correct_answer, false);
END;
$$ LANGUAGE plpgsql;

-- Function to calculate quiz attempt statistics
CREATE OR REPLACE FUNCTION calculate_quiz_stats(attempt_uuid UUID)
RETURNS TABLE (
  score INTEGER,
  total_questions INTEGER,
  points_earned INTEGER,
  percentage DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    qa.score,
    qa.total_questions,
    qa.points_earned,
    CASE
      WHEN qa.total_questions > 0
      THEN ROUND((qa.score::DECIMAL / qa.total_questions) * 100, 2)
      ELSE 0
    END as percentage
  FROM quiz_attempts qa
  WHERE qa.id = attempt_uuid;
END;
$$ LANGUAGE plpgsql;

-- Function to get user's best quiz attempt for a lesson
CREATE OR REPLACE FUNCTION get_best_quiz_attempt(
  enroll_id UUID,
  lesson_uuid UUID
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
    AND qa.lesson_id = lesson_uuid
  ORDER BY qa.score DESC, qa.points_earned DESC, qa.completed_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Auto-update updated_at timestamp for quiz_questions
CREATE TRIGGER update_quiz_questions_updated_at
  BEFORE UPDATE ON quiz_questions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- COMMENTS
-- =====================================================
COMMENT ON TABLE quiz_questions IS 'Questions for quiz-type lessons with explanations';
COMMENT ON TABLE quiz_options IS 'Multiple choice options for quiz questions';
COMMENT ON TABLE quiz_attempts IS 'User attempts at completing quizzes';
COMMENT ON TABLE quiz_answers IS 'Individual answers within a quiz attempt';

COMMENT ON FUNCTION get_quiz_questions IS 'Retrieves all questions and options for a quiz lesson';
COMMENT ON FUNCTION validate_quiz_answer IS 'Checks if a selected option is correct for a question';
COMMENT ON FUNCTION calculate_quiz_stats IS 'Calculates statistics for a quiz attempt';
COMMENT ON FUNCTION get_best_quiz_attempt IS 'Gets the user''s best attempt at a specific quiz';
