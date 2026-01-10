import { TestPageWrapper } from "@/components/player";
import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import {
  getAllLessonsWithQuizzes,
  fetchQuizData,
  getAvailableSteps,
  fetchUnitsWithQuiz,
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

  // Fetch course by slug (including title for breadcrumb)
  const { data: course, error: courseError } = await supabase
    .from("courses")
    .select("id, slug, title")
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

  // Get all lessons and units for navigation (including unit quizzes)
  const units = await getCourseUnits(course.id);
  const hasUnits = units.length > 0;
  const unitQuizMap = hasUnits
    ? await fetchUnitsWithQuiz(supabase, units.map((u) => u.id))
    : new Map<string, boolean>();
  const allLessons = hasUnits
    ? getAllLessonsWithQuizzes(units, unitQuizMap)
    : [];

  // Find unit title for breadcrumb (if lesson belongs to a unit)
  let unitTitle: string | undefined;
  if (hasUnits && lessonWithContent) {
    for (const unit of units) {
      const lessonInUnit = unit.lessons?.find((l) => l.id === lessonId);
      if (lessonInUnit) {
        unitTitle = unit.title;
        break;
      }
    }
  }

  return (
    <TestPageWrapper
      quizData={quizData}
      lessonId={lessonId}
      courseId={course.id}
      lessonTitle={lessonWithContent?.title || ""}
      courseTitle={course.title}
      courseSlug={slug}
      unitTitle={unitTitle}
      currentStep="test"
      availableSteps={availableSteps}
      allLessons={allLessons}
    />
  );
}
