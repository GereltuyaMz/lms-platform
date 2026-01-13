"use client";

import { Gift } from "lucide-react";
import { getUnitCompletionState, getSubjectIcon } from "@/lib/utils";

type TimelineNodeProps = {
  progress: number;
  unitId: string;
  hasUnitQuiz: boolean;
  completedUnitQuizIds: string[];
  unitContent?: string | null;
  showBadge?: boolean;
  isLastSection: boolean;
  verticalConnectorColor: string;
  badgeBorderColor: string;
  canClaimReward?: boolean;
  onClaimReward?: () => void;
  isClaimingReward?: boolean;
  // Unit content group milestone props
  canClaimGroupMilestone?: boolean;
  onClaimGroupMilestone?: () => void;
  isClaimingGroupMilestone?: boolean;
};

const MEASUREMENTS = {
  VERTICAL_TOP_OFFSET: 16,
} as const;

export const TimelineNode = ({
  progress,
  unitId,
  hasUnitQuiz,
  completedUnitQuizIds,
  unitContent,
  showBadge = false,
  isLastSection,
  verticalConnectorColor,
  badgeBorderColor,
  canClaimReward = false,
  onClaimReward,
  isClaimingReward = false,
  canClaimGroupMilestone = false,
  onClaimGroupMilestone,
  isClaimingGroupMilestone = false,
}: TimelineNodeProps) => {
  const state = getUnitCompletionState(
    progress,
    unitId,
    completedUnitQuizIds,
    hasUnitQuiz
  );

  // Get subject-specific icon
  const { Icon: SubjectIcon, name: subjectName } = getSubjectIcon(unitContent);

  const isFullyComplete =
    progress === 100 && hasUnitQuiz && completedUnitQuizIds.includes(unitId);

  const horizontalColor = isFullyComplete ? "#415ff4" : "#e2e2e2";

  // Icon color: white if completed, use state color if not
  const iconColor = isFullyComplete ? "#ffffff" : state.iconColor;

  return (
    <div className="relative flex items-center shrink-0 ">
      {/* Vertical connector to next unit */}
      {!isLastSection && (
        <div
          className="absolute left-3 sm:left-3.5 md:left-4 w-0.5 h-[200px] sm:h-[240px] md:h-[280px]"
          style={{
            backgroundColor: verticalConnectorColor,
            top: `${MEASUREMENTS.VERTICAL_TOP_OFFSET}px`,
          }}
          aria-hidden="true"
        />
      )}

      {/* Badge and connector */}
      {showBadge && unitContent && (
        <>
          <div
            className="absolute -left-0 bg-white border px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 rounded-sm text-xs sm:text-sm md:text-base font-semibold shadow-sm whitespace-nowrap z-20 -top-14 sm:-top-14 md:-top-24 tracking-tight"
            style={{ borderColor: badgeBorderColor }}
          >
            {unitContent}
            {/* Gift icon for claiming unit content group milestone */}
            {canClaimGroupMilestone && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClaimGroupMilestone?.();
                }}
                disabled={isClaimingGroupMilestone}
                className="absolute -top-2 -right-2 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-green-500 border-2 border-white flex items-center justify-center shadow-md hover:bg-green-600 transition-colors animate-pulse cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label={`${unitContent} milestone XP авах`}
              >
                <Gift className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
              </button>
            )}
          </div>
          <div
            className="absolute left-3 sm:left-3.5 md:left-4 w-0.5 top-0 -translate-y-full h-8 sm:h-8 md:h-16"
            style={{
              backgroundColor: badgeBorderColor,
            }}
            aria-hidden="true"
          />
        </>
      )}

      {/* Progress circle */}
      <div
        className="relative z-10 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded flex items-center justify-center border-2 transition-all duration-300"
        style={{
          backgroundColor: state.bg,
          borderColor: state.border,
        }}
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${progress.toFixed(0)}% дууссан`}
      >
        <SubjectIcon
          className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4"
          style={{ color: iconColor }}
          aria-label={subjectName}
        />

        {/* Gift icon for claiming unit completion reward */}
        {canClaimReward && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClaimReward?.();
            }}
            disabled={isClaimingReward}
            className="absolute -top-2 -right-2 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-yellow-400 border-2 border-white flex items-center justify-center shadow-md hover:bg-yellow-500 transition-colors animate-pulse cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Unit XP авах"
          >
            <Gift className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
          </button>
        )}
      </div>

      {/* Horizontal connector to content */}
      <div
        className="h-0.5 w-5 sm:w-7 md:w-[35px]"
        style={{
          backgroundColor: horizontalColor,
        }}
        aria-hidden="true"
      />
    </div>
  );
};
