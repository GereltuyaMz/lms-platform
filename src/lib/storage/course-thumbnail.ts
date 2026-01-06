import { createClient } from "@/lib/supabase/client";

type UploadThumbnailResult = {
  success: boolean;
  thumbnailUrl?: string;
  error?: string;
};

/**
 * Upload course thumbnail to Supabase Storage
 * @param file - The image file to upload
 * @param courseId - The course ID for folder organization
 * @returns Result with thumbnail URL or error
 */
export async function uploadCourseThumbnail(
  file: File,
  courseId: string
): Promise<UploadThumbnailResult> {
  try {
    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: "Зөвхөн JPG, PNG, GIF, WEBP форматын зураг оруулна уу",
      };
    }

    // Validate file size (5MB max for thumbnails)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return {
        success: false,
        error: "Зургийн хэмжээ 5MB-аас бага байх ёстой",
      };
    }

    const supabase = createClient();

    // Generate unique filename with timestamp
    const fileExt = file.name.split(".").pop();
    const fileName = `courses/${courseId}/thumbnail-${Date.now()}.${fileExt}`;

    // Upload thumbnail
    const { data, error: uploadError } = await supabase.storage
      .from("course-thumbnails")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      return {
        success: false,
        error: `Зураг байршуулахад алдаа гарлаа: ${uploadError.message}`,
      };
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("course-thumbnails").getPublicUrl(data.path);

    return {
      success: true,
      thumbnailUrl: publicUrl,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Тодорхойгүй алдаа гарлаа",
    };
  }
}

/**
 * Delete course thumbnail from storage
 * @param thumbnailUrl - The full URL of the thumbnail to delete
 */
export async function deleteCourseThumbnail(thumbnailUrl: string): Promise<boolean> {
  try {
    const supabase = createClient();

    // Extract path from URL
    const url = new URL(thumbnailUrl);
    const pathMatch = url.pathname.match(/\/course-thumbnails\/(.+)$/);
    if (!pathMatch) return false;

    const filePath = pathMatch[1];

    const { error } = await supabase.storage
      .from("course-thumbnails")
      .remove([filePath]);

    return !error;
  } catch {
    return false;
  }
}
