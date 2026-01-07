-- =====================================================
-- CREATE LESSON CONTENT TABLE
-- =====================================================
-- Separates video/text content from lesson metadata
-- Each lesson can have multiple content items (theory, examples)
-- Run after 019_add_unit_to_quizzes.sql

-- =====================================================
-- CREATE CONTENT_TYPE ENUM
-- =====================================================
CREATE TYPE content_type AS ENUM ('theory', 'example', 'text', 'attachment');

-- =====================================================
-- LESSON CONTENT TABLE
-- =====================================================
-- Each lesson can have multiple content items:
-- - Theory video (order_index: 1)
-- - Easy example video (order_index: 2)
-- - Hard example video (order_index: 3)

CREATE TABLE lesson_content (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,                -- Content title (e.g., "Теори", "Хялбар жишээ")
  content_type content_type NOT NULL, -- theory, example, text, attachment
  video_url TEXT,                     -- For video content
  content TEXT,                       -- For text/markdown content
  duration_seconds INTEGER,           -- Video duration
  order_index INTEGER DEFAULT 1,      -- Order within lesson (1=theory, 2=easy, 3=hard)
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  UNIQUE(lesson_id, order_index),
  CONSTRAINT duration_positive CHECK (duration_seconds IS NULL OR duration_seconds > 0)
);

-- =====================================================
-- INDEXES
-- =====================================================
CREATE INDEX idx_lesson_content_lesson ON lesson_content(lesson_id);
CREATE INDEX idx_lesson_content_type ON lesson_content(content_type);
CREATE INDEX idx_lesson_content_order ON lesson_content(lesson_id, order_index);

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Auto-update timestamp
CREATE TRIGGER update_lesson_content_updated_at
  BEFORE UPDATE ON lesson_content FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Get all content items for a lesson ordered by order_index
CREATE OR REPLACE FUNCTION get_lesson_content(lesson_uuid UUID)
RETURNS TABLE (
  content_id UUID,
  title TEXT,
  content_type content_type,
  video_url TEXT,
  content TEXT,
  duration_seconds INTEGER,
  order_index INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    lc.id as content_id,
    lc.title,
    lc.content_type,
    lc.video_url,
    lc.content,
    lc.duration_seconds,
    lc.order_index
  FROM lesson_content lc
  WHERE lc.lesson_id = lesson_uuid
  ORDER BY lc.order_index;
END;
$$ LANGUAGE plpgsql;

-- Get total duration of all content in a lesson
CREATE OR REPLACE FUNCTION get_lesson_total_duration(lesson_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
  total INTEGER;
BEGIN
  SELECT COALESCE(SUM(duration_seconds), 0) INTO total
  FROM lesson_content
  WHERE lesson_id = lesson_uuid;
  RETURN total;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- COMMENTS
-- =====================================================
COMMENT ON TABLE lesson_content IS 'Content items (theory, examples) for lessons. One lesson has multiple content items.';
COMMENT ON COLUMN lesson_content.content_type IS 'Type: theory, easy_example, hard_example, text, attachment';
COMMENT ON COLUMN lesson_content.order_index IS 'Order within lesson: 1=theory, 2=easy_example, 3=hard_example';
COMMENT ON FUNCTION get_lesson_content IS 'Returns all content items for a lesson ordered by order_index';
COMMENT ON FUNCTION get_lesson_total_duration IS 'Returns total duration in seconds of all video content in a lesson';
