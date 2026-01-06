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
  TestResultsTab,
} from "@/components/dashboard";
import {
  getUserEnrollments,
  getLastAccessedLesson,
  getUserStats,
  checkProfileCompletion,
  getUserProfile,
  getRecommendedCourses,
  getUserMockTestAttempts,
} from "@/lib/actions";
import { getUserBadgeProgress } from "@/lib/actions/badges";
import { getUserOrders } from "@/lib/actions/shop-actions";
import type { CourseLevel } from "@/types/database/enums";

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

  // Fetch real user stats, enrollments, profile, profile completion, badges, mock test attempts, and orders from database
  const [
    { data: userStats },
    { data: enrollments },
    { data: userProfile },
    profileCompletionResult,
    badgeProgress,
    mockTestAttempts,
    userOrders,
  ] = await Promise.all([
    getUserStats(),
    getUserEnrollments(),
    getUserProfile(),
    checkProfileCompletion(),
    getUserBadgeProgress(),
    getUserMockTestAttempts(),
    getUserOrders(),
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
      level: CourseLevel;
    } | null;
  }>;

  // Fetch last accessed lesson for each enrollment
  const enrollmentsWithLastLesson = await Promise.all(
    rawEnrollments.map(async (enrollment) => {
      if (!enrollment.courses) return { ...enrollment, lastLessonId: null };

      const lastLessonId = await getLastAccessedLesson(enrollment.courses.id);

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

  // Fetch recommended courses for users with no enrollments
  const recommendedCoursesResult =
    userEnrollments.length === 0 ? await getRecommendedCourses() : null;

  const isProfileComplete = profileCompletionResult.isComplete || false;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Header */}
      <ProfileHeader userStats={userStats} />

      {/* Profile Completion Banner */}
      <div className="container mx-auto px-4 pt-8 max-w-[1400px]">
        <ProfileCompletionBanner isProfileComplete={isProfileComplete} />
      </div>

      {/* Dashboard Tabs */}
      <DashboardTabs
        coursesContent={
          <MyCoursesTab
            enrollments={userEnrollments}
            recommendedCourses={recommendedCoursesResult?.courses || []}
            isPersonalized={recommendedCoursesResult?.isPersonalized || false}
          />
        }
        achievementsContent={
          <AchievementsTab achievements={badgeProgress} />
        }
        testResultsContent={
          <TestResultsTab attempts={mockTestAttempts.data || []} />
        }
        profileContent={
          <ProfileTab
            username={userStats.username}
            email={userEmail}
            avatarUrl={userStats.avatarUrl}
            dateOfBirth={userProfile?.date_of_birth || ""}
            phoneNumber={userProfile?.phone_number || ""}
            learningGoals={
              Array.isArray(userProfile?.learning_goals)
                ? userProfile.learning_goals.join(", ")
                : userProfile?.learning_goals || ""
            }
          />
        }
        shopContent={<ShopTab orders={userOrders} />}
      />
    </div>
  );
}
