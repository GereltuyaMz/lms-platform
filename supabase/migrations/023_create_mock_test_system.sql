-- ================================================
-- EYSH Mock Test System
-- ================================================
-- This migration creates the complete schema for EYSH mock tests
-- including sections, problems, questions, and user attempts.

-- Mock test definitions
CREATE TABLE IF NOT EXISTS mock_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  time_limit_minutes INTEGER NOT NULL DEFAULT 180,
  total_questions INTEGER NOT NULL,
  passing_score_percentage INTEGER DEFAULT 60,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sections within mock tests (Math, Physics, Chemistry, English)
CREATE TABLE IF NOT EXISTS mock_test_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mock_test_id UUID NOT NULL REFERENCES mock_tests(id) ON DELETE CASCADE,
  subject TEXT NOT NULL CHECK (subject IN ('math', 'physics', 'chemistry', 'english')),
  title TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(mock_test_id, order_index),
  UNIQUE(mock_test_id, subject)
);

-- Problem groups (big problems with sub-questions)
CREATE TABLE IF NOT EXISTS mock_test_problems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id UUID NOT NULL REFERENCES mock_test_sections(id) ON DELETE CASCADE,
  problem_number INTEGER NOT NULL,
  title TEXT,
  context TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(section_id, order_index)
);

-- Individual questions (sub-questions within problems)
CREATE TABLE IF NOT EXISTS mock_test_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  problem_id UUID NOT NULL REFERENCES mock_test_problems(id) ON DELETE CASCADE,
  question_number TEXT NOT NULL,
  question_text TEXT NOT NULL,
  explanation TEXT NOT NULL,
  points INTEGER DEFAULT 10 CHECK (points > 0),
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(problem_id, order_index)
);

-- Multiple choice options
CREATE TABLE IF NOT EXISTS mock_test_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES mock_test_questions(id) ON DELETE CASCADE,
  option_text TEXT NOT NULL,
  is_correct BOOLEAN DEFAULT false,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(question_id, order_index)
);

-- User attempts (tracks time and progress)
CREATE TABLE IF NOT EXISTS mock_test_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  mock_test_id UUID NOT NULL REFERENCES mock_tests(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  time_remaining_seconds INTEGER,
  is_completed BOOLEAN DEFAULT false,
  total_score INTEGER DEFAULT 0,
  total_questions INTEGER,
  percentage DECIMAL(5,2),
  xp_awarded INTEGER DEFAULT 0,
  subject_scores JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CHECK (total_score >= 0),
  CHECK (percentage >= 0 AND percentage <= 100)
);

-- User answers
CREATE TABLE IF NOT EXISTS mock_test_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID NOT NULL REFERENCES mock_test_attempts(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES mock_test_questions(id) ON DELETE CASCADE,
  selected_option_id UUID REFERENCES mock_test_options(id) ON DELETE SET NULL,
  is_correct BOOLEAN,
  points_earned INTEGER DEFAULT 0,
  answered_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(attempt_id, question_id)
);

-- ================================================
-- INDEXES
-- ================================================

CREATE INDEX IF NOT EXISTS idx_mock_test_sections_test
  ON mock_test_sections(mock_test_id);

CREATE INDEX IF NOT EXISTS idx_mock_test_problems_section
  ON mock_test_problems(section_id);

CREATE INDEX IF NOT EXISTS idx_mock_test_questions_problem
  ON mock_test_questions(problem_id);

CREATE INDEX IF NOT EXISTS idx_mock_test_options_question
  ON mock_test_options(question_id);

CREATE INDEX IF NOT EXISTS idx_mock_test_attempts_user
  ON mock_test_attempts(user_id);

CREATE INDEX IF NOT EXISTS idx_mock_test_attempts_test
  ON mock_test_attempts(mock_test_id);

CREATE INDEX IF NOT EXISTS idx_mock_test_attempts_user_test
  ON mock_test_attempts(user_id, mock_test_id);

