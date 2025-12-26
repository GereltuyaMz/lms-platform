"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export type QuizControlsProps = {
  currentQuestion: number;
  totalQuestions: number;
  selectedAnswer: number | null;
  showExplanation: boolean;
  isSubmitting: boolean;
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
  onSubmit: () => void;
  onNext?: () => void;
  onPrevious: () => void;
  isResultsScreen?: boolean;
  nextLessonUrl?: string | null;
};

export const QuizControls = ({
  currentQuestion,
  totalQuestions,
  selectedAnswer,
  showExplanation,
  isSubmitting,
  isFirstQuestion,
  onSubmit,
  onNext,
  onPrevious,
  isResultsScreen,
  nextLessonUrl,
}: QuizControlsProps) => {
  // Results screen mode
  if (isResultsScreen) {
    return (
      <div className="flex items-center justify-between w-full gap-4">
        <Button
          variant="outline"
          onClick={onPrevious}
          className="flex items-center gap-2"
        >
          <span>Дахин турших</span>
        </Button>

        <div className="text-sm font-medium text-muted-foreground">
          Quiz дууслаа
        </div>

        {nextLessonUrl && onNext ? (
          <Button
            onClick={onNext}
            className="flex items-center gap-2"
          >
            <span>Дараагийн хичээл</span>
          </Button>
        ) : (
          <div className="w-32" />
        )}
      </div>
    );
  }

  // Quiz mode (during questions)
  return (
    <div className="flex items-center justify-between w-full gap-4">
      {/* Previous Question Button */}
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={isFirstQuestion || showExplanation}
        className="flex items-center gap-2"
      >
        <span className="hidden sm:inline">Өмнөх</span>
        <span className="sm:hidden">Өм</span>
      </Button>

      {/* Question Progress */}
      <div className="text-sm font-medium text-muted-foreground">
        {currentQuestion + 1} / {totalQuestions}
      </div>

      {/* Submit/Next Button */}
      {!showExplanation ? (
        <Button
          onClick={onSubmit}
          disabled={selectedAnswer === null}
          className="flex items-center gap-2"
        >
          <span className="hidden sm:inline">Хариу илгээх</span>
          <span className="sm:hidden">Илгээх</span>
        </Button>
      ) : (
        <Button
          onClick={onNext}
          disabled={isSubmitting}
          className="flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              <span className="hidden sm:inline">Хадгалж байна...</span>
              <span className="sm:hidden">Хадгалж...</span>
            </>
          ) : currentQuestion === totalQuestions - 1 ? (
            <>
              <span className="hidden sm:inline">Үр дүнг харах</span>
              <span className="sm:hidden">Үр дүн</span>
            </>
          ) : (
            <>
              <span className="hidden sm:inline">Дараагийн асуулт</span>
              <span className="sm:hidden">Дараах</span>
            </>
          )}
        </Button>
      )}
    </div>
  );
};
