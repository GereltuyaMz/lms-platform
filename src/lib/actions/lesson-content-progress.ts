"use server";

import { revalidatePath } from "next/cache";
import {
  getAuthenticatedUser,
  getUserEnrollment,
  revalidateUserPages,
  handleActionError,
} from "./helpers";
import { insertXPTransaction } from "./xp-helpers";
import { checkAndCompleteLessonIfReady } from "./lesson-progress";

type ContentProgressResult = {
  success: boolean;
  message: string;
  xpAwarded?: number;
  unitXpAwarded?: number;
  isRewatch?: boolean;
  lessonComplete?: boolean;
  readyForQuiz?: boolean;
};

type ContentProgress = {
  contentId: string;
  contentType: string;
  title: string;
  isCompleted: boolean;
  lastPosition: number;
  xpAwarded: number;
};

/**
 * Save progress for individual lesson content (theory/example videos)
 * Awards 10 XP for first completion, 0 XP for rewatching
 *
 * @param contentId - UUID of the lesson_content item
 * @param lessonId - UUID of the parent lesson
 * @param courseId - UUID of the course
 * @param lastPosition - Current playback position in seconds
 * @param isCompleted - Whether the content is fully watched
 * @returns Result with XP awarded and unit completion info
 */
export async function saveContentProgress(
  contentId: string,
  lessonId: string,
  courseId: string,
  lastPosition: number,
  isCompleted: boolean = false
): Promise<ContentProgressResult> {
  try {
    const { user, supabase, error: authError } = await getAuthenticatedUser();

    if (authError || !user) {
      return {
        success: false,
        message: "You must be logged in to save progress",
      };
    }

    // Get enrollment for this course
    const { enrollment, error: enrollmentError } = await getUserEnrollment(
      user.id,
      courseId
    );

    if (enrollmentError || !enrollment) {
      return {
        success: false,
        message: "You must be enrolled in this course",
      };
    }

    // Get content details
    const { data: content, error: contentError } = await supabase
      .from("lesson_content")
      .select("content_type, title")
      .eq("id", contentId)
      .single();

    if (contentError || !content) {
      return {
        success: false,
        message: "Content not found",
      };
    }

    // Check if already completed (rewatch detection)
    const { data: existing } = await supabase
      .from("lesson_content_progress")
      .select("is_completed, xp_awarded, completed_at")
      .eq("enrollment_id", enrollment.id)
      .eq("lesson_content_id", contentId)
      .single();

    const isRewatch = existing?.is_completed === true;

    // Calculate XP (10 for first completion, 0 for rewatch)
    let xpToAward = 0;
    if (isCompleted && !isRewatch) {
      // Only award XP for theory and example content types
      if (content.content_type === "theory" || content.content_type === "example") {
        xpToAward = 10;
      }
    }

    // Upsert content progress
    const { error: progressError } = await supabase
      .from("lesson_content_progress")
      .upsert(
        {
          enrollment_id: enrollment.id,
          lesson_content_id: contentId,
          is_completed: isCompleted,
          completed_at: isCompleted ? new Date().toISOString() : existing?.is_completed ? existing.completed_at : null,
          last_position_seconds: lastPosition,
          xp_awarded: isRewatch ? (existing?.xp_awarded || 0) : xpToAward,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "enrollment_id,lesson_content_id",
        }
      );

    if (progressError) {
      console.error("Error saving content progress:", progressError);
      return {
        success: false,
        message: "Error saving progress",
      };
    }

    // Award XP if this is first completion
    if (xpToAward > 0 && !isRewatch) {
      const sourceType =
        content.content_type === "theory"
          ? "lesson_theory_complete"
          : "lesson_example_complete";

      await insertXPTransaction(
        user.id,
        xpToAward,
        sourceType,
        contentId,
        `Completed ${content.content_type}: "${content.title}"`,
        {
          content_id: contentId,
          lesson_id: lessonId,
          course_id: courseId,
          content_type: content.content_type,
        }
      );
    }

    // Check if lesson can be completed after this content completion
    // Also checks for unit completion when lesson completes
    let lessonComplete = false;
    let readyForQuiz = false;
    let unitXpAwarded: number | undefined;
    if (isCompleted) {
      const completionStatus = await checkAndCompleteLessonIfReady(
        enrollment.id,
        lessonId,
        courseId,
        user.id
      );
      lessonComplete = completionStatus.lessonComplete;
      readyForQuiz = completionStatus.contentComplete;
      unitXpAwarded = completionStatus.unitXpAwarded;
    }

    // Revalidate pages
    revalidateUserPages();
    const { data: courseData } = await supabase
      .from("courses")
      .select("slug")
      .eq("id", courseId)
      .single();

    if (courseData?.slug) {
      revalidatePath(
        `/courses/${courseData.slug}/learn/lesson/${lessonId}`,
        "page"
      );
    }

    return {
      success: true,
      message: isRewatch
        ? "Progress saved (rewatching)"
        : `You earned ${xpToAward} XP!`,
      xpAwarded: xpToAward,
      unitXpAwarded,
      isRewatch,
      lessonComplete,
      readyForQuiz,
    };
  } catch (error) {
    return handleActionError(error) as ContentProgressResult;
  }
}

/**
 * Get progress for all content items in a lesson
 *
 * @param lessonId - UUID of the lesson
 * @param courseId - UUID of the course
 * @returns Array of content progress data
 */
export async function getContentProgress(
  lessonId: string,
  courseId: string
): Promise<ContentProgress[]> {
  try {
    const { user, supabase, error: authError } = await getAuthenticatedUser();

    if (authError || !user) {
      return [];
    }

    // Get enrollment
    const { enrollment, error: enrollmentError } = await getUserEnrollment(
      user.id,
      courseId
    );

    if (enrollmentError || !enrollment) {
      return [];
    }

    // Get all content for this lesson
    const { data: contentItems, error: contentError } = await supabase
      .from("lesson_content")
      .select("id, content_type, title")
      .eq("lesson_id", lessonId)
      .order("order_index");

    if (contentError || !contentItems) {
      return [];
    }

    // Get progress for each content item
    const contentIds = contentItems.map((c) => c.id);
    const { data: progressData } = await supabase
      .from("lesson_content_progress")
      .select("*")
      .eq("enrollment_id", enrollment.id)
      .in("lesson_content_id", contentIds);

    // Merge content info with progress
    return contentItems.map((content) => {
      const progress = progressData?.find(
        (p) => p.lesson_content_id === content.id
      );

      return {
        contentId: content.id,
        contentType: content.content_type,
        title: content.title,
        isCompleted: progress?.is_completed || false,
        lastPosition: progress?.last_position_seconds || 0,
        xpAwarded: progress?.xp_awarded || 0,
      };
    });
  } catch {
    return [];
  }
}

/**
 * Check if all content items in a lesson are completed
 * Used to determine if lesson quiz can be unlocked
 *
 * @param lessonId - UUID of the lesson
 * @param courseId - UUID of the course
 * @returns True if all theory/example content is completed
 */
export async function isLessonContentComplete(
  lessonId: string,
  courseId: string
): Promise<boolean> {
  try {
    const contentProgress = await getContentProgress(lessonId, courseId);

    // Check if all theory and example content is completed
    const requiredContent = contentProgress.filter(
      (c) => c.contentType === "theory" || c.contentType === "example"
    );

    if (requiredContent.length === 0) {
      return true; // No content to complete
    }

    return requiredContent.every((c) => c.isCompleted);
  } catch {
    return false;
  }
}
