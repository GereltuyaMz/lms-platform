"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { LessonStep } from "@/lib/lesson-step-utils";
import type { Lesson } from "@/types/database/tables";
import type { LessonItem } from "@/lib/lesson-utils";

type NavigationControlsProps = {
  courseSlug: string;
  lessonId: string;
  currentStep: LessonStep;
  availableSteps: LessonStep[];
  allLessons: Lesson[] | LessonItem[];
};

export const NavigationControls = ({
  courseSlug,
  lessonId,
  currentStep,
  availableSteps,
  allLessons,
}: NavigationControlsProps) => {
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
    return `/courses/${courseSlug}/learn/lesson/${lesson.id}${step ? `/${step}` : ""}`;
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
      return getLessonRoute(nextLesson, "theory");
    }
    return null;
  };

  const getPreviousLabel = () => {
    if (!isFirstStep) return "Өмнөх";
    return "Өмнөх хичээл";
  };

  const getNextLabel = () => {
    if (!isLastStep) return "Дараах";
    return "Дараагийн хичээл";
  };

  const previousUrl = getPreviousUrl();
  const nextUrl = getNextUrl();

  return (
    <div className="flex items-center justify-between w-full gap-4">
      {/* Previous Button */}
      {previousUrl ? (
        <Button
          variant="outline"
          asChild
          className="flex items-center gap-2 hover:text-white transition-all duration-300"
        >
          <Link href={previousUrl}>
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">{getPreviousLabel()}</span>
            <span className="sm:hidden">Өмнөх</span>
          </Link>
        </Button>
      ) : (
        <Button variant="outline" disabled className="flex items-center gap-2">
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Өмнөх хичээл</span>
          <span className="sm:hidden">Өмнөх</span>
        </Button>
      )}

      {/* Step Progress Indicator */}
      <div className="flex items-center gap-2">
        {availableSteps.map((step, index) => (
          <div
            key={step}
            className={`h-2 rounded-full transition-all duration-500 ${
              index === currentIndex
                ? "w-8 bg-primary"
                : index < currentIndex
                ? "w-2 bg-primary/60"
                : "w-2 bg-gray-300"
            }`}
          />
        ))}
      </div>

      {/* Next Button */}
      {nextUrl ? (
        <Button
          asChild
          className="flex items-center gap-2 transition-all duration-300"
        >
          <Link href={nextUrl}>
            <span className="hidden sm:inline">{getNextLabel()}</span>
            <span className="sm:hidden">Дараах</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </Button>
      ) : (
        <Button disabled className="flex items-center gap-2">
          <span className="hidden sm:inline">Дараагийн хичээл</span>
          <span className="sm:hidden">Дараах</span>
          <ChevronRight className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};
