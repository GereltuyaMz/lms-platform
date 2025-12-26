import type { LessonContent } from "@/types/database/tables";
import type { QuizData } from "@/types/quiz";

// =====================================================
// LESSON STEP HELPERS (CLIENT-SAFE)
// =====================================================

export type LessonStep = 'theory' | 'example' | 'test';

/**
 * Determine which steps are available for a lesson based on content and quiz data
 */
export const getAvailableSteps = (
  lessonContent: LessonContent[] | undefined,
  quizData: QuizData | null
): LessonStep[] => {
  const steps: LessonStep[] = [];

  const hasTheory = lessonContent?.some(c => c.content_type === 'theory');
  const hasExample = lessonContent?.some(c => c.content_type === 'example');
  const hasTest = !!quizData;

  if (hasTheory) steps.push('theory');
  if (hasExample) steps.push('example');
  if (hasTest) steps.push('test');

  return steps;
};

/**
 * Get display label for a lesson step
 */
export const getStepLabel = (step: LessonStep): string => {
  const labels: Record<LessonStep, string> = {
    theory: 'Теори',
    example: 'Жишээ',
    test: 'Тест',
  };
  return labels[step];
};
