"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

type ProgressResult = {
  success: boolean;
  message: string;
};

type LessonProgressData = {
  isCompleted: boolean;
  lastPosition: number;
  completedAt: string | null;
};

/**
 * Save video progress for a lesson
 * @param lessonId - UUID of the lesson
 * @param courseId - UUID of the course
 * @param lastPosition - Current position in seconds
 * @param isCompleted - Whether the lesson is completed
 * @returns Result object with success status
 */
export async function saveVideoProgress(
  lessonId: string,
  courseId: string,
  lastPosition: number,
  isCompleted: boolean = false
): Promise<ProgressResult> {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        message: "You must be logged in to save progress",
      };
    }

    // Get enrollment for this course
    const { data: enrollment, error: enrollmentError } = await supabase
      .from("enrollments")
      .select("id")
      .eq("user_id", user.id)
      .eq("course_id", courseId)
      .single();

    if (enrollmentError || !enrollment) {
      return {
        success: false,
        message: "You must be enrolled in this course",
      };
    }

    // Upsert lesson progress (insert or update)
    const { error: progressError } = await supabase
      .from("lesson_progress")
      .upsert(
        {
          enrollment_id: enrollment.id,
          lesson_id: lessonId,
          last_position_seconds: Math.floor(lastPosition),
          is_completed: isCompleted,
          completed_at: isCompleted ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "enrollment_id,lesson_id",
        }
      );

    if (progressError) {
      console.error("Error saving lesson progress:", progressError);
      return {
        success: false,
        message: "Error saving progress",
      };
    }

    // Revalidate relevant pages
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Progress saved successfully",
    };
  } catch (error) {
    console.error("Unexpected error in saveVideoProgress:", error);
    return {
      success: false,
      message: "An unexpected error occurred",
    };
  }
}

/**
 * Get lesson progress for the authenticated user
 * @param lessonId - UUID of the lesson
 * @param courseId - UUID of the course
 * @returns Lesson progress data or null
 */
export async function getLessonProgress(
  lessonId: string,
  courseId: string
): Promise<LessonProgressData | null> {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return null;
    }

    // Get enrollment for this course
    const { data: enrollment, error: enrollmentError } = await supabase
      .from("enrollments")
      .select("id")
      .eq("user_id", user.id)
      .eq("course_id", courseId)
      .single();

    if (enrollmentError || !enrollment) {
      return null;
    }

    // Get lesson progress
    const { data: progress, error: progressError } = await supabase
      .from("lesson_progress")
      .select("is_completed, last_position_seconds, completed_at")
      .eq("enrollment_id", enrollment.id)
      .eq("lesson_id", lessonId)
      .single();

    if (progressError || !progress) {
      return {
        isCompleted: false,
        lastPosition: 0,
        completedAt: null,
      };
    }

    return {
      isCompleted: progress.is_completed,
      lastPosition: progress.last_position_seconds || 0,
      completedAt: progress.completed_at,
    };
  } catch (error) {
    console.error("Error getting lesson progress:", error);
    return null;
  }
}

/**
 * Mark a lesson as complete
 * @param lessonId - UUID of the lesson
 * @param courseId - UUID of the course
 * @returns Result object with success status
 */
export async function markLessonComplete(
  lessonId: string,
  courseId: string
): Promise<ProgressResult> {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        message: "You must be logged in",
      };
    }

    // Get enrollment for this course
    const { data: enrollment, error: enrollmentError } = await supabase
      .from("enrollments")
      .select("id")
      .eq("user_id", user.id)
      .eq("course_id", courseId)
      .single();

    if (enrollmentError || !enrollment) {
      return {
        success: false,
        message: "You must be enrolled in this course",
      };
    }

    // Get existing progress to preserve last_position_seconds
    const { data: existingProgress } = await supabase
      .from("lesson_progress")
      .select("last_position_seconds")
      .eq("enrollment_id", enrollment.id)
      .eq("lesson_id", lessonId)
      .single();

    // Upsert lesson progress as completed, preserving video position
    const { error: progressError } = await supabase
      .from("lesson_progress")
      .upsert(
        {
          enrollment_id: enrollment.id,
          lesson_id: lessonId,
          is_completed: true,
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          // Preserve existing position or default to 0
          last_position_seconds: existingProgress?.last_position_seconds ?? 0,
        },
        {
          onConflict: "enrollment_id,lesson_id",
        }
      );

    if (progressError) {
      console.error("Error marking lesson complete:", progressError);
      return {
        success: false,
        message: "Error marking lesson as complete",
      };
    }

    // Revalidate relevant pages
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Lesson marked as complete",
    };
  } catch (error) {
    console.error("Unexpected error in markLessonComplete:", error);
    return {
      success: false,
      message: "An unexpected error occurred",
    };
  }
}

/**
 * Get all lesson progress for an enrollment
 * @param courseId - UUID of the course
 * @returns Array of lesson progress data
 */
export async function getCourseProgress(courseId: string) {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { data: null, error: "Not authenticated" };
    }

    // Get enrollment for this course
    const { data: enrollment, error: enrollmentError } = await supabase
      .from("enrollments")
      .select("id")
      .eq("user_id", user.id)
      .eq("course_id", courseId)
      .single();

    if (enrollmentError || !enrollment) {
      return { data: null, error: "Not enrolled" };
    }

    // Get all lesson progress for this enrollment
    const { data: progressData, error: progressError } = await supabase
      .from("lesson_progress")
      .select("lesson_id, is_completed, last_position_seconds, completed_at")
      .eq("enrollment_id", enrollment.id);

    if (progressError) {
      console.error("Error fetching course progress:", progressError);
      return { data: null, error: "Error fetching progress" };
    }

    return { data: progressData, error: null };
  } catch (error) {
    console.error("Unexpected error in getCourseProgress:", error);
    return { data: null, error: "An unexpected error occurred" };
  }
}
