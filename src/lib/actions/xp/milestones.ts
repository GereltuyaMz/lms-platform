"use server";

import {
  getAuthenticatedUser,
  revalidateUserPages,
  handleActionError,
} from "../helpers";
import {
  hasXPBeenAwarded,
  insertXPTransaction,
  getCourseTitle,
  getCompletedCoursesCount,
} from "../xp-helpers";
import type { XPResult } from "./types";

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
      return [{ success: false, message: "Нэвтрэх шаардлагатай" }];
    }

    const results: XPResult[] = [];

    const milestones = [
      { threshold: 25, xp: 30, label: "25%" },
      { threshold: 50, xp: 50, label: "50%" },
      { threshold: 75, xp: 70, label: "75%" },
      { threshold: 100, xp: 100, label: "100%" },
    ];

    const courseTitle = await getCourseTitle(courseId);

    for (const milestone of milestones) {
      if (progressPercentage >= milestone.threshold) {
        const milestoneId = `${enrollmentId}-${milestone.threshold}`;
        const alreadyAwarded = await hasXPBeenAwarded(user.id, "milestone", milestoneId);

        if (!alreadyAwarded) {
          const success = await insertXPTransaction(
            user.id,
            milestone.xp,
            "milestone",
            milestoneId,
            `"${courseTitle}" хичээлийн ${milestone.label}-г дууслаа`,
            { course_id: courseId, enrollment_id: enrollmentId, milestone_percentage: milestone.threshold }
          );

          if (success) {
            results.push({
              success: true,
              message: `${milestone.label} дууссанаар ${milestone.xp} XP авлаа!`,
              xpAwarded: milestone.xp,
            });
          }
        }
      }
    }

    // Check for course completion achievements at 100%
    if (progressPercentage === 100) {
      const achievementResults = await awardCourseCompletionAchievements(
        user.id,
        courseId,
        courseTitle
      );
      results.push(...achievementResults);
    }

    if (results.length > 0) {
      revalidateUserPages();
    }

    return results;
  } catch (error) {
    const errorResult = handleActionError(error);
    return [errorResult as XPResult];
  }
}

/**
 * Award achievements for course completion milestones
 */
async function awardCourseCompletionAchievements(
  userId: string,
  courseId: string,
  courseTitle: string
): Promise<XPResult[]> {
  const results: XPResult[] = [];
  const completedCount = await getCompletedCoursesCount(userId);

  // First course completion bonus
  if (completedCount === 1) {
    const firstCourseId = `first-course-${userId}`;
    const alreadyAwarded = await hasXPBeenAwarded(userId, "achievement", firstCourseId);

    if (!alreadyAwarded) {
      const success = await insertXPTransaction(
        userId,
        150,
        "achievement",
        firstCourseId,
        `Анхны хичээлээ дууслаа: "${courseTitle}"`,
        { course_id: courseId, achievement_type: "first_course_completion" }
      );

      if (success) {
        results.push({
          success: true,
          message: "Анхны хичээлээ дуусгасанд 150 XP авлаа!",
          xpAwarded: 150,
        });
      }
    }
  }

  // 3 courses milestone
  if (completedCount === 3) {
    const threeCoursesId = `three-courses-${userId}`;
    const alreadyAwarded = await hasXPBeenAwarded(userId, "achievement", threeCoursesId);

    if (!alreadyAwarded) {
      const success = await insertXPTransaction(
        userId,
        300,
        "achievement",
        threeCoursesId,
        "3 хичээл дууссан - Профайл цол авлаа!",
        { achievement_type: "three_courses_milestone" }
      );

      if (success) {
        results.push({
          success: true,
          message: "3 хичээл дуусгасанд 300 XP авлаа!",
          xpAwarded: 300,
        });
      }
    }
  }

  // 5 courses milestone
  if (completedCount === 5) {
    const fiveCoursesId = `five-courses-${userId}`;
    const alreadyAwarded = await hasXPBeenAwarded(userId, "achievement", fiveCoursesId);

    if (!alreadyAwarded) {
      const success = await insertXPTransaction(
        userId,
        400,
        "achievement",
        fiveCoursesId,
        "5 хичээл дууссан - Профайл хүрээ авлаа!",
        { achievement_type: "five_courses_milestone" }
      );

      if (success) {
        results.push({
          success: true,
          message: "5 хичээл дуусгасанд 400 XP авлаа!",
          xpAwarded: 400,
        });
      }
    }
  }

  // Course badge award
  const courseBadgeId = `course-badge-${courseId}`;
  const badgeAwarded = await hasXPBeenAwarded(userId, "achievement", courseBadgeId);

  if (!badgeAwarded) {
    const success = await insertXPTransaction(
      userId,
      150,
      "achievement",
      courseBadgeId,
      `"${courseTitle}" хичээлийн бэйж авлаа`,
      { course_id: courseId, achievement_type: "course_badge" }
    );

    if (success) {
      results.push({
        success: true,
        message: "Хичээлийн бэйж авсанд 150 XP авлаа!",
        xpAwarded: 150,
      });
    }
  }

  return results;
}
