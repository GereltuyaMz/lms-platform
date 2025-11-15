"use server";

import {
  getAuthenticatedUser,
  revalidateUserPages,
  handleActionError,
} from "./helpers";
import {
  hasXPBeenAwarded,
  getEnrollmentId,
  isFirstLessonInCourse,
  isQuizRetry,
  getLessonTitle,
  calculateVideoXP,
  calculateQuizXP,
  insertXPTransaction,
  getCourseTitle,
  getCompletedCoursesCount,
} from "./xp-helpers";

type XPResult = {
  success: boolean;
  message: string;
  xpAwarded?: number;
};

export type XPTransaction = {
  id: string;
  amount: number;
  source_type: string;
  description: string;
  created_at: string;
  metadata: Record<string, unknown>;
};

/**
 * Award XP for video lesson completion
 */
export async function awardVideoCompletionXP(
  lessonId: string,
  courseId: string,
  durationSeconds: number
): Promise<XPResult> {
  try {
    const { user, error: authError } = await getAuthenticatedUser();

    if (authError || !user) {
      return { success: false, message: "You must be logged in" };
    }

    // Check if already awarded
    if (await hasXPBeenAwarded(user.id, "lesson_complete", lessonId)) {
      return {
        success: false,
        message: "XP already awarded for this lesson",
        xpAwarded: 0,
      };
    }

    // Get enrollment
    const enrollmentId = await getEnrollmentId(user.id, courseId);
    if (!enrollmentId) {
      return { success: false, message: "Enrollment not found" };
    }

    // Check if first lesson
    const isFirst = await isFirstLessonInCourse(enrollmentId);

    // Calculate XP
    const { amount, metadata } = await calculateVideoXP(durationSeconds, isFirst);

    // Get lesson title
    const lessonTitle = await getLessonTitle(lessonId);

    // Insert transaction
    const success = await insertXPTransaction(
      user.id,
      amount,
      "lesson_complete",
      lessonId,
      `Completed "${lessonTitle}"`,
      { ...metadata, course_id: courseId }
    );

    if (!success) {
      return { success: false, message: "Error awarding XP" };
    }

    revalidateUserPages();

    return {
      success: true,
      message: `You earned ${amount} XP!`,
      xpAwarded: amount,
    };
  } catch (error) {
    return handleActionError(error, "awardVideoCompletionXP") as XPResult;
  }
}

/**
 * Award XP for quiz completion
 */
export async function awardQuizCompletionXP(
  quizAttemptId: string,
  lessonId: string,
  scorePercentage: number
): Promise<XPResult> {
  try {
    const { user, error: authError } = await getAuthenticatedUser();

    if (authError || !user) {
      return { success: false, message: "You must be logged in" };
    }

    // Check if already awarded
    if (await hasXPBeenAwarded(user.id, "quiz_complete", quizAttemptId)) {
      return {
        success: false,
        message: "XP already awarded for this attempt",
        xpAwarded: 0,
      };
    }

    // Check if retry
    const isRetry = await isQuizRetry(user.id, lessonId, quizAttemptId);

    // Calculate XP
    const { amount, metadata } = await calculateQuizXP(scorePercentage, isRetry);

    if (amount === 0) {
      return {
        success: false,
        message: "Score too low to earn XP (need 80%+)",
        xpAwarded: 0,
      };
    }

    // Get lesson title
    const lessonTitle = await getLessonTitle(lessonId);

    // Insert transaction
    const success = await insertXPTransaction(
      user.id,
      amount,
      "quiz_complete",
      quizAttemptId,
      `Completed quiz "${lessonTitle}" with ${scorePercentage}%`,
      { ...metadata, lesson_id: lessonId }
    );

    if (!success) {
      return { success: false, message: "Error awarding XP" };
    }

    revalidateUserPages();

    return {
      success: true,
      message: `You earned ${amount} XP!`,
      xpAwarded: amount,
    };
  } catch (error) {
    return handleActionError(error, "awardQuizCompletionXP") as XPResult;
  }
}

/**
 * Get user's total XP
 */
