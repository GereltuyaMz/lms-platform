-- =====================================================
-- CREATE LESSON_VIDEOS TABLE
-- =====================================================
-- Stores metadata for videos uploaded to Bunny Stream
-- Links to lesson_content via lesson_video_id FK (added in migration 053)

-- Video status enum for tracking upload and processing state
CREATE TYPE video_status AS ENUM (
  'created',      -- Record created, awaiting upload
  'uploading',    -- Upload in progress
  'processing',   -- Bunny is encoding the video
  'ready',        -- Video ready for playback
  'failed'        -- Upload or processing failed
);

CREATE TABLE lesson_videos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,

  -- Bunny Stream identifiers
  bunny_video_id TEXT NOT NULL UNIQUE,           -- GUID from Bunny
  bunny_library_id TEXT NOT NULL,                -- Library ID for reference

  -- Video metadata (populated after processing)
  title TEXT NOT NULL,
  duration_seconds INTEGER,                       -- From Bunny after encoding
  thumbnail_url TEXT,                             -- Bunny-generated thumbnail

  -- File metadata
  original_filename TEXT,
  file_size_bytes BIGINT,

  -- Status tracking
  status video_status DEFAULT 'created' NOT NULL,
  error_message TEXT,                             -- Populated on failure

  -- Ownership (for RLS and admin management)
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  processing_completed_at TIMESTAMPTZ            -- When Bunny finished encoding
);

-- =====================================================
-- INDEXES
-- =====================================================
CREATE INDEX idx_lesson_videos_status ON lesson_videos(status);
CREATE INDEX idx_lesson_videos_bunny_id ON lesson_videos(bunny_video_id);
CREATE INDEX idx_lesson_videos_uploaded_by ON lesson_videos(uploaded_by);

-- =====================================================
-- TRIGGERS
-- =====================================================
CREATE TRIGGER update_lesson_videos_updated_at
  BEFORE UPDATE ON lesson_videos FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================
ALTER TABLE lesson_videos ENABLE ROW LEVEL SECURITY;

-- Authenticated users can manage videos (admin check can be added later)
CREATE POLICY "Authenticated users can manage videos"
ON lesson_videos
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Public read for ready videos (for student playback)
CREATE POLICY "Anyone can view ready videos"
ON lesson_videos
FOR SELECT
TO anon
USING (status = 'ready');

-- =====================================================
-- COMMENTS
-- =====================================================
COMMENT ON TABLE lesson_videos IS 'Metadata for videos uploaded to Bunny Stream CDN';
COMMENT ON COLUMN lesson_videos.bunny_video_id IS 'GUID assigned by Bunny Stream API';
COMMENT ON COLUMN lesson_videos.status IS 'Tracks video lifecycle: created -> uploading -> processing -> ready';
COMMENT ON COLUMN lesson_videos.bunny_library_id IS 'Bunny Stream library ID for constructing playback URLs';


-- =====================================================
-- ADD LESSON_VIDEO_ID TO LESSON_CONTENT
-- =====================================================
-- Links lesson_content to uploaded Bunny Stream videos
-- When lesson_video_id is set, it takes precedence over video_url

ALTER TABLE lesson_content
ADD COLUMN lesson_video_id UUID REFERENCES lesson_videos(id) ON DELETE SET NULL;

-- Index for efficient lookups
CREATE INDEX idx_lesson_content_lesson_video ON lesson_content(lesson_video_id);

-- Comment
COMMENT ON COLUMN lesson_content.lesson_video_id IS 'Reference to uploaded Bunny Stream video. Takes precedence over video_url when set.';
