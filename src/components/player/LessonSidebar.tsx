"use client";

import {
  Lock,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Lightbulb,
  FileCheck,
  Crown,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import type { LessonType } from "@/types/database";
import type { Unit } from "@/types/database/tables";
import { getStepLabel, type LessonStep } from "@/lib/lesson-step-utils";
import { cn } from "@/lib/utils";
import { LessonBreadcrumb } from "./LessonBreadcrumb";

// Legacy type for section-based display
type LessonItem = {
  id: string;
  title: string;
  duration: string;
  type: LessonType;
  completed: boolean;
  current?: boolean;
  locked?: boolean;
  isUnitQuiz?: boolean;
  unitId?: string;
};

// Legacy type
type LessonSection = {
  section: string;
  items: LessonItem[];
};

// New type for unit-based display
type UnitSection = {
  unit: Unit;
  items: LessonItem[];
  hasUnitQuiz: boolean;
};

type LessonSidebarProps = {
  courseTitle: string;
  courseSlug: string;
  // Support both legacy sections and new units
  lessons?: LessonSection[];
  units?: UnitSection[];
  progress: {
    completed: number;
    total: number;
    percentage: number;
    streak?: number;
    totalXp: number;
  };
  currentLessonTitle?: string;
  currentStep?: LessonStep;
  availableSteps?: LessonStep[];
  lessonStepsMap?: Map<string, LessonStep[]>;
};

export const LessonSidebar = ({
  courseTitle,
  courseSlug,
  lessons,
  units,
  progress,
  currentStep,
  availableSteps = [],
  lessonStepsMap = new Map(),
}: LessonSidebarProps) => {
  // Determine which data source to use
  const hasUnits = units && units.length > 0;

  // Flatten all lessons from sections/units
  const allLessons = hasUnits
    ? units.flatMap((u) => u.items)
    : (lessons || []).flatMap((l) => l.items);

  // Find current lesson index
  const currentLessonIndex = allLessons.findIndex((item) => item.current);
  const [viewingLessonIndex, setViewingLessonIndex] = useState(
    currentLessonIndex >= 0 ? currentLessonIndex : 0
  );

  const viewingLesson = allLessons[viewingLessonIndex];
  const isFirstLesson = viewingLessonIndex === 0;
  const isLastLesson = viewingLessonIndex === allLessons.length - 1;

  // Find which section/unit the viewing lesson belongs to
  const getSectionTitle = (lessonId: string) => {
    if (hasUnits && units) {
      for (const unit of units) {
        if (unit.items.some((item) => item.id === lessonId)) {
          return unit.unit.title;
        }
      }
    } else if (lessons) {
      for (const section of lessons) {
        if (section.items.some((item) => item.id === lessonId)) {
          return section.section;
        }
      }
    }
    return "";
  };

  const handlePrevious = () => {
    if (!isFirstLesson) {
      setViewingLessonIndex(viewingLessonIndex - 1);
    }
  };

  const handleNext = () => {
    if (!isLastLesson) {
      setViewingLessonIndex(viewingLessonIndex + 1);
    }
  };

  const getStepIcon = (step: LessonStep) => {
    const iconClass = "w-4 h-4";
    switch (step) {
      case "theory":
        return <BookOpen className={iconClass} />;
      case "example":
        return <Lightbulb className={iconClass} />;
      case "test":
        return <FileCheck className={iconClass} />;
    }
  };

  if (!viewingLesson) {
    return null;
  }

  const sectionTitle = getSectionTitle(viewingLesson.id);

  return (
    <aside className="w-[340px] bg-white border-r h-[calc(100vh-73px)] sticky top-[73px] overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Course Progress Card */}
        <div className="bg-linear-to-br from-blue-50 to-purple-50 rounded-xl p-4 border">
          <h3 className="font-semibold text-sm mb-3">{courseTitle}</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs text-muted-foreground mb-2">
                <span>Явц</span>
                <span>
                  {progress.completed} -c {progress.total} сургалт
                </span>
              </div>
              <Progress value={progress.percentage} className="h-2" />
            </div>
            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex items-center gap-1.5">
                <span className="text-lg">🔥</span>
                <span className="text-sm font-semibold">
                  {progress.streak} өдөр стрик
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg">⚡</span>
                <span className="text-sm font-semibold">
                  {progress.totalXp} XP
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Lesson Navigation */}
        <div className="space-y-2">
          {/* Metadata Row (Top) */}
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            {viewingLesson.locked && (
              <Lock className="w-3.5 h-3.5 text-gray-400" />
            )}
            <span>{viewingLesson.duration}</span>
          </div>

          {/* Breadcrumb Navigation Row (Bottom) */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevious}
              disabled={isFirstLesson}
              className="h-7 w-7 shrink-0"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>

            <div className="flex-1 flex justify-center">
              <LessonBreadcrumb
                courseTitle={courseTitle}
                courseSlug={courseSlug}
                unitOrSectionTitle={sectionTitle}
                lessonTitle={viewingLesson.title}
                compact
              />
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleNext}
              disabled={isLastLesson}
              className="h-7 w-7 shrink-0"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Lesson Steps or Unit Quiz Button */}
        {!viewingLesson.isUnitQuiz ? (
          <div className="space-y-2">
            {/* For current lesson: show actual available steps with completion state */}
            {viewingLesson.current && availableSteps.length > 0
              ? availableSteps.map((step) => {
                  const isActive =
                    step === currentStep && viewingLesson.current;

                  const stepUrl = `/courses/${courseSlug}/learn/lesson/${viewingLesson.id}/${step}`;

                  return (
                    <Link
                      key={step}
                      href={stepUrl}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg transition-all duration-200 cursor-pointer",
                        isActive
                          ? "bg-blue-500 text-white shadow-md"
                          : "bg-gray-50 hover:bg-gray-100 text-gray-700"
                      )}
                    >
                      <div
                        className={cn(
                          "shrink-0 flex items-center justify-center w-8 h-8 rounded-full transition-all",
                          isActive
                            ? "bg-white/20"
                            : step === "test" && viewingLesson.completed
                            ? "bg-yellow-100"
                            : "bg-white"
                        )}
                      >
                        {step === "test" && viewingLesson.completed ? (
                          <Crown className="w-4 h-4 text-yellow-600" />
                        ) : (
                          <div
                            className={cn(
                              "transition-colors",
                              isActive ? "text-white" : "text-gray-600"
                            )}
                          >
                            {getStepIcon(step)}
                          </div>
                        )}
                      </div>

                      <div className="flex-1 text-left">
                        <p
                          className={cn(
                            "text-sm font-medium",
                            isActive && "font-semibold"
                          )}
                        >
                          {getStepLabel(step)}
                        </p>
                      </div>

                      {isActive && (
                        <ChevronRight className="w-4 h-4 opacity-60" />
                      )}
                    </Link>
                  );
                })
              : /* For other lessons: show their actual available steps from lessonStepsMap */
                (lessonStepsMap.get(viewingLesson.id) || []).map((step) => {
                  const stepUrl = `/courses/${courseSlug}/learn/lesson/${viewingLesson.id}/${step}`;
                  const showCrown = step === "test" && viewingLesson.completed;

                  return (
                    <Link
                      key={step}
                      href={stepUrl}
                      className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-700 transition-all duration-200 cursor-pointer"
                    >
                      <div
                        className={cn(
                          "shrink-0 flex items-center justify-center w-8 h-8 rounded-full",
                          showCrown ? "bg-yellow-100" : "bg-white"
                        )}
                      >
                        {showCrown ? (
                          <Crown className="w-4 h-4 text-yellow-600" />
                        ) : (
                          <div className="text-gray-600">
                            {getStepIcon(step)}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium">
                          {getStepLabel(step)}
                        </p>
                      </div>
                    </Link>
                  );
                })}
          </div>
        ) : (
          /* Unit Quiz Button */
          <Link
            href={`/courses/${courseSlug}/learn/lesson/${viewingLesson.unitId}/unit-quiz`}
            className={cn(
              "block w-full p-4 rounded-lg border-2 transition-colors cursor-pointer",
              viewingLesson.completed
                ? "bg-yellow-50 border-yellow-200 hover:bg-yellow-100"
                : "bg-purple-50 border-purple-200 hover:bg-purple-100"
            )}
          >
            <div className="flex items-center justify-center gap-2">
              {viewingLesson.completed ? (
                <Crown className="w-5 h-5 text-yellow-600" />
              ) : (
                <FileCheck className="w-5 h-5 text-purple-600" />
              )}
              <span
                className={cn(
                  "text-sm font-semibold",
                  viewingLesson.completed
                    ? "text-yellow-700"
                    : "text-purple-700"
                )}
              >
                {viewingLesson.completed
                  ? "Бүлгийн тест дууссан"
                  : "Бүлгийн тестэд орох"}
              </span>
            </div>
          </Link>
        )}
      </div>
    </aside>
  );
};

// Export types for use in other components
export type { LessonItem, LessonSection, UnitSection };
