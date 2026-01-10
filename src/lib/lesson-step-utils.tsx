import type { LessonContent } from "@/types/database/tables";
import type { QuizData } from "@/types/quiz";
import { TheoryIcon, ExampleIcon, TestIcon } from "@/icons";

// =====================================================
// LESSON STEP HELPERS (CLIENT-SAFE)
// =====================================================

export type LessonStep = "theory" | "example" | "test" | "unit-quiz";

/**
 * Determine which steps are available for a lesson based on content and quiz data
 */
export const getAvailableSteps = (
  lessonContent: LessonContent[] | undefined,
  quizData: QuizData | null
): LessonStep[] => {
  const steps: LessonStep[] = [];

  const hasTheory = lessonContent?.some((c) => c.content_type === "theory");
  const hasExample = lessonContent?.some((c) => c.content_type === "example");
  const hasTest = !!quizData;

  if (hasTheory) steps.push("theory");
  if (hasExample) steps.push("example");
  if (hasTest) steps.push("test");

  return steps;
};

/**
 * Get display label for a lesson step
 */
export const getStepLabel = (step: LessonStep): string => {
  const labels: Record<LessonStep, string> = {
    theory: "Онол",
    example: "Жишээ",
    test: "Тест",
    "unit-quiz": "Бүлгийн тест",
  };
  return labels[step];
};

/**
 * Get the appropriate icon component for a lesson step
 */
export const getStepIcon = (step: LessonStep, className?: string) => {
  switch (step) {
    case "theory":
      return <TheoryIcon className={className} />;
    case "example":
      return <ExampleIcon className={className} />;
    case "test":
      return <TestIcon className={className} />;
  }
};
