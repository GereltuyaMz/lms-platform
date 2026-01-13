"use server";

import { getAuthenticatedUser, getUserEnrollment, upsertLessonProgress } from "../helpers";
import { isLessonContentComplete } from "../lesson-content-progress";
import { checkAndAwardUnitCompletion } from "../xp-helpers";
import { createClient } from "@/lib/supabase/server";
import type { LessonCompletionResult, LessonCompletionStatus, LessonRequirements } from "./types";

/**
 * Check if a lesson quiz has been passed (≥80% score)
 */
export async function isLessonQuizPassed(enrollmentId: string, lessonId: string): Promise<boolean> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("quiz_attempts")
      .select("passed")
      .eq("enrollment_id", enrollmentId)
      .eq("lesson_id", lessonId)
      .eq("passed", true)
      .limit(1);

    return !error && data && data.length > 0;
  } catch {
    return false;
  }
}

/**
 * Check if lesson requirements are met for authenticated user
 */
export async function checkLessonRequirements(lessonId: string, courseId: string): Promise<LessonRequirements> {
  const defaultResult = { contentComplete: false, quizPassed: false, canComplete: false };

  try {
    const { user, error: authError } = await getAuthenticatedUser();
    if (authError || !user) return defaultResult;

    const { enrollment, error: enrollmentError } = await getUserEnrollment(user.id, courseId);
    if (enrollmentError || !enrollment) return defaultResult;

    const contentComplete = await isLessonContentComplete(lessonId, courseId);
    const quizPassed = await isLessonQuizPassed(enrollment.id, lessonId);

    return { contentComplete, quizPassed, canComplete: contentComplete && quizPassed };
  } catch {
    return defaultResult;
  }
}

/**
 * Mark lesson as complete if all requirements are met
 */
export async function markLessonCompleteIfReady(
  lessonId: string,
  courseId: string
): Promise<LessonCompletionResult> {
  try {
    const { user, error: authError } = await getAuthenticatedUser();
    if (authError || !user) {
      return { success: false, message: "Not authenticated", lessonComplete: false };
    }

    const { enrollment, error: enrollmentError } = await getUserEnrollment(user.id, courseId);
    if (enrollmentError || !enrollment) {
      return { success: false, message: "Not enrolled", lessonComplete: false };
    }

    const contentComplete = await isLessonContentComplete(lessonId, courseId);
    if (!contentComplete) {
      return { success: false, message: "Content not complete", lessonComplete: false, missingRequirement: "content" };
    }

    const quizPassed = await isLessonQuizPassed(enrollment.id, lessonId);
    if (!quizPassed) {
      return { success: false, message: "Quiz not passed", lessonComplete: false, missingRequirement: "quiz" };
    }

    const result = await checkAndCompleteLessonIfReady(enrollment.id, lessonId, courseId);
    return {
      success: result.lessonComplete,
      message: result.lessonComplete ? "Lesson completed" : "Failed to complete",
      lessonComplete: result.lessonComplete,
    };
  } catch {
    return { success: false, message: "An error occurred", lessonComplete: false };
  }
}

/**
 * Check requirements and complete lesson if ready
 * Requirements: All theory/example videos + quiz passed
 */
export async function checkAndCompleteLessonIfReady(
  enrollmentId: string,
  lessonId: string,
  courseId: string,
  userId?: string
): Promise<LessonCompletionStatus> {
  try {
    const contentComplete = await isLessonContentComplete(lessonId, courseId);
    const quizPassed = await isLessonQuizPassed(enrollmentId, lessonId);
    const shouldComplete = contentComplete && quizPassed;

    let unitXpAwarded: number | undefined;

    if (shouldComplete) {
      const supabase = await createClient();
      const { data: existing } = await supabase
        .from("lesson_progress")
        .select("is_completed")
        .eq("enrollment_id", enrollmentId)
        .eq("lesson_id", lessonId)
        .single();

      if (!existing?.is_completed) {
        await upsertLessonProgress(enrollmentId, lessonId, { isCompleted: true });
      }

      if (userId) {
        const unitResult = await checkAndAwardUnitCompletion(userId, lessonId, enrollmentId);
        if (unitResult.awarded) unitXpAwarded = unitResult.xp;
      }
    }

    return { contentComplete, quizPassed, lessonComplete: shouldComplete, unitXpAwarded };
  } catch {
    return { contentComplete: false, quizPassed: false, lessonComplete: false };
  }
}
