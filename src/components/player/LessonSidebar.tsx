"use client";

import { usePathname } from "next/navigation";
import { useLessonPlayer } from "@/hooks/useLessonPlayer";
import { SidebarContent } from "./sidebar";
import type { LessonStep } from "@/lib/lesson-step-utils";

export const LessonSidebar = () => {
  const pathname = usePathname();
  const { sidebarData, currentLessonId, availableSteps, isUnitQuiz } =
    useLessonPlayer();

  // Derive current step from URL pathname (more reliable than context for soft navigation)
  const currentStep: LessonStep = pathname.includes("/example")
    ? "example"
    : pathname.includes("/test")
    ? "test"
    : "theory";

  // Don't render if no sidebar data
  if (!sidebarData) {
    return null;
  }

  const { courseTitle, courseSlug, units, progress } = sidebarData;

  // Find current lesson from units (check both regular lesson ID and unit quiz ID)
  const allItems = units?.flatMap((u) => u.items) ?? [];
  const currentLesson =
    allItems.find((item) => item.id === currentLessonId) ||
    allItems.find((item) => item.id === `unit-quiz-${currentLessonId}`);

  // Find unit quiz completion status for the current unit
  const currentUnitId = currentLesson?.unitId;
  const unitQuizItem = currentUnitId
    ? allItems.find((item) => item.isUnitQuiz && item.unitId === currentUnitId)
    : null;

  // Show loading state if lesson not yet set
  if (!currentLessonId) {
    return (
      <aside className="hidden md:block w-[280px] h-[calc(100vh-78px)] sticky top-[78px] overflow-y-auto py-4 pr-4">
        <div className="animate-pulse space-y-4">
          <div className="h-9 w-9 bg-gray-200 rounded-[10px]" />
          <div className="h-32 bg-gray-200 rounded-xl" />
          <div className="h-24 bg-gray-200 rounded-xl" />
        </div>
      </aside>
    );
  }

  return (
    <aside className="hidden md:block w-[280px] h-[calc(100vh-78px)] sticky top-[78px] overflow-y-auto py-10 pr-4">
      <SidebarContent
        courseTitle={courseTitle}
        courseSlug={courseSlug}
        progress={progress}
        currentLessonId={currentLessonId}
        currentStep={currentStep}
        availableSteps={availableSteps}
        isCompleted={currentLesson?.completed ?? false}
        isUnitQuiz={isUnitQuiz}
        unitId={currentUnitId}
        unitQuizCompleted={unitQuizItem?.completed ?? false}
      />
    </aside>
  );
};
