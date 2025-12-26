"use client";

import { NavigationControls } from "./NavigationControls";
import { QuizControls, type QuizControlsProps } from "./QuizControls";
import type { LessonStep } from "@/lib/lesson-step-utils";
import type { Lesson } from "@/types/database/tables";

type NavigationProps = {
  courseSlug: string;
  lessonId: string;
  currentStep: LessonStep;
  availableSteps: LessonStep[];
  allLessons: Lesson[];
};

type LessonStickyNavProps =
  | { mode: "navigation"; navigationProps: NavigationProps }
  | { mode: "quiz"; quizProps: QuizControlsProps };

export const LessonStickyNav = (props: LessonStickyNavProps) => {
  return (
    <nav className="fixed bottom-0 left-[340px] right-0 z-50 bg-white border-t shadow-lg">
      <div className="max-w-[1260px] mx-auto px-4 md:px-6 lg:px-8 h-16 md:h-20 flex items-center">
        {props.mode === "navigation" && (
          <NavigationControls {...props.navigationProps} />
        )}
        {props.mode === "quiz" && <QuizControls {...props.quizProps} />}
      </div>
    </nav>
  );
};
