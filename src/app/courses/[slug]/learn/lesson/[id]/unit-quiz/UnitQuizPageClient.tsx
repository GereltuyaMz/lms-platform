"use client";

import { useState } from "react";
import { LessonStickyNav } from "@/components/player";
import { UnitQuizPlayer } from "@/components/player/quiz";
import type { QuizControlsProps } from "@/components/player/QuizControls";
import type { QuizOptionUI } from "@/types/quiz";

type QuizQuestionData = {
  id: string | number;
  question: string;
  options: QuizOptionUI[];
  correctAnswer: number;
  explanation: string;
  points?: number;
};

type QuizData = {
  totalQuestions: number;
  questions: QuizQuestionData[];
};

type UnitQuizPageClientProps = {
  title: string;
  quizData: QuizData | null;
  unitId: string;
  courseId: string;
  nextLessonUrl: string | null;
};

export const UnitQuizPageClient = ({
  title,
  quizData,
  unitId,
  courseId,
  nextLessonUrl,
}: UnitQuizPageClientProps) => {
  const [quizControls, setQuizControls] = useState<QuizControlsProps | null>(null);

  return (
    <>
      <UnitQuizPlayer
        title={title}
        quizData={quizData}
        unitId={unitId}
        courseId={courseId}
        nextLessonUrl={nextLessonUrl}
        onQuizStateChange={setQuizControls}
      />

      {quizControls && (
        <LessonStickyNav
          mode="quiz"
          quizProps={quizControls}
        />
      )}
    </>
  );
};
