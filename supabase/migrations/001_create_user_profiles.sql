-- Create user_profiles table for LMS platform
CREATE TABLE user_profiles (
  -- Primary identification
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Basic Information
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,

  -- User Role & Status
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'instructor', 'admin')),
  is_active BOOLEAN DEFAULT true,

  -- LMS Specific Fields
  date_of_birth DATE,
  phone_number TEXT,

  -- Learning Preferences
  learning_goals TEXT[],

  -- Platform Engagement
  total_points INTEGER DEFAULT 0,
  enrollment_count INTEGER DEFAULT 0,
  completed_courses INTEGER DEFAULT 0,
  total_learning_hours DECIMAL(10,2) DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for faster queries
CREATE INDEX idx_user_profiles_email ON user_profiles(email);
CREATE INDEX idx_user_profiles_role ON user_profiles(role);
CREATE INDEX idx_user_profiles_is_active ON user_profiles(is_active);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policy 1: Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON user_profiles
  FOR SELECT
  USING (auth.uid() = id);

-- RLS Policy 2: Users can update their own profile
-- BUT cannot change role or is_active (admin-only fields)
CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND role = (SELECT role FROM user_profiles WHERE id = auth.uid())
    AND is_active = (SELECT is_active FROM user_profiles WHERE id = auth.uid())
  );

-- -- RLS Policy 3: Admins can view all profiles
-- CREATE POLICY "Admins can view all profiles"
--   ON user_profiles
--   FOR SELECT
--   USING (
--     EXISTS (
--       SELECT 1 FROM user_profiles
--       WHERE id = auth.uid() AND role = 'admin'
--     )
--   );

-- -- RLS Policy 4: Admins can update any profile
-- CREATE POLICY "Admins can update all profiles"
--   ON user_profiles
--   FOR UPDATE
--   USING (
--     EXISTS (
--       SELECT 1 FROM user_profiles
--       WHERE id = auth.uid() AND role = 'admin'
--     )
--   );

-- -- RLS Policy 5: Public can view active instructor profiles (for course browsing)
-- CREATE POLICY "Anyone can view active instructor profiles"
--   ON user_profiles
--   FOR SELECT
--   USING (role = 'instructor' AND is_active = true);

-- RLS Policy 6: Allow profile creation during signup (authenticated users only)
CREATE POLICY "Authenticated users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at on profile changes
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to auto-update last_login_at when user logs in
CREATE OR REPLACE FUNCTION update_last_login()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE user_profiles
  SET last_login_at = NOW()
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update last_login_at on auth events
-- Note: This trigger is on auth.users table, requires admin privileges
-- You may need to run this separately in Supabase SQL Editor
-- CREATE TRIGGER on_auth_user_login
--   AFTER UPDATE OF last_sign_in_at ON auth.users
--   FOR EACH ROW
--   WHEN (OLD.last_sign_in_at IS DISTINCT FROM NEW.last_sign_in_at)
--   EXECUTE FUNCTION update_last_login();
