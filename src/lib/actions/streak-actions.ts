"use server";

import { createClient } from "@/lib/supabase/server";
import { calculateStreak, checkStreakMilestone } from "./helpers";

export type StreakResult = {
  success: boolean;
  currentStreak: number;
  longestStreak: number;
  streakBonusAwarded?: number;
  streakBonusMessage?: string;
  isNewStreakDay?: boolean;
};

/**
 * Update user's streak based on activity
 * Calculates streak continuation/reset and awards streak milestone bonuses
 */
export async function updateUserStreak(
  userId: string
): Promise<StreakResult> {
  try {
    const supabase = await createClient();

    // Get user's current streak data
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("current_streak, longest_streak, last_activity_date")
      .eq("id", userId)
      .single();

    if (profileError || !profile) {
      return {
        success: false,
        currentStreak: 0,
        longestStreak: 0,
      };
    }

    // Calculate new streak
    const { newStreak, isNewStreakDay } = calculateStreak(
      profile.current_streak || 0,
      profile.last_activity_date
    );

    // Update longest streak if needed
    const longestStreak = Math.max(newStreak, profile.longest_streak || 0);

    let streakBonusAwarded: number | undefined;
    let streakBonusMessage: string | undefined;

    // Check for streak milestone bonuses (only on new streak days)
    if (isNewStreakDay) {
      const milestone = checkStreakMilestone(newStreak);

      if (milestone?.shouldAward) {
        // Check if already awarded for this streak milestone
        const sourceId = `streak-${userId}-${newStreak}`;

        const { data: existingAward } = await supabase
          .from("xp_transactions")
          .select("id")
          .eq("user_id", userId)
          .eq("source_type", "streak")
          .eq("source_id", sourceId)
          .single();

        if (!existingAward) {
          // Award streak bonus
          const { error: xpError } = await supabase
            .from("xp_transactions")
            .insert({
              user_id: userId,
              amount: milestone.xp,
              source_type: "streak",
              source_id: sourceId,
              description: `Achieved ${milestone.label}!`,
              metadata: {
                streak_days: newStreak,
                achievement_type: "streak_milestone",
              },
            });

          if (!xpError) {
            streakBonusAwarded = milestone.xp;
            streakBonusMessage = `Achieved ${milestone.label}!`;
          }
        }
      }
    }

    // Update user profile
    const today = new Date().toISOString().split("T")[0];

    const { error: updateError } = await supabase
      .from("user_profiles")
      .update({
        current_streak: newStreak,
        longest_streak: longestStreak,
        last_activity_date: today,
      })
      .eq("id", userId);

    if (updateError) {
      return {
        success: false,
        currentStreak: profile.current_streak || 0,
        longestStreak: profile.longest_streak || 0,
      };
    }

    return {
      success: true,
      currentStreak: newStreak,
      longestStreak,
      streakBonusAwarded,
      streakBonusMessage,
      isNewStreakDay,
    };
  } catch {
    return {
      success: false,
      currentStreak: 0,
      longestStreak: 0,
    };
  }
}

/**
 * Get user's current streak info
 */
export async function getUserStreak(userId: string) {
  try {
    const supabase = await createClient();

    const { data: profile } = await supabase
      .from("user_profiles")
      .select("current_streak, longest_streak, last_activity_date")
      .eq("id", userId)
      .single();

    if (!profile) {
      return {
        currentStreak: 0,
        longestStreak: 0,
        lastActivityDate: null,
      };
    }

    return {
      currentStreak: profile.current_streak || 0,
      longestStreak: profile.longest_streak || 0,
      lastActivityDate: profile.last_activity_date,
    };
  } catch {
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastActivityDate: null,
    };
  }
}
