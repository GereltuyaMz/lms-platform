import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import {
  DashboardTabs,
  MyCoursesTab,
  AchievementsTab,
  ShopTab,
  TestResultsTab,
  ProfileOverview,
  // ProfileCompletionBanner, // TODO: Enable later
} from "@/components/dashboard";
import {
  getUserEnrollments,
  getLastAccessedLesson,
  getUserStats,
  // checkProfileCompletion, // TODO: Enable later
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

  // Fetch real user stats, enrollments, profile, badges, mock test attempts, and orders from database
  const [
    { data: userStats },
    { data: enrollments },
    { data: userProfile },
    badgeProgress,
    mockTestAttempts,
    userOrders,
  ] = await Promise.all([
    getUserStats(),
    getUserEnrollments(),
    getUserProfile(),
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
      duration_hours: number | null;
      lessons: { count: number }[];
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

  // TODO: Enable profile completion check later
  // const profileCompletionResult = await checkProfileCompletion();
  // const isProfileComplete = profileCompletionResult.isComplete || false;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Completion Banner - temporarily disabled, will be used later
      <div className="container mx-auto px-4 pt-8 max-w-[1400px]">
        <ProfileCompletionBanner isProfileComplete={isProfileComplete} />
      </div>
      */}

      {/* Dashboard Tabs with 3-column layout */}
      <DashboardTabs
        profileOverviewContent={
          <ProfileOverview
            userStats={userStats}
            enrollments={userEnrollments}
            recommendedCourses={recommendedCoursesResult?.courses || []}
            isPersonalized={recommendedCoursesResult?.isPersonalized || false}
            joinedDate={userProfile?.created_at}
          />
        }
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
        shopContent={<ShopTab orders={userOrders} />}
        achievements={badgeProgress}
      />
    </div>
  );
}
