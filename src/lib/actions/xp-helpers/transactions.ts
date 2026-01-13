import { createClient } from "@/lib/supabase/server";

/**
 * Insert XP transaction
 */
export async function insertXPTransaction(
  userId: string,
  amount: number,
  sourceType: string,
  sourceId: string,
  description: string,
  metadata: Record<string, unknown>
): Promise<boolean> {
  const supabase = await createClient();

  const { error } = await supabase.from("xp_transactions").insert({
    user_id: userId,
    amount,
    source_type: sourceType,
    source_id: sourceId,
    description,
    metadata,
  });

  if (error) {
    console.error("XP Transaction Error:", { error, sourceType, userId, amount });
    return false;
  }

  return true;
}

/**
 * Get user level and progress information
 */
export async function getUserLevel(userId: string): Promise<{
  level: number;
  currentXP: number;
  xpForNextLevel: number;
  xpForCurrentLevel: number;
  progressToNextLevel: number;
}> {
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("total_xp")
    .eq("id", userId)
    .single();

  const totalXP = profile?.total_xp || 0;

  const { data: level } = await supabase.rpc("get_user_level", { user_xp: totalXP });

  const currentLevel = (level as number) || 1;

  const { data: thresholds } = await supabase
    .from("level_thresholds")
    .select("level, xp_required")
    .in("level", [currentLevel, currentLevel + 1])
    .order("level");

  const currentLevelXP = thresholds?.[0]?.xp_required || 0;
  const nextLevelXP = thresholds?.[1]?.xp_required || currentLevelXP;

  const progressToNextLevel =
    nextLevelXP > currentLevelXP
      ? ((totalXP - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100
      : 100;

  return {
    level: currentLevel,
    currentXP: totalXP,
    xpForNextLevel: nextLevelXP,
    xpForCurrentLevel: currentLevelXP,
    progressToNextLevel: Math.min(progressToNextLevel, 100),
  };
}
