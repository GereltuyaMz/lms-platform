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

/**
 * Calculate unit completion progress percentage
 */
export const calculateUnitProgress = (
  unitLessons: { id: string }[],
  completedLessonIds: string[]
): number => {
  if (unitLessons.length === 0) return 0;
  const completed = unitLessons.filter((l) =>
    completedLessonIds.includes(l.id)
  ).length;
  return (completed / unitLessons.length) * 100;
};

/**
 * Get timeline icon state based on progress percentage
 */
export const getTimelineIconState = (progress: number) => {
  if (progress === 0) {
    return {
      bg: "#d8d8d8",
      border: "#d8d8d8",
      icon: "lock" as const,
      iconColor: "#666666",
    };
  }
  if (progress === 100) {
    return {
      bg: "#9fa8da",
      border: "#415ff4",
      icon: "check" as const,
      iconColor: "#415ff4",
    };
  }
  return {
    bg: "#9fa8da",
    border: "#415ff4",
    icon: "lock" as const,
    iconColor: "#415ff4",
  };
};

/**
 * Get unit completion state including quiz status
 * Returns 4 possible states based on lesson progress and quiz completion
 */
export const getUnitCompletionState = (
  progress: number,
  unitId: string,
  completedUnitQuizIds: string[],
  hasUnitQuiz: boolean
) => {
  // Not started (0%)
  if (progress === 0) {
    return {
      bg: "#d8d8d8",
      border: "#d8d8d8",
      icon: "lock" as const,
      iconColor: "#666666",
    };
  }

  // Lessons complete (100%)
  if (progress === 100) {
    // Check if unit has quiz and if it's passed
    if (hasUnitQuiz && completedUnitQuizIds.includes(unitId)) {
      // Fully complete - gold/yellow with star
      return {
        bg: "#fef3c7", // Light gold background (Tailwind yellow-100)
        border: "#f59e0b", // Amber-500 border
        icon: "star" as const,
        iconColor: "#f59e0b",
      };
    }
    // Lessons complete but quiz not passed (or no quiz exists)
    return {
      bg: "#9fa8da",
      border: "#415ff4",
      icon: "check" as const,
      iconColor: "#415ff4",
    };
  }

  // In progress (1-99%)
  return {
    bg: "#9fa8da",
    border: "#415ff4",
    icon: "lock" as const,
    iconColor: "#415ff4",
  };
};

/**
 * Format difficulty level to display text
 */
export const formatDifficultyLevel = (level: string | null): string => {
  const mapping: Record<string, string> = {
    "beginner-100": "Анхлал 100+",
    "mid-level": "Дунд түвшин",
    advanced: "Төгсөлт",
    "top-500": "Топ төрөөд 500+",
    preparation: "Бэлтгэх",
    "algebra-500": "Алгебр 500+",
    "counting-500": "Тоо тоолол 500+",
  };
  return level ? mapping[level] || level : "";
};

/**
 * Validate if a URL is a valid YouTube or Vimeo video URL
 */
export const isValidVideoUrl = (url: string): boolean => {
  if (!url || url.trim() === "") return false;

  // YouTube patterns: youtube.com/watch?v=... or youtu.be/...
  const youtubePattern = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/).+$/;

  // Vimeo pattern: vimeo.com/...
  const vimeoPattern = /^(https?:\/\/)?(www\.)?vimeo\.com\/.+$/;

  return youtubePattern.test(url) || vimeoPattern.test(url);
};

/**
 * Extract video ID from YouTube or Vimeo URL for future thumbnail fetching
 */
export const extractVideoId = (url: string): string | null => {
  if (!url) return null;

  // Extract YouTube ID from youtube.com/watch?v=... or youtu.be/...
  const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?]+)/);
  if (youtubeMatch) return youtubeMatch[1];

  // Extract Vimeo ID from vimeo.com/...
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return vimeoMatch[1];

  return null;
};
