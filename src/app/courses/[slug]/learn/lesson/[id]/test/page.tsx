import { TestPageWrapper } from "@/components/player";
import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import {
  fetchUnitsWithQuiz,
  getAllLessonsFromUnits,
  fetchQuizData,
  getAvailableSteps,
} from "@/lib/lesson-utils";
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

  // Fetch course by slug (needed for courseId)
  const { data: course, error: courseError } = await supabase
    .from("courses")
    .select("id, slug")
    .eq("slug", slug)
    .single();

  if (courseError || !course) {
    notFound();
  }

  // Fetch lesson content
  const lessonWithContent = await getLessonWithContent(lessonId);

  // Fetch quiz data to determine available steps
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

  // Get units for next lesson calculation
  const units = await getCourseUnits(course.id);
  const hasUnits = units.length > 0;
  const allLessons = hasUnits ? getAllLessonsFromUnits(units) : [];

  const unitQuizMap = hasUnits
    ? await fetchUnitsWithQuiz(
        supabase,
        units.map((u) => u.id)
      )
    : new Map<string, boolean>();

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
    <TestPageWrapper
      quizData={quizData}
      lessonId={lessonId}
      courseId={course.id}
      lessonTitle={lessonWithContent?.title || ""}
      nextLessonUrl={nextLessonUrl}
    />
  );
}
