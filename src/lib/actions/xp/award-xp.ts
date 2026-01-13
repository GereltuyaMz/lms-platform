"use server";

import {
  getAuthenticatedUser,
  revalidateUserPages,
  handleActionError,
} from "../helpers";
import {
  hasXPBeenAwarded,
  getEnrollmentId,
  isFirstLessonInCourse,
  isQuizRetry,
  isUnitQuizRetry,
  getLessonTitle,
  getUnitTitle,
  calculateVideoXP,
  calculateLessonQuizXP,
  insertXPTransaction,
} from "../xp-helpers";
import type { XPResult } from "./types";

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

    if (await hasXPBeenAwarded(user.id, "lesson_complete", lessonId)) {
      return { success: false, message: "XP already awarded for this lesson", xpAwarded: 0 };
    }

    const enrollmentId = await getEnrollmentId(user.id, courseId);
    if (!enrollmentId) {
      return { success: false, message: "Enrollment not found" };
    }

    const isFirst = await isFirstLessonInCourse(enrollmentId);
    const { amount, metadata } = await calculateVideoXP(durationSeconds, isFirst);
    const lessonTitle = await getLessonTitle(lessonId);

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

    return { success: true, message: `You earned ${amount} XP!`, xpAwarded: amount };
  } catch (error) {
    return handleActionError(error) as XPResult;
  }
}

/**
 * Award XP for quiz completion
 */
export async function awardQuizCompletionXP(
  quizAttemptId: string,
  lessonId: string,
  courseId: string,
  scoreCorrect: number,
  totalQuestions: number
): Promise<XPResult> {
  try {
    const { user, error: authError } = await getAuthenticatedUser();

    if (authError || !user) {
      return { success: false, message: "You must be logged in" };
    }

    if (await hasXPBeenAwarded(user.id, "quiz_complete", quizAttemptId)) {
      return { success: false, message: "XP already awarded for this attempt", xpAwarded: 0 };
    }

    const isRetry = await isQuizRetry(user.id, lessonId, quizAttemptId);
    const { amount, metadata } = await calculateLessonQuizXP(scoreCorrect, totalQuestions, isRetry);

    if (amount === 0) {
      return { success: false, message: "No XP for retry attempts", xpAwarded: 0 };
    }

    const lessonTitle = await getLessonTitle(lessonId);
    const scorePercentage = totalQuestions > 0 ? (scoreCorrect / totalQuestions) * 100 : 0;

    const success = await insertXPTransaction(
      user.id,
      amount,
      "quiz_complete",
      quizAttemptId,
      `Completed quiz "${lessonTitle}" with ${Math.round(scorePercentage)}%`,
      { ...metadata, lesson_id: lessonId, course_id: courseId }
    );

    if (!success) {
      return { success: false, message: "Error awarding XP" };
    }

    revalidateUserPages();

    return { success: true, message: `You earned ${amount} XP!`, xpAwarded: amount };
  } catch (error) {
    return handleActionError(error) as XPResult;
  }
}

/**
 * Award XP for unit quiz completion
 */
export async function awardUnitQuizCompletionXP(
  quizAttemptId: string,
  unitId: string,
  courseId: string,
  scoreCorrect: number,
  totalQuestions: number
): Promise<XPResult> {
  try {
    const { user, error: authError } = await getAuthenticatedUser();

    if (authError || !user) {
      return { success: false, message: "You must be logged in" };
    }

    if (await hasXPBeenAwarded(user.id, "unit_quiz_complete", quizAttemptId)) {
      return { success: false, message: "XP already awarded for this attempt", xpAwarded: 0 };
    }

    const isRetry = await isUnitQuizRetry(user.id, unitId, quizAttemptId);
    const { amount, metadata } = await calculateLessonQuizXP(scoreCorrect, totalQuestions, isRetry);

    if (amount === 0) {
      return { success: false, message: "No XP for retry attempts", xpAwarded: 0 };
    }

    const unitTitle = await getUnitTitle(unitId);
    const scorePercentage = totalQuestions > 0 ? (scoreCorrect / totalQuestions) * 100 : 0;

    const success = await insertXPTransaction(
      user.id,
      amount,
      "unit_quiz_complete",
      quizAttemptId,
      `Completed unit quiz "${unitTitle}" with ${Math.round(scorePercentage)}%`,
      { ...metadata, unit_id: unitId, course_id: courseId }
    );

    if (!success) {
      return { success: false, message: "Error awarding XP" };
    }

    revalidateUserPages();

    return { success: true, message: `You earned ${amount} XP!`, xpAwarded: amount };
  } catch (error) {
    return handleActionError(error) as XPResult;
  }
}
