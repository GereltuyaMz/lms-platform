import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type QuizNavigationProps = {
  currentQuestion: number;
  totalQuestions: number;
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
  showExplanation: boolean;
  selectedAnswer: number | null;
  isSubmitting: boolean;
  onPrevious: () => void;
  onSubmit: () => void;
  onNext: () => void;
};

export const QuizNavigation = ({
  currentQuestion,
  totalQuestions,
  isFirstQuestion,
  isLastQuestion,
  showExplanation,
  selectedAnswer,
  isSubmitting,
  onPrevious,
  onSubmit,
  onNext,
}: QuizNavigationProps) => {
  return (
    <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t flex items-center justify-between">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={isFirstQuestion || showExplanation}
      >
        Өмнөх
      </Button>

      <span className="text-sm font-medium text-muted-foreground">
        {currentQuestion + 1} / {totalQuestions}
      </span>

      {!showExplanation ? (
        <Button
          onClick={onSubmit}
          disabled={selectedAnswer === null}
          className="bg-[#606099] hover:bg-[#505085]"
        >
          Хариу илгээх
        </Button>
      ) : (
        <Button
          onClick={onNext}
          disabled={isSubmitting}
          className="bg-[#606099] hover:bg-[#505085]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Хадгалж байна...
            </>
          ) : isLastQuestion ? (
            "Үр дүнг харах"
          ) : (
            "Дараагийн асуулт"
          )}
        </Button>
      )}
    </div>
  );
};
