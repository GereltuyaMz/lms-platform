"use server";

import { createClient } from "@/lib/supabase/server";
import { transformToUserStats } from "@/lib/utils";

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
  } catch (error) {
    console.error("Error fetching user profile:", error);
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
