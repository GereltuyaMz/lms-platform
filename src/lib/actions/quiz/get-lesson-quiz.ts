"use server";

import { getAuthenticatedUser, getUserEnrollment } from "../helpers";
import type { BestScoreData, LatestAttemptData } from "./types";

/**
 * Get the best quiz score for a lesson
 */
export async function getBestQuizScore(lessonId: string, courseId: string): Promise<BestScoreData | null> {
  try {
    const { user, supabase, error: authError } = await getAuthenticatedUser();
    if (authError || !user) return null;

    const { enrollment, error: enrollmentError } = await getUserEnrollment(user.id, courseId);
    if (enrollmentError || !enrollment) return null;

    const { data: attempts, error: attemptsError } = await supabase
      .from("quiz_attempts")
      .select("score, total_questions, points_earned")
      .eq("enrollment_id", enrollment.id)
      .eq("lesson_id", lessonId)
      .order("score", { ascending: false })
      .order("points_earned", { ascending: false });

    if (attemptsError || !attempts || attempts.length === 0) return null;

    const bestAttempt = attempts[0];
    return {
      bestScore: bestAttempt.score,
      totalQuestions: bestAttempt.total_questions,
      bestPercentage: Math.round((bestAttempt.score / bestAttempt.total_questions) * 100),
      attempts: attempts.length,
    };
  } catch {
    return null;
  }
}

/**
 * Get all quiz attempts for a lesson
 */
export async function getQuizAttempts(lessonId: string, courseId: string) {
  try {
    const { user, supabase, error: authError } = await getAuthenticatedUser();
    if (authError || !user) return { data: null, error: authError };

    const { enrollment, error: enrollmentError } = await getUserEnrollment(user.id, courseId);
    if (enrollmentError || !enrollment) return { data: null, error: enrollmentError };

    const { data: attempts, error: attemptsError } = await supabase
      .from("quiz_attempts")
      .select("id, score, total_questions, points_earned, completed_at")
      .eq("enrollment_id", enrollment.id)
      .eq("lesson_id", lessonId)
      .order("completed_at", { ascending: false });

    if (attemptsError) return { data: null, error: "Error fetching attempts" };
    return { data: attempts, error: null };
  } catch {
    return { data: null, error: "An unexpected error occurred" };
  }
}

/**
 * Get the latest quiz attempt for a lesson
 */
export async function getLatestQuizAttempt(lessonId: string, courseId: string): Promise<LatestAttemptData | null> {
  try {
    const { user, supabase, error: authError } = await getAuthenticatedUser();
    if (authError || !user) return null;

    const { enrollment, error: enrollmentError } = await getUserEnrollment(user.id, courseId);
    if (enrollmentError || !enrollment) return null;

    const { data: attempt, error: attemptError } = await supabase
      .from("quiz_attempts")
      .select("score, total_questions, completed_at")
      .eq("enrollment_id", enrollment.id)
      .eq("lesson_id", lessonId)
      .order("completed_at", { ascending: false })
      .limit(1)
      .single();

    if (attemptError || !attempt) return null;
    return { score: attempt.score, totalQuestions: attempt.total_questions, completedAt: attempt.completed_at };
  } catch {
    return null;
  }
}
