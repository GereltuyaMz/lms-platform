"use server";

import { createClient } from "@/lib/supabase/server";
import {
  getAuthenticatedUser,
  revalidateUserPages,
  handleActionError,
} from "./helpers";
import {
  calculateBadgeProgress,
  getNewlyQualifiedBadges,
} from "../helpers/badge-checker";
import type { Badge } from "@/types/database/tables";

type BadgeResult = {
  success: boolean;
  message: string;
  badgesAwarded?: Badge[];
};

export type BadgeWithProgress = Badge & {
  progress_current: number;
  progress_target: number;
  progress_percentage: number;
  unlocked_at: string | null;
  is_unlocked: boolean;
};

export type BadgeStats = {
  total_badges: number;
  unlocked_badges: number;
  bronze_unlocked: number;
  silver_unlocked: number;
  gold_unlocked: number;
  platinum_unlocked: number;
};

/**
 * Get all badges with user's progress
 */
export async function getUserBadgeProgress(): Promise<BadgeWithProgress[]> {
  try {
    const { user, error: authError } = await getAuthenticatedUser();

    if (authError || !user) {
      return [];
    }

    const supabase = await createClient();

    // Get all badges
    const { data: badges } = await supabase
      .from("badges")
      .select("*")
      .order("requirement_value", { ascending: true });

    if (!badges) return [];

    // Get user's badge progress
    const { data: userBadges } = await supabase
      .from("user_badges")
      .select("*")
      .eq("user_id", user.id);

    const userBadgeMap = new Map(
      userBadges?.map((ub) => [ub.badge_id, ub]) || []
    );

    // Merge badge definitions with user progress
    const badgesWithProgress: BadgeWithProgress[] = await Promise.all(
      badges.map(async (badge) => {
        const userBadge = userBadgeMap.get(badge.id);

        // If no user_badge record, calculate current progress
        let progressCurrent = userBadge?.progress_current || 0;
        let progressTarget = userBadge?.progress_target || badge.requirement_value;

        if (!userBadge) {
          const progress = await calculateBadgeProgress(user.id, badge);
          progressCurrent = progress.currentValue;
          progressTarget = progress.requirementValue;
        }

        const progressPercentage = Math.min(
          (progressCurrent / progressTarget) * 100,
          100
        );

        return {
          ...badge,
          progress_current: progressCurrent,
          progress_target: progressTarget,
          progress_percentage: Math.round(progressPercentage),
          unlocked_at: userBadge?.unlocked_at || null,
          is_unlocked: !!userBadge?.unlocked_at,
        };
      })
    );

    // Sort badges: unlocked first (by unlock date desc), then locked (by progress desc)
    return badgesWithProgress.sort((a, b) => {
      // Unlocked badges come first
      if (a.is_unlocked && !b.is_unlocked) return -1;
      if (!a.is_unlocked && b.is_unlocked) return 1;

      // Both unlocked: sort by unlock date (most recent first)
      if (a.is_unlocked && b.is_unlocked) {
        const dateA = a.unlocked_at ? new Date(a.unlocked_at).getTime() : 0;
        const dateB = b.unlocked_at ? new Date(b.unlocked_at).getTime() : 0;
        return dateB - dateA;
      }

      // Both locked: sort by progress percentage (highest first)
      return b.progress_percentage - a.progress_percentage;
    });
  } catch (error) {
    console.error("Error fetching user badge progress:", error);
    return [];
  }
}

/**
 * Get badge statistics for user
 */
export async function getUserBadgeStats(): Promise<BadgeStats> {
  try {
    const { user, error: authError } = await getAuthenticatedUser();

    if (authError || !user) {
      return {
        total_badges: 0,
        unlocked_badges: 0,
        bronze_unlocked: 0,
        silver_unlocked: 0,
        gold_unlocked: 0,
        platinum_unlocked: 0,
      };
    }

    const supabase = await createClient();

    // Get total badge count
    const { count: totalBadges } = await supabase
      .from("badges")
      .select("*", { count: "exact", head: true });

    // Get unlocked badges with rarity info
    const { data: unlockedBadges } = await supabase
      .from("user_badges")
      .select(`
        unlocked_at,
        badge:badge_id(rarity)
      `)
      .eq("user_id", user.id)
      .not("unlocked_at", "is", null);

    const rarityCounts = {
      bronze: 0,
      silver: 0,
      gold: 0,
      platinum: 0,
    };

    unlockedBadges?.forEach((ub) => {
      const badge = ub.badge as Badge | Badge[] | null;
      const rarity = (Array.isArray(badge) ? badge[0]?.rarity : badge?.rarity) as string | undefined;
      if (rarity && rarity in rarityCounts) {
        rarityCounts[rarity as keyof typeof rarityCounts]++;
      }
    });

    return {
      total_badges: totalBadges || 0,
      unlocked_badges: unlockedBadges?.length || 0,
      bronze_unlocked: rarityCounts.bronze,
      silver_unlocked: rarityCounts.silver,
      gold_unlocked: rarityCounts.gold,
      platinum_unlocked: rarityCounts.platinum,
    };
  } catch (error) {
    console.error("Error fetching badge stats:", error);
    return {
      total_badges: 0,
      unlocked_badges: 0,
      bronze_unlocked: 0,
      silver_unlocked: 0,
      gold_unlocked: 0,
      platinum_unlocked: 0,
    };
  }
}

