import { VideoPlayer } from "@/components/player/VideoPlayer";
import { LessonSidebar } from "@/components/player/LessonSidebar";
import { LessonContent } from "@/components/player/LessonContent";
import { NavigationButtons } from "@/components/player/NavigationButtons";
import { LessonPageClient } from "@/components/player/LessonPageClient";
import { QuizPlayer } from "@/components/player/quiz/QuizPlayer";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import type { Lesson } from "@/types/database/tables";
import { formatTime } from "@/lib/utils";

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

  // Fetch current lesson
  const { data: currentLesson, error: lessonError } = await supabase
    .from("lessons")
    .select("*")
    .eq("id", lessonId)
    .eq("course_id", course.id)
    .single();

  if (lessonError || !currentLesson) {
    notFound();
  }

  // Fetch all lessons for the course
  const { data: allLessons, error: lessonsError } = await supabase
    .from("lessons")
    .select("*")
    .eq("course_id", course.id)
    .order("order_index", { ascending: true });

  if (lessonsError || !allLessons) {
    notFound();
  }

  // Use calculate_course_stats RPC function
  const { data: courseStats } = await supabase.rpc("calculate_course_stats", {
    course_uuid: course.id,
  });

  // Group lessons by section
  const lessonsBySection = allLessons.reduce(
    (acc, lesson) => {
      const sectionTitle = lesson.section_title || "Uncategorized";
      if (!acc[sectionTitle]) {
        acc[sectionTitle] = [];
      }
      acc[sectionTitle].push(lesson);
      return acc;
    },
    {} as Record<string, Lesson[]>
  );

  // Transform lessons for sidebar
  const sidebarLessons = Object.entries(lessonsBySection).map(
    ([section, lessons]) => ({
      section,
      items: (lessons as Lesson[]).map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        duration:
          lesson.lesson_type === "video" && lesson.duration_seconds
            ? formatTime(lesson.duration_seconds)
            : lesson.lesson_type === "quiz"
              ? "Quiz"
              : "Assignment",
        type: lesson.lesson_type,
        completed: false, // TODO: fetch from lesson_progress when auth is ready
        current: lesson.id === lessonId,
        locked: false, // TODO: implement lock logic based on enrollment
      })),
    })
  );

  // Calculate progress
  const totalLessons = courseStats?.[0]?.lesson_count || allLessons.length;
  const completedLessons = 0; // TODO: fetch from lesson_progress when auth is ready
  const progressPercentage =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const progress = {
    completed: completedLessons,
    total: totalLessons,
    percentage: progressPercentage,
    totalXp: 0, // Static for now, will be calculated from xp_transactions
  };

  // Fetch quiz data if lesson is a quiz
  let quizData = null;
  if (currentLesson.lesson_type === "quiz") {
    type QuizOptionFromDB = {
      id: string;
      option_text: string;
      is_correct: boolean;
      order_index: number;
    };

    type QuizQuestionFromDB = {
      id: string;
      question: string;
      explanation: string;
      order_index: number;
      points: number;
      quiz_options: QuizOptionFromDB[];
    };

    const { data: quizQuestions } = await supabase
      .from("quiz_questions")
      .select(
        `
        id,
        question,
        explanation,
        order_index,
        points,
        quiz_options (
          id,
          option_text,
          is_correct,
          order_index
        )
      `
      )
      .eq("lesson_id", lessonId)
      .order("order_index", { ascending: true });

    if (quizQuestions && quizQuestions.length > 0) {
      // Transform the data to match our component structure
      quizData = {
        totalQuestions: quizQuestions.length,
        questions: (quizQuestions as QuizQuestionFromDB[]).map((q) => {
          // Sort options by order_index
          const sortedOptions = [...(q.quiz_options || [])].sort(
            (a, b) => a.order_index - b.order_index
          );

          return {
            id: q.id,
            question: q.question,
            options: sortedOptions.map((opt) => opt.option_text),
            correctAnswer: sortedOptions.findIndex((opt) => opt.is_correct),
            explanation: q.explanation,
            points: q.points,
          };
        }),
      };
    }
  }

  // Find previous and next lessons
  const currentIndex = allLessons.findIndex((l) => l.id === lessonId);
  const previousLesson =
    currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const previousLessonUrl = previousLesson
    ? `/courses/${course.slug}/learn/${previousLesson.id}`
    : undefined;
  const nextLessonUrl = nextLesson
    ? `/courses/${course.slug}/learn/${nextLesson.id}`
    : undefined;

  return (
    <LessonPageClient>
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-[1600px]">
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/courses">Courses</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-bold">
                  {course.title}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
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
            {/* Render content based on lesson type */}
            {currentLesson.lesson_type === "video" && (
              <VideoPlayer
                videoUrl={currentLesson.video_url || ""}
                title={currentLesson.title}
              />
            )}

            {currentLesson.lesson_type === "text" && (
              <div className="bg-white rounded-lg border p-6 mb-6">
                <div className="prose max-w-none">
                  {currentLesson.content || currentLesson.description || ""}
                </div>
              </div>
            )}

            {currentLesson.lesson_type === "quiz" && (
              <QuizPlayer title={currentLesson.title} quizData={quizData} />
            )}

            {currentLesson.lesson_type === "assignment" && (
              <div className="bg-white rounded-lg border p-6 mb-6">
                <div className="text-center py-12">
                  <p className="text-lg text-muted-foreground mb-4">
                    📄 Assignment Component
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Assignment functionality coming soon
                  </p>
                </div>
              </div>
            )}

            {/* Lesson Info */}
            <div className="bg-white rounded-lg border p-6 mb-6">
              <h1 className="text-2xl font-bold mb-2">
                {currentLesson.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <span className="text-amber-600 font-semibold">+50 XP</span>
              </div>

              {/* Navigation Buttons */}
              <NavigationButtons
                previousLessonUrl={previousLessonUrl}
                nextLessonUrl={nextLessonUrl}
                isCompleted={false}
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
