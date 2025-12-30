"use client";

import { Check, X } from "lucide-react";
import type { MockTestProblem, DetailedAnswer } from "@/types/mock-test";

type MockTestDetailedResultsProps = {
  problems: MockTestProblem[];
  answers: Record<string, DetailedAnswer>;
};

export const MockTestDetailedResults = ({
  problems,
  answers,
}: MockTestDetailedResultsProps) => {
  return (
    <div className="space-y-8 mt-8">
      {problems.map((problem) => (
        <div key={problem.id} className="border rounded-lg p-6 bg-white shadow-sm">
          {/* Problem Header */}
          <h3 className="text-xl font-bold mb-4 text-gray-900">
            {problem.title || `Асуулт ${problem.problem_number}`}
          </h3>

          {problem.context && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-gray-700">{problem.context}</p>
            </div>
          )}

          {/* Questions */}
          <div className="space-y-6">
            {problem.questions.map((question) => {
              const userAnswer = answers[question.id];
              const selectedOption = question.options.find(
                (o) => o.id === userAnswer?.selected_option_id
              );

              return (
                <div
                  key={question.id}
                  className="border-l-4 pl-4 py-2"
                  style={{
                    borderColor: userAnswer?.is_correct ? "#10b981" : "#ef4444",
                  }}
                >
                  <div className="flex items-start gap-2 mb-3">
                    <span className="font-bold text-gray-700">
                      {question.question_number})
                    </span>
                    <p className="flex-1 text-gray-900">{question.question_text}</p>
                    <div
                      className={`px-3 py-1 rounded-full text-sm font-bold whitespace-nowrap ${
                        userAnswer?.is_correct
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {userAnswer?.points_earned || 0} оноо
                    </div>
                  </div>

                  {/* Options */}
                  <div className="space-y-2 ml-6">
                    {question.options.map((option) => {
                      const isSelected =
                        option.id === userAnswer?.selected_option_id;
                      // Determine if this option is correct based on available data
                      const isCorrect =
                        option.is_correct ??
                        (isSelected && userAnswer?.is_correct === true);

                      return (
                        <div
                          key={option.id}
                          className={`p-3 rounded-lg border-2 transition-colors ${
                            isCorrect
                              ? "border-green-500 bg-green-50"
                              : isSelected
                              ? "border-red-500 bg-red-50"
                              : "border-gray-200 bg-white"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {isCorrect && (
                              <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                            )}
                            {isSelected && !isCorrect && (
                              <X className="w-5 h-5 text-red-600 flex-shrink-0" />
                            )}
                            <span
                              className={`flex-1 ${isSelected ? "font-bold" : ""}`}
                            >
                              {option.option_text}
                            </span>
                            {isCorrect && (
                              <span className="text-sm text-green-600 font-semibold">
                                Зөв хариулт
                              </span>
                            )}
                            {isSelected && !isCorrect && (
                              <span className="text-sm text-red-600 font-semibold">
                                Таны хариулт
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation */}
                  {question.explanation && (
                    <div className="mt-4 ml-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold text-blue-900">
                          Тайлбар:
                        </span>{" "}
                        {question.explanation}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
