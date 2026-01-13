"use server";

import { getAuthenticatedUser } from "../helpers";
import type { XPTransaction } from "./types";

/**
 * Get user's total XP
 */
export async function getUserTotalXP(): Promise<number> {
  try {
    const { user, supabase, error: authError } = await getAuthenticatedUser();

    if (authError || !user) return 0;

    const { data } = await supabase
      .from("user_profiles")
      .select("total_xp")
      .eq("id", user.id)
      .single();

    return data?.total_xp || 0;
  } catch {
    return 0;
  }
}

/**
 * Get XP transaction history
 */
export async function getXPTransactions(limit: number = 50): Promise<XPTransaction[]> {
  try {
    const { user, supabase, error: authError } = await getAuthenticatedUser();

    if (authError || !user) return [];

    const { data } = await supabase
      .from("xp_transactions")
      .select("id, amount, source_type, description, created_at, metadata")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(limit);

    return data || [];
  } catch {
    return [];
  }
}

/**
 * Get total XP earned for a specific course
 */
export async function getCourseXPEarned(courseId: string): Promise<number> {
  try {
    const { user, supabase, error: authError } = await getAuthenticatedUser();

    if (authError || !user) return 0;

    const { data } = await supabase
      .from("xp_transactions")
      .select("amount")
      .eq("user_id", user.id)
      .in("source_type", [
        "lesson_theory_complete",
        "lesson_example_complete",
        "lesson_quiz_complete",
        "lesson_complete",
        "quiz_complete",
        "unit_complete",
        "unit_quiz_complete",
        "course_complete",
        "milestone",
        "achievement",
        "badge_earned",
        "streak",
        "daily_streak",
        "streak_milestone",
      ])
      .contains("metadata", { course_id: courseId });

    if (!data) return 0;

    return data.reduce((sum, transaction) => sum + transaction.amount, 0);
  } catch {
    return 0;
  }
}
