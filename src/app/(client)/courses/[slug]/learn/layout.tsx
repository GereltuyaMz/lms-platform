import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { checkEnrollment, getCourseProgress } from "@/lib/actions";
import { getCourseUnits } from "@/lib/actions/unit-actions";
import {
  transformUnitsForSidebar,
  calculateCourseProgress,
  fetchUnitsWithQuiz,
  getAllLessonsFromUnits,
  fetchAvailableStepsForLessons,
} from "@/lib/lesson-utils";
import {
  LessonPlayerProvider,
  type SidebarData,
} from "@/hooks/useLessonPlayer";
import {
  LessonSidebar,
  LessonPageClient,
  AIChatWidgetWrapper,
} from "@/components/player";

export const revalidate = 0;

type LearnLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
};

export default async function LearnLayout({
  children,
  params,
}: LearnLayoutProps) {
  const { slug } = await params;
  const supabase = await createClient();

  // Fetch course by slug
  const { data: course, error: courseError } = await supabase
    .from("courses")
    .select("id, title, slug, thumbnail_url")
    .eq("slug", slug)
    .single();

  if (courseError || !course) {
    notFound();
  }

  // Check if user is enrolled
  const enrollmentStatus = await checkEnrollment(course.id);
  if (!enrollmentStatus.isEnrolled) {
    redirect(`/courses/${slug}`);
  }

  // Get authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/courses/${slug}`);
  }

  // Fetch units and lessons for sidebar
  const units = await getCourseUnits(course.id);
  const allLessons = getAllLessonsFromUnits(units);

  // Fetch lesson progress
  const { data: progressData } = await getCourseProgress(course.id);
  const completedLessonIds =
    progressData?.filter((p) => p.is_completed).map((p) => p.lesson_id) || [];
  const completedCount = completedLessonIds.length;

  // Fetch completed unit quiz attempts
  const { data: completedQuizAttempts } = await supabase
    .from("quiz_attempts")
    .select("unit_id, enrollments!inner(user_id)")
    .eq("enrollments.user_id", user.id)
    .eq("passed", true)
    .not("unit_id", "is", null);

  const completedUnitQuizIds =
    completedQuizAttempts?.map((qa) => qa.unit_id!) || [];

  // Fetch unit quiz status and available steps
  const unitIds = units.map((u) => u.id);
  const allLessonIds = allLessons.map((l) => l.id);

  const [unitQuizMap, lessonStepsMap] = await Promise.all([
    fetchUnitsWithQuiz(supabase, unitIds),
    fetchAvailableStepsForLessons(supabase, allLessonIds),
  ]);

  // Transform data for sidebar - pass empty string for currentLessonId
  // The context will update this when a lesson page mounts
  const sidebarUnits = transformUnitsForSidebar(
    units,
    "", // No current lesson at layout level
    completedLessonIds,
    unitQuizMap,
    undefined,
    completedUnitQuizIds
  );

  // Calculate course stats and progress
  const { data: courseStats } = await supabase.rpc("calculate_course_stats", {
    course_uuid: course.id,
  });

  const totalLessons = courseStats?.[0]?.lesson_count || allLessons.length;

  // Count unit quizzes for progress calculation
  const totalUnitQuizzes = [...unitQuizMap.values()].filter(Boolean).length;
  const completedUnitQuizCount = completedUnitQuizIds.length;

  const progress = await calculateCourseProgress(
    totalLessons,
    completedCount,
    course.id,
    totalUnitQuizzes,
    completedUnitQuizCount
  );

  // Prepare initial sidebar data for context
  const initialSidebarData: SidebarData = {
    courseTitle: course.title,
    courseSlug: course.slug,
    courseId: course.id,
    units: sidebarUnits,
    progress,
    lessonStepsMap,
  };

  return (
    <LessonPlayerProvider initialData={initialSidebarData}>
      <LessonPageClient>
        <div className="min-h-screen bg-[#faf9f6] lg:bg-transparent">
          <div className="flex min-h-screen lg:min-h-0 max-w-[1510px] mx-auto md:px-6 lg:px-[120px]">
            <LessonSidebar />

            <main className="flex-1 px-4 py-4 md:p-6 lg:p-10 lg:bg-[#faf9f6]">
              <Suspense fallback={<LessonContentLoading />}>
                {children}
              </Suspense>
            </main>
          </div>
        </div>

        <AIChatWidgetWrapper />
      </LessonPageClient>
    </LessonPlayerProvider>
  );
}

// Purple skeleton for lesson player theme
const PurpleSkeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse rounded-md bg-[#606099]/10 ${className}`} />
);

// Loading component for lesson content
const LessonContentLoading = () => (
  <div className="bg-[#faf9f6] rounded-lg p-4 md:p-6 lg:p-10 flex flex-col gap-4 md:gap-5">
    {/* Breadcrumb Skeleton */}
    <div className="flex items-center gap-2">
      <PurpleSkeleton className="h-4 w-24" />
      <PurpleSkeleton className="h-4 w-3" />
      <PurpleSkeleton className="h-4 w-32" />
      <PurpleSkeleton className="h-4 w-3" />
      <PurpleSkeleton className="h-4 w-20" />
    </div>

    {/* Divider */}
    <div className="border-b border-[#e5e5e5]" />

    {/* Step Title + Navigation Row */}
    <div className="flex items-center justify-between">
      <PurpleSkeleton className="h-8 w-24" />
      <div className="flex items-center gap-2">
        <PurpleSkeleton className="size-10 rounded-full" />
        <PurpleSkeleton className="size-10 rounded-full" />
      </div>
    </div>

    {/* Content Area Skeleton */}
    <div className="flex-1 space-y-4">
      <div className="bg-white rounded-xl border p-4 md:p-6 space-y-4">
        <PurpleSkeleton className="h-6 w-3/4" />
        <PurpleSkeleton className="h-4 w-full" />
        <PurpleSkeleton className="h-4 w-full" />
        <PurpleSkeleton className="h-4 w-2/3" />
        <PurpleSkeleton className="h-40 w-full rounded-lg" />
        <PurpleSkeleton className="h-4 w-full" />
        <PurpleSkeleton className="h-4 w-5/6" />
      </div>
    </div>

    {/* Mark Complete Button Skeleton */}
    <div className="flex justify-start">
      <PurpleSkeleton className="h-10 w-36 rounded-lg" />
    </div>
  </div>
);
