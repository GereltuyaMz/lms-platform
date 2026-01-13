"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  getStepLabel,
  getStepIcon,
  type LessonStep,
} from "@/lib/lesson-step-utils";
import { Crown, FileCheck } from "lucide-react";

type ModulesCardProps = {
  courseSlug: string;
  lessonId: string;
  currentStep?: LessonStep;
  availableSteps: LessonStep[];
  isCurrentLesson: boolean;
  isCompleted: boolean;
  isUnitQuiz?: boolean;
  unitId?: string;
  unitQuizCompleted?: boolean;
  completedSteps?: Set<LessonStep>;
};

export const ModulesCard = ({
  courseSlug,
  lessonId,
  currentStep,
  availableSteps,
  isCurrentLesson,
  isCompleted,
  isUnitQuiz,
  unitId,
  unitQuizCompleted,
  completedSteps = new Set(),
}: ModulesCardProps) => {
  // Unit Quiz Card - when viewing a unit quiz page

  if (isUnitQuiz) {
    return (
      <Link
        href={`/courses/${courseSlug}/learn/lesson/${unitId}/unit-quiz`}
        className={cn(
          "block w-full p-4 rounded-[20px] border transition-colors cursor-pointer",
          unitQuizCompleted
            ? "bg-yellow-50 border-yellow-200 hover:bg-yellow-100"
            : "bg-[#f3e8ff] border-[#d8b4fe] hover:bg-[#ede9fe]"
        )}
      >
        <div className="flex items-center justify-center gap-2">
          {unitQuizCompleted ? (
            <Crown className="w-5 h-5 text-yellow-600" />
          ) : (
            <FileCheck className="w-5 h-5 text-[#675496]" />
          )}
          <span
            className={cn(
              "text-sm font-semibold",
              unitQuizCompleted ? "text-yellow-700" : "text-[#675496]"
            )}
          >
            {unitQuizCompleted ? "Бүлгийн тест дууссан" : "Бүлгийн тест бөглөх"}
          </span>
        </div>
      </Link>
    );
  }

  return (
    <div className="bg-white border border-[#cac4d0] rounded-[20px] p-5 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col gap-3 pb-3">
        <h3 className="text-sm font-semibold text-[#333]">Modules</h3>
        <div className="h-px bg-[#cac4d0] w-full" />
      </div>

      {/* Step Buttons */}
      <div className="flex flex-col">
        {availableSteps.map((step) => {
          const isActive = isCurrentLesson && step === currentStep;
          const stepUrl = `/courses/${courseSlug}/learn/lesson/${lessonId}/${step}`;
          const isStepCompleted =
            (step === "test" && isCompleted) || completedSteps.has(step);

          return (
            <Link
              key={step}
              href={stepUrl}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer",
                isActive ? "bg-[#e2e0f9]" : "bg-white hover:bg-[#f8f2fa]"
              )}
            >
              {/* Icon Container */}
              <div
                className={cn(
                  "border border-white rounded-full w-6 h-6 flex items-center justify-center overflow-hidden shrink-0",
                  isStepCompleted ? "bg-yellow-100" : "bg-[#eaddff]"
                )}
              >
                <span
                  className={cn(
                    isStepCompleted ? "text-yellow-600" : "text-[#675496]"
                  )}
                >
                  {getStepIcon(step, "w-3 h-3")}
                </span>
              </div>

              {/* Label */}
              <span
                className={cn(
                  "text-base font-semibold",
                  isActive ? "text-[#675496]" : "text-[#1a1a1a]"
                )}
              >
                {getStepLabel(step)}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
