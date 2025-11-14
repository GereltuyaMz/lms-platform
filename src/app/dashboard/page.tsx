import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import {
  ProfileHeader,
  DashboardTabs,
  MyCoursesTab,
  AchievementsTab,
  ProfileTab,
  ShopTab,
  ProfileCompletionBanner,
} from "@/components/dashboard";
import {
  getUserEnrollments,
  getLastAccessedLesson,
  getUserStats,
  checkProfileCompletion,
  getUserProfile,
} from "@/lib/actions";
import { mockAchievements } from "@/lib/mock-data";

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

  const userEmail = user.email || "";

  // Fetch real user stats, enrollments, profile, and profile completion from database
  const [
    { data: userStats, error: userStatsError },
    { data: enrollments, error: enrollmentsError },
    { data: userProfile, error: userProfileError },
    profileCompletionResult,
  ] = await Promise.all([
    getUserStats(),
    getUserEnrollments(),
    getUserProfile(),
    checkProfileCompletion(),
  ]);

  // Use empty array if no enrollments or error
  // Type assertion needed because Supabase infers courses as array but it's actually a single object
  const rawEnrollments = (enrollments || []) as unknown as Array<{
    id: string;
    enrolled_at: string;
    progress_percentage: number;
    completed_at: string | null;
    courses: {
      id: string;
      title: string;
      slug: string;
      description: string | null;
      thumbnail_url: string | null;
      level: string;
    } | null;
  }>;

  // Fetch last accessed lesson for each enrollment
  const enrollmentsWithLastLesson = await Promise.all(
    rawEnrollments.map(async (enrollment) => {
      if (!enrollment.courses) return { ...enrollment, lastLessonId: null };

      const lastLessonId = await getLastAccessedLesson(
        enrollment.courses.id,
        enrollment.courses.slug
      );

      return {
        ...enrollment,
        lastLessonId,
      };
    })
  );

  const userEnrollments = enrollmentsWithLastLesson;

  // If no user stats, redirect to sign in (profile should exist if authenticated)
  if (!userStats) {
    redirect("/signin");
  }

  const isProfileComplete = profileCompletionResult.isComplete || false;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Header */}
      <ProfileHeader userStats={userStats} />

      {/* Profile Completion Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <ProfileCompletionBanner isProfileComplete={isProfileComplete} />
      </div>

      {/* Dashboard Tabs */}
      <DashboardTabs
        coursesContent={<MyCoursesTab enrollments={userEnrollments} />}
        achievementsContent={
          <AchievementsTab achievements={mockAchievements} />
        }
        profileContent={
          <ProfileTab
            username={userStats.username}
            email={userEmail}
            avatarUrl={userStats.avatarUrl}
            dateOfBirth={userProfile?.date_of_birth || ""}
            learningGoals={userProfile?.learning_goals || ""}
          />
        }
        shopContent={<ShopTab />}
      />
    </div>
  );
}
