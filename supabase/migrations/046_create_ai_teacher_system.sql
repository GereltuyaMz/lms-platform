-- =====================================================
-- AI TEACHER CHATBOT SYSTEM
-- =====================================================
-- Stores chat conversations between students and AI teacher
-- per lesson for contextual help

-- =====================================================
-- CHAT SESSIONS TABLE
-- =====================================================
CREATE TABLE ai_chat_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE NOT NULL,
  lesson_step TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- One active session per user per lesson step
  UNIQUE(user_id, lesson_id, lesson_step),

  -- Validate lesson step values
  CONSTRAINT lesson_step_check CHECK (lesson_step IN ('theory', 'example', 'test'))
);

-- =====================================================
-- CHAT MESSAGES TABLE
-- =====================================================
CREATE TABLE ai_chat_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id UUID REFERENCES ai_chat_sessions(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  message_type TEXT,
  -- For generated problems, store the problem and validation data
  generated_problem JSONB,
  user_answer TEXT,
  is_correct BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  CONSTRAINT role_check CHECK (role IN ('user', 'assistant')),
  CONSTRAINT message_type_check CHECK (
    message_type IN ('solve', 'explain', 'generate_problem', 'general') OR message_type IS NULL
  )
);

-- =====================================================
-- INDEXES
-- =====================================================
CREATE INDEX idx_chat_sessions_user ON ai_chat_sessions(user_id);
CREATE INDEX idx_chat_sessions_lesson ON ai_chat_sessions(lesson_id);
CREATE INDEX idx_chat_messages_session ON ai_chat_messages(session_id);
CREATE INDEX idx_chat_messages_created ON ai_chat_messages(session_id, created_at);

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================
ALTER TABLE ai_chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_chat_messages ENABLE ROW LEVEL SECURITY;

-- Users can only access their own chat sessions
CREATE POLICY "Users can view own chat sessions"
  ON ai_chat_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own chat sessions"
  ON ai_chat_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own chat sessions"
  ON ai_chat_sessions FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can only access messages from their own sessions
CREATE POLICY "Users can view own chat messages"
  ON ai_chat_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM ai_chat_sessions
      WHERE ai_chat_sessions.id = ai_chat_messages.session_id
      AND ai_chat_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create chat messages in own sessions"
  ON ai_chat_messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM ai_chat_sessions
      WHERE ai_chat_sessions.id = session_id
      AND ai_chat_sessions.user_id = auth.uid()
    )
  );

-- =====================================================
-- TRIGGERS
-- =====================================================
CREATE TRIGGER update_chat_sessions_updated_at
  BEFORE UPDATE ON ai_chat_sessions FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Get or create chat session for user+lesson+step
CREATE OR REPLACE FUNCTION get_or_create_chat_session(
  p_user_id UUID,
  p_lesson_id UUID,
  p_lesson_step TEXT
)
RETURNS UUID AS $$
DECLARE
  v_session_id UUID;
BEGIN
  -- Try to get existing session
  SELECT id INTO v_session_id
  FROM ai_chat_sessions
  WHERE user_id = p_user_id
    AND lesson_id = p_lesson_id
    AND lesson_step = p_lesson_step;

  -- Create new session if doesn't exist
  IF v_session_id IS NULL THEN
    INSERT INTO ai_chat_sessions (user_id, lesson_id, lesson_step)
    VALUES (p_user_id, p_lesson_id, p_lesson_step)
    RETURNING id INTO v_session_id;
  END IF;

  RETURN v_session_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get chat history for a session
CREATE OR REPLACE FUNCTION get_chat_history(
  p_session_id UUID,
  p_limit INTEGER DEFAULT 50
)
RETURNS TABLE (
  message_id UUID,
  role TEXT,
  content TEXT,
  message_type TEXT,
  generated_problem JSONB,
  user_answer TEXT,
  is_correct BOOLEAN,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    id,
    ai_chat_messages.role,
    ai_chat_messages.content,
    ai_chat_messages.message_type,
    ai_chat_messages.generated_problem,
    ai_chat_messages.user_answer,
    ai_chat_messages.is_correct,
    ai_chat_messages.created_at
  FROM ai_chat_messages
  WHERE session_id = p_session_id
  ORDER BY created_at ASC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON TABLE ai_chat_sessions IS 'AI teacher chat sessions per user per lesson step';
COMMENT ON TABLE ai_chat_messages IS 'Chat messages with AI teacher including generated problems';
COMMENT ON FUNCTION get_or_create_chat_session IS 'Get existing or create new chat session for user+lesson+step';
COMMENT ON FUNCTION get_chat_history IS 'Retrieve chat history for a session with limit';
