import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { UserProfile, UserStats } from "@/lib/actions";
import type { UnitWithLessons } from "@/types/database";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes}min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
};

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};

/**
 * Transform user profile to user stats for dashboard display
 * This includes calculated fields like level, streak, and league
 */
export const transformToUserStats = (profile: UserProfile): UserStats => {
  // Calculate level from total_xp
  // Formula: level = floor(xp / 500) + 1
  const level = Math.floor((profile.total_xp || 0) / 500) + 1;

  // Calculate league from level
  let league: UserStats["league"] = "Bronze";
  if (level >= 20) {
    league = "Diamond";
  } else if (level >= 15) {
    league = "Platinum";
  } else if (level >= 10) {
    league = "Gold";
  } else if (level >= 5) {
    league = "Silver";
  }

  return {
    username: profile.full_name,
    avatarUrl: profile.avatar_url || "",
    level,
    xp: profile.total_xp || 0,
    streak: profile.current_streak || 0,
    league,
  };
};

/**
 * Finds the next uncompleted lesson in the course
 * Returns null if all lessons are completed
 */
export const findNextUncompletedLesson = (
  units: UnitWithLessons[],
  completedLessonIds: string[],
  completedUnitQuizIds: string[],
  unitQuizMap: Map<string, boolean>
): { type: "lesson" | "unit-quiz"; id: string } | null => {
  for (const unit of units) {
    // Check lessons in this unit
    for (const lesson of unit.lessons) {
      if (!completedLessonIds.includes(lesson.id)) {
        return { type: "lesson", id: lesson.id };
      }
    }

    // Check unit quiz (if exists and all lessons completed)
    if (unitQuizMap.get(unit.id)) {
      const allLessonsCompleted = unit.lessons.every((l) =>
        completedLessonIds.includes(l.id)
      );
      if (allLessonsCompleted && !completedUnitQuizIds.includes(unit.id)) {
        return { type: "unit-quiz", id: unit.id };
      }
    }
  }

  // All completed - return first lesson
  return units[0]?.lessons?.[0]
    ? { type: "lesson", id: units[0].lessons[0].id }
    : null;
};
