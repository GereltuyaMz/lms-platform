"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { UnitSection } from "./UnitSection";
import { calculateUnitProgress } from "@/lib/utils";
import { claimUnitCompletionXP } from "@/lib/actions/unit-completion";
import { claimUnitContentMilestoneXP } from "@/lib/actions/unit-content-milestone";
import type { Lesson } from "@/types/database";
import type { UnitWithLessons } from "@/types/database";

type CourseContentProps = {
  lessonsBySection?: Record<string, Lesson[]>;
  units?: UnitWithLessons[];
  courseSlug: string;
  courseId: string;
  completedLessonIds?: string[];
  completedUnitQuizIds?: string[];
  unitQuizMap?: Map<string, boolean>;
  claimedUnitIds?: string[];
  claimedUnitContentGroups?: string[];
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
  courseId,
  completedLessonIds = [],
  completedUnitQuizIds = [],
  unitQuizMap = new Map(),
  claimedUnitIds = [],
  claimedUnitContentGroups = [],
}: CourseContentProps) => {
  const [claimingUnitId, setClaimingUnitId] = useState<string | null>(null);
  const [localClaimedUnits, setLocalClaimedUnits] = useState<string[]>(claimedUnitIds);
  const [claimingGroupName, setClaimingGroupName] = useState<string | null>(null);
  const [localClaimedGroups, setLocalClaimedGroups] = useState<string[]>(claimedUnitContentGroups);

  const handleClaimReward = async (unitId: string) => {
    setClaimingUnitId(unitId);
    try {
      const result = await claimUnitCompletionXP(unitId, courseId);
      if (result.success) {
        toast.success(`🎁 +${result.xpAwarded} XP`, {
          description: result.message,
          duration: 5000,
        });
        setLocalClaimedUnits((prev) => [...prev, unitId]);
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Алдаа гарлаа");
    } finally {
      setClaimingUnitId(null);
    }
  };

  const handleClaimGroupMilestone = async (unitContent: string) => {
    setClaimingGroupName(unitContent);
    try {
      const result = await claimUnitContentMilestoneXP(unitContent, courseId);
      if (result.success) {
        toast.success(`🏆 +${result.xpAwarded} XP`, {
          description: result.message,
          duration: 5000,
        });
        setLocalClaimedGroups((prev) => [...prev, unitContent]);
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Алдаа гарлаа");
    } finally {
      setClaimingGroupName(null);
    }
  };

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

  // Calculate which unit_content groups have all units claimed
  const completedUnitContentGroups = useMemo(() => {
    // Group units by unit_content
    const groupedUnits = new Map<string, string[]>();
    sections.forEach((section) => {
      const unitContent = section.unit?.unit_content;
      if (unitContent) {
        const existing = groupedUnits.get(unitContent) || [];
        groupedUnits.set(unitContent, [...existing, section.id]);
      }
    });

    // Check which groups have ALL units claimed
    const completed = new Set<string>();
    groupedUnits.forEach((unitIds, unitContent) => {
      const allClaimed = unitIds.every((id) => localClaimedUnits.includes(id));
      if (allClaimed) {
        completed.add(unitContent);
      }
    });

    return completed;
  }, [sections, localClaimedUnits]);

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
            const nextSection =
              index < sections.length - 1 ? sections[index + 1] : null;
            const nextProgress = nextSection
              ? sectionProgress.get(nextSection.id) || 0
              : 0;
            const isNextFullyComplete =
              nextSection &&
              nextProgress === 100 &&
              nextSection.hasUnitQuiz &&
              completedUnitQuizIds.includes(nextSection.id);

            // Connector color: blue if both current and next are fully complete
            const connectorColor =
              isCurrentFullyComplete && isNextFullyComplete
                ? "#415ff4"
                : "#e2e2e2";

            // Badge border color: blue if current unit (first in badge group) is complete
            const badgeBorderColor = isCurrentFullyComplete
              ? "#415ff4"
              : "#e2e2e2";

            // Check if unit can claim reward (fully complete but not yet claimed)
            const canClaimReward =
              isCurrentFullyComplete && !localClaimedUnits.includes(section.id);

            // Check if this is the first unit of a unit_content group that can claim milestone
            // Only show gift on badge (which appears on first unit of each group)
            const unitContent = section.unit?.unit_content;
            const canClaimGroupMilestone =
              showBadge &&
              !!unitContent &&
              completedUnitContentGroups.has(unitContent) &&
              !localClaimedGroups.includes(unitContent);

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
                badgeBorderColor={badgeBorderColor}
                isLastSection={index === sections.length - 1}
                canClaimReward={canClaimReward}
                onClaimReward={() => handleClaimReward(section.id)}
                isClaimingReward={claimingUnitId === section.id}
                canClaimGroupMilestone={canClaimGroupMilestone}
                onClaimGroupMilestone={() => unitContent && handleClaimGroupMilestone(unitContent)}
                isClaimingGroupMilestone={claimingGroupName === unitContent}
              />
            );
          })}
        </div>
      </div>
    </>
  );
};
