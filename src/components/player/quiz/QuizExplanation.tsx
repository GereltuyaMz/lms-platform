import { CheckCircle, XCircle } from "lucide-react";

type QuizExplanationProps = {
  isCorrect: boolean;
  explanation: string;
};

export const QuizExplanation = ({
  isCorrect,
  explanation,
}: QuizExplanationProps) => {
  return (
    <div
      className={`p-3 md:p-4 rounded-lg mt-4 md:mt-6 ${
        isCorrect
          ? "bg-green-50 border border-green-200"
          : "bg-red-50 border border-red-200"
      }`}
    >
      <div className="flex items-start gap-3">
        {isCorrect ? (
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
        ) : (
          <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
        )}
        <div>
          <p
            className={`font-semibold mb-1 ${
              isCorrect ? "text-green-900" : "text-red-900"
            }`}
          >
            {isCorrect ? "Зөв байна!" : "Буруу байна"}
          </p>
          <p
            className={`text-sm ${
              isCorrect ? "text-green-700" : "text-red-700"
            }`}
          >
            {explanation}
          </p>
        </div>
      </div>
    </div>
  );
};
