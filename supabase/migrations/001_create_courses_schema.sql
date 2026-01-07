-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
-- CREATE TYPE user_role AS ENUM ('student', 'instructor', 'admin');
CREATE TYPE course_level AS ENUM ('Beginner', 'Intermediate', 'Advanced');
-- lesson_type ENUM removed - lesson types now determined by lesson_content table

-- =====================================================
-- USER_PROFILES TABLE
-- =====================================================
-- Extends Supabase auth.users with additional profile information
-- CREATE TABLE user_profiles (
--   id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
--   email TEXT UNIQUE NOT NULL,
--   full_name TEXT,
--   avatar_url TEXT,
--   role user_role DEFAULT 'student' NOT NULL,
--   bio TEXT,
--   website TEXT,
--   created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
--   updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
-- );

-- =====================================================
-- CATEGORIES TABLE
-- =====================================================
CREATE TABLE categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- =====================================================
-- COURSES TABLE
-- =====================================================
CREATE TABLE courses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  -- instructor_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  thumbnail_url TEXT,
  level course_level DEFAULT 'Beginner' NOT NULL,
  price DECIMAL(10, 2) DEFAULT 0 NOT NULL,
  original_price DECIMAL(10, 2),
  duration_hours DECIMAL(4, 1), 
  is_published BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  CONSTRAINT price_positive CHECK (price >= 0),
  CONSTRAINT original_price_greater CHECK (original_price IS NULL OR original_price >= price)
);

-- =====================================================
-- COURSE_CATEGORIES TABLE (Many-to-Many)
-- =====================================================
CREATE TABLE course_categories (
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  PRIMARY KEY (course_id, category_id)
);

-- =====================================================
-- LESSONS TABLE
-- =====================================================
-- Lessons are now part of units and have content in lesson_content table
CREATE TABLE lessons (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  unit_id UUID, -- Will reference units table (added in migration 018)
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  order_in_unit INTEGER, -- Order within unit (added in migration 018)
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  UNIQUE(course_id, slug)
);

-- =====================================================
-- ENROLLMENTS TABLE
-- =====================================================
CREATE TABLE enrollments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  enrolled_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  completed_at TIMESTAMPTZ,
  progress_percentage INTEGER DEFAULT 0 NOT NULL,

  UNIQUE(user_id, course_id),
  CONSTRAINT progress_range CHECK (progress_percentage >= 0 AND progress_percentage <= 100)
);

-- =====================================================
-- LESSON_PROGRESS TABLE
-- =====================================================
CREATE TABLE lesson_progress (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  enrollment_id UUID REFERENCES enrollments(id) ON DELETE CASCADE NOT NULL,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE NOT NULL,
  is_completed BOOLEAN DEFAULT false NOT NULL,
  completed_at TIMESTAMPTZ,
  last_position_seconds INTEGER DEFAULT 0, -- For video progress tracking
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  UNIQUE(enrollment_id, lesson_id)
);

-- =====================================================
-- REVIEWS TABLE
-- =====================================================
-- CREATE TABLE reviews (
--   id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
--   course_id UUID REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
--   user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
--   rating INTEGER NOT NULL,
--   comment TEXT,
--   created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
--   updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

--   UNIQUE(course_id, user_id),
--   CONSTRAINT rating_range CHECK (rating >= 1 AND rating <= 5)
-- );

