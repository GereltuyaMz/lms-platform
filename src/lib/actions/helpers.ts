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
  } catch {
    return [];
  }
}

// ============================================
// Streak Helpers
// ============================================

/**
 * Calculate days between two dates (ignoring time)
 */
export function calculateDaysBetween(date1: Date, date2: Date): number {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  d1.setHours(0, 0, 0, 0);
  d2.setHours(0, 0, 0, 0);
  return Math.floor((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Calculate new streak value based on last activity
 * Returns { newStreak, isNewStreakDay }
 */
export function calculateStreak(
  currentStreak: number,
  lastActivityDate: string | null
): { newStreak: number; isNewStreakDay: boolean } {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (!lastActivityDate) {
    // First activity ever
    return { newStreak: 1, isNewStreakDay: true };
  }

  const lastActivity = new Date(lastActivityDate);
  lastActivity.setHours(0, 0, 0, 0);

  const daysSince = calculateDaysBetween(lastActivity, today);

  if (daysSince === 0) {
    // Same day - no change
    return { newStreak: currentStreak || 1, isNewStreakDay: false };
  } else if (daysSince === 1) {
    // Next day - continue streak
    return { newStreak: (currentStreak || 0) + 1, isNewStreakDay: true };
  } else {
    // Gap > 1 day - reset streak
    return { newStreak: 1, isNewStreakDay: true };
  }
}

/**
 * Get streak multiplier based on current streak
 * 1.0x (no streak) -> 1.5x (30+ days)
 */
export function getStreakMultiplier(currentStreak: number): number {
  if (currentStreak < 3) return 1.0;
  if (currentStreak < 7) return 1.1;
  if (currentStreak < 14) return 1.2;
  if (currentStreak < 30) return 1.3;
  return 1.5; // Max multiplier at 30+ days
}

/**
 * Check if streak milestone should be awarded
 * Returns { shouldAward, xp, label } or null
 */
export function checkStreakMilestone(newStreak: number): {
  shouldAward: boolean;
  xp: number;
  label: string;
} | null {
  const milestones = [
    { days: 3, xp: 100, label: "3-day streak" },
    { days: 7, xp: 250, label: "7-day streak" },
    { days: 30, xp: 1000, label: "30-day streak" },
  ];

  const milestone = milestones.find((m) => m.days === newStreak);

  if (milestone) {
    return {
      shouldAward: true,
      xp: milestone.xp,
      label: milestone.label,
    };
  }

  return null;
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
export function handleActionError(error: unknown) {
  return {
    success: false,
    message: "An unexpected error occurred",
    details: error instanceof Error ? error.message : String(error),
  };
}
