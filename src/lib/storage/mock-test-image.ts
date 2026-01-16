import { createClient } from "@/lib/supabase/client";

/**
 * Get public URL for a mock test image
 * @param imagePath - Storage path (e.g., "problem-123.png" or "questions/q-456.jpg")
 * @returns Public URL of the image
 */
export function getMockTestImageUrl(imagePath: string): string {
  const supabase = createClient();

  const { data } = supabase.storage
    .from("mock-test-images")
    .getPublicUrl(imagePath);

  return data.publicUrl;
}

/**
 * Upload a mock test image to Supabase Storage
 * @param file - Image file to upload
 * @param path - Storage path (e.g., "problems/problem-123.png")
 * @returns Public URL of the uploaded image or null on error
 */
export async function uploadMockTestImage(
  file: File,
  path: string
): Promise<string | null> {
  const supabase = createClient();

  const { error } = await supabase.storage
    .from("mock-test-images")
    .upload(path, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (error) {
    console.error("Error uploading mock test image:", error);
    return null;
  }

  return getMockTestImageUrl(path);
}

/**
 * Delete a mock test image from storage
 * @param path - Storage path
 * @returns Success status
 */
export async function deleteMockTestImage(path: string): Promise<boolean> {
  const supabase = createClient();

  const { error } = await supabase.storage
    .from("mock-test-images")
    .remove([path]);

  if (error) {
    console.error("Error deleting mock test image:", error);
    return false;
  }

  return true;
}