CREATE INDEX IF NOT EXISTS idx_mock_test_answers_attempt
  ON mock_test_answers(attempt_id);

-- ================================================
-- DATABASE FUNCTIONS
-- ================================================

-- Get complete mock test data with all sections, problems, questions, and options
CREATE OR REPLACE FUNCTION get_mock_test_data(test_id UUID)
RETURNS JSON AS $$
  SELECT json_build_object(
    'id', mt.id,
    'title', mt.title,
    'description', mt.description,
    'time_limit_minutes', mt.time_limit_minutes,
    'total_questions', mt.total_questions,
    'passing_score_percentage', mt.passing_score_percentage,
    'sections', (
      SELECT json_agg(
        json_build_object(
          'id', s.id,
          'subject', s.subject,
          'title', s.title,
          'order_index', s.order_index,
          'problems', (
            SELECT json_agg(
              json_build_object(
                'id', p.id,
                'problem_number', p.problem_number,
                'title', p.title,
                'context', p.context,
                'order_index', p.order_index,
                'questions', (
                  SELECT json_agg(
                    json_build_object(
                      'id', q.id,
                      'question_number', q.question_number,
                      'question_text', q.question_text,
                      'explanation', q.explanation,
                      'points', q.points,
                      'order_index', q.order_index,
                      'options', (
                        SELECT json_agg(
                          json_build_object(
                            'id', o.id,
                            'option_text', o.option_text,
                            'is_correct', o.is_correct,
                            'order_index', o.order_index
                          ) ORDER BY o.order_index
                        )
                        FROM mock_test_options o
                        WHERE o.question_id = q.id
                      )
                    ) ORDER BY q.order_index
                  )
                  FROM mock_test_questions q
                  WHERE q.problem_id = p.id
                )
              ) ORDER BY p.order_index
            )
            FROM mock_test_problems p
            WHERE p.section_id = s.id
          )
        ) ORDER BY s.order_index
      )
      FROM mock_test_sections s
      WHERE s.mock_test_id = mt.id
    )
  )
  FROM mock_tests mt
  WHERE mt.id = test_id AND mt.is_published = true;
$$ LANGUAGE sql STABLE;

-- Create or resume mock test attempt
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

  -- Return existing attempt if found
  IF v_existing_attempt IS NOT NULL THEN
    RETURN v_existing_attempt;
  END IF;

  -- Get test details
  SELECT total_questions, time_limit_minutes INTO v_total_questions, v_time_limit_minutes
  FROM mock_tests
  WHERE id = p_test_id;

  -- Create new attempt
  INSERT INTO mock_test_attempts (
    user_id,
    mock_test_id,
    total_questions,
    time_remaining_seconds
  )
  VALUES (
    p_user_id,
    p_test_id,
    v_total_questions,
    v_time_limit_minutes * 60
  )
  RETURNING id INTO v_attempt_id;

  RETURN v_attempt_id;
END;
$$ LANGUAGE plpgsql;

