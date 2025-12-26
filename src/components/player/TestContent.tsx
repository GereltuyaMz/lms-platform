import { QuizPlayer } from "./quiz/QuizPlayer";
import type { QuizData } from "@/types/quiz";
import type { QuizControlsProps } from "./QuizControls";

type TestContentProps = {
  quizData: QuizData | null;
  lessonId: string;
  courseId: string;
  lessonTitle: string;
  nextLessonUrl?: string | null;
  onQuizStateChange?: (state: QuizControlsProps) => void;
};

export const TestContent = ({
  quizData,
  lessonId,
  courseId,
  lessonTitle,
  nextLessonUrl,
  onQuizStateChange,
}: TestContentProps) => {
  if (!quizData) {
    return (
      <div className="bg-white rounded-lg border p-6 mb-6">
        <p className="text-center text-muted-foreground">
          Энэ хичээлд тест байхгүй байна.
        </p>
      </div>
    );
  }

  return (
    <QuizPlayer
      title={`${lessonTitle} - Шалгалт`}
      quizData={quizData}
      lessonId={lessonId}
      courseId={courseId}
      nextLessonUrl={nextLessonUrl}
      onQuizStateChange={onQuizStateChange}
    />
  );
};
