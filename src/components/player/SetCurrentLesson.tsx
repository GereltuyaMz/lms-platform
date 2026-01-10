"use client";

import { useEffect } from "react";
import { useLessonPlayer, type LessonInfo } from "@/hooks/useLessonPlayer";
import type { LessonStep } from "@/lib/lesson-step-utils";

type SetCurrentLessonProps = {
  lessonId: string;
  step: LessonStep;
  availableSteps: LessonStep[];
  isUnitQuiz?: boolean;
  lessonInfo: LessonInfo;
  children: React.ReactNode;
};

export const SetCurrentLesson = ({
  lessonId,
  step,
  availableSteps,
  isUnitQuiz = false,
  lessonInfo,
  children,
}: SetCurrentLessonProps) => {
  const { setCurrentLesson, currentLessonId, currentStep } = useLessonPlayer();

  useEffect(() => {
    // Only update if lesson or step changed
    if (currentLessonId !== lessonId || currentStep !== step) {
      setCurrentLesson(lessonId, step, availableSteps, isUnitQuiz, lessonInfo);
    }
  }, [
    lessonId,
    step,
    availableSteps,
    isUnitQuiz,
    lessonInfo,
    setCurrentLesson,
    currentLessonId,
    currentStep,
  ]);

  return <>{children}</>;
};
