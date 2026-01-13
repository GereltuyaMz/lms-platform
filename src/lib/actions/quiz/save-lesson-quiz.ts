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
import { checkAndCompleteLessonIfReady } from "../lesson-progress";
import type { QuizAttemptResult, QuizAnswer } from "./types";

/**
 * Save a completed lesson quiz attempt
 */
export async function saveQuizAttempt(
  lessonId: string,
  courseId: string,
  score: number,
  totalQuestions: number,
  pointsEarned: number,
  answers: QuizAnswer[]
): Promise<QuizAttemptResult> {
  try {
    const { user, supabase, error: authError } = await getAuthenticatedUser();
    if (authError || !user) {
      return { success: false, message: "You must be logged in to save quiz attempts" };
    }

    const { enrollment, error: enrollmentError } = await getUserEnrollment(user.id, courseId);
    if (enrollmentError || !enrollment) {
      return { success: false, message: "You must be enrolled in this course" };
    }

    const { data: attempt, error: attemptError } = await supabase
      .from("quiz_attempts")
      .insert({ enrollment_id: enrollment.id, lesson_id: lessonId, score, total_questions: totalQuestions, points_earned: pointsEarned })
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
    let milestoneResults: Array<{ success: boolean; message: string; xpAwarded?: number }> = [];
    let streakBonusAwarded: number | undefined;
    let streakBonusMessage: string | undefined;
    let currentStreak: number | undefined;
    let lessonComplete = false;
    let requiresContentCompletion = false;
    let unitXpAwarded: number | undefined;

    if (quizPassed) {
      const completionStatus = await checkAndCompleteLessonIfReady(enrollment.id, lessonId, courseId, user.id);
      lessonComplete = completionStatus.lessonComplete;
      requiresContentCompletion = !completionStatus.contentComplete;
      unitXpAwarded = completionStatus.unitXpAwarded;

      if (lessonComplete) {
        const [milestones, streakResult, courseData] = await Promise.all([
          checkAndAwardMilestones(user.id, courseId),
          updateUserStreak(user.id),
          supabase.from("courses").select("slug").eq("id", courseId).single(),
        ]);
        milestoneResults = milestones;
        if (streakResult.success && streakResult.isNewStreakDay) {
          currentStreak = streakResult.currentStreak;
          streakBonusAwarded = streakResult.streakBonusAwarded;
          streakBonusMessage = streakResult.streakBonusMessage;
        }
        checkAndAwardBadges("quiz").catch(() => {});
        revalidateUserPages();
        if (courseData.data?.slug) {
          revalidatePath(`/courses/${courseData.data.slug}/learn/lesson/${lessonId}`, "page");
          revalidatePath(`/courses/${courseData.data.slug}`, "page");
        }
      } else {
        const { data: courseData } = await supabase.from("courses").select("slug").eq("id", courseId).single();
        revalidateUserPages();
        if (courseData?.slug) {
          revalidatePath(`/courses/${courseData.slug}/learn/lesson/${lessonId}`, "page");
          revalidatePath(`/courses/${courseData.slug}`, "page");
        }
      }
    } else {
      const { data: course } = await supabase.from("courses").select("slug").eq("id", courseId).single();
      revalidateUserPages();
      if (course?.slug) {
        revalidatePath(`/courses/${course.slug}/learn/lesson/${lessonId}`, "page");
        revalidatePath(`/courses/${course.slug}`, "page");
      }
    }

    return {
      success: true,
      message: "Quiz attempt saved successfully",
      attemptId: attempt.id,
      lessonComplete,
      requiresContentCompletion: quizPassed ? requiresContentCompletion : undefined,
      milestoneResults: milestoneResults.length > 0 ? milestoneResults : undefined,
      streakBonusAwarded,
      streakBonusMessage,
      currentStreak,
      unitXpAwarded,
    };
  } catch (error) {
    return handleActionError(error) as QuizAttemptResult;
  }
}
