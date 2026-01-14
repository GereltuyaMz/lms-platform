import { Button } from "@/components/ui/button";
import { QuizResults } from "./QuizResults";
import { ArrowCounterClockwiseIcon } from "@phosphor-icons/react";

type QuizResultsSectionProps = {
  score: number;
  totalQuestions: number;
  xpAwarded: number;
  passed: boolean;
  onRetry: () => void;
};

export const QuizResultsSection = ({
  score,
  totalQuestions,
  xpAwarded,
  passed,
  onRetry,
}: QuizResultsSectionProps) => {
  return (
    <>
      <QuizResults
        score={score}
        totalQuestions={totalQuestions}
        xpAwarded={xpAwarded}
        passed={passed}
      />
      {/* Results Navigation */}
      <div className="px-4 md:px-6 pb-6 md:pb-8 pt-4 flex items-center justify-center border-t bg-gradient-to-b from-gray-50 to-white">
        <Button
          variant="landing"
          onClick={onRetry}
          className="cursor-pointer min-w-[200px] flex items-center gap-2"
        >
          <ArrowCounterClockwiseIcon size={20} weight="bold" />
          Дахин турших
        </Button>
      </div>
    </>
  );
};
