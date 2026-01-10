import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { checkEnrollment } from "@/lib/actions";
import {
  getCourseUnits,
  getUnitQuizQuestions,
} from "@/lib/actions/unit-actions";
import {
  fetchUnitsWithQuiz,
  getAllLessonsWithQuizzes,
} from "@/lib/lesson-utils";
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

  // Fetch quiz questions only (sidebar data is handled by layout)
  const quizQuestions = await getUnitQuizQuestions(unitId);

  // Get all lessons and units for navigation (including unit quizzes)
  const units = await getCourseUnits(course.id);
  const unitQuizMap = await fetchUnitsWithQuiz(
    supabase,
    units.map((u) => u.id)
  );
  const allLessons = getAllLessonsWithQuizzes(units, unitQuizMap);

  // Transform quiz data for the player
  type QuizOption = {
    id: string;
    option_text: string;
    is_correct: boolean;
    order_index: number;
  };

  const quizData =
    quizQuestions.length > 0
      ? {
          totalQuestions: quizQuestions.length,
          questions: quizQuestions.map((q) => ({
            id: q.id,
            question: q.question,
            options: q.options.map((opt: QuizOption) => ({
              id: opt.id,
              text: opt.option_text,
              orderIndex: opt.order_index,
            })),
            correctAnswer: q.options.findIndex(
              (opt: QuizOption) => opt.is_correct
            ),
            explanation: q.explanation,
            points: q.points,
          })),
        }
      : null;

  return (
    <UnitQuizPageClient
      title={`${unit.title} - Бүлгийн тест`}
      quizData={quizData}
      unitId={unitId}
      courseId={course.id}
      courseSlug={slug}
      courseTitle={course.title}
      unitTitle={unit.title}
      allLessons={allLessons}
    />
  );
}
