-- ================================================
-- Mock Test Category Migration
-- ================================================
-- Adds category column to support subject-based grouping of tests

-- Add category column to mock_tests table
ALTER TABLE mock_tests
ADD COLUMN category TEXT CHECK (category IN ('math', 'physics', 'chemistry', 'english'));

-- Create index for faster category queries
CREATE INDEX idx_mock_tests_category ON mock_tests(category) WHERE is_published = true;

-- Add comment for documentation
COMMENT ON COLUMN mock_tests.category IS 'Subject category: math, physics, chemistry, english';
