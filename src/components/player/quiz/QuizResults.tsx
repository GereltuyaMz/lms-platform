import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

type QuizResultsProps = {
  score: number;
  totalQuestions: number;
  onRetry: () => void;
};

export const QuizResults = ({
  score,
  totalQuestions,
  onRetry,
}: QuizResultsProps) => {
  return (
    <div className="p-8 text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <CheckCircle className="w-10 h-10 text-green-600" />
      </div>
      <h3 className="text-2xl font-bold mb-2">Quiz дууслаа!</h3>
      <p className="text-lg text-muted-foreground mb-6">
        Та {totalQuestions}-аас {score} оноо авлаа
      </p>

      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-lg p-6 mb-6 max-w-md mx-auto">
        <p className="text-amber-900 font-semibold text-lg">
          🎉 +{score * 20} XP
        </p>
      </div>

      <div className="flex gap-3 justify-center">
        <Button variant="outline" onClick={onRetry}>
          Дахин турших
        </Button>
      </div>
    </div>
  );
};
