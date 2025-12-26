import { LessonSidebar, LessonPageClient, LessonStickyNav } from "@/components/player";
import { UnitQuizPlayer } from "@/components/player/quiz";
import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import {
  transformUnitsForSidebar,
  calculateCourseProgress,
  fetchUnitsWithQuiz,
} from "@/lib/lesson-utils";
import { checkEnrollment, getCourseProgress } from "@/lib/actions";
import {
  getCourseUnits,
  getUnitQuizQuestions,
} from "@/lib/actions/unit-actions";
import { UnitQuizPageClient } from "./UnitQuizPageClient";

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

  // Get user for completion tracking
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/courses/${slug}`);
  }

  // Parallel fetches
  const [units, quizQuestions, { data: progressData }] = await Promise.all([
    getCourseUnits(course.id),
    getUnitQuizQuestions(unitId),
    getCourseProgress(course.id),
  ]);

  // Fetch completed unit quiz attempts
  const { data: completedQuizAttempts } = await supabase
    .from("quiz_attempts")
    .select("unit_id, enrollments!inner(user_id)")
    .eq("enrollments.user_id", user.id)
    .eq("passed", true)
    .not("unit_id", "is", null);

  const completedUnitQuizIds =
    completedQuizAttempts?.map((qa) => qa.unit_id!) || [];

  // Transform quiz data for the player
  type QuizOption = { option_text: string; is_correct: boolean };

  const quizData =
    quizQuestions.length > 0
      ? {
          totalQuestions: quizQuestions.length,
          questions: quizQuestions.map((q) => ({
            id: q.id,
            question: q.question,
            options: q.options.map((opt: QuizOption) => opt.option_text),
            correctAnswer: q.options.findIndex(
              (opt: QuizOption) => opt.is_correct
            ),
            explanation: q.explanation,
            points: q.points,
          })),
        }
      : null;

  // Sidebar data
  const completedLessonIds =
    progressData?.filter((p) => p.is_completed).map((p) => p.lesson_id) || [];
  const unitIds = units.map((u) => u.id);
  const unitQuizMap = await fetchUnitsWithQuiz(supabase, unitIds);
  const sidebarUnits = transformUnitsForSidebar(
    units,
    `unit-quiz-${unitId}`,
    completedLessonIds,
    unitQuizMap,
    unitId,
    completedUnitQuizIds
  );
  const totalLessons = units.flatMap((u) => u.lessons).length;
  const progress = await calculateCourseProgress(
    totalLessons,
    completedLessonIds.length,
    course.id
  );

  // Find next lesson after this unit quiz
  const currentUnitIndex = units.findIndex((u) => u.id === unitId);
  let nextLessonUrl: string | null = null;

  if (currentUnitIndex !== -1 && currentUnitIndex < units.length - 1) {
    const nextUnit = units[currentUnitIndex + 1];
    if (nextUnit.lessons.length > 0) {
      nextLessonUrl = `/courses/${slug}/learn/lesson/${nextUnit.lessons[0].id}/theory`;
    }
  }

  return (
    <LessonPageClient>
      <div className="min-h-screen">
        <div className="flex max-w-[1600px] mx-auto">
          <LessonSidebar
            courseTitle={course.title}
            courseSlug={course.slug}
            units={sidebarUnits}
            progress={progress}
          />

          <main className="flex-1 p-6 bg-muted pb-24">
            <UnitQuizPageClient
              title={`${unit.title} - Бүлгийн тест`}
              quizData={quizData}
              unitId={unitId}
              courseId={course.id}
              nextLessonUrl={nextLessonUrl}
            />
          </main>
        </div>
      </div>
    </LessonPageClient>
  );
}
