import { createClient } from '@/lib/supabase/client';

/**
 * Upload a video file to Supabase Storage
 * @param file - Video file to upload
 * @param courseSlug - Course slug for organization
 * @param lessonSlug - Lesson slug for naming
 * @returns Public URL of the uploaded video
 */
export async function uploadVideo(
  file: File,
  courseSlug: string,
  lessonSlug: string
): Promise<string | null> {
  const supabase = createClient();

  // Generate file path
  const filePath = `${courseSlug}/${lessonSlug}.mp4`;

  // Upload file
  const { error } = await supabase.storage
    .from('course-videos')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true, // Replace if exists
    });

  if (error) {
    console.error('Error uploading video:', error);
    return null;
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('course-videos')
    .getPublicUrl(filePath);

  return publicUrl;
}

/**
 * Get public URL for a video
 * @param courseSlug - Course slug
 * @param lessonSlug - Lesson slug
 * @returns Public URL of the video
 */
export function getVideoUrl(courseSlug: string, lessonSlug: string): string {
  const supabase = createClient();

  const filePath = `${courseSlug}/${lessonSlug}.mp4`;

  const { data: { publicUrl } } = supabase.storage
    .from('course-videos')
    .getPublicUrl(filePath);

  return publicUrl;
}

/**
 * Delete a video from storage
 * @param courseSlug - Course slug
 * @param lessonSlug - Lesson slug
 */
export async function deleteVideo(
  courseSlug: string,
  lessonSlug: string
): Promise<boolean> {
  const supabase = createClient();

  const filePath = `${courseSlug}/${lessonSlug}.mp4`;

  const { error } = await supabase.storage
    .from('course-videos')
    .remove([filePath]);

  if (error) {
    console.error('Error deleting video:', error);
    return false;
  }

  return true;
}
