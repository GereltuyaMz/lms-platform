"use server";

import { createClient } from "@/lib/supabase/server";
import { transformToUserStats } from "@/lib/utils";
import { hasXPBeenAwarded, insertXPTransaction } from "./xp-helpers";

export type UserProfile = {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  role: "student" | "instructor" | "admin";
  total_points: number;
  total_xp: number;
  current_streak: number;
  longest_streak: number;
  enrollment_count: number;
  completed_courses: number;
  created_at: string;
  date_of_birth: string | null;
  phone_number: string | null;
  learning_goals: string[] | null;
  profile_completed_at: string | null;
  has_completed_onboarding: boolean;
};

export type UserStats = {
  username: string;
  avatarUrl: string;
  level: number;
  xp: number;
  streak: number;
  league: "Bronze" | "Silver" | "Gold" | "Platinum" | "Diamond";
};

/**
 * Get user profile from database
 */
export async function getUserProfile() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { data: null, error: "Not authenticated" };
    }

    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError) {
      return { data: null, error: profileError.message };
    }

    return { data: profile as UserProfile, error: null };
  } catch {
    return { data: null, error: "Failed to fetch user profile" };
  }
}

/**
 * Get user stats for dashboard display
 * Combines profile data with calculated stats
 */
export async function getUserStats() {
  const { data: profile, error } = await getUserProfile();

  if (error || !profile) {
    return { data: null, error: error || "Profile not found" };
  }

  const userStats = transformToUserStats(profile);

  return { data: userStats, error: null };
}

/**
 * Check and award profile completion achievement (XP System V2)
 * Awards 50 XP when user completes all required profile fields
 *
 * Required fields: full_name, avatar_url, bio (or other fields you define)
 * Call this function after profile updates
 */
export async function checkAndAwardProfileCompletion(userId: string): Promise<{
  awarded: boolean;
  xp: number;
  message?: string;
}> {
  try {
    const supabase = await createClient();

    // Get user profile
    const { data: profile, error } = await supabase
      .from("user_profiles")
      .select("full_name, avatar_url, bio")
      .eq("id", userId)
      .single();

    if (error) {
      return { awarded: false, xp: 0 };
    }

    // Check if profile is complete
    // Define what "complete" means for your platform
    const isComplete =
      profile?.full_name &&
      profile?.full_name.trim().length > 0 &&
      profile?.avatar_url &&
      profile?.bio &&
      profile?.bio.trim().length > 0;

    if (!isComplete) {
      return { awarded: false, xp: 0, message: "Profile not yet complete" };
    }

    // Check if already awarded (idempotency)
    const alreadyAwarded = await hasXPBeenAwarded(
      userId,
      "profile_complete",
      userId
    );

    if (alreadyAwarded) {
      return { awarded: false, xp: 0, message: "Already awarded" };
    }

    // Award 50 XP for profile completion
    const success = await insertXPTransaction(
      userId,
      50,
      "profile_complete",
      userId,
      "Completed your profile",
      { achievement_type: "profile_completion" }
    );

    if (success) {
      return {
        awarded: true,
        xp: 50,
        message: "You earned 50 XP for completing your profile!",
      };
    }

    return { awarded: false, xp: 0 };
  } catch {
    return { awarded: false, xp: 0 };
  }
}
