import { CheckCircle, XCircle } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import type { QuizOptionUI } from "@/types/quiz";

type QuizQuestionProps = {
  question: string;
  options: QuizOptionUI[];
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
    <div className="mb-4 md:mb-6">
      <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">{question}</h3>

      <RadioGroup
        key={questionId}
        value={selectedAnswer !== null ? selectedAnswer.toString() : undefined}
        onValueChange={(value) => onAnswerSelect(parseInt(value))}
        disabled={showExplanation}
      >
        <div className="space-y-2 md:space-y-3">
          {options.map((option, index) => (
            <Label
              key={option.id}
              htmlFor={`option-${option.id}`}
              className={`
                flex items-center space-x-3 p-3 md:p-4 rounded-lg border-2 transition-colors
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
              <RadioGroupItem value={index.toString()} id={`option-${option.id}`} />
              <span className="flex-1">{option.text}</span>
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

      </div>
  );
};
