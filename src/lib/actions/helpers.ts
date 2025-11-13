import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { User } from "@supabase/supabase-js";

/**
 * Centralized action helpers to reduce code duplication
 * Provides common patterns for authentication, enrollment checks, error handling, etc.
 */

// ============================================
// Authentication Helpers
// ============================================

type AuthResult = {
  user: User | null;
  supabase: Awaited<ReturnType<typeof createClient>>;
  error: string | null;
};

/**
 * Get authenticated user with Supabase client
 * Returns both user and supabase instance for convenience
 */
export async function getAuthenticatedUser(): Promise<AuthResult> {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      user: null,
      supabase,
      error: "Not authenticated",
    };
  }

  return {
    user,
    supabase,
    error: null,
  };
}

// ============================================
// Enrollment Helpers
// ============================================

type EnrollmentResult = {
  enrollment: { id: string } | null;
  error: string | null;
};

/**
 * Get user's enrollment for a course
 * Returns enrollment ID if user is enrolled
 */
export async function getUserEnrollment(
  userId: string,
  courseId: string
): Promise<EnrollmentResult> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("enrollments")
    .select("id")
    .eq("user_id", userId)
    .eq("course_id", courseId)
    .single();

  if (error || !data) {
    return {
      enrollment: null,
      error: "Not enrolled in course",
    };
  }

  return {
    enrollment: data,
    error: null,
  };
}

/**
 * Ensure user profile exists, create if needed
 * Used during enrollment or first-time actions
 */
export async function ensureUserProfile(user: User): Promise<{
  success: boolean;
  error: string | null;
}> {
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("id")
    .eq("id", user.id)
    .single();

  if (!profile) {
    const { error } = await supabase.from("user_profiles").insert({
      id: user.id,
      email: user.email!,
      full_name: user.user_metadata?.full_name || "Student",
      avatar_url: user.user_metadata?.avatar_url || null,
    });

    if (error) {
      console.error("Error creating user profile:", error);
      return { success: false, error: "Error creating user profile" };
    }
  }

  return { success: true, error: null };
}

// ============================================
// Lesson Progress Helpers
// ============================================

/**
 * Upsert lesson progress with standardized structure
 */
export async function upsertLessonProgress(
  enrollmentId: string,
  lessonId: string,
  updates: {
    isCompleted?: boolean;
    lastPosition?: number;
  }
) {
  const supabase = await createClient();

  const progressData: Record<string, unknown> = {
    enrollment_id: enrollmentId,
    lesson_id: lessonId,
    updated_at: new Date().toISOString(),
  };

  if (updates.isCompleted !== undefined) {
    progressData.is_completed = updates.isCompleted;
    progressData.completed_at = updates.isCompleted
      ? new Date().toISOString()
      : null;
  }

  if (updates.lastPosition !== undefined) {
    progressData.last_position_seconds = Math.floor(updates.lastPosition);
  }

  return await supabase.from("lesson_progress").upsert(progressData, {
    onConflict: "enrollment_id,lesson_id",
  });
}

// ============================================
// Milestone XP Helpers
// ============================================

type MilestoneXPResult = {
  success: boolean;
  message: string;
  xpAwarded?: number;
};

/**
 * Check and award milestone XP after lesson completion
 * Returns results so UI can display toast notifications
 */
export async function checkAndAwardMilestones(
  userId: string,
  courseId: string
): Promise<MilestoneXPResult[]> {
  try {
    const supabase = await createClient();

    const { data: enrollment } = await supabase
      .from("enrollments")
      .select("id, progress_percentage")
      .eq("user_id", userId)
      .eq("course_id", courseId)
      .single();

    if (enrollment) {
      // Dynamic import to avoid circular dependency
      const { awardMilestoneXP } = await import("./xp-actions");

      const results = await awardMilestoneXP(
        enrollment.id,
        courseId,
        enrollment.progress_percentage
      );

      return results;
    }

    return [];
  } catch (error) {
    console.error("Error awarding milestone XP:", error);
    return [];
  }
}

// ============================================
// Revalidation Helpers
// ============================================

/**
 * Revalidate common user pages
 */
export function revalidateUserPages(additionalPaths: string[] = []) {
  revalidatePath("/dashboard");
  additionalPaths.forEach((path) => revalidatePath(path));
}

// ============================================
// Error Handling Helpers
// ============================================

/**
 * Standardized error handler for server actions
 */
export function handleActionError(error: unknown, context: string) {
  console.error(`Error in ${context}:`, error);

  return {
    success: false,
    message: "An unexpected error occurred",
    details: error instanceof Error ? error.message : String(error),
  };
}
