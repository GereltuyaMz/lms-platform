import { CheckCircle, XCircle } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

type QuizQuestionProps = {
  question: string;
  options: string[];
  selectedAnswer: number | null;
  correctAnswer: number;
  showExplanation: boolean;
  explanation: string;
  onAnswerSelect: (index: number) => void;
  questionId?: string | number;
};

export const QuizQuestion = ({
  question,
  options,
  selectedAnswer,
  correctAnswer,
  showExplanation,
  explanation,
  onAnswerSelect,
  questionId,
}: QuizQuestionProps) => {
  const isCorrect = selectedAnswer === correctAnswer;

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-4">{question}</h3>

      <RadioGroup
        key={questionId}
        value={selectedAnswer !== null ? selectedAnswer.toString() : undefined}
        onValueChange={(value) => onAnswerSelect(parseInt(value))}
        disabled={showExplanation}
      >
        <div className="space-y-3">
          {options.map((option, index) => (
            <Label
              key={index}
              htmlFor={`option-${index}`}
              className={`
                flex items-center space-x-3 p-4 rounded-lg border-2 transition-colors
                ${
                  showExplanation
                    ? index === correctAnswer
                      ? "border-green-500 bg-green-50"
                      : index === selectedAnswer
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200"
                    : selectedAnswer === index
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }
                ${showExplanation ? "cursor-default" : "cursor-pointer"}
              `}
            >
              <RadioGroupItem value={index.toString()} id={`option-${index}`} />
              <span className="flex-1">{option}</span>
              {showExplanation && index === correctAnswer && (
                <CheckCircle className="w-5 h-5 text-green-600" />
              )}
              {showExplanation &&
                index === selectedAnswer &&
                index !== correctAnswer && (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
            </Label>
          ))}
        </div>
      </RadioGroup>

      {/* Explanation */}
      {showExplanation && (
        <div
          className={`p-4 rounded-lg mt-6 ${
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
      )}
    </div>
  );
};
