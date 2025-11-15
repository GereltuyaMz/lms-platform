import {
  LessonRenderer,
  LessonSidebar,
  LessonContent,
  NavigationButtons,
  LessonPageClient,
} from "@/components/player";
import { CourseBreadcrumb } from "@/components/courses";
import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import {
  transformLessonsForSidebar,
  calculateCourseProgress,
  getNavigationUrls,
  fetchQuizData,
} from "@/lib/lesson-utils";
import { checkEnrollment, getCourseProgress } from "@/lib/actions";

// Revalidate page every 5 minutes (300 seconds) to cache lesson data
export const revalidate = 300;

type PageProps = {
  params: Promise<{
    slug: string;
    lessonId: string;
  }>;
};

export default async function LessonPage({ params }: PageProps) {
  const { slug, lessonId } = await params;
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
    // Redirect to course detail page if not enrolled
    redirect(`/courses/${slug}`);
  }

  // Parallelize independent queries for better performance
  const [
    { data: currentLesson, error: lessonError },
    { data: allLessons, error: lessonsError },
    { data: courseStats },
  ] = await Promise.all([
    // Fetch current lesson
    supabase
      .from("lessons")
      .select("*")
      .eq("id", lessonId)
      .eq("course_id", course.id)
      .single(),
    // Fetch all lessons for the course
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

  if (lessonError || !currentLesson) {
    notFound();
  }

  if (lessonsError || !allLessons) {
    notFound();
  }

  // Fetch lesson progress for this course
  const { data: progressData } = await getCourseProgress(course.id);
  const completedLessonIds =
    progressData
      ?.filter((p) => p.is_completed)
      .map((p) => p.lesson_id) || [];
  const completedCount = completedLessonIds.length;

  // Transform data using utility functions
  const sidebarLessons = transformLessonsForSidebar(
    allLessons,
    lessonId,
    completedLessonIds
  );
  const totalLessons = courseStats?.[0]?.lesson_count || allLessons.length;
  const progress = await calculateCourseProgress(totalLessons, completedCount, course.id);
  const { previousLessonUrl, nextLessonUrl } = getNavigationUrls(
    allLessons,
    lessonId,
    course.slug
  );

  // Fetch quiz data if needed
  const quizData =
    currentLesson.lesson_type === "quiz"
      ? await fetchQuizData(supabase, lessonId)
      : null;

  return (
    <LessonPageClient>
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-[1600px]">
          <CourseBreadcrumb courseTitle={course.title} />
        </div>
        {/* Main Layout */}
        <div className="flex max-w-[1600px] mx-auto">
          {/* Sidebar */}
          <LessonSidebar
            courseTitle={course.title}
            courseSlug={course.slug}
            lessons={sidebarLessons}
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
              <h1 className="text-2xl font-bold mb-2">{currentLesson.title}</h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <span className="text-amber-600 font-semibold">+50 XP</span>
              </div>

              {/* Navigation Buttons */}
              <NavigationButtons
                previousLessonUrl={previousLessonUrl}
                nextLessonUrl={nextLessonUrl}
              />
            </div>

            {/* Lesson Content Tabs */}
            <LessonContent
              overview={currentLesson.description || ""}
              resources={[
                { name: "Lesson Notes.pdf", size: "2.3 MB", url: "#" },
                { name: "Practice Worksheet.pdf", size: "1.8 MB", url: "#" },
              ]}
            />
          </main>
        </div>
      </div>
    </LessonPageClient>
  );
}
