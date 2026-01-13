"use server";

import { revalidatePath } from "next/cache";
import {
  getAuthenticatedUser,
  getUserEnrollment,
  upsertLessonProgress,
  checkAndAwardMilestones,
  revalidateUserPages,
  handleActionError,
} from "../helpers";
import { awardVideoCompletionXP } from "../xp-actions";
import { updateUserStreak } from "../streak-actions";
import { checkAndAwardBadges } from "../badges";
import { saveContentProgress } from "../lesson-content-progress";
import type { ProgressResult } from "./types";

/**
 * Save progress for individual lesson content (theory/example video)
 */
export async function saveIndividualContentProgress(
  contentId: string,
  lessonId: string,
  courseId: string,
  lastPosition: number,
  isCompleted: boolean = false
): Promise<ProgressResult> {
  try {
    const result = await saveContentProgress(
      contentId,
      lessonId,
      courseId,
      lastPosition,
      isCompleted
    );

    if (!result.success) {
      return { success: false, message: result.message };
    }

    return {
      success: true,
      message: result.message,
      videoXpAwarded: result.xpAwarded,
      milestoneResults: result.unitXpAwarded
        ? [
            {
              success: true,
              message: `You earned ${result.unitXpAwarded} XP for completing the unit!`,
              xpAwarded: result.unitXpAwarded,
            },
          ]
        : undefined,
    };
  } catch (error) {
    return handleActionError(error) as ProgressResult;
  }
}

/**
 * @deprecated Use saveIndividualContentProgress() for theory/example videos instead.
 * Save video progress for a lesson (legacy)
 */
export async function saveVideoProgress(
  lessonId: string,
  courseId: string,
  lastPosition: number,
  isCompleted: boolean = false,
  videoDuration?: number
): Promise<ProgressResult> {
  try {
    const { user, supabase, error: authError } = await getAuthenticatedUser();

    if (authError || !user) {
      return { success: false, message: "You must be logged in to save progress" };
    }

    const { enrollment, error: enrollmentError } = await getUserEnrollment(
      user.id,
      courseId
    );

    if (enrollmentError || !enrollment) {
      return { success: false, message: "You must be enrolled in this course" };
    }

    const { error: progressError } = await upsertLessonProgress(
      enrollment.id,
      lessonId,
      { lastPosition, isCompleted }
    );

    if (progressError) {
      return { success: false, message: "Error saving progress" };
    }

    let milestoneResults: ProgressResult["milestoneResults"] = [];
    let videoXpAwarded: number | undefined;
    let streakBonusAwarded: number | undefined;
    let streakBonusMessage: string | undefined;
    let currentStreak: number | undefined;

    if (isCompleted) {
      const [milestones, xpResult, streakResult, courseData] = await Promise.all([
        checkAndAwardMilestones(user.id, courseId),
        videoDuration && videoDuration > 0
          ? awardVideoCompletionXP(lessonId, courseId, videoDuration)
          : Promise.resolve({ success: false, xpAwarded: 0 }),
        updateUserStreak(user.id),
        supabase.from("courses").select("slug").eq("id", courseId).single(),
      ]);

      milestoneResults = milestones;
      if (xpResult.success && xpResult.xpAwarded) {
        videoXpAwarded = xpResult.xpAwarded;
      }
      if (streakResult.success && streakResult.isNewStreakDay) {
        currentStreak = streakResult.currentStreak;
        streakBonusAwarded = streakResult.streakBonusAwarded;
        streakBonusMessage = streakResult.streakBonusMessage;
      }

      checkAndAwardBadges("lesson").catch(() => {});
      revalidateUserPages();

      if (courseData.data?.slug) {
        revalidatePath(`/courses/${courseData.data.slug}/learn/lesson/${lessonId}`, "page");
        revalidatePath(`/courses/${courseData.data.slug}`, "page");
      }
    }

    return {
      success: true,
      message: "Progress saved successfully",
      milestoneResults: milestoneResults.length > 0 ? milestoneResults : undefined,
      streakBonusAwarded,
      streakBonusMessage,
      currentStreak,
      videoXpAwarded,
    };
  } catch (error) {
    return handleActionError(error) as ProgressResult;
  }
}
