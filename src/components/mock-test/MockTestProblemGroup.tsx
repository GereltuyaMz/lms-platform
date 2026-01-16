"use client";

import type { MockTestProblem, UserAnswers } from "@/types/mock-test";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { getMockTestImageUrl } from "@/lib/storage/mock-test-image";
import { MathText } from "@/components/shared/MathText";

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
            <div className="text-sm md:text-base text-gray-700 whitespace-pre-wrap">
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
                  priority={false}
                />
              </div>
            )}
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
                <div className="text-sm md:text-base text-gray-800 mb-3">
                  <MathText>{question.question_text}</MathText>
                </div>

                {question.image_url && (
                  <div className="mb-4">
                    <Image
                      src={getMockTestImageUrl(question.image_url)}
                      alt={`Question ${question.question_number} diagram`}
                      width={500}
                      height={300}
                      className="rounded-lg border border-gray-200 w-full h-auto max-w-xl"
                      priority={false}
                    />
                  </div>
                )}

                {!question.options || question.options.length === 0 ? (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      ⚠️ Энэ асуултын хариултын сонголтууд байхгүй байна.
                    </p>
                  </div>
                ) : (
                  <RadioGroup
                    value={userAnswers[question.id] || ""}
                    onValueChange={(value) => onAnswerSelect(question.id, value)}
                  >
                    <div className="space-y-2">
                      {question.options.map((option) => (
                        <div
                          key={option.id}
                          className="flex items-start space-x-2"
                        >
                          <RadioGroupItem
                            value={option.id}
                            id={option.id}
                            className="cursor-pointer mt-1"
                          />
                          <Label
                            htmlFor={option.id}
                            className="cursor-pointer flex-1"
                          >
                            <div className="flex flex-col gap-2">
                              {option.option_text && (
                                <div className="text-sm md:text-base">
                                  <MathText>{option.option_text}</MathText>
                                </div>
                              )}
                              {option.image_url && (
                                <Image
                                  src={getMockTestImageUrl(option.image_url)}
                                  alt={`Option ${option.option_text || "image"}`}
                                  width={200}
                                  height={150}
                                  className="rounded border border-gray-200 w-full h-auto max-w-xs"
                                />
                              )}
                            </div>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
