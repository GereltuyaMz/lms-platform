-- Migration: Add image support to mock test system
-- Description: Adds optional image_url fields to problems, questions, and options
-- Author: Mock Test Image Feature (Branch 77)
-- Date: 2026-01-16

-- Add image_url to mock_test_problems (for shared context images)
ALTER TABLE mock_test_problems
ADD COLUMN image_url TEXT NULL;

COMMENT ON COLUMN mock_test_problems.image_url IS 'Supabase Storage path for problem context image (e.g., storage/mock-tests/problem-123.png)';

-- Add image_url to mock_test_questions (for question-specific images)
ALTER TABLE mock_test_questions
ADD COLUMN image_url TEXT NULL;

COMMENT ON COLUMN mock_test_questions.image_url IS 'Supabase Storage path for question image (e.g., diagrams, charts, illustrations)';

-- Add image_url to mock_test_options (for image-based answer choices)
ALTER TABLE mock_test_options
ADD COLUMN image_url TEXT NULL;

COMMENT ON COLUMN mock_test_options.image_url IS 'Supabase Storage path for option image (e.g., when options are diagrams instead of text)';

-- Create index for faster queries when filtering by image presence
CREATE INDEX idx_mock_test_questions_with_images ON mock_test_questions(id) WHERE image_url IS NOT NULL;
CREATE INDEX idx_mock_test_options_with_images ON mock_test_options(id) WHERE image_url IS NOT NULL;

-- Note: These are nullable fields to maintain backward compatibility with existing text-only questions
-- Migration: Create Supabase Storage bucket for mock test images
-- Description: Sets up storage bucket with RLS policies for mock test question/option images
-- Author: Mock Test Image Feature (Branch 77)
-- Date: 2026-01-16

-- Create storage bucket for mock test images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'mock-test-images',
  'mock-test-images',
  true, -- Public bucket for easy CDN access
  5242880, -- 5MB file size limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
)
ON CONFLICT (id) DO NOTHING;

-- RLS Policy: Allow public read access (anyone can view mock test images)
CREATE POLICY "Public read access for mock test images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'mock-test-images');

-- RLS Policy: Allow authenticated users to upload images
-- (This would typically be admin users; adjust based on your auth requirements)
CREATE POLICY "Authenticated users can upload mock test images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'mock-test-images');

-- RLS Policy: Allow authenticated users to update their uploaded images
CREATE POLICY "Authenticated users can update mock test images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'mock-test-images');

-- RLS Policy: Allow authenticated users to delete images
CREATE POLICY "Authenticated users can delete mock test images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'mock-test-images');

-- Note: Adjust policies based on your admin/role system
-- You may want to restrict upload/update/delete to specific roles (e.g., teachers, admins)
