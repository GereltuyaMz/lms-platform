import { Suspense } from "react";
import { headers } from "next/headers";
import {
  LessonSidebar,
  LessonPageClient,
  LessonContentLoading,
} from "@/components/player";
import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import {
  transformLessonsForSidebar,
  transformUnitsForSidebar,
  calculateCourseProgress,
  fetchUnitsWithQuiz,
  getAllLessonsFromUnits,
  fetchQuizData,
  getAvailableSteps,
  fetchAvailableStepsForLessons,
} from "@/lib/lesson-utils";
import { checkEnrollment, getCourseProgress } from "@/lib/actions";
import { getCourseUnits, getLessonWithContent } from "@/lib/actions/unit-actions";
import { AIChatWidget } from "@/components/ai-teacher";

export const revalidate = 0;

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{
    slug: string;
    id: string;
  }>;
};

export default async function LessonLayout({ children, params }: LayoutProps) {
  const { slug, id } = await params;
  const lessonId = id;
  const supabase = await createClient();

  // Get current pathname to detect route type and current step
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";

  // Detect if this is a unit-quiz route
  const isUnitQuiz = pathname.includes("/unit-quiz");

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

  // Fetch units and lesson data for sidebar
  const units = await getCourseUnits(course.id);
  const hasUnits = units.length > 0;

  // Fetch lesson content OR unit data depending on route type
  let lessonWithContent;
  let unitData = null;

  if (isUnitQuiz) {
    // For unit-quiz: fetch unit data instead of lesson content
    const { data: unit } = await supabase
      .from("units")
      .select("id, title, course_id")
      .eq("id", lessonId) // lessonId is actually unitId for unit-quiz routes
      .eq("course_id", course.id)
      .single();
    unitData = unit;
  } else {
    // For regular lessons: fetch lesson content
    try {
      lessonWithContent = await getLessonWithContent(lessonId);
      // If this fails (returns null/undefined), something is wrong
      if (!lessonWithContent) {
        return <>{children}</>;
      }
    } catch {
      // If getLessonWithContent fails, return early
      return <>{children}</>;
    }
  }

  // Fetch quiz data to determine available steps (only for regular lessons, not unit-quiz)
  const quizData = isUnitQuiz ? null : await fetchQuizData(supabase, lessonId);
  const availableSteps = isUnitQuiz ? [] : getAvailableSteps(
    lessonWithContent?.lesson_content,
    quizData
  );

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

  // Get all lessons for navigation
  const allLessons = hasUnits ? getAllLessonsFromUnits(units) : [];

  // Fetch available steps for all lessons (for sidebar preview)
  const allLessonIds = allLessons.map((l) => l.id);
  const lessonStepsMap = await fetchAvailableStepsForLessons(supabase, allLessonIds);

  // Transform data for sidebar
  const sidebarLessons = hasUnits
    ? undefined
    : transformLessonsForSidebar(allLessons, lessonId, completedLessonIds);

  const unitQuizMap = hasUnits
    ? await fetchUnitsWithQuiz(
        supabase,
        units.map((u) => u.id)
      )
    : new Map<string, boolean>();

  const sidebarUnits = hasUnits
    ? transformUnitsForSidebar(
        units,
        lessonId,
        completedLessonIds,
        unitQuizMap,
        isUnitQuiz ? lessonId : undefined, // Pass unitId when on unit-quiz route
        completedUnitQuizIds
      )
    : undefined;

  const { data: courseStats } = await supabase.rpc("calculate_course_stats", {
    course_uuid: course.id,
  });

  const totalLessons = courseStats?.[0]?.lesson_count || allLessons.length;
  const progress = await calculateCourseProgress(
    totalLessons,
    completedCount,
    course.id
  );

  // Determine current step from pathname (not applicable for unit-quiz)
  let currentStep: "theory" | "example" | "test" = "theory";
  if (!isUnitQuiz) {
    if (pathname.includes("/example")) {
      currentStep = "example";
    } else if (pathname.includes("/test")) {
      currentStep = "test";
    }
  }

  return (
    <LessonPageClient>
      <div className="min-h-screen">
        <div className="flex max-w-[1600px] mx-auto">
          <LessonSidebar
            key={`sidebar-${completedCount}-${lessonId}-${currentStep}`}
            courseTitle={course.title}
            courseSlug={course.slug}
            lessons={sidebarLessons}
            units={sidebarUnits}
            progress={progress}
            currentLessonTitle={isUnitQuiz ? unitData?.title : lessonWithContent?.title}
            currentStep={currentStep}
            availableSteps={availableSteps}
            lessonStepsMap={lessonStepsMap}
          />

          <main className="flex-1 p-6 bg-muted">
            <Suspense fallback={<LessonContentLoading />}>{children}</Suspense>
            {/* Bottom padding to prevent content hiding behind sticky nav */}
            <div className="h-20 md:h-24" />
          </main>
        </div>
      </div>

      <AIChatWidget
        lessonId={lessonId}
        lessonStep={currentStep}
        lessonTitle={isUnitQuiz ? unitData?.title || "" : lessonWithContent?.title || ""}
        lessonContent={
          !isUnitQuiz && lessonWithContent?.lesson_content
            ? lessonWithContent.lesson_content
                .map((c) => c.content || "")
                .join(" ")
                .substring(0, 1000)
            : undefined
        }
      />
    </LessonPageClient>
  );
}
