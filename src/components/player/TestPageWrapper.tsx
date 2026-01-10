"use client";

import { TestContent } from "./TestContent";
import { LessonContentWrapper } from "./LessonContentWrapper";
import type { QuizData } from "@/types/quiz";
import type { LessonStep } from "@/lib/lesson-step-utils";
import type { Lesson } from "@/types/database/tables";
import type { LessonItem } from "@/lib/lesson-utils";

type TestPageWrapperProps = {
  quizData: QuizData | null;
  lessonId: string;
  courseId: string;
  lessonTitle: string;
  // Wrapper props for new design
  courseTitle: string;
  courseSlug: string;
  unitTitle?: string;
  currentStep: LessonStep;
  availableSteps: LessonStep[];
  allLessons: Lesson[] | LessonItem[];
};

export const TestPageWrapper = ({
  quizData,
  lessonId,
  courseId,
  lessonTitle,
  courseTitle,
  courseSlug,
  unitTitle,
  currentStep,
  availableSteps,
  allLessons,
}: TestPageWrapperProps) => {
  return (
    <LessonContentWrapper
      courseTitle={courseTitle}
      courseSlug={courseSlug}
      courseId={courseId}
      unitTitle={unitTitle}
      lessonTitle={lessonTitle}
      lessonId={lessonId}
      currentStep={currentStep}
      availableSteps={availableSteps}
      allLessons={allLessons}
      hideMarkComplete={true}
    >
      <TestContent
        quizData={quizData}
        lessonId={lessonId}
        courseId={courseId}
        lessonTitle={lessonTitle}
      />
    </LessonContentWrapper>
  );
};
