import type { BadgeWithProgress } from "@/lib/actions/badges";

// Badge category matching database categories
export type BadgeCategory =
  | "course_completion"
  | "quiz_performance"
  | "streak"
  | "engagement"
  | "milestone"
  | "social";

// Props for the main BadgeCard component
export interface BadgeCardProps {
  badge: BadgeWithProgress;
  size?: "small" | "medium" | "large";
  className?: string;
}
