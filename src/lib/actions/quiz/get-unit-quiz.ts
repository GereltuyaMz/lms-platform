"use server";

import { getAuthenticatedUser, getUserEnrollment } from "../helpers";
import type { BestScoreData, LatestAttemptData } from "./types";

/**
 * Get the best unit quiz score
 */
export async function getBestUnitQuizScore(unitId: string, courseId: string): Promise<BestScoreData | null> {
  try {
    const { user, supabase, error: authError } = await getAuthenticatedUser();
    if (authError || !user) return null;

    const { enrollment, error: enrollmentError } = await getUserEnrollment(user.id, courseId);
    if (enrollmentError || !enrollment) return null;

    const { data: attempts, error: attemptsError } = await supabase
      .from("quiz_attempts")
      .select("score, total_questions, points_earned")
      .eq("enrollment_id", enrollment.id)
      .eq("unit_id", unitId)
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
 * Get the latest unit quiz attempt
 */
export async function getLatestUnitQuizAttempt(unitId: string, courseId: string): Promise<LatestAttemptData | null> {
  try {
    const { user, supabase, error: authError } = await getAuthenticatedUser();
    if (authError || !user) return null;

    const { enrollment, error: enrollmentError } = await getUserEnrollment(user.id, courseId);
    if (enrollmentError || !enrollment) return null;

    const { data: attempt, error: attemptError } = await supabase
      .from("quiz_attempts")
      .select("score, total_questions, completed_at")
      .eq("enrollment_id", enrollment.id)
      .eq("unit_id", unitId)
      .order("completed_at", { ascending: false })
      .limit(1)
      .single();

    if (attemptError || !attempt) return null;
    return { score: attempt.score, totalQuestions: attempt.total_questions, completedAt: attempt.completed_at };
  } catch {
    return null;
  }
}
