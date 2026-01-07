"use client";

import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef } from "react";
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
  isLastSection: boolean;
};

export const UnitSection = ({
  section,
  progress,
  courseSlug,
  completedLessonIds,
  completedUnitQuizIds,
  showBadge = true,
  connectorColor,
  isLastSection,
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
      className="relative mb-12 flex items-start"
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
      />

      {/* Unit Content Container */}
      <div className="bg-[#eee] rounded-lg py-3 px-4 flex-1 overflow-hidden min-w-0">
        {/* Unit Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold line-clamp-2 flex-1 pr-4">
            {section.title}
          </h3>

          {/* Navigation Buttons (matching Figma) */}
          <div className="flex gap-1 flex-shrink-0">
            <button
              onClick={() => handleScroll("left")}
              className="w-8 h-8 rounded-full border border-black/20 bg-white/50 flex items-center justify-center hover:bg-white transition-all active:scale-95"
              aria-label="Өмнөх хичээл"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleScroll("right")}
              className="w-8 h-8 rounded-full border border-black/20 bg-white flex items-center justify-center hover:bg-gray-50 transition-all active:scale-95"
              aria-label="Дараах хичээл"
            >
              <ChevronRight className="w-4 h-4" />
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
              className="flex gap-3  overflow-x-auto scrollbar-hide"
            >
              {section.lessons.map((lesson) => (
                <LessonCard
                  key={lesson.id}
                  lesson={lesson}
                  courseSlug={courseSlug}
                  isCompleted={completedLessonIds.includes(lesson.id)}
                />
              ))}

              {/* Unit Quiz Card - Inside scroll with lessons */}
              {section.hasUnitQuiz && section.unit && (
                <div
                  onClick={() =>
                    router.push(
                      `/courses/${courseSlug}/learn/lesson/${
                        section.unit!.id
                      }/unit-quiz`
                    )
                  }
                  className="bg-white rounded-lg border-2 border-yellow-200 px-4 py-3 hover:shadow-md transition-all duration-200 cursor-pointer w-[292px] shrink-0 flex items-center gap-3"
                >
                  {completedUnitQuizIds.includes(section.unit!.id) ? (
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400 shrink-0" />
                  ) : (
                    <Star className="w-5 h-5 text-gray-400 shrink-0" />
                  )}
                  <span className="text-sm font-medium">
                    {section.unit!.title} - Бүлгийн тест
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