-- Save or update a single answer
CREATE OR REPLACE FUNCTION save_mock_test_answer(
  p_attempt_id UUID,
  p_question_id UUID,
  p_option_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
  v_is_correct BOOLEAN;
  v_points INTEGER;
BEGIN
  -- Get correct answer status and points
  SELECT o.is_correct, q.points INTO v_is_correct, v_points
  FROM mock_test_options o
  JOIN mock_test_questions q ON q.id = o.question_id
  WHERE o.id = p_option_id AND q.id = p_question_id;

  -- Insert or update answer
  INSERT INTO mock_test_answers (
    attempt_id,
    question_id,
    selected_option_id,
    is_correct,
    points_earned
  )
  VALUES (
    p_attempt_id,
    p_question_id,
    p_option_id,
    v_is_correct,
    CASE WHEN v_is_correct THEN v_points ELSE 0 END
  )
  ON CONFLICT (attempt_id, question_id)
  DO UPDATE SET
    selected_option_id = p_option_id,
    is_correct = v_is_correct,
    points_earned = CASE WHEN v_is_correct THEN v_points ELSE 0 END,
    answered_at = NOW();

  -- Update attempt timestamp
  UPDATE mock_test_attempts
  SET updated_at = NOW()
  WHERE id = p_attempt_id;

  RETURN v_is_correct;
END;
$$ LANGUAGE plpgsql;

-- Submit mock test attempt and calculate scores
CREATE OR REPLACE FUNCTION submit_mock_test_attempt(p_attempt_id UUID)
RETURNS JSON AS $$
DECLARE
  v_total_score INTEGER;
  v_total_questions INTEGER;
  v_percentage DECIMAL(5,2);
  v_subject_scores JSONB;
  v_test_id UUID;
BEGIN
  -- Calculate total score
  SELECT
    COALESCE(SUM(points_earned), 0),
    COUNT(*),
    attempt.total_questions,
    attempt.mock_test_id
  INTO
    v_total_score,
    v_total_questions,
    v_total_questions,
    v_test_id
  FROM mock_test_answers ans
  JOIN mock_test_attempts attempt ON attempt.id = ans.attempt_id
  WHERE ans.attempt_id = p_attempt_id
  GROUP BY attempt.total_questions, attempt.mock_test_id;

  -- Calculate percentage
  v_percentage := CASE
    WHEN v_total_questions > 0 THEN (v_total_score::DECIMAL / v_total_questions) * 100
    ELSE 0
  END;

  -- Calculate subject-wise scores
  SELECT json_object_agg(
    subject,
    json_build_object(
      'score', correct_count,
      'total', total_count,
      'percentage', ROUND((correct_count::DECIMAL / total_count) * 100, 2)
    )
  )::JSONB INTO v_subject_scores
  FROM (
    SELECT
      s.subject,
      COUNT(*) FILTER (WHERE ans.is_correct = true) as correct_count,
      COUNT(*) as total_count
    FROM mock_test_answers ans
    JOIN mock_test_questions q ON q.id = ans.question_id
    JOIN mock_test_problems p ON p.id = q.problem_id
    JOIN mock_test_sections s ON s.id = p.section_id
    WHERE ans.attempt_id = p_attempt_id
    GROUP BY s.subject
  ) subject_stats;

  -- Update attempt with final scores
  UPDATE mock_test_attempts
  SET
    total_score = v_total_score,
    percentage = v_percentage,
    subject_scores = v_subject_scores,
    is_completed = true,
    completed_at = NOW(),
    updated_at = NOW()
  WHERE id = p_attempt_id;

  -- Return results
  RETURN json_build_object(
    'total_score', v_total_score,
    'total_questions', v_total_questions,
    'percentage', v_percentage,
    'subject_scores', v_subject_scores
  );
END;
$$ LANGUAGE plpgsql;

-- Get best attempt for a user and test
CREATE OR REPLACE FUNCTION get_best_mock_test_attempt(
  p_user_id UUID,
  p_test_id UUID
)
RETURNS JSON AS $$
  SELECT json_build_object(
    'id', id,
    'total_score', total_score,
    'total_questions', total_questions,
    'percentage', percentage,
    'xp_awarded', xp_awarded,
    'completed_at', completed_at,
    'subject_scores', subject_scores
  )
  FROM mock_test_attempts
  WHERE user_id = p_user_id
    AND mock_test_id = p_test_id
    AND is_completed = true
  ORDER BY percentage DESC, total_score DESC, completed_at DESC
  LIMIT 1;
$$ LANGUAGE sql STABLE;

-- Get all published mock tests
CREATE OR REPLACE FUNCTION get_published_mock_tests()
RETURNS SETOF mock_tests AS $$
  SELECT *
  FROM mock_tests
  WHERE is_published = true
  ORDER BY created_at DESC;
$$ LANGUAGE sql STABLE;

-- Update timer state
CREATE OR REPLACE FUNCTION update_timer_state(
  p_attempt_id UUID,
  p_time_remaining_seconds INTEGER
)
RETURNS VOID AS $$
  UPDATE mock_test_attempts
  SET
    time_remaining_seconds = p_time_remaining_seconds,
    updated_at = NOW()
  WHERE id = p_attempt_id;
$$ LANGUAGE sql;

-- ================================================
-- TRIGGERS
-- ================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_mock_test_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_mock_tests_updated_at
  BEFORE UPDATE ON mock_tests
  FOR EACH ROW
  EXECUTE FUNCTION update_mock_test_updated_at();

CREATE TRIGGER trigger_update_mock_test_attempts_updated_at
  BEFORE UPDATE ON mock_test_attempts
  FOR EACH ROW
  EXECUTE FUNCTION update_mock_test_updated_at();

-- ================================================
-- ROW LEVEL SECURITY (RLS)
-- ================================================

ALTER TABLE mock_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE mock_test_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE mock_test_problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE mock_test_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE mock_test_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE mock_test_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE mock_test_answers ENABLE ROW LEVEL SECURITY;

-- Public can view published tests
CREATE POLICY "Published mock tests are viewable by everyone"
  ON mock_tests FOR SELECT
  USING (is_published = true);

CREATE POLICY "Published sections are viewable by everyone"
  ON mock_test_sections FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM mock_tests
      WHERE id = mock_test_sections.mock_test_id
      AND is_published = true
    )
  );

