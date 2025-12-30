import { createClient } from "@/lib/supabase/server";
import type { Badge } from "@/types/database/tables";

/**
 * Badge condition checking logic - Pure functions for badge requirements
 */

type BadgeProgress = {
  currentValue: number;
  requirementValue: number;
  isUnlocked: boolean;
};

/**
 * Check course completion count for user
 */
export async function getCourseCompletionCount(
  userId: string
): Promise<number> {
  const supabase = await createClient();

  const { count } = await supabase
    .from("enrollments")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("progress_percentage", 100);

  return count || 0;
}

/**
 * Check lesson completion count for user
 */
export async function getLessonCompletionCount(
  userId: string
): Promise<number> {
  const supabase = await createClient();

  const { count } = await supabase
    .from("lesson_progress")
    .select("enrollment:enrollment_id(user_id)", { count: "exact", head: true })
    .eq("is_completed", true)
    .eq("enrollment.user_id", userId);

  return count || 0;
}

/**
 * Check perfect quiz count for user
 */
export async function getPerfectQuizCount(userId: string): Promise<number> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("quiz_attempts")
    .select("score, total_questions, enrollment:enrollment_id(user_id)")
    .eq("enrollment.user_id", userId);

  if (!data) return 0;

  return data.filter((attempt) => attempt.score === attempt.total_questions)
    .length;
}

/**
 * Check total quiz count for user
 */
export async function getTotalQuizCount(userId: string): Promise<number> {
  const supabase = await createClient();

  const { count } = await supabase
    .from("quiz_attempts")
    .select("enrollment:enrollment_id(user_id)", { count: "exact", head: true })
    .eq("enrollment.user_id", userId);

  return count || 0;
}

/**
 * Check current streak days for user
 */
export async function getCurrentStreak(userId: string): Promise<number> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("user_profiles")
    .select("current_streak")
    .eq("id", userId)
    .single();

  return data?.current_streak || 0;
}

/**
 * Check best streak for user
 */
export async function getBestStreak(userId: string): Promise<number> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("user_profiles")
    .select("best_streak")
    .eq("id", userId)
    .single();

  return data?.best_streak || 0;
}

/**
 * Check total XP for user
 */
export async function getTotalXP(userId: string): Promise<number> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("user_profiles")
    .select("total_xp")
    .eq("id", userId)
    .single();

  return data?.total_xp || 0;
}

/**
 * Check badge unlock count for user
 */
export async function getUnlockedBadgeCount(userId: string): Promise<number> {
  const supabase = await createClient();

  const { count } = await supabase
    .from("user_badges")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .not("unlocked_at", "is", null);

  return count || 0;
}

/**
 * Get category-specific course completion count
 */
export async function getCategoryCompletionCount(
  userId: string,
  categorySlug: string
): Promise<number> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("enrollments")
    .select(
      `
      progress_percentage,
      course:course_id(
        course_categories(
          category:category_id(slug)
        )
      )
    `
    )
    .eq("user_id", userId)
    .eq("progress_percentage", 100);

  if (!data) return 0;

  return data.filter((enrollment) => {
    const course = enrollment.course as {
      course_categories?: Array<{ category?: { slug?: string } }>;
    } | null;
    const categories = course?.course_categories;
    return categories?.some((cc) => cc.category?.slug === categorySlug);
  }).length;
}

/**
 * Calculate badge progress for a specific badge based on current user stats
 */
export async function calculateBadgeProgress(
  userId: string,
  badge: Badge
): Promise<BadgeProgress> {
  let currentValue = 0;

  switch (badge.requirement_type) {
    case "course_count":
      currentValue = await getCourseCompletionCount(userId);
      break;
    case "lesson_count":
      currentValue = await getLessonCompletionCount(userId);
      break;
    case "quiz_perfect":
      currentValue = await getPerfectQuizCount(userId);
      break;
    case "quiz_count":
      currentValue = await getTotalQuizCount(userId);
      break;
    case "streak_days":
      currentValue = await getCurrentStreak(userId);
      break;
    case "streak_best":
      currentValue = await getBestStreak(userId);
      break;
    case "total_xp":
      currentValue = await getTotalXP(userId);
      break;
    case "badge_count":
      currentValue = await getUnlockedBadgeCount(userId);
      break;
    case "category_math":
      currentValue = await getCategoryCompletionCount(userId, "matematikiin");
      break;
    case "category_physics":
      currentValue = await getCategoryCompletionCount(userId, "fizik");
      break;
    case "category_chemistry":
      currentValue = await getCategoryCompletionCount(userId, "khimi");
      break;
    default:
      currentValue = 0;
  }

  return {
    currentValue,
    requirementValue: badge.requirement_value,
    isUnlocked: currentValue >= badge.requirement_value,
  };
}

/**
 * Check if user meets badge requirements
 */
export async function checkBadgeRequirement(
  userId: string,
  badge: Badge
): Promise<boolean> {
  const progress = await calculateBadgeProgress(userId, badge);
  return progress.isUnlocked;
}

/**
 * Get all badges that user has newly qualified for (not yet awarded)
 */
export async function getNewlyQualifiedBadges(
  userId: string
): Promise<Badge[]> {
  const supabase = await createClient();

  // Get all badges
  const { data: allBadges } = await supabase.from("badges").select("*");

  if (!allBadges) return [];

  // Get user's current badge status
  const { data: userBadges } = await supabase
    .from("user_badges")
    .select("badge_id, unlocked_at")
    .eq("user_id", userId);

  const unlockedBadgeIds = new Set(
    userBadges?.filter((ub) => ub.unlocked_at).map((ub) => ub.badge_id) || []
  );

  // Check each badge that's not yet unlocked
  const newlyQualified: Badge[] = [];

  for (const badge of allBadges) {
    if (!unlockedBadgeIds.has(badge.id)) {
      const meetsRequirement = await checkBadgeRequirement(userId, badge);
      if (meetsRequirement) {
        newlyQualified.push(badge);
      }
    }
  }

  return newlyQualified;
}
