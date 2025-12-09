"use server";

import {
  getAuthenticatedUser,
  getUserEnrollment,
  upsertLessonProgress,
  checkAndAwardMilestones,
  revalidateUserPages,
  handleActionError,
} from "./helpers";

type ProgressResult = {
  success: boolean;
  message: string;
  milestoneResults?: Array<{
    success: boolean;
    message: string;
    xpAwarded?: number;
  }>;
  streakBonusAwarded?: number;
  streakBonusMessage?: string;
  currentStreak?: number;
  videoXpAwarded?: number;
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
  isCompleted: boolean = false,
  videoDuration?: number
): Promise<ProgressResult> {
  try {
    const { user, error: authError } = await getAuthenticatedUser();

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

    // Upsert lesson progress
    const { error: progressError } = await upsertLessonProgress(
      enrollment.id,
      lessonId,
      {
        lastPosition,
        isCompleted,
      }
    );

    if (progressError) {
      return {
        success: false,
        message: "Error saving progress",
      };
    }

    // Check for milestone XP and return results
    let milestoneResults: Array<{
      success: boolean;
      message: string;
      xpAwarded?: number;
    }> = [];

    if (isCompleted) {
      milestoneResults = await checkAndAwardMilestones(user.id, courseId);
    }

    // Award video XP on completion (if videoDuration provided)
    let videoXpAwarded: number | undefined;

    if (isCompleted && videoDuration && videoDuration > 0) {
      const { awardVideoCompletionXP } = await import("./xp-actions");
      const xpResult = await awardVideoCompletionXP(
        lessonId,
        courseId,
        videoDuration
      );

      if (xpResult.success && xpResult.xpAwarded) {
        videoXpAwarded = xpResult.xpAwarded;
      }
    }

    // Update user streak on completion
    let streakBonusAwarded: number | undefined;
    let streakBonusMessage: string | undefined;
    let currentStreak: number | undefined;

    if (isCompleted) {
      const { updateUserStreak } = await import("./streak-actions");
      const streakResult = await updateUserStreak(user.id);

      // Only show streak notification if it's a new streak day
      if (streakResult.success && streakResult.isNewStreakDay) {
        currentStreak = streakResult.currentStreak;
        streakBonusAwarded = streakResult.streakBonusAwarded;
        streakBonusMessage = streakResult.streakBonusMessage;
      }
    }

    // Check for badge awards on completion
    if (isCompleted) {
      const { checkAndAwardBadges } = await import("./badges");
      await checkAndAwardBadges("lesson");
    }

    // Revalidate relevant pages
    revalidateUserPages();

    return {
      success: true,
      message: "Progress saved successfully",
      milestoneResults:
        milestoneResults.length > 0 ? milestoneResults : undefined,
      streakBonusAwarded,
      streakBonusMessage,
      currentStreak,
      videoXpAwarded,
    };
  } catch (error) {
    return handleActionError(error) as ProgressResult;
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
    const { user, supabase, error: authError } = await getAuthenticatedUser();

    if (authError || !user) {
      return null;
    }

    // Get enrollment for this course
    const { enrollment, error: enrollmentError } = await getUserEnrollment(
      user.id,
      courseId
    );

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
  } catch {
    return null;
  }
}

/**
 * Get all lesson progress for an enrollment
 * @param courseId - UUID of the course
 * @returns Array of lesson progress data
 */
export async function getCourseProgress(courseId: string) {
  try {
    const { user, supabase, error: authError } = await getAuthenticatedUser();

    if (authError || !user) {
      return { data: null, error: authError };
    }

    // Get enrollment for this course
    const { enrollment, error: enrollmentError } = await getUserEnrollment(
      user.id,
      courseId
    );

    if (enrollmentError || !enrollment) {
      return { data: null, error: enrollmentError };
    }

    // Get all lesson progress for this enrollment
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