-- =====================================================
-- INDEXES
-- =====================================================
-- CREATE INDEX idx_courses_instructor ON courses(instructor_id);
CREATE INDEX idx_courses_published ON courses(is_published);
CREATE INDEX idx_courses_level ON courses(level);
CREATE INDEX idx_lessons_course ON lessons(course_id);
CREATE INDEX idx_lessons_order ON lessons(course_id, order_index);
CREATE INDEX idx_enrollments_user ON enrollments(user_id);
CREATE INDEX idx_enrollments_course ON enrollments(course_id);
CREATE INDEX idx_lesson_progress_enrollment ON lesson_progress(enrollment_id);
-- CREATE INDEX idx_reviews_course ON reviews(course_id);
-- CREATE INDEX idx_reviews_user ON reviews(user_id);

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate course stats (lesson count, total duration)
CREATE OR REPLACE FUNCTION calculate_course_stats(course_uuid UUID)
RETURNS TABLE (
  lesson_count BIGINT,
  total_duration_seconds INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(DISTINCT l.id) as lesson_count,
    COALESCE(SUM(lc.duration_seconds), 0)::INTEGER as total_duration_seconds
  FROM lessons l
  LEFT JOIN lesson_content lc ON l.id = lc.lesson_id
  WHERE l.course_id = course_uuid;
END;
$$ LANGUAGE plpgsql;

-- Function to update enrollment progress percentage
CREATE OR REPLACE FUNCTION update_enrollment_progress()
RETURNS TRIGGER AS $$
DECLARE
  total_lessons INTEGER;
  completed_lessons INTEGER;
  new_progress INTEGER;
  enroll_id UUID;
BEGIN
  -- Get enrollment_id
  enroll_id := NEW.enrollment_id;

  -- Count total lessons in the course
  SELECT COUNT(*) INTO total_lessons
  FROM lessons l
  INNER JOIN enrollments e ON l.course_id = e.course_id
  WHERE e.id = enroll_id;

  -- Count completed lessons
  SELECT COUNT(*) INTO completed_lessons
  FROM lesson_progress
  WHERE enrollment_id = enroll_id AND is_completed = true;

  -- Calculate progress percentage
  IF total_lessons > 0 THEN
    new_progress := ROUND((completed_lessons::DECIMAL / total_lessons) * 100);
  ELSE
    new_progress := 0;
  END IF;

  -- Update enrollment
  UPDATE enrollments
  SET
    progress_percentage = new_progress,
    completed_at = CASE WHEN new_progress = 100 THEN NOW() ELSE NULL END
  WHERE id = enroll_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to transliterate Mongolian Cyrillic to Latin
-- Based on official Mongolian transliteration standard
CREATE OR REPLACE FUNCTION transliterate_mongolian(text_input TEXT)
RETURNS TEXT AS $$
DECLARE
  result TEXT;
BEGIN
  result := text_input;

  -- Lowercase Mongolian Cyrillic to Latin
  -- Core alphabet
  result := replace(result, 'а', 'a');
  result := replace(result, 'б', 'b');
  result := replace(result, 'в', 'v');
  result := replace(result, 'г', 'g');
  result := replace(result, 'д', 'd');
  result := replace(result, 'е', 'e');
  result := replace(result, 'ё', 'yo');
  result := replace(result, 'ж', 'j');
  result := replace(result, 'з', 'z');
  result := replace(result, 'и', 'i');
  result := replace(result, 'й', 'i');
  result := replace(result, 'к', 'k');
  result := replace(result, 'л', 'l');
  result := replace(result, 'м', 'm');
  result := replace(result, 'н', 'n');
  result := replace(result, 'о', 'o');
  result := replace(result, 'ө', 'o');
  result := replace(result, 'п', 'p');
  result := replace(result, 'р', 'r');
  result := replace(result, 'с', 's');
  result := replace(result, 'т', 't');
  result := replace(result, 'у', 'u');
  result := replace(result, 'ү', 'u');
  result := replace(result, 'ф', 'f');
  result := replace(result, 'х', 'kh');
  result := replace(result, 'ц', 'ts');
  result := replace(result, 'ч', 'ch');
  result := replace(result, 'ш', 'sh');
  result := replace(result, 'щ', 'shch');
  result := replace(result, 'ъ', '');
  result := replace(result, 'ы', 'y');
  result := replace(result, 'ь', '');
  result := replace(result, 'э', 'e');
  result := replace(result, 'ю', 'yu');
  result := replace(result, 'я', 'ya');

  -- Uppercase Mongolian Cyrillic to Latin
  result := replace(result, 'А', 'A');
  result := replace(result, 'Б', 'B');
  result := replace(result, 'В', 'V');
  result := replace(result, 'Г', 'G');
  result := replace(result, 'Д', 'D');
  result := replace(result, 'Е', 'E');
  result := replace(result, 'Ё', 'Yo');
  result := replace(result, 'Ж', 'J');
  result := replace(result, 'З', 'Z');
  result := replace(result, 'И', 'I');
  result := replace(result, 'Й', 'I');
  result := replace(result, 'К', 'K');
  result := replace(result, 'Л', 'L');
  result := replace(result, 'М', 'M');
  result := replace(result, 'Н', 'N');
  result := replace(result, 'О', 'O');
  result := replace(result, 'Ө', 'O');
  result := replace(result, 'П', 'P');
  result := replace(result, 'Р', 'R');
  result := replace(result, 'С', 'S');
  result := replace(result, 'Т', 'T');
  result := replace(result, 'У', 'U');
  result := replace(result, 'Ү', 'U');
  result := replace(result, 'Ф', 'F');
  result := replace(result, 'Х', 'Kh');
  result := replace(result, 'Ц', 'Ts');
  result := replace(result, 'Ч', 'Ch');
  result := replace(result, 'Ш', 'Sh');
  result := replace(result, 'Щ', 'Shch');
  result := replace(result, 'Ъ', '');
  result := replace(result, 'Ы', 'Y');
  result := replace(result, 'Ь', '');
  result := replace(result, 'Э', 'E');
  result := replace(result, 'Ю', 'Yu');
  result := replace(result, 'Я', 'Ya');

  RETURN result;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to auto-generate slug from name with Mongolian support
CREATE OR REPLACE FUNCTION generate_slug_from_name()
RETURNS TRIGGER AS $$
DECLARE
  source_text TEXT;
BEGIN
  -- Only generate slug if it's not provided or empty
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    -- Determine source text based on which column exists
    -- Categories use 'name', Courses/Lessons use 'title'
    IF TG_TABLE_NAME = 'categories' THEN
      source_text := NEW.name;
    ELSE
      source_text := NEW.title;
    END IF;

    NEW.slug := lower(
      regexp_replace(
        regexp_replace(
          transliterate_mongolian(trim(source_text)),
          '[^a-zA-Z0-9\s-]', '',    -- Remove special characters except spaces and hyphens
          'g'
        ),
        '\s+', '-', 'g'              -- Replace one or more spaces with single hyphen
      )
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Auto-update updated_at timestamp
-- Note: user_profiles trigger is in 001_create_user_profiles.sql
-- CREATE TRIGGER update_user_profiles_updated_at
--   BEFORE UPDATE ON user_profiles
--   FOR EACH ROW
--   EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON courses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lessons_updated_at
  BEFORE UPDATE ON lessons
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lesson_progress_updated_at
  BEFORE UPDATE ON lesson_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- CREATE TRIGGER update_reviews_updated_at
--   BEFORE UPDATE ON reviews
--   FOR EACH ROW
--   EXECUTE FUNCTION update_updated_at_column();

-- Auto-update enrollment progress when lesson is completed
CREATE TRIGGER trigger_update_enrollment_progress
  AFTER INSERT OR UPDATE OF is_completed ON lesson_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_enrollment_progress();

-- Auto-generate slug for categories
CREATE TRIGGER generate_category_slug
  BEFORE INSERT OR UPDATE OF name ON categories
  FOR EACH ROW
  EXECUTE FUNCTION generate_slug_from_name();

-- Auto-generate slug for courses
CREATE TRIGGER generate_course_slug
  BEFORE INSERT OR UPDATE OF title ON courses
  FOR EACH ROW
  EXECUTE FUNCTION generate_slug_from_name();

-- Auto-generate slug for lessons
CREATE TRIGGER generate_lesson_slug
  BEFORE INSERT OR UPDATE OF title ON lessons
  FOR EACH ROW
  EXECUTE FUNCTION generate_slug_from_name();

-- =====================================================
-- SEED DATA (Optional - Basic Categories)
-- =====================================================
-- Note: Slugs are auto-generated from names, no need to specify them
INSERT INTO categories (name, description) VALUES
  ('Mathematics', 'Courses related to mathematics'),
  ('Algebra', 'Algebraic concepts and applications'),
  ('Calculus', 'Differential and integral calculus'),
  ('Statistics', 'Statistical analysis and probability'),
  ('Logic', 'Logical reasoning and problem solving'),
  ('Математик', 'Math courses')
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- COMMENTS
-- =====================================================
COMMENT ON TABLE user_profiles IS 'User profiles extending Supabase auth.users';
COMMENT ON TABLE categories IS 'Course categories/topics for filtering';
COMMENT ON TABLE courses IS 'Main courses table with pricing and metadata';
COMMENT ON TABLE course_categories IS 'Many-to-many relationship between courses and categories';
COMMENT ON TABLE lessons IS 'Individual lessons/chapters within courses';
COMMENT ON TABLE enrollments IS 'Student enrollments in courses';
COMMENT ON TABLE lesson_progress IS 'Tracks student progress through individual lessons';
-- COMMENT ON TABLE reviews IS 'Course reviews and ratings from students';
