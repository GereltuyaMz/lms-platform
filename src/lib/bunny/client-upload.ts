import { createClient } from "@/lib/supabase/client";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;

/**
 * Upload video file to Bunny Stream via edge function (client-side)
 * This must be called from the client because ArrayBuffer doesn't serialize for server actions
 */
export async function uploadVideoToBunny(
  bunnyVideoId: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    // Read file as ArrayBuffer
    const fileBuffer = await file.arrayBuffer();

    // Call edge function to upload
    const response = await fetch(
      `${SUPABASE_URL}/functions/v1/bunny-video-upload?action=upload&videoId=${bunnyVideoId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/octet-stream",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: fileBuffer,
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.error || "Upload failed" };
    }

    // Upload complete, video is now processing
    onProgress?.(100);
    return { success: true };
  } catch (error) {
    console.error("Error uploading video:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Upload failed",
    };
  }
}