CREATE POLICY "Published problems are viewable by everyone"
  ON mock_test_problems FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM mock_test_sections s
      JOIN mock_tests t ON t.id = s.mock_test_id
      WHERE s.id = mock_test_problems.section_id
      AND t.is_published = true
    )
  );

CREATE POLICY "Published questions are viewable by everyone"
  ON mock_test_questions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM mock_test_problems p
      JOIN mock_test_sections s ON s.id = p.section_id
      JOIN mock_tests t ON t.id = s.mock_test_id
      WHERE p.id = mock_test_questions.problem_id
      AND t.is_published = true
    )
  );

CREATE POLICY "Published options are viewable by everyone"
  ON mock_test_options FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM mock_test_questions q
      JOIN mock_test_problems p ON p.id = q.problem_id
      JOIN mock_test_sections s ON s.id = p.section_id
      JOIN mock_tests t ON t.id = s.mock_test_id
      WHERE q.id = mock_test_options.question_id
      AND t.is_published = true
    )
  );

-- Users can view own attempts
CREATE POLICY "Users can view own attempts"
  ON mock_test_attempts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own attempts"
  ON mock_test_attempts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own attempts"
  ON mock_test_attempts FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can view own answers
CREATE POLICY "Users can view own answers"
  ON mock_test_answers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM mock_test_attempts
      WHERE id = mock_test_answers.attempt_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own answers"
  ON mock_test_answers FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM mock_test_attempts
      WHERE id = mock_test_answers.attempt_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own answers"
  ON mock_test_answers FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM mock_test_attempts
      WHERE id = mock_test_answers.attempt_id
      AND user_id = auth.uid()
    )
  );

-- ================================================
-- COMMENTS
-- ================================================

COMMENT ON TABLE mock_tests IS 'EYSH mock test definitions';
COMMENT ON TABLE mock_test_sections IS 'Test sections by subject (Math, Physics, Chemistry, English)';
COMMENT ON TABLE mock_test_problems IS 'Big problems with shared context for sub-questions';
COMMENT ON TABLE mock_test_questions IS 'Individual sub-questions within problems';
COMMENT ON TABLE mock_test_options IS 'Multiple choice options for questions';
COMMENT ON TABLE mock_test_attempts IS 'User test attempts with timer and scoring';
COMMENT ON TABLE mock_test_answers IS 'Individual answers within attempts';
