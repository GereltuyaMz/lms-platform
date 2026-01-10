"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LessonBreadcrumb } from "./LessonBreadcrumb";
import { MobileSidebarSheet } from "./sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { LessonStep } from "@/lib/lesson-step-utils";
import { getStepLabel } from "@/lib/lesson-step-utils";
import type { Lesson } from "@/types/database/tables";
import type { LessonItem } from "@/lib/lesson-utils";

type LessonContentHeaderProps = {
  courseTitle: string;
  courseSlug: string;
  unitTitle?: string;
  lessonTitle: string;
  lessonId: string;
  currentStep: LessonStep;
  availableSteps: LessonStep[];
  allLessons: Lesson[] | LessonItem[];
  // Mobile sidebar props
  progress: {
    completed: number;
    total: number;
    percentage: number;
    streak?: number;
    totalXp: number;
  };
  isCompleted: boolean;
  isUnitQuiz: boolean;
  unitId?: string;
  unitQuizCompleted?: boolean;
};

export const LessonContentHeader = ({
  courseTitle,
  courseSlug,
  unitTitle,
  lessonTitle,
  lessonId,
  currentStep,
  availableSteps,
  allLessons,
  progress,
  isCompleted,
  isUnitQuiz,
  unitId,
  unitQuizCompleted,
}: LessonContentHeaderProps) => {
  const currentIndex = availableSteps.indexOf(currentStep);
  const isFirstStep = currentIndex === 0;
  const isLastStep = currentIndex === availableSteps.length - 1;

  // Helper to check if item is a LessonItem (with isUnitQuiz flag)
  const isLessonItem = (lesson: Lesson | LessonItem): lesson is LessonItem => {
    return "isUnitQuiz" in lesson;
  };

  // Helper to generate route for a lesson/unit quiz
  const getLessonRoute = (lesson: Lesson | LessonItem, step?: LessonStep) => {
    if (isLessonItem(lesson) && lesson.isUnitQuiz) {
      return `/courses/${courseSlug}/learn/lesson/${lesson.unitId}/unit-quiz`;
    }
    return `/courses/${courseSlug}/learn/lesson/${lesson.id}${
      step ? `/${step}` : ""
    }`;
  };

  const lessonIndex = allLessons.findIndex((l) => l.id === lessonId);
  const previousLesson = lessonIndex > 0 ? allLessons[lessonIndex - 1] : null;
  const nextLesson =
    lessonIndex < allLessons.length - 1 ? allLessons[lessonIndex + 1] : null;

  const getPreviousUrl = () => {
    if (!isFirstStep) {
      const prevStep = availableSteps[currentIndex - 1];
      return `/courses/${courseSlug}/learn/lesson/${lessonId}/${prevStep}`;
    } else if (previousLesson) {
      return getLessonRoute(previousLesson);
    }
    return null;
  };

  const getNextUrl = () => {
    if (!isLastStep) {
      const nextStep = availableSteps[currentIndex + 1];
      return `/courses/${courseSlug}/learn/lesson/${lessonId}/${nextStep}`;
    } else if (nextLesson) {
      return getLessonRoute(nextLesson);
    }
    return null;
  };

  const previousUrl = getPreviousUrl();
  const nextUrl = getNextUrl();
  const stepLabel = getStepLabel(currentStep);

  return (
    <div className="flex flex-col gap-3">
      {/* Breadcrumb Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Mobile Back Button - visible only on mobile/tablet */}
          <Link href={`/courses/${courseSlug}`} className="md:hidden">
            <Button
              variant="outline"
              size="icon"
              className="w-9 h-9 rounded-[10px] shadow-sm border-[#e5e5e5] hover:bg-gray-50 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
          </Link>
          {/* Mobile Sidebar Trigger - visible only on mobile/tablet */}
          <MobileSidebarSheet
            courseTitle={courseTitle}
            courseSlug={courseSlug}
            progress={progress}
            currentLessonId={lessonId}
            currentStep={currentStep}
            availableSteps={availableSteps}
            isCompleted={isCompleted}
            isUnitQuiz={isUnitQuiz}
            unitId={unitId}
            unitQuizCompleted={unitQuizCompleted}
          />
          <LessonBreadcrumb
            courseTitle={courseTitle}
            courseSlug={courseSlug}
            unitOrSectionTitle={unitTitle}
            lessonTitle={lessonTitle}
          />
        </div>
      </div>

      {/* Divider */}
      <div className="border-b border-[#e5e5e5]" />

      {/* Step Title + Navigation Row */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg md:text-2xl font-semibold text-[#333]">
          {stepLabel}
        </h2>

        {/* Circular Navigation Buttons */}
        <div className="flex items-center gap-1.5 md:gap-2">
          <TooltipProvider>
            {/* Previous Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                {previousUrl ? (
                  <Link
                    href={previousUrl}
                    className={cn(
                      "flex items-center justify-center size-9 md:size-10 rounded-full",
                      "bg-white border border-[#e5e5e5] shadow-sm",
                      "hover:bg-gray-50 transition-colors cursor-pointer"
                    )}
                  >
                    <ChevronLeft className="size-4 text-[#333] transition-colors" />
                  </Link>
                ) : (
                  <div
                    className={cn(
                      "flex items-center justify-center size-9 md:size-10 rounded-full",
                      "bg-white border border-[#e5e5e5] shadow-sm",
                      "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <ChevronLeft className="size-4 text-[#333]" />
                  </div>
                )}
              </TooltipTrigger>
              <TooltipContent className="bg-[#333] text-white">
                <p>Өмнөх</p>
              </TooltipContent>
            </Tooltip>

            {/* Next Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                {nextUrl ? (
                  <Link
                    href={nextUrl}
                    className={cn(
                      "flex items-center justify-center size-9 md:size-10 rounded-full",
                      "bg-white border border-[#e5e5e5] shadow-sm",
                      "hover:bg-gray-50 transition-colors cursor-pointer"
                    )}
                  >
                    <ChevronRight className="size-4 text-[#333]" />
                  </Link>
                ) : (
                  <div
                    className={cn(
                      "flex items-center justify-center size-9 md:size-10 rounded-full",
                      "bg-white border border-[#e5e5e5] shadow-sm",
                      "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <ChevronRight className="size-4 text-[#333]" />
                  </div>
                )}
              </TooltipTrigger>
              <TooltipContent className="bg-[#333] text-white">
                <p>Дараах</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};
