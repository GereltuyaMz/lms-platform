"use client";

import { Lock, Check, Star } from "lucide-react";
import { getUnitCompletionState } from "@/lib/utils";

type TimelineNodeProps = {
  progress: number;
  unitId: string;
  hasUnitQuiz: boolean;
  completedUnitQuizIds: string[];
  unitContent?: string | null;
  showBadge?: boolean;
  isLastSection: boolean;
  verticalConnectorColor: string;
};

const MEASUREMENTS = {
  CIRCLE_SIZE: 32,
  CIRCLE_RADIUS: 16,
  BADGE_TOP_OFFSET: -72,
  BADGE_TO_CIRCLE_HEIGHT: 56,
  BADGE_TO_CIRCLE_TOP: -32,
  HORIZONTAL_WIDTH: 35,
  VERTICAL_TOP_OFFSET: 16,
  UNIT_BOTTOM_MARGIN: 48,
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
}: TimelineNodeProps) => {
  const state = getUnitCompletionState(
    progress,
    unitId,
    completedUnitQuizIds,
    hasUnitQuiz
  );

  const isFullyComplete =
    progress === 100 && hasUnitQuiz && completedUnitQuizIds.includes(unitId);

  const horizontalColor = isFullyComplete ? "#f59e0b" : "#e2e2e2";
  const badgeConnectorColor = isFullyComplete ? "#f59e0b" : "#415ff4";
  const verticalHeight = "280px";

  return (
    <div className="relative flex items-center shrink-0">
      {/* Vertical connector to next unit */}
      {!isLastSection && (
        <div
          className="absolute left-4 w-0.5"
          style={{
            backgroundColor: verticalConnectorColor,
            top: `${MEASUREMENTS.VERTICAL_TOP_OFFSET}px`,
            height: verticalHeight,
          }}
          aria-hidden="true"
        />
      )}

      {/* Badge and connector */}
      {showBadge && unitContent && (
        <>
          <div
            className="absolute -left-0 bg-white border px-6 py-3 rounded-sm text-xs font-semibold shadow-sm whitespace-nowrap z-20"
            style={{ top: `${MEASUREMENTS.BADGE_TOP_OFFSET}px` }}
          >
            {unitContent}
          </div>
          <div
            className="absolute left-4 w-0.5"
            style={{
              top: `${MEASUREMENTS.BADGE_TO_CIRCLE_TOP}px`,
              height: `${MEASUREMENTS.BADGE_TO_CIRCLE_HEIGHT}px`,
              backgroundColor: badgeConnectorColor,
            }}
            aria-hidden="true"
          />
        </>
      )}

      {/* Progress circle */}
      <div
        className="relative z-10 w-8 h-8 rounded flex items-center justify-center border-2 transition-all duration-300"
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
        {state.icon === "lock" ? (
          <Lock className="w-4 h-4" style={{ color: state.iconColor }} />
        ) : state.icon === "check" ? (
          <Check className="w-4 h-4" style={{ color: state.iconColor }} />
        ) : (
          <Star
            className="w-4 h-4"
            style={{ color: state.iconColor, fill: state.iconColor }}
          />
        )}
      </div>

      {/* Horizontal connector to content */}
      <div
        className="h-0.5"
        style={{
          width: `${MEASUREMENTS.HORIZONTAL_WIDTH}px`,
          backgroundColor: horizontalColor,
        }}
        aria-hidden="true"
      />
    </div>
  );
};
