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
