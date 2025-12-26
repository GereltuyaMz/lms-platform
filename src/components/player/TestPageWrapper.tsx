"use client";

import { useState } from "react";
import { TestContent } from "./TestContent";
import { LessonStickyNav } from "./LessonStickyNav";
import type { QuizControlsProps } from "./QuizControls";
import type { QuizData } from "@/types/quiz";

type TestPageWrapperProps = {
  quizData: QuizData | null;
  lessonId: string;
  courseId: string;
  lessonTitle: string;
  nextLessonUrl?: string | null;
};

export const TestPageWrapper = ({
  quizData,
  lessonId,
  courseId,
  lessonTitle,
  nextLessonUrl,
}: TestPageWrapperProps) => {
  const [quizState, setQuizState] = useState<QuizControlsProps | null>(null);

  return (
    <>
      <TestContent
        quizData={quizData}
        lessonId={lessonId}
        courseId={courseId}
        lessonTitle={lessonTitle}
        nextLessonUrl={nextLessonUrl}
        onQuizStateChange={setQuizState}
      />

      {/* Bottom padding to prevent content hiding behind sticky nav */}
      <div className="h-20 md:h-24" />

      {/* Sticky Navigation */}
      {quizState && (
        <LessonStickyNav mode="quiz" quizProps={quizState} />
      )}
    </>
  );
};
