import { QuizPlayer } from "./quiz/QuizPlayer";
import type { QuizData } from "@/types/quiz";

type TestContentProps = {
  quizData: QuizData | null;
  lessonId: string;
  courseId: string;
  lessonTitle: string;
};

export const TestContent = ({
  quizData,
  lessonId,
  courseId,
  lessonTitle,
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
      title={`${lessonTitle} - Тест`}
      quizData={quizData}
      lessonId={lessonId}
      courseId={courseId}
    />
  );
};
