import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

// Force dynamic rendering to always get fresh enrollment data
export const dynamic = "force-dynamic";
import {
  DashboardTabs,
  MyCoursesTab,
  AchievementsTab,
  ShopTab,
  TestResultsTab,
  ProfileOverview,
  ProfileTab,
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

  // Fetch real user stats, enrollments, profile, badges, mock test attempts, orders, and profile completion from database
  const [
    { data: userStats },
    { data: enrollments },
    { data: userProfile },
    badgeProgress,
    mockTestAttempts,
    userOrders,
    profileCompletionResult,
  ] = await Promise.all([
    getUserStats(),
    getUserEnrollments(),
    getUserProfile(),
    getUserBadgeProgress(),
    getUserMockTestAttempts(),
    getUserOrders(),
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
      level: CourseLevel;
      duration_hours: number | null;
      lessons: { count: number }[];
    } | null;
  }>;

  // Fetch course durations from courses_with_stats view (includes Bunny video durations)
  const courseIds = rawEnrollments
    .map((e) => e.courses?.id)
    .filter((id): id is string => !!id);

  const courseDurations: Record<string, number> = {};
  if (courseIds.length > 0) {
    const { data: courseStats } = await supabase
      .from("courses_with_stats")
      .select("id, total_duration_seconds")
      .in("id", courseIds);

    courseStats?.forEach((cs) => {
      courseDurations[cs.id] = cs.total_duration_seconds || 0;
    });
  }

  // Fetch last accessed lesson for each enrollment and merge duration data
  const enrollmentsWithLastLesson = await Promise.all(
    rawEnrollments.map(async (enrollment) => {
      if (!enrollment.courses) return { ...enrollment, lastLessonId: null };

      const lastLessonId = await getLastAccessedLesson(enrollment.courses.id);
      const totalDurationSeconds = courseDurations[enrollment.courses.id] || 0;

      return {
        ...enrollment,
        lastLessonId,
        courses: {
          ...enrollment.courses,
          total_duration_seconds: totalDurationSeconds,
        },
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

  // Get profile completion status
  const isProfileComplete = profileCompletionResult.isComplete || false;

  return (
    <div className="min-h-screen bg-white">
      {/* Dashboard Tabs with 3-column layout */}
      <DashboardTabs
        profileOverviewContent={
          <ProfileOverview
            userStats={userStats}
            enrollments={userEnrollments}
            recommendedCourses={recommendedCoursesResult?.courses || []}
            joinedDate={userProfile?.created_at}
          />
        }
        coursesContent={<MyCoursesTab enrollments={userEnrollments} />}
        achievementsContent={
          <AchievementsTab achievements={badgeProgress} />
        }
        testResultsContent={
          <TestResultsTab attempts={mockTestAttempts.data || []} />
        }
        shopContent={<ShopTab orders={userOrders} />}
        settingsContent={
          <ProfileTab
            username={userStats.username}
            email={user.email || ""}
            avatarUrl={userStats.avatarUrl}
            dateOfBirth={userProfile?.date_of_birth || ""}
            phoneNumber={userProfile?.phone_number || ""}
            learningGoals={userProfile?.learning_goals?.join(", ") || ""}
          />
        }
        achievements={badgeProgress}
        isProfileComplete={isProfileComplete}
      />
    </div>
  );
}
