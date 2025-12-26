import {
  LessonSidebar,
  LessonPageClient,
  TestPageWrapper,
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
} from "@/lib/lesson-utils";
import { checkEnrollment, getCourseProgress } from "@/lib/actions";
import {
  getCourseUnits,
  getLessonWithContent,
} from "@/lib/actions/unit-actions";

export const revalidate = 0;

type PageProps = {
  params: Promise<{
    slug: string;
    id: string;
  }>;
};

export default async function TestPage({ params }: PageProps) {
  const { slug, id } = await params;
  const lessonId = id;
  const supabase = await createClient();

  const { data: course, error: courseError } = await supabase
    .from("courses")
    .select("id, title, slug, thumbnail_url")
    .eq("slug", slug)
    .single();

  if (courseError || !course) {
    notFound();
  }

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

  const units = await getCourseUnits(course.id);
  const hasUnits = units.length > 0;
  const lessonWithContent = await getLessonWithContent(lessonId);

  const quizData = await fetchQuizData(supabase, lessonId);
  const availableSteps = getAvailableSteps(
    lessonWithContent?.lesson_content,
    quizData
  );

  // Redirect if no test content
  if (!quizData) {
    if (availableSteps.includes("theory")) {
      redirect(`/courses/${slug}/learn/lesson/${id}/theory`);
    } else if (availableSteps.includes("example")) {
      redirect(`/courses/${slug}/learn/lesson/${id}/example`);
    } else {
      notFound();
    }
  }

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

  const allLessons = hasUnits ? getAllLessonsFromUnits(units) : [];

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
        undefined,
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

  // Find next lesson URL for quiz results navigation
  let nextLessonUrl: string | null = null;

  if (hasUnits) {
    // Find current lesson's unit and position
    for (let unitIndex = 0; unitIndex < units.length; unitIndex++) {
      const unit = units[unitIndex];
      const lessonIndex = unit.lessons.findIndex((l) => l.id === lessonId);

      if (lessonIndex !== -1) {
        // Found current lesson in this unit

        // Check if there's a next lesson in the same unit
        if (lessonIndex < unit.lessons.length - 1) {
          const nextLesson = unit.lessons[lessonIndex + 1];
          nextLessonUrl = `/courses/${slug}/learn/lesson/${nextLesson.id}/theory`;
        }
        // Check if this unit has a quiz
        else if (unitQuizMap.get(unit.id)) {
          nextLessonUrl = `/courses/${slug}/learn/lesson/${unit.id}/unit-quiz`;
        }
        // Check if there's a next unit with lessons
        else if (unitIndex < units.length - 1) {
          const nextUnit = units[unitIndex + 1];
          if (nextUnit.lessons.length > 0) {
            nextLessonUrl = `/courses/${slug}/learn/lesson/${nextUnit.lessons[0].id}/theory`;
          }
        }

        break;
      }
    }
  } else {
    // Flat lesson structure (no units)
    const currentIndex = allLessons.findIndex((l) => l.id === lessonId);
    if (currentIndex !== -1 && currentIndex < allLessons.length - 1) {
      const nextLesson = allLessons[currentIndex + 1];
      nextLessonUrl = `/courses/${slug}/learn/lesson/${nextLesson.id}/theory`;
    }
  }

  return (
    <LessonPageClient>
      <div className="min-h-screen">
        <div className="flex max-w-[1600px] mx-auto">
          <LessonSidebar
            key={`sidebar-${completedCount}-${lessonId}`}
            courseTitle={course.title}
            courseSlug={course.slug}
            lessons={sidebarLessons}
            units={sidebarUnits}
            progress={progress}
            currentLessonTitle={lessonWithContent?.title}
            currentStep="test"
            availableSteps={availableSteps}
          />

          <main className="flex-1 p-6 bg-muted">
            <TestPageWrapper
              quizData={quizData}
              lessonId={lessonId}
              courseId={course.id}
              lessonTitle={lessonWithContent?.title || ""}
              nextLessonUrl={nextLessonUrl}
            />
          </main>
        </div>
      </div>
    </LessonPageClient>
  );
}
