"use client";

import { LessonContentHeader } from "./LessonContentHeader";
import { MarkCompleteButton } from "./MarkCompleteButton";
import { useLessonPlayer } from "@/hooks/useLessonPlayer";
import type { LessonStep } from "@/lib/lesson-step-utils";
import type { Lesson } from "@/types/database/tables";
import type { LessonItem } from "@/lib/lesson-utils";

type LessonContentWrapperProps = {
  children: React.ReactNode;
  // Header props
  courseTitle: string;
  courseSlug: string;
  courseId: string;
  unitTitle?: string;
  lessonTitle: string;
  lessonId: string;
  currentStep: LessonStep;
  availableSteps: LessonStep[];
  allLessons: Lesson[] | LessonItem[];
  // Optional: hide mark complete button (e.g., for test pages with quiz)
  hideMarkComplete?: boolean;
};

export const LessonContentWrapper = ({
  children,
  courseTitle,
  courseSlug,
  courseId,
  unitTitle,
  lessonTitle,
  lessonId,
  currentStep,
  availableSteps,
  allLessons,
  hideMarkComplete = false,
}: LessonContentWrapperProps) => {
  const { sidebarData, isUnitQuiz } = useLessonPlayer();

  // Get progress and completion data from context
  const progress = sidebarData?.progress ?? {
    completed: 0,
    total: 0,
    percentage: 0,
    streak: 0,
    totalXp: 0,
  };

  // Find current lesson completion status
  const allItems = sidebarData?.units?.flatMap((u) => u.items) ?? [];
  const currentLesson = allItems.find((item) => item.id === lessonId);
  const currentUnitId = currentLesson?.unitId;
  const unitQuizItem = currentUnitId
    ? allItems.find((item) => item.isUnitQuiz && item.unitId === currentUnitId)
    : null;

  return (
    <div className="flex flex-col gap-4 md:gap-5">
      {/* Header with breadcrumb, divider, and navigation */}
      <LessonContentHeader
        courseTitle={courseTitle}
        courseSlug={courseSlug}
        unitTitle={unitTitle}
        lessonTitle={lessonTitle}
        lessonId={lessonId}
        currentStep={currentStep}
        availableSteps={availableSteps}
        allLessons={allLessons}
        progress={progress}
        isCompleted={currentLesson?.completed ?? false}
        isUnitQuiz={isUnitQuiz}
        unitId={currentUnitId}
        unitQuizCompleted={unitQuizItem?.completed ?? false}
      />

      {/* Content Area */}
      <div className="flex-1">{children}</div>

      {/* Mark Complete Button */}
      {!hideMarkComplete && (
        <div className="flex justify-start">
          <MarkCompleteButton lessonId={lessonId} courseId={courseId} />
        </div>
      )}
    </div>
  );
};
