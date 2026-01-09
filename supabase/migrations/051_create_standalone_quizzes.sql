-- =====================================================
-- STANDALONE QUIZZES TABLE
-- =====================================================
-- Creates a standalone quizzes table for reusable quiz assets
-- Quizzes can be attached to lessons or units

-- =====================================================
-- CREATE QUIZZES TABLE
-- =====================================================
CREATE TABLE quizzes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- =====================================================
-- ADD QUIZ_ID TO QUIZ_QUESTIONS
-- =====================================================
ALTER TABLE quiz_questions
ADD COLUMN quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE;

-- =====================================================
-- UPDATE CONSTRAINT TO ALLOW QUIZ_ID AS PARENT
-- =====================================================
-- Drop existing constraint first
ALTER TABLE quiz_questions
DROP CONSTRAINT IF EXISTS quiz_question_parent_required;

-- Add new constraint allowing quiz_id as parent
ALTER TABLE quiz_questions
ADD CONSTRAINT quiz_question_parent_required
CHECK (quiz_id IS NOT NULL OR lesson_id IS NOT NULL OR unit_id IS NOT NULL);

-- =====================================================
-- ADD QUIZ_ID TO LESSONS AND UNITS FOR ATTACHMENT
-- =====================================================
ALTER TABLE lessons
ADD COLUMN quiz_id UUID REFERENCES quizzes(id) ON DELETE SET NULL;

ALTER TABLE units
ADD COLUMN quiz_id UUID REFERENCES quizzes(id) ON DELETE SET NULL;

-- =====================================================
-- INDEXES
-- =====================================================
CREATE INDEX idx_quiz_questions_quiz ON quiz_questions(quiz_id);
CREATE INDEX idx_lessons_quiz ON lessons(quiz_id);
CREATE INDEX idx_units_quiz ON units(quiz_id);

-- =====================================================
-- TRIGGER FOR UPDATED_AT
-- =====================================================
CREATE TRIGGER update_quizzes_updated_at
  BEFORE UPDATE ON quizzes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- COMMENTS
-- =====================================================
COMMENT ON TABLE quizzes IS 'Standalone reusable quiz definitions';
COMMENT ON COLUMN quizzes.title IS 'Quiz title';
COMMENT ON COLUMN quizzes.description IS 'Optional quiz description';
COMMENT ON COLUMN lessons.quiz_id IS 'Optional attached quiz for lesson knowledge check';
COMMENT ON COLUMN units.quiz_id IS 'Optional attached quiz for unit-level exam';
