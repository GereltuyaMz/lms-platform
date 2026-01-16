-- Migration: Add admin RLS policies for mock_tests CRUD operations
-- Description: Allow users with role='admin' to create, update, and delete mock tests
-- Created: 2026-01-16

-- Drop existing policies if they exist (for idempotency)
DROP POLICY IF EXISTS "Admins can insert mock tests" ON mock_tests;
DROP POLICY IF EXISTS "Admins can update mock tests" ON mock_tests;
DROP POLICY IF EXISTS "Admins can delete mock tests" ON mock_tests;
DROP POLICY IF EXISTS "Admins can manage mock test sections" ON mock_test_sections;
DROP POLICY IF EXISTS "Admins can manage mock test problems" ON mock_test_problems;
DROP POLICY IF EXISTS "Admins can manage mock test questions" ON mock_test_questions;
DROP POLICY IF EXISTS "Admins can manage mock test options" ON mock_test_options;

-- Mock Tests: Admin CRUD policies
CREATE POLICY "Admins can insert mock tests"
  ON mock_tests FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update mock tests"
  ON mock_tests FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete mock tests"
  ON mock_tests FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- Mock Test Sections: Admin CRUD policies
CREATE POLICY "Admins can manage mock test sections"
  ON mock_test_sections FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- Mock Test Problems: Admin CRUD policies
CREATE POLICY "Admins can manage mock test problems"
  ON mock_test_problems FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- Mock Test Questions: Admin CRUD policies
CREATE POLICY "Admins can manage mock test questions"
  ON mock_test_questions FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- Mock Test Options: Admin CRUD policies
CREATE POLICY "Admins can manage mock test options"
  ON mock_test_options FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- Note: The existing SELECT policies for published tests remain unchanged
-- This allows public viewing of published tests while restricting CRUD to admins
