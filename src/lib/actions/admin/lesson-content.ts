"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { LessonContent } from "@/types/database/tables";

type ContentType = "theory" | "example";

type LessonContentData = {
  title: string;
  video_url: string | null;
  lesson_video_id: string | null; // FK to lesson_videos (Bunny Stream)
  content: string | null;
  duration_seconds: number | null;
};

/**
 * Fetch all content blocks for a lesson
 */
export async function getLessonContent(
  lessonId: string
): Promise<LessonContent[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("lesson_content")
    .select("*")
    .eq("lesson_id", lessonId)
    .order("order_index", { ascending: true });

  if (error) {
    console.error("Error fetching lesson content:", error);
    return [];
  }

  return data || [];
}

/**
 * Create or update lesson content for a specific content type (theory or example)
 */
export async function upsertLessonContent(
  lessonId: string,
  contentType: ContentType,
  data: LessonContentData
): Promise<{ success: boolean; message: string; data?: LessonContent }> {
  const supabase = await createClient();

  // Map content type to order_index
  const orderIndex = contentType === "theory" ? 1 : 2;

  // Auto-generate title based on content type
  const title = contentType === "theory" ? "Онол" : "Жишээ";

  try {
    // Check if content already exists for this lesson and content type
    const { data: existing } = await supabase
      .from("lesson_content")
      .select("id")
      .eq("lesson_id", lessonId)
      .eq("content_type", contentType)
      .single();

    if (existing) {
      // Update existing content
      // If lesson_video_id is set, clear video_url (Bunny takes precedence)
      // If video_url is set, clear lesson_video_id (external URL takes precedence)
      const { data: updated, error } = await supabase
        .from("lesson_content")
        .update({
          title,
          video_url: data.lesson_video_id ? null : data.video_url,
          lesson_video_id: data.video_url ? null : data.lesson_video_id,
          content: data.content,
          duration_seconds: data.duration_seconds,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id)
        .select()
        .single();

      if (error) {
        return { success: false, message: error.message };
      }

      revalidatePath(`/admin/lessons/${lessonId}`);
      return {
        success: true,
        message: "Content updated successfully",
        data: updated,
      };
    } else {
      // Create new content
      // If lesson_video_id is set, clear video_url (Bunny takes precedence)
      // If video_url is set, clear lesson_video_id (external URL takes precedence)
      const { data: created, error } = await supabase
        .from("lesson_content")
        .insert({
          lesson_id: lessonId,
          title,
          content_type: contentType,
          video_url: data.lesson_video_id ? null : data.video_url,
          lesson_video_id: data.video_url ? null : data.lesson_video_id,
          content: data.content,
          duration_seconds: data.duration_seconds,
          order_index: orderIndex,
        })
        .select()
        .single();

      if (error) {
        return { success: false, message: error.message };
      }

      revalidatePath(`/admin/lessons/${lessonId}`);
      return {
        success: true,
        message: "Content created successfully",
        data: created,
      };
    }
  } catch (error) {
    console.error("Error upserting lesson content:", error);
    return {
      success: false,
      message: "An unexpected error occurred",
    };
  }
}

/**
 * Delete lesson content for a specific content type
 */
export async function deleteLessonContent(
  lessonId: string,
  contentType: ContentType
): Promise<{ success: boolean; message: string }> {
  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from("lesson_content")
      .delete()
      .eq("lesson_id", lessonId)
      .eq("content_type", contentType);

    if (error) {
      return { success: false, message: error.message };
    }

    revalidatePath(`/admin/lessons/${lessonId}`);
    return { success: true, message: "Content deleted successfully" };
  } catch (error) {
    console.error("Error deleting lesson content:", error);
    return {
      success: false,
      message: "An unexpected error occurred",
    };
  }
}
