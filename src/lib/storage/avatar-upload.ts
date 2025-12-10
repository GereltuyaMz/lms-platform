import { createClient } from "@/lib/supabase/client";

type UploadAvatarResult = {
  success: boolean;
  avatarUrl?: string;
  error?: string;
};

/**
 * Upload user avatar to Supabase Storage
 * @param file - The image file to upload
 * @param userId - The user's ID for folder organization
 * @returns Result with avatar URL or error
 */
export async function uploadAvatar(
  file: File,
  userId: string
): Promise<UploadAvatarResult> {
  try {
    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: "Зөвхөн JPG, PNG, GIF, WEBP форматын зураг оруулна уу",
      };
    }

    // Validate file size (2MB max)
    const maxSize = 2 * 1024 * 1024; // 2MB in bytes
    if (file.size > maxSize) {
      return {
        success: false,
        error: "Зургийн хэмжээ 2MB-аас бага байх ёстой",
      };
    }

    const supabase = createClient();

    // Generate unique filename with timestamp
    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}/avatar-${Date.now()}.${fileExt}`;

    // Delete old avatars for this user (cleanup)
    const { data: existingFiles } = await supabase.storage
      .from("avatars")
      .list(userId);

    if (existingFiles && existingFiles.length > 0) {
      const filesToDelete = existingFiles.map((f) => `${userId}/${f.name}`);
      await supabase.storage.from("avatars").remove(filesToDelete);
    }

    // Upload new avatar
    const { data, error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
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
    } = supabase.storage.from("avatars").getPublicUrl(data.path);

    return {
      success: true,
      avatarUrl: publicUrl,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Тодорхойгүй алдаа гарлаа",
    };
  }
}
