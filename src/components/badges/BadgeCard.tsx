"use client";

import {
  TrophyIcon,
  BrainIcon,
  FlameIcon,
  BookOpenIcon,
  StarIcon,
  HeartIcon,
  LockIcon,
} from "@phosphor-icons/react";
import { BadgeBackground } from "@/icons";
import type { BadgeCardProps, BadgeCategory } from "./types";
import { BADGE_SIZES, CATEGORY_THEMES, LOCKED_THEME } from "./constants";

// Map categories to Phosphor icons
const CATEGORY_ICONS = {
  course_completion: TrophyIcon,
  quiz_performance: BrainIcon,
  streak: FlameIcon,
  engagement: BookOpenIcon,
  milestone: StarIcon,
  social: HeartIcon,
} as const;

export const BadgeCard = ({
  badge,
  size = "medium",
  className = "",
}: BadgeCardProps) => {
  const category = badge.category as BadgeCategory;
  const theme = badge.is_unlocked
    ? CATEGORY_THEMES[category] || CATEGORY_THEMES.milestone
    : LOCKED_THEME;

  const pixelSize = BADGE_SIZES[size];
  // Original SVG is 73x90, ratio = 1.233
  const cardWidth = pixelSize;
  const cardHeight = Math.round(pixelSize * 1.233);
  const iconSize = Math.round(pixelSize * 0.35);

  const IconComponent = badge.is_unlocked
    ? CATEGORY_ICONS[category] || StarIcon
    : LockIcon;

  return (
    <div
      className={`badge-card-wrapper ${className}`}
      style={{
        width: cardWidth,
        height: cardHeight,
        flexShrink: 0,
      }}
    >
      <div
        className={`
          relative w-full h-full
          transition-all duration-300 ease-out
          ${badge.is_unlocked ? "hover:scale-105 hover:-translate-y-1" : "opacity-50 grayscale"}
        `}
        style={{
          filter: badge.is_unlocked
            ? `drop-shadow(0 4px 8px ${theme.shadow}) drop-shadow(0 8px 16px ${theme.shadow})`
            : "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
        }}
      >
        {/* Badge SVG Background */}
        <BadgeBackground
          width={cardWidth}
          height={cardHeight}
          c1={theme.c1}
          c2={theme.c2}
          c3={theme.c3}
          c4={theme.c4}
          className="absolute inset-0"
        />

        {/* Icon centered in the frame */}
        <div
          className="absolute flex items-center justify-center"
          style={{
            // Position icon in the center of the inner frame
            // Inner frame is roughly at x:19.5-53.4, y:13.5-43 in 73x90 viewBox
            left: `${(19.5 / 73) * 100}%`,
            top: `${(13.5 / 90) * 100}%`,
            width: `${((53.4 - 19.5) / 73) * 100}%`,
            height: `${((43 - 13.5) / 90) * 100}%`,
          }}
        >
          <IconComponent
            size={iconSize}
            weight={badge.is_unlocked ? "fill" : "regular"}
            style={{
              color: theme.icon,
              filter: badge.is_unlocked
                ? "drop-shadow(0 2px 4px rgba(0,0,0,0.2))"
                : "none",
            }}
          />
        </div>
      </div>
    </div>
  );
};
