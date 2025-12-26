import {
  LessonSidebar,
  LessonPageClient,
  ExampleContent,
  LessonStickyNav,
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

export default async function ExamplePage({ params }: PageProps) {
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

  // Redirect if no example content
  const hasExample = lessonWithContent?.lesson_content?.some(
    (c) => c.content_type === "example"
  );
  if (!hasExample) {
    if (availableSteps.includes("theory")) {
      redirect(`/courses/${slug}/learn/lesson/${id}/theory`);
    } else if (availableSteps.includes("test")) {
      redirect(`/courses/${slug}/learn/lesson/${id}/test`);
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
            currentStep="example"
            availableSteps={availableSteps}
          />

          <main className="flex-1 p-6 bg-muted">
            <ExampleContent
              lessonContent={lessonWithContent?.lesson_content}
              courseId={course.id}
              lessonId={lessonId}
            />

            {/* Bottom padding to prevent content hiding behind sticky nav */}
            <div className="h-20 md:h-24" />
          </main>
        </div>

        {/* Sticky Navigation */}
        <LessonStickyNav
          mode="navigation"
          navigationProps={{
            courseSlug: slug,
            lessonId,
            currentStep: "example",
            availableSteps,
            allLessons,
          }}
        />
      </div>
    </LessonPageClient>
  );
}
