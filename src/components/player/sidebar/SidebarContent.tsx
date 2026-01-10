"use client";

import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ProgressCard } from "./ProgressCard";
import { ModulesCard } from "./ModulesCard";
import type { LessonStep } from "@/lib/lesson-step-utils";

type SidebarContentProps = {
  courseTitle: string;
  courseSlug: string;
  progress: {
    completed: number;
    total: number;
    percentage: number;
    streak?: number;
    totalXp: number;
  };
  currentLessonId: string;
  currentStep: LessonStep;
  availableSteps: LessonStep[];
  isCompleted: boolean;
  isUnitQuiz: boolean;
  unitId?: string;
  unitQuizCompleted?: boolean;
  onNavigate?: () => void;
  showBackButton?: boolean;
};

export const SidebarContent = ({
  courseTitle,
  courseSlug,
  progress,
  currentLessonId,
  currentStep,
  availableSteps,
  isCompleted,
  isUnitQuiz,
  unitId,
  unitQuizCompleted,
  onNavigate,
  showBackButton = true,
}: SidebarContentProps) => {
  return (
    <>
      {/* Back Button - only shown on desktop sidebar */}
      {showBackButton && (
        <Link
          href={`/courses/${courseSlug}`}
          className="inline-block mb-4"
          onClick={onNavigate}
        >
          <Button
            variant="outline"
            size="icon"
            className="w-9 h-9 rounded-[10px] shadow-sm border-[#e5e5e5] hover:bg-gray-50"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
        </Link>
      )}

      {/* Cards Container */}
      <div className="flex flex-col gap-5">
        {/* Progress Card */}
        <ProgressCard courseTitle={courseTitle} progress={progress} />

        {/* Modules Card - wrap with onNavigate for mobile close */}
        <div onClick={onNavigate}>
          <ModulesCard
            courseSlug={courseSlug}
            lessonId={currentLessonId}
            currentStep={currentStep}
            availableSteps={availableSteps}
            isCurrentLesson={true}
            isCompleted={isCompleted}
            isUnitQuiz={isUnitQuiz}
            unitId={unitId}
            unitQuizCompleted={unitQuizCompleted}
          />
        </div>
      </div>
    </>
  );
};
