import { Button } from "@/components/ui/button";
import { QuizResults } from "./QuizResults";

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
      <div className="px-4 md:px-6 pb-4 md:pb-6 pt-2 flex items-center justify-center border-t bg-gray-50">
        <Button variant="outline" onClick={onRetry}>
          Дахин турших
        </Button>
      </div>
    </>
  );
};