export async function getUserTotalXP(): Promise<number> {
  try {
    const { user, supabase, error: authError } = await getAuthenticatedUser();

    if (authError || !user) return 0;

    const { data } = await supabase
      .from("user_profiles")
      .select("total_xp")
      .eq("id", user.id)
      .single();

    return data?.total_xp || 0;
  } catch (error) {
    return 0;
  }
}

/**
 * Get XP transaction history
 */
export async function getXPTransactions(
  limit: number = 50
): Promise<XPTransaction[]> {
  try {
    const { user, supabase, error: authError } = await getAuthenticatedUser();

    if (authError || !user) return [];

    const { data } = await supabase
      .from("xp_transactions")
      .select("id, amount, source_type, description, created_at, metadata")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(limit);

    return data || [];
  } catch (error) {
    return [];
  }
}

/**
 * Get total XP earned for a specific course
 */
export async function getCourseXPEarned(
  courseId: string
): Promise<number> {
  try {
    const { user, supabase, error: authError } = await getAuthenticatedUser();

    if (authError || !user) return 0;

    const { data } = await supabase
      .from("xp_transactions")
      .select("amount")
      .eq("user_id", user.id)
      .in("source_type", ["lesson_complete", "quiz_complete", "milestone", "achievement"])
      .contains("metadata", { course_id: courseId });

    if (!data) return 0;

    return data.reduce((sum, transaction) => sum + transaction.amount, 0);
  } catch (error) {
    return 0;
  }
}

/**
 * Award XP for course progress milestones
 * Checks progress percentage and awards XP for 25%, 50%, 75%, 100% completion
 */
export async function awardMilestoneXP(
  enrollmentId: string,
  courseId: string,
  progressPercentage: number
): Promise<XPResult[]> {
  try {
    const { user, error: authError } = await getAuthenticatedUser();

    if (authError || !user) {
      return [{ success: false, message: "You must be logged in" }];
    }

    const results: XPResult[] = [];

    // Define milestones and their XP rewards
    const milestones = [
      { threshold: 25, xp: 200, label: "25%" },
      { threshold: 50, xp: 300, label: "50%" },
      { threshold: 75, xp: 400, label: "75%" },
      { threshold: 100, xp: 500, label: "100%" },
    ];

    // Get course title
    const courseTitle = await getCourseTitle(courseId);

    // Check each milestone
    for (const milestone of milestones) {
      if (progressPercentage >= milestone.threshold) {
        const milestoneId = `${enrollmentId}-${milestone.threshold}`;

        // Check if already awarded
        const alreadyAwarded = await hasXPBeenAwarded(
          user.id,
          "milestone",
          milestoneId
        );

        if (!alreadyAwarded) {
          // Award milestone XP
          const success = await insertXPTransaction(
            user.id,
            milestone.xp,
            "milestone",
            milestoneId,
            `Reached ${milestone.label} completion in "${courseTitle}"`,
            {
              course_id: courseId,
              enrollment_id: enrollmentId,
              milestone_percentage: milestone.threshold,
            }
          );

          if (success) {
            results.push({
              success: true,
              message: `You earned ${milestone.xp} XP for ${milestone.label} completion!`,
              xpAwarded: milestone.xp,
            });
          }
        }
      }
    }

    // Check for first course completion bonus (only at 100%)
    if (progressPercentage === 100) {
      const completedCount = await getCompletedCoursesCount(user.id);

      // Award first course bonus if this is their first completed course
      if (completedCount === 1) {
        const firstCourseId = `first-course-${user.id}`;
        const alreadyAwarded = await hasXPBeenAwarded(
          user.id,
          "achievement",
          firstCourseId
        );

        if (!alreadyAwarded) {
          const success = await insertXPTransaction(
            user.id,
            1000,
            "achievement",
            firstCourseId,
            `Completed your first course: "${courseTitle}"`,
            {
              course_id: courseId,
              achievement_type: "first_course_completion",
            }
          );

          if (success) {
            results.push({
              success: true,
              message: "You earned 1,000 XP for completing your first course!",
              xpAwarded: 1000,
            });
          }
        }
      }
    }

    if (results.length > 0) {
      revalidateUserPages();
    }

    return results;
  } catch (error) {
    const errorResult = handleActionError(error, "awardMilestoneXP");
    return [errorResult as XPResult];
  }
}
