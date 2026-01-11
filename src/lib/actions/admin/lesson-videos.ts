"use server";

import { createClient } from "@/lib/supabase/server";
import type { LessonVideo, VideoStatus } from "@/types/database/tables";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;

type CreateVideoResponse = {
  success: boolean;
  id?: string;
  bunnyVideoId?: string;
  uploadUrl?: string;
  error?: string;
};

type UploadResponse = {
  success: boolean;
  status?: VideoStatus;
  message?: string;
  error?: string;
};

type StatusResponse = {
  success: boolean;
  video?: LessonVideo;
  error?: string;
};

type DeleteResponse = {
  success: boolean;
  error?: string;
};

/**
 * Get the edge function URL
 */
function getEdgeFunctionUrl(action: string, params?: Record<string, string>) {
  const url = new URL(`${SUPABASE_URL}/functions/v1/bunny-video-upload`);
  url.searchParams.set("action", action);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }
  return url.toString();
}

/**
 * Create a new video record in Bunny Stream and database
 * Returns upload URL for the client to use
 */
export async function createBunnyVideo(
  title: string,
  filename?: string
): Promise<CreateVideoResponse> {
  const supabase = await createClient();

  // Get user session for auth
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const response = await fetch(getEdgeFunctionUrl("create"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ title, filename }),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.error || "Failed to create video" };
    }

    const data = await response.json();
    return {
      success: true,
      id: data.id,
      bunnyVideoId: data.bunnyVideoId,
      uploadUrl: data.uploadUrl,
    };
  } catch (error) {
    console.error("Error creating Bunny video:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Upload video file to Bunny Stream via edge function
 * Note: This is called from the client with the file data
 */
export async function uploadToBunny(
  bunnyVideoId: string,
  fileBuffer: ArrayBuffer
): Promise<UploadResponse> {
  const supabase = await createClient();

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const response = await fetch(
      getEdgeFunctionUrl("upload", { videoId: bunnyVideoId }),
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
      return { success: false, error: error.error || "Failed to upload video" };
    }

    const data = await response.json();
    return {
      success: true,
      status: data.status,
      message: data.message,
    };
  } catch (error) {
    console.error("Error uploading to Bunny:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Get current video processing status from Bunny
 */
export async function getVideoStatus(
  bunnyVideoId: string
): Promise<StatusResponse> {
  const supabase = await createClient();

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const response = await fetch(
      getEdgeFunctionUrl("status", { videoId: bunnyVideoId }),
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.error || "Failed to get video status",
      };
    }

    const video = await response.json();
    return { success: true, video };
  } catch (error) {
    console.error("Error getting video status:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Delete video from Bunny Stream and database
 */
export async function deleteBunnyVideo(
  bunnyVideoId: string
): Promise<DeleteResponse> {
  const supabase = await createClient();

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const response = await fetch(
      getEdgeFunctionUrl("delete", { videoId: bunnyVideoId }),
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.error || "Failed to delete video",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting Bunny video:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Get video by database ID
 */
export async function getVideoById(
  id: string
): Promise<{ success: boolean; video?: LessonVideo; error?: string }> {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("lesson_videos")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, video: data };
  } catch (error) {
    console.error("Error getting video by ID:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Get video by Bunny Video ID
 */
export async function getVideoByBunnyId(
  bunnyVideoId: string
): Promise<{ success: boolean; video?: LessonVideo; error?: string }> {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("lesson_videos")
      .select("*")
      .eq("bunny_video_id", bunnyVideoId)
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, video: data };
  } catch (error) {
    console.error("Error getting video by Bunny ID:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
