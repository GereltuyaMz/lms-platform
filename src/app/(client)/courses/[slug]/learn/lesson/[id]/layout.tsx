import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { SetCurrentLesson } from "@/components/player";
import { getLessonWithContent } from "@/lib/actions/unit-actions";
import { fetchQuizData, getAvailableSteps } from "@/lib/lesson-utils";
import type { LessonStep } from "@/lib/lesson-step-utils";

export const revalidate = 0;

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{
    slug: string;
    id: string;
  }>;
};

export default async function LessonLayout({ children, params }: LayoutProps) {
  const { id } = await params;
  const lessonId = id;
  const supabase = await createClient();

  // Get current pathname to detect route type and current step
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";

  // Detect if this is a unit-quiz route
  const isUnitQuiz = pathname.includes("/unit-quiz");

  // Fetch lesson content OR unit data depending on route type
  let lessonWithContent;
  let unitData = null;

  if (isUnitQuiz) {
    // For unit-quiz: fetch unit data
    const { data: unit, error } = await supabase
      .from("units")
      .select("id, title, course_id")
      .eq("id", lessonId)
      .single();

    if (error || !unit) {
      notFound();
    }
    unitData = unit;
  } else {
    // For regular lessons: fetch lesson content
    try {
      lessonWithContent = await getLessonWithContent(lessonId);
      if (!lessonWithContent) {
        notFound();
      }
    } catch {
      notFound();
    }
  }

  // Fetch quiz data to determine available steps (only for regular lessons)
  const quizData = isUnitQuiz ? null : await fetchQuizData(supabase, lessonId);
  const availableSteps: LessonStep[] = isUnitQuiz
    ? []
    : getAvailableSteps(lessonWithContent?.lesson_content, quizData);

  // Determine current step from pathname
  let currentStep: LessonStep = "theory";
  if (!isUnitQuiz) {
    if (pathname.includes("/example")) {
      currentStep = "example";
    } else if (pathname.includes("/test")) {
      currentStep = "test";
    }
  }

  // Prepare lesson info for AI chat
  const lessonTitle = isUnitQuiz
    ? unitData?.title || ""
    : lessonWithContent?.title || "";

  const lessonContent =
    !isUnitQuiz && lessonWithContent?.lesson_content
      ? lessonWithContent.lesson_content
          .map((c) => c.content || "")
          .join(" ")
          .substring(0, 1000)
      : undefined;

  return (
    <SetCurrentLesson
      lessonId={lessonId}
      step={currentStep}
      availableSteps={availableSteps}
      isUnitQuiz={isUnitQuiz}
      lessonInfo={{
        title: lessonTitle,
        content: lessonContent,
      }}
    >
      {children}
    </SetCurrentLesson>
  );
}
