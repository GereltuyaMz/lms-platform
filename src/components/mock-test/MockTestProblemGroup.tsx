"use client";

import type { MockTestProblem, UserAnswers } from "@/types/mock-test";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

type MockTestProblemGroupProps = {
  problem: MockTestProblem;
  userAnswers: UserAnswers;
  onAnswerSelect: (questionId: string, optionId: string) => void;
};

export const MockTestProblemGroup = ({
  problem,
  userAnswers,
  onAnswerSelect,
}: MockTestProblemGroupProps) => {
  return (
    <div className="border rounded-lg p-4 md:p-6 mb-6 bg-white shadow-sm">
      {/* Problem Header */}
      <div className="mb-4">
        <h3 className="text-lg md:text-xl font-bold text-gray-900">
          {problem.title || `Асуулт ${problem.problem_number}`}
        </h3>
        {problem.context && (
          <div className="mt-3 p-3 md:p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
            <p className="text-sm md:text-base text-gray-700 whitespace-pre-wrap">
              {problem.context}
            </p>
          </div>
        )}
      </div>

      {/* Sub-questions */}
      <div className="space-y-6">
        {problem.questions.map((question) => (
          <div
            key={question.id}
            className="pl-4 border-l-2 border-gray-200 space-y-3"
          >
            <div className="flex items-start gap-2">
              <span className="font-bold text-gray-900 text-sm md:text-base">
                {question.question_number})
              </span>
              <div className="flex-1">
                <p className="text-sm md:text-base text-gray-800 mb-3">
                  {question.question_text}
                </p>

                <RadioGroup
                  value={userAnswers[question.id] || ""}
                  onValueChange={(value) => onAnswerSelect(question.id, value)}
                >
                  <div className="space-y-2">
                    {question.options.map((option) => (
                      <div
                        key={option.id}
                        className="flex items-center space-x-2"
                      >
                        <RadioGroupItem
                          value={option.id}
                          id={option.id}
                          className="cursor-pointer"
                        />
                        <Label
                          htmlFor={option.id}
                          className="cursor-pointer text-sm md:text-base flex-1"
                        >
                          {option.option_text}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