/**
 * Check and award badges that user has newly qualified for
 * This function is called after lesson completion, quiz completion, etc.
 */
export async function checkAndAwardBadges(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _triggerType: "lesson" | "quiz" | "course" | "streak" | "xp"
): Promise<BadgeResult> {
  try {
    const { user, error: authError } = await getAuthenticatedUser();

    if (authError || !user) {
      return { success: false, message: "You must be logged in" };
    }

    const supabase = await createClient();

    // Get all badges that user newly qualifies for
    const newlyQualified = await getNewlyQualifiedBadges(user.id);

    if (newlyQualified.length === 0) {
      return {
        success: true,
        message: "No new badges to award",
        badgesAwarded: [],
      };
    }

    const awardedBadges: Badge[] = [];

    // Award each qualified badge
    for (const badge of newlyQualified) {
      // Call database function to award badge
      const { data, error } = await supabase.rpc("check_and_award_badge", {
        p_user_id: user.id,
        p_badge_name: badge.name,
        p_current_value: badge.requirement_value,
      });

      if (!error && data === true) {
        awardedBadges.push(badge);
      }
    }

    if (awardedBadges.length > 0) {
      revalidateUserPages();

      const totalXP = awardedBadges.reduce((sum, badge) => sum + badge.xp_bonus, 0);

      return {
        success: true,
        message: `Баяр хүргэе! ${awardedBadges.length} шинэ медаль олж авлаа! +${totalXP} XP`,
        badgesAwarded: awardedBadges,
      };
    }

    return {
      success: true,
      message: "No badges awarded",
      badgesAwarded: [],
    };
  } catch (error) {
    return handleActionError(error) as BadgeResult;
  }
}

/**
 * Initialize user badge tracking for a new user
 * Creates user_badge records with 0 progress for all badges
 */
export async function initializeUserBadges(userId: string): Promise<boolean> {
  try {
    const supabase = await createClient();

    // Get all badges
    const { data: badges } = await supabase.from("badges").select("*");

    if (!badges) return false;

    // Insert user_badge records for each badge
    const userBadges = badges.map((badge) => ({
      user_id: userId,
      badge_id: badge.id,
      progress_current: 0,
      progress_target: badge.requirement_value,
    }));

    const { error } = await supabase.from("user_badges").insert(userBadges);

    return !error;
  } catch (error) {
    console.error("Error initializing user badges:", error);
    return false;
  }
}

/**
 * Update badge progress for a specific badge
 * Called by triggers or manually to update progress
 */
export async function updateBadgeProgress(
  badgeName: string,
  currentValue: number
): Promise<boolean> {
  try {
    const { user, error: authError } = await getAuthenticatedUser();

    if (authError || !user) {
      return false;
    }

    const supabase = await createClient();

    // Call database function
    const { data, error } = await supabase.rpc("check_and_award_badge", {
      p_user_id: user.id,
      p_badge_name: badgeName,
      p_current_value: currentValue,
    });

    if (error) {
      console.error("Error updating badge progress:", error);
      return false;
    }

    // If badge was newly unlocked, revalidate pages
    if (data === true) {
      revalidateUserPages();
    }

    return true;
  } catch (error) {
    console.error("Error updating badge progress:", error);
    return false;
  }
}

/**
 * Get recently unlocked badges for user (last 10)
 */
export async function getRecentlyUnlockedBadges(): Promise<BadgeWithProgress[]> {
  try {
    const { user, error: authError } = await getAuthenticatedUser();

    if (authError || !user) {
      return [];
    }

    const supabase = await createClient();

    const { data } = await supabase
      .from("user_badges")
      .select(`
        *,
        badge:badge_id(*)
      `)
      .eq("user_id", user.id)
      .not("unlocked_at", "is", null)
      .order("unlocked_at", { ascending: false })
      .limit(10);

    if (!data) return [];

    return data.map((ub) => {
      const badge = (Array.isArray(ub.badge) ? ub.badge[0] : ub.badge) as Badge;
      return {
        ...badge,
        progress_current: ub.progress_current,
        progress_target: ub.progress_target,
        progress_percentage: 100,
        unlocked_at: ub.unlocked_at,
        is_unlocked: true,
      };
    });
  } catch (error) {
    console.error("Error fetching recently unlocked badges:", error);
    return [];
  }
}

/**
 * Get badges by category
 */
export async function getBadgesByCategory(
  category: string
): Promise<BadgeWithProgress[]> {
  try {
    const allBadges = await getUserBadgeProgress();
    return allBadges.filter((badge) => badge.category === category);
  } catch (error) {
    console.error("Error fetching badges by category:", error);
    return [];
  }
}

/**
 * Get badges by rarity
 */
export async function getBadgesByRarity(
  rarity: "bronze" | "silver" | "gold" | "platinum"
): Promise<BadgeWithProgress[]> {
  try {
    const allBadges = await getUserBadgeProgress();
    return allBadges.filter((badge) => badge.rarity === rarity);
  } catch (error) {
    console.error("Error fetching badges by rarity:", error);
    return [];
  }
}
