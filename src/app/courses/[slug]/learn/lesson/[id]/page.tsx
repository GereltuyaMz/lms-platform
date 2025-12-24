import {
  LessonRenderer,
  LessonSidebar,
  NavigationButtons,
  LessonPageClient,
} from "@/components/player";
import { CourseBreadcrumb } from "@/components/courses";
import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import {
  transformLessonsForSidebar,
  transformUnitsForSidebar,
  calculateCourseProgress,
  getNavigationUrls,
  fetchQuizData,
  getAllLessonsFromUnits,
  fetchUnitsWithQuiz,
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

export default async function LessonPage({ params }: PageProps) {
  const { slug, id } = await params;
  const lessonId = id;
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

  // Check if user is enrolled in the course
  const enrollmentStatus = await checkEnrollment(course.id);
  if (!enrollmentStatus.isEnrolled) {
    redirect(`/courses/${slug}`);
  }

  // Fetch units with lessons (new structure)
  const units = await getCourseUnits(course.id);
  const hasUnits = units.length > 0;

  // Fetch current lesson with content (new structure)
  const lessonWithContent = await getLessonWithContent(lessonId);

  // Parallelize independent queries
  const [
    { data: currentLessonLegacy, error: lessonError },
    { data: allLessonsLegacy, error: lessonsError },
    { data: courseStats },
  ] = await Promise.all([
    // Fetch current lesson (legacy fallback)
    supabase
      .from("lessons")
      .select("*")
      .eq("id", lessonId)
      .eq("course_id", course.id)
      .single(),
    // Fetch all lessons for navigation (legacy fallback)
    supabase
      .from("lessons")
      .select("*")
      .eq("course_id", course.id)
      .order("order_index", { ascending: true }),
    // Use calculate_course_stats RPC function
    supabase.rpc("calculate_course_stats", {
      course_uuid: course.id,
    }),
  ]);

  // Use lesson with content if available, otherwise use legacy
  const currentLesson = lessonWithContent || currentLessonLegacy;

  if (lessonError || !currentLesson) {
    notFound();
  }

  if (lessonsError || !allLessonsLegacy) {
    notFound();
  }

  // Get all lessons for navigation (from units if available)
  const allLessons = hasUnits
    ? getAllLessonsFromUnits(units)
    : allLessonsLegacy;

  // Fetch lesson progress for this course
  const { data: progressData } = await getCourseProgress(course.id);
  const completedLessonIds =
    progressData?.filter((p) => p.is_completed).map((p) => p.lesson_id) || [];
  const completedCount = completedLessonIds.length;

  // Transform data for sidebar - use units if available
  const sidebarLessons = hasUnits
    ? undefined
    : transformLessonsForSidebar(allLessonsLegacy, lessonId, completedLessonIds);

  // Fetch which units have quizzes for sidebar display
  const unitQuizMap = hasUnits
    ? await fetchUnitsWithQuiz(supabase, units.map((u) => u.id))
    : new Map<string, boolean>();

  const sidebarUnits = hasUnits
    ? transformUnitsForSidebar(units, lessonId, completedLessonIds, unitQuizMap)
    : undefined;

  const totalLessons = courseStats?.[0]?.lesson_count || allLessons.length;
  const progress = await calculateCourseProgress(
    totalLessons,
    completedCount,
    course.id
  );
  const { previousLessonUrl, nextLessonUrl } = getNavigationUrls(
    allLessons,
    lessonId,
    course.slug
  );

  // Fetch quiz data for ALL lessons (each lesson can have quiz questions)
  const quizData = await fetchQuizData(supabase, lessonId);

  return (
    <LessonPageClient>
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-[1600px]">
          <CourseBreadcrumb courseTitle={course.title} />
        </div>
        {/* Main Layout */}
        <div className="flex max-w-[1600px] mx-auto">
          {/* Sidebar - supports both legacy sections and new units */}
          <LessonSidebar
            key={`sidebar-${completedCount}-${lessonId}`}
            courseTitle={course.title}
            courseSlug={course.slug}
            lessons={sidebarLessons}
            units={sidebarUnits}
            progress={progress}
          />

          {/* Main Content */}
          <main className="flex-1 p-6 bg-muted">
            <LessonRenderer
              lesson={currentLesson}
              courseId={course.id}
              quizData={quizData}
            />

            {/* Lesson Info */}
            <div className="bg-white rounded-lg border p-6 mb-6">
              <h1 className="text-2xl font-bold mb-5">{currentLesson.title}</h1>

              {/* Navigation Buttons */}
              <NavigationButtons
                previousLessonUrl={previousLessonUrl}
                nextLessonUrl={nextLessonUrl}
              />
            </div>
          </main>
        </div>
      </div>
    </LessonPageClient>
  );
}
