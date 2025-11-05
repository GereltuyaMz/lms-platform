import { Progress } from "@/components/ui/progress";

type QuizProgressProps = {
  currentQuestion: number;
  totalQuestions: number;
};

export const QuizProgress = ({
  currentQuestion,
  totalQuestions,
}: QuizProgressProps) => {
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  return (
    <div className="space-y-2 mb-6">
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>
          Question {currentQuestion + 1} of {totalQuestions}
        </span>
        <span>{Math.round(progress)}% Complete</span>
      </div>
      <Progress value={progress} />
    </div>
  );
};
