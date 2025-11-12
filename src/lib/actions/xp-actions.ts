"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import {
  hasXPBeenAwarded,
  getEnrollmentId,
  isFirstLessonInCourse,
  isQuizRetry,
  getLessonTitle,
  calculateVideoXP,
  calculateQuizXP,
  insertXPTransaction,
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
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
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

    revalidatePath("/dashboard");

    return {
      success: true,
      message: `You earned ${amount} XP!`,
      xpAwarded: amount,
    };
  } catch (error) {
    console.error("Error in awardVideoCompletionXP:", error);
    return { success: false, message: "An unexpected error occurred" };
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
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
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

    revalidatePath("/dashboard");

    return {
      success: true,
      message: `You earned ${amount} XP!`,
      xpAwarded: amount,
    };
  } catch (error) {
    console.error("Error in awardQuizCompletionXP:", error);
    return { success: false, message: "An unexpected error occurred" };
  }
}

/**
 * Get user's total XP
 */
export async function getUserTotalXP(): Promise<number> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return 0;

    const { data } = await supabase
      .from("user_profiles")
      .select("total_xp")
      .eq("id", user.id)
      .single();

    return data?.total_xp || 0;
  } catch (error) {
    console.error("Error getting user total XP:", error);
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
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return [];

    const { data } = await supabase
      .from("xp_transactions")
      .select("id, amount, source_type, description, created_at, metadata")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(limit);

    return data || [];
  } catch (error) {
    console.error("Error fetching XP transactions:", error);
    return [];
  }
}
