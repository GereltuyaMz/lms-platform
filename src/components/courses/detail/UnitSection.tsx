"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { TimelineNode } from "./TimelineNode";
import { LessonCard } from "./LessonCard";
import type { Lesson } from "@/types/database";
import type { UnitWithLessons } from "@/types/database";

type SectionData = {
  id: string;
  title: string;
  description?: string | null;
  lessons: Lesson[];
  hasUnitQuiz?: boolean;
  unit?: UnitWithLessons;
};

type UnitSectionProps = {
  section: SectionData;
  progress: number;
  courseSlug: string;
  completedLessonIds: string[];
  completedUnitQuizIds: string[];
  showBadge?: boolean;
  connectorColor: string;
  badgeBorderColor: string;
  isLastSection: boolean;
  canClaimReward?: boolean;
  onClaimReward?: () => void;
  isClaimingReward?: boolean;
  // Unit content group milestone props
  canClaimGroupMilestone?: boolean;
  onClaimGroupMilestone?: () => void;
  isClaimingGroupMilestone?: boolean;
  isAuthenticated: boolean;
  hasAccess: boolean;
  price: number;
};

export const UnitSection = ({
  section,
  progress,
  courseSlug,
  completedLessonIds,
  completedUnitQuizIds,
  showBadge = true,
  connectorColor,
  badgeBorderColor,
  isLastSection,
  canClaimReward = false,
  onClaimReward,
  isClaimingReward = false,
  canClaimGroupMilestone = false,
  onClaimGroupMilestone,
  isClaimingGroupMilestone = false,
  isAuthenticated,
  hasAccess,
  price,
}: UnitSectionProps) => {
  const router = useRouter();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;

    const scrollAmount = 300; // Scroll by ~1 card width
    const newScrollPosition =
      direction === "left"
        ? scrollContainerRef.current.scrollLeft - scrollAmount
        : scrollContainerRef.current.scrollLeft + scrollAmount;

    scrollContainerRef.current.scrollTo({
      left: newScrollPosition,
      behavior: "smooth",
    });
  };

  return (
    <div
      className={`relative mb-8 sm:mb-10 md:mb-12 flex items-start ${
        showBadge ? "mt-16 sm:mt-16 md:mt-34" : ""
      }`}
      id={`unit-section-${section.id}`}
    >
      {/* Timeline Node with Connector */}
      <TimelineNode
        progress={progress}
        unitId={section.id}
        hasUnitQuiz={section.hasUnitQuiz ?? false}
        completedUnitQuizIds={completedUnitQuizIds}
        unitContent={section.unit?.unit_content}
        showBadge={showBadge}
        isLastSection={isLastSection}
        verticalConnectorColor={connectorColor}
        badgeBorderColor={badgeBorderColor}
        canClaimReward={canClaimReward}
        onClaimReward={onClaimReward}
        isClaimingReward={isClaimingReward}
        canClaimGroupMilestone={canClaimGroupMilestone}
        onClaimGroupMilestone={onClaimGroupMilestone}
        isClaimingGroupMilestone={isClaimingGroupMilestone}
      />

      {/* Unit Content Container */}
      <div className="bg-[#eee] rounded-lg py-2 sm:py-2.5 md:py-3 px-2 sm:px-3 md:px-4 flex-1 overflow-hidden min-w-0 ">
        {/* Unit Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm sm:text-sm md:text-base font-semibold line-clamp-2 flex-1 pr-2 sm:pr-3 md:pr-4">
            {section.title}
          </h3>

          {/* Navigation Buttons (matching Figma) */}
          <div className="flex gap-1 flex-shrink-0">
            <button
              onClick={() => handleScroll("left")}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-black/20 bg-white/50 flex items-center justify-center hover:bg-white transition-all active:scale-95"
              aria-label="Өмнөх хичээл"
            >
              <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
            <button
              onClick={() => handleScroll("right")}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-black/20 bg-white flex items-center justify-center hover:bg-gray-50 transition-all active:scale-95"
              aria-label="Дараах хичээл"
            >
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>

        {/* Lesson Cards - Always Visible, Horizontal Scroll */}
        {section.lessons.length === 0 && !section.hasUnitQuiz ? (
          <div className="text-sm text-gray-500 italic py-4">
            Энэ хэсэгт хичээл байхгүй байна
          </div>
        ) : (
          <div className="w-full overflow-x-auto scrollbar-hide">
            <div
              ref={scrollContainerRef}
              className="flex gap-2 sm:gap-2.5 md:gap-3 overflow-x-auto scrollbar-hide"
            >
              {section.lessons.map((lesson) => (
                <LessonCard
                  key={lesson.id}
                  lesson={lesson}
                  courseSlug={courseSlug}
                  isCompleted={completedLessonIds.includes(lesson.id)}
                  isAuthenticated={isAuthenticated}
                  hasAccess={hasAccess}
                  price={price}
                />
              ))}

              {/* Unit Quiz Card - Inside scroll with lessons */}
              {section.hasUnitQuiz && section.unit && (
                <div
                  onClick={() => {
                    if (!isAuthenticated) {
                      router.push("/signin");
                      return;
                    }
                    if (!hasAccess) {
                      router.push(`/courses/${courseSlug}/checkout`);
                      return;
                    }
                    router.push(
                      `/courses/${courseSlug}/learn/lesson/${
                        section.unit!.id
                      }/unit-quiz`
                    );
                  }}
                  className="bg-white rounded-lg border border-gray-200 p-3 sm:p-3.5 md:p-4 hover:shadow-md transition-all duration-200 cursor-pointer min-w-[160px] w-[160px] sm:min-w-[240px] sm:w-[240px] md:min-w-[260px] md:w-[260px] lg:min-w-[280px] lg:w-[292px] shrink-0 group"
                >
                  <div className="bg-[#faf9f7] rounded p-2 sm:p-2.5 md:p-3 flex gap-1.5 sm:gap-2 items-start">
                    {completedUnitQuizIds.includes(section.unit!.id) && (
                      <Checkbox
                        checked
                        className="w-3 h-3 sm:w-4 sm:h-4 border-[#415ff4] data-[state=checked]:bg-[#415ff4] data-[state=checked]:border-[#415ff4] pointer-events-none"
                      />
                    )}
                    <span className="text-[11px] sm:text-xs text-gray-700 truncate group-hover:whitespace-normal group-hover:break-words flex-1 transition-all duration-200">
                      {section.unit!.title} - Бүлгийн тест
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
