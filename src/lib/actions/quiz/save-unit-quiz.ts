"use server";

import { revalidatePath } from "next/cache";
import {
  getAuthenticatedUser,
  getUserEnrollment,
  checkAndAwardMilestones,
  revalidateUserPages,
  handleActionError,
} from "../helpers";
import { updateUserStreak } from "../streak-actions";
import { checkAndAwardBadges } from "../badges";
import type { QuizAttemptResult, QuizAnswer } from "./types";

/**
 * Save a completed unit quiz attempt
 */
export async function saveUnitQuizAttempt(
  unitId: string,
  courseId: string,
  score: number,
  totalQuestions: number,
  pointsEarned: number,
  answers: QuizAnswer[]
): Promise<QuizAttemptResult> {
  try {
    const { user, supabase, error: authError } = await getAuthenticatedUser();
    if (authError || !user) {
      return {
        success: false,
        message: "You must be logged in to save quiz attempts",
      };
    }

    const { enrollment, error: enrollmentError } = await getUserEnrollment(
      user.id,
      courseId
    );
    if (enrollmentError || !enrollment) {
      return { success: false, message: "You must be enrolled in this course" };
    }

    const { data: attempt, error: attemptError } = await supabase
      .from("quiz_attempts")
      .insert({
        enrollment_id: enrollment.id,
        unit_id: unitId,
        lesson_id: null,
        score,
        total_questions: totalQuestions,
        points_earned: pointsEarned,
      })
      .select("id")
      .single();

    if (attemptError || !attempt) {
      return { success: false, message: "Error saving quiz attempt" };
    }

    if (answers.length > 0) {
      await supabase.from("quiz_answers").insert(
        answers.map((answer) => ({
          attempt_id: attempt.id,
          question_id: answer.questionId,
          selected_option_id: answer.selectedOptionId,
          is_correct: answer.isCorrect,
          points_earned: answer.pointsEarned,
        }))
      );
    }

    const quizPassed = score >= totalQuestions * 0.8;
    let milestoneResults: Array<{
      success: boolean;
      message: string;
      xpAwarded?: number;
    }> = [];
    let streakBonusAwarded: number | undefined;
    let streakBonusMessage: string | undefined;
    let currentStreak: number | undefined;
    let badgeXpAwarded: number | undefined;
    let badgeMessage: string | undefined;

    if (quizPassed) {
      const [milestones, streakResult, badgeResult, courseData] =
        await Promise.all([
          checkAndAwardMilestones(user.id, courseId),
          updateUserStreak(user.id),
          checkAndAwardBadges("quiz"),
          supabase.from("courses").select("slug").eq("id", courseId).single(),
        ]);
      milestoneResults = milestones;
      if (streakResult.success && streakResult.isNewStreakDay) {
        currentStreak = streakResult.currentStreak;
        streakBonusAwarded = streakResult.streakBonusAwarded;
        streakBonusMessage = streakResult.streakBonusMessage;
      }
      if (
        badgeResult.success &&
        badgeResult.badgesAwarded &&
        badgeResult.badgesAwarded.length > 0
      ) {
        badgeXpAwarded = badgeResult.badgesAwarded.reduce(
          (sum, b) => sum + b.xp_bonus,
          0
        );
        badgeMessage = badgeResult.message;
      }
      revalidateUserPages();
      if (courseData.data?.slug)
        revalidatePath(`/courses/${courseData.data.slug}`, "page");
    } else {
      revalidateUserPages();
    }

    return {
      success: true,
      message: "Unit quiz attempt saved successfully",
      attemptId: attempt.id,
      milestoneResults:
        milestoneResults.length > 0 ? milestoneResults : undefined,
      streakBonusAwarded,
      streakBonusMessage,
      currentStreak,
      badgeXpAwarded,
      badgeMessage,
    };
  } catch (error) {
    return handleActionError(error) as QuizAttemptResult;
  }
}
