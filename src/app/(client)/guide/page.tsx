import { createClient } from "@/lib/supabase/server";
import { HowXPWorks, LevelsAndLeagues } from "@/components/guide";
import { calculateLevel } from "@/lib/mock-data";

export default async function GuidePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let userXP = 0;
  let userLevel = 1;

  if (user) {
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("total_xp, current_streak")
      .eq("id", user.id)
      .single();

    if (profile) {
      userXP = profile.total_xp || 0;
      userLevel = calculateLevel(userXP);
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-[1200px]">
        {/* Hero Section */}
        {/* <XPGuideHero
          userXP={userXP}
          userLevel={userLevel}
          userStreak={userStreak}
        /> */}

        {/* Divider */}

        {/* How XP Works */}
        <HowXPWorks />

        {/* Divider */}
        {/* <div className="my-16" /> */}

        {/* Levels & Leagues */}
        <LevelsAndLeagues currentXP={userXP} currentLevel={userLevel} />

        {/* Streak System */}
        {/* <StreakSystem currentStreak={userStreak} /> */}

        {/* Divider */}
        {/* <div className="my-16" /> */}

        {/* Coming Soon Section */}
        {/* <ComingSoonSection /> */}
      </div>
    </div>
  );
}
