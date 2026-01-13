"use server";

import {
  getAuthenticatedUser,
  getUserEnrollment,
} from "../helpers";
import type { LessonProgressData, ContentProgressData } from "./types";

/**
 * Get lesson progress for the authenticated user
 */
export async function getLessonProgress(
  lessonId: string,
  courseId: string
): Promise<LessonProgressData | null> {
  try {
    const { user, supabase, error: authError } = await getAuthenticatedUser();

    if (authError || !user) {
      return null;
    }

    const { enrollment, error: enrollmentError } = await getUserEnrollment(
      user.id,
      courseId
    );

    if (enrollmentError || !enrollment) {
      return null;
    }

    const { data: progress, error: progressError } = await supabase
      .from("lesson_progress")
      .select("is_completed, last_position_seconds, completed_at")
      .eq("enrollment_id", enrollment.id)
      .eq("lesson_id", lessonId)
      .single();

    if (progressError || !progress) {
      return { isCompleted: false, lastPosition: 0, completedAt: null };
    }

    return {
      isCompleted: progress.is_completed,
      lastPosition: progress.last_position_seconds || 0,
      completedAt: progress.completed_at,
    };
  } catch {
    return null;
  }
}

/**
 * Get content-level progress for a lesson (theory/example videos)
 */
export async function getLessonContentProgress(
  lessonId: string,
  courseId: string
): Promise<{ data: ContentProgressData[] | null; error: string | null }> {
  try {
    const { user, supabase, error: authError } = await getAuthenticatedUser();

    if (authError || !user) {
      return { data: null, error: authError || "Not authenticated" };
    }

    const { enrollment, error: enrollmentError } = await getUserEnrollment(
      user.id,
      courseId
    );

    if (enrollmentError || !enrollment) {
      return { data: null, error: enrollmentError || "Not enrolled" };
    }

    const { data: contentItems, error: contentError } = await supabase
      .from("lesson_content")
      .select("id, content_type, title, order_index")
      .eq("lesson_id", lessonId)
      .order("order_index");

    if (contentError || !contentItems) {
      return { data: null, error: "Error fetching content items" };
    }

    const contentIds = contentItems.map((c) => c.id);
    const { data: progressData } = await supabase
      .from("lesson_content_progress")
      .select("*")
      .eq("enrollment_id", enrollment.id)
      .in("lesson_content_id", contentIds);

    const mergedData: ContentProgressData[] = contentItems.map((content) => {
      const progress = progressData?.find(
        (p) => p.lesson_content_id === content.id
      );

      return {
        contentId: content.id,
        contentType: content.content_type,
        title: content.title,
        orderIndex: content.order_index,
        isCompleted: progress?.is_completed || false,
        lastPosition: progress?.last_position_seconds || 0,
        xpAwarded: progress?.xp_awarded || 0,
        completedAt: progress?.completed_at || null,
      };
    });

    return { data: mergedData, error: null };
  } catch {
    return { data: null, error: "An unexpected error occurred" };
  }
}

/**
 * Get all lesson progress for an enrollment
 */
export async function getCourseProgress(courseId: string) {
  try {
    const { user, supabase, error: authError } = await getAuthenticatedUser();

    if (authError || !user) {
      return { data: null, error: authError };
    }

    const { enrollment, error: enrollmentError } = await getUserEnrollment(
      user.id,
      courseId
    );

    if (enrollmentError || !enrollment) {
      return { data: null, error: enrollmentError };
    }

    const { data: progressData, error: progressError } = await supabase
      .from("lesson_progress")
      .select("lesson_id, is_completed, last_position_seconds, completed_at")
      .eq("enrollment_id", enrollment.id);

    if (progressError) {
      return { data: null, error: "Error fetching progress" };
    }

    return { data: progressData, error: null };
  } catch {
    return { data: null, error: "An unexpected error occurred" };
  }
}
