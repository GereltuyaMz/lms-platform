"use client";

import { useMemo } from "react";
import { UnitSection } from "./UnitSection";
import { calculateUnitProgress } from "@/lib/utils";
import type { Lesson } from "@/types/database";
import type { UnitWithLessons } from "@/types/database";

type CourseContentProps = {
  lessonsBySection?: Record<string, Lesson[]>;
  units?: UnitWithLessons[];
  courseSlug: string;
  completedLessonIds?: string[];
  completedUnitQuizIds?: string[];
  unitQuizMap?: Map<string, boolean>;
};

type SectionData = {
  id: string;
  title: string;
  description?: string | null;
  lessons: Lesson[];
  hasUnitQuiz?: boolean;
  unit?: UnitWithLessons;
};

export const CourseContent = ({
  lessonsBySection,
  units,
  courseSlug,
  completedLessonIds = [],
  completedUnitQuizIds = [],
  unitQuizMap = new Map(),
}: CourseContentProps) => {
  const sections: SectionData[] = units?.length
    ? units.map((unit) => ({
        id: unit.id,
        title: unit.title,
        description: unit.description,
        lessons: unit.lessons,
        hasUnitQuiz: unitQuizMap.get(unit.id) ?? false,
        unit,
      }))
    : Object.entries(lessonsBySection || {}).map(([title, lessons], index) => ({
        id: `section-${index}`,
        title,
        lessons,
      }));

  const sectionProgress = useMemo(() => {
    const map = new Map<string, number>();
    sections.forEach((section) => {
      const progress = calculateUnitProgress(
        section.lessons,
        completedLessonIds
      );
      map.set(section.id, progress);
    });
    return map;
  }, [sections, completedLessonIds]);

  return (
    <>
      <div className="relative">
        {/* Sections */}
        <div className="space-y-0">
          {sections.map((section, index) => {
            const prevSection = index > 0 ? sections[index - 1] : null;
            const showBadge = !!(
              section.unit?.unit_content &&
              (!prevSection ||
                prevSection.unit?.unit_content !== section.unit.unit_content)
            );

            // Check if current unit is fully complete
            const currentProgress = sectionProgress.get(section.id) || 0;
            const isCurrentFullyComplete =
              currentProgress === 100 &&
              section.hasUnitQuiz &&
              completedUnitQuizIds.includes(section.id);

            // Check if next unit is fully complete
            const nextSection = index < sections.length - 1 ? sections[index + 1] : null;
            const nextProgress = nextSection ? sectionProgress.get(nextSection.id) || 0 : 0;
            const isNextFullyComplete =
              nextSection &&
              nextProgress === 100 &&
              nextSection.hasUnitQuiz &&
              completedUnitQuizIds.includes(nextSection.id);

            // Connector color: gold if both current and next are fully complete
            const connectorColor =
              isCurrentFullyComplete && isNextFullyComplete ? "#f59e0b" : "#e2e2e2";

            return (
              <UnitSection
                key={section.id}
                section={section}
                progress={currentProgress}
                courseSlug={courseSlug}
                completedLessonIds={completedLessonIds}
                completedUnitQuizIds={completedUnitQuizIds}
                showBadge={showBadge}
                connectorColor={connectorColor}
                isLastSection={index === sections.length - 1}
              />
            );
          })}
        </div>
      </div>
    </>
  );
};
