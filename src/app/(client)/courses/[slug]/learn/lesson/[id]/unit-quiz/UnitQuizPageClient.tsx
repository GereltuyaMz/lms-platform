"use client";

import { UnitQuizPlayer } from "@/components/player/quiz";
import { LessonContentHeader } from "@/components/player/LessonContentHeader";
import { useLessonPlayer } from "@/hooks/useLessonPlayer";
import type { QuizOptionUI } from "@/types/quiz";
import type { LessonItem } from "@/lib/lesson-utils";

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
  courseSlug: string;
  courseTitle: string;
  unitTitle: string;
  allLessons: LessonItem[];
};

export const UnitQuizPageClient = ({
  title,
  quizData,
  unitId,
  courseId,
  courseSlug,
  courseTitle,
  unitTitle,
  allLessons,
}: UnitQuizPageClientProps) => {
  const { sidebarData } = useLessonPlayer();

  // Get progress data from context
  const progress = sidebarData?.progress ?? {
    completed: 0,
    total: 0,
    percentage: 0,
    streak: 0,
    totalXp: 0,
    totalPlatformXp: 0,
  };

  // Find unit quiz completion status
  const allItems = sidebarData?.units?.flatMap((u) => u.items) ?? [];
  const unitQuizItem = allItems.find(
    (item) => item.isUnitQuiz && item.unitId === unitId
  );

  return (
    <div className="flex flex-col gap-5">
      <LessonContentHeader
        courseTitle={courseTitle}
        courseSlug={courseSlug}
        unitTitle={unitTitle}
        lessonTitle={title}
        lessonId={`unit-quiz-${unitId}`}
        currentStep="unit-quiz"
        availableSteps={["unit-quiz"]}
        allLessons={allLessons}
        progress={progress}
        isCompleted={unitQuizItem?.completed ?? false}
        isUnitQuiz={true}
        unitId={unitId}
        unitQuizCompleted={unitQuizItem?.completed ?? false}
      />
      <UnitQuizPlayer
        title={title}
        quizData={quizData}
        unitId={unitId}
        courseId={courseId}
      />
    </div>
  );
};
