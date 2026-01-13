import { CheckCircle, XCircle, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

type QuizResultsProps = {
  score: number;
  totalQuestions: number;
  xpAwarded: number;
  passed: boolean;
};

export const QuizResults = ({
  score,
  totalQuestions,
  xpAwarded,
  passed,
}: QuizResultsProps) => {
  const scorePercentage = Math.round((score / totalQuestions) * 100);

  return (
    <div className="p-8 text-center">
      <div
        className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
          passed ? "bg-green-100" : "bg-red-100"
        }`}
      >
        {passed ? (
          <CheckCircle className="w-10 h-10 text-green-600" />
        ) : (
          <XCircle className="w-10 h-10 text-red-600" />
        )}
      </div>
      <h3 className="text-2xl font-bold mb-2">
        {passed ? "Амжилттай давлаа!" : "Дахин оролдоорой"}
      </h3>
      <p className="text-lg text-muted-foreground mb-6">
        Та {totalQuestions}-аас {score} оноо авлаа ({scorePercentage}%)
      </p>

      {xpAwarded > 0 && (
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-lg p-6 mb-6 max-w-md mx-auto">
          <p className="text-amber-900 font-semibold text-lg">
            🎉 +{xpAwarded} XP
          </p>
        </div>
      )}

      {/* Explanation Section */}
      <div className="mt-6 space-y-3 max-w-md mx-auto">
        {/* Conditional message based on outcome */}
        {passed && xpAwarded === 0 && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Та тестийг давсан боловч энэ нь давтан оролдлого тул XP олгогдохгүй.
              XP зөвхөн анхны амжилттай оролдлогод олгогдоно.
            </AlertDescription>
          </Alert>
        )}

        {!passed && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Тестийг давахын тулд 80%-иас дээш үнэлгээ шаардлагатай.
              Дахин оролдож, XP цуглуулаарай!
            </AlertDescription>
          </Alert>
        )}

        {/* General Quiz Info */}
        <div className="text-sm text-muted-foreground space-y-1.5 pt-2">
          <p className="flex items-center justify-center gap-2">
            <span>📊</span>
            <span>Давах босго: 80%</span>
          </p>
          <p className="flex items-center justify-center gap-2">
            <span>⭐</span>
            <span>XP зөвхөн анхны амжилттай оролдлогод олгогдоно</span>
          </p>
        </div>
      </div>
    </div>
  );
};
