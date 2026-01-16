"use client";

import { Check, X } from "lucide-react";
import type { MockTestProblem, DetailedAnswer } from "@/types/mock-test";
import Image from "next/image";
import { getMockTestImageUrl } from "@/lib/storage/mock-test-image";
import { MathText } from "@/components/shared/MathText";

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
              <div className="text-gray-700">
                <MathText>{problem.context}</MathText>
              </div>
              {problem.image_url && (
                <div className="mt-3">
                  <Image
                    src={getMockTestImageUrl(problem.image_url)}
                    alt="Problem context diagram"
                    width={600}
                    height={400}
                    className="rounded-lg border border-gray-300 w-full h-auto max-w-2xl"
                  />
                </div>
              )}
            </div>
          )}

          {/* Questions */}
          <div className="space-y-6">
            {problem.questions.map((question) => {
              const userAnswer = answers[question.id];
              const selectedOption = question.options?.find(
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
                    <div className="flex-1">
                      <div className="text-gray-900">
                        <MathText>{question.question_text}</MathText>
                      </div>
                      {question.image_url && (
                        <div className="mt-3">
                          <Image
                            src={getMockTestImageUrl(question.image_url)}
                            alt={`Question ${question.question_number} diagram`}
                            width={500}
                            height={300}
                            className="rounded-lg border border-gray-200 w-full h-auto max-w-xl"
                          />
                        </div>
                      )}
                    </div>
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
                    {!question.options || question.options.length === 0 ? (
                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-yellow-800">
                          ⚠️ Энэ асуултын хариултын сонголтууд байхгүй байна.
                        </p>
                      </div>
                    ) : (
                      question.options.map((option) => {
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
                          <div className="flex items-start gap-2">
                            {isCorrect && (
                              <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                            )}
                            {isSelected && !isCorrect && (
                              <X className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
                            )}
                            <div className="flex-1">
                              {option.option_text && (
                                <div
                                  className={`block ${isSelected ? "font-bold" : ""}`}
                                >
                                  <MathText>{option.option_text}</MathText>
                                </div>
                              )}
                              {option.image_url && (
                                <div className="mt-2">
                                  <Image
                                    src={getMockTestImageUrl(option.image_url)}
                                    alt={`Option ${option.option_text || "image"}`}
                                    width={200}
                                    height={150}
                                    className="rounded border border-gray-200 w-full h-auto max-w-xs"
                                  />
                                </div>
                              )}
                            </div>
                            {isCorrect && (
                              <span className="text-sm text-green-600 font-semibold whitespace-nowrap">
                                Зөв хариулт
                              </span>
                            )}
                            {isSelected && !isCorrect && (
                              <span className="text-sm text-red-600 font-semibold whitespace-nowrap">
                                Таны хариулт
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })
                    )}
                  </div>

                  {/* Explanation */}
                  {question.explanation && (
                    <div className="mt-4 ml-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="text-sm text-gray-700">
                        <span className="font-semibold text-blue-900">
                          Тайлбар:
                        </span>{" "}
                        <MathText>{question.explanation}</MathText>
                      </div>
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
