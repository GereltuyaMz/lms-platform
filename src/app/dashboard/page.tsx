import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ProfileHeader } from "@/components/dashboard/ProfileHeader";
import { DashboardTabs } from "@/components/dashboard/DashboardTabs";
import { MyCoursesTab } from "@/components/dashboard/MyCoursesTab";
import { AchievementsTab } from "@/components/dashboard/AchievementsTab";
import { ProfileTab } from "@/components/dashboard/ProfileTab";
import { ShopTab } from "@/components/dashboard/ShopTab";
import {
  mockUserStats,
  mockEnrolledCourses,
  mockAchievements,
} from "@/lib/mock-data";

export default async function DashboardPage() {
  const supabase = await createClient();

  // Get the authenticated user
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  // If no user, redirect to sign in
  if (error || !user) {
    redirect("/signin");
  }

  // TODO: Replace mock data with real user data from Supabase in later phases
  const userEmail = user.email || "";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Header */}
      <ProfileHeader userStats={mockUserStats} />

      {/* Dashboard Tabs */}
      <DashboardTabs
        coursesContent={<MyCoursesTab courses={mockEnrolledCourses} />}
        achievementsContent={
          <AchievementsTab achievements={mockAchievements} />
        }
        profileContent={
          <ProfileTab
            username={mockUserStats.username}
            email={userEmail}
            avatarUrl={mockUserStats.avatarUrl}
          />
        }
        shopContent={<ShopTab />}
      />
    </div>
  );
}
