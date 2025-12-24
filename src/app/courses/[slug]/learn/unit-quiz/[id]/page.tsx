import { LessonSidebar, LessonPageClient } from "@/components/player";
import { CourseBreadcrumb } from "@/components/courses";
import { UnitQuizPlayer } from "@/components/player/quiz";
import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import {
  transformUnitsForSidebar,
  calculateCourseProgress,
  fetchUnitsWithQuiz,
} from "@/lib/lesson-utils";
import { checkEnrollment, getCourseProgress } from "@/lib/actions";
import { getCourseUnits, getUnitQuizQuestions } from "@/lib/actions/unit-actions";

export const revalidate = 0;

type PageProps = {
  params: Promise<{ slug: string; id: string }>;
};

export default async function UnitQuizPage({ params }: PageProps) {
  const { slug, id } = await params;
  const unitId = id;
  const supabase = await createClient();

  // Fetch course
  const { data: course, error: courseError } = await supabase
    .from("courses")
    .select("id, title, slug")
    .eq("slug", slug)
    .single();

  if (courseError || !course) {
    notFound();
  }

  // Check enrollment
  const enrollmentStatus = await checkEnrollment(course.id);
  if (!enrollmentStatus.isEnrolled) {
    redirect(`/courses/${slug}`);
  }

  // Fetch unit
  const { data: unit, error: unitError } = await supabase
    .from("units")
    .select("id, title, course_id")
    .eq("id", unitId)
    .eq("course_id", course.id)
    .single();

  if (unitError || !unit) {
    notFound();
  }

  // Parallel fetches
  const [units, quizQuestions, { data: progressData }] = await Promise.all([
    getCourseUnits(course.id),
    getUnitQuizQuestions(unitId),
    getCourseProgress(course.id),
  ]);

  // Transform quiz data for the player
  type QuizOption = { option_text: string; is_correct: boolean };

  const quizData = quizQuestions.length > 0 ? {
    totalQuestions: quizQuestions.length,
    questions: quizQuestions.map((q) => ({
      id: q.id,
      question: q.question,
      options: q.options.map((opt: QuizOption) => opt.option_text),
      correctAnswer: q.options.findIndex((opt: QuizOption) => opt.is_correct),
      explanation: q.explanation,
      points: q.points,
    })),
  } : null;

  // Sidebar data
  const completedLessonIds = progressData?.filter((p) => p.is_completed).map((p) => p.lesson_id) || [];
  const unitIds = units.map((u) => u.id);
  const unitQuizMap = await fetchUnitsWithQuiz(supabase, unitIds);
  const sidebarUnits = transformUnitsForSidebar(units, "", completedLessonIds, unitQuizMap);
  const totalLessons = units.flatMap((u) => u.lessons).length;
  const progress = await calculateCourseProgress(totalLessons, completedLessonIds.length, course.id);

  return (
    <LessonPageClient>
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-[1600px]">
          <CourseBreadcrumb courseTitle={course.title} />
        </div>

        <div className="flex max-w-[1600px] mx-auto">
          <LessonSidebar
            courseTitle={course.title}
            courseSlug={course.slug}
            units={sidebarUnits}
            progress={progress}
          />

          <main className="flex-1 p-6 bg-muted">
            <UnitQuizPlayer
              title={`${unit.title} - Бүлгийн тест`}
              quizData={quizData}
              unitId={unitId}
              courseId={course.id}
            />
          </main>
        </div>
      </div>
    </LessonPageClient>
  );
}
