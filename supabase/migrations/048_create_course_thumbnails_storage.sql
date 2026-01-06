-- Migration: Create Course Thumbnails Storage Bucket
-- Description: Set up storage bucket for course thumbnail images

-- Create the course-thumbnails bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'course-thumbnails',
  'course-thumbnails',
  true, -- Public bucket so thumbnail URLs work without auth
  5242880, -- 5MB file size limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload course thumbnails
-- In production, you may want to restrict this to admin users only
CREATE POLICY "Authenticated users can upload course thumbnails"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'course-thumbnails');

-- Allow authenticated users to update course thumbnails
CREATE POLICY "Authenticated users can update course thumbnails"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'course-thumbnails')
WITH CHECK (bucket_id = 'course-thumbnails');

-- Allow authenticated users to delete course thumbnails
CREATE POLICY "Authenticated users can delete course thumbnails"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'course-thumbnails');

-- Allow anyone to view course thumbnails (public read)
CREATE POLICY "Anyone can view course thumbnails"
ON storage.objects
FOR SELECT
USING (bucket_id = 'course-thumbnails');
