import type { ReactElement } from "react";
import { PlayIcon, NotebookIcon, DumbbellIcon, BookOpenIcon, LightbulbIcon, BrainIcon } from "@/icons";
import type { Lesson } from "@/types/database";

export type LessonType = "video" | "text" | "quiz" | "assignment" | "theory" | "easy_example" | "hard_example";

type LessonConfig = {
  icon: ReactElement;
  calculateXP: (lesson: Lesson) => number;
  displayXP: (xp: number) => string;
};

export const LESSON_XP = {
  VIDEO_BASE: 50,
  VIDEO_DURATION_BONUS_PER_5MIN: 5,
  QUIZ_MIN: 100,
  QUIZ_MAX: 200,
  ASSIGNMENT: 150,
  TEXT_BASE: 30,
  TEXT_LONG_FORM: 50,
  // Unit lesson types XP
  THEORY: 50,
  EASY_EXAMPLE: 40,
  HARD_EXAMPLE: 60,
} as const;

// NOTE: calculateXP functions now receive duration_seconds as parameter
// Duration should be calculated from lesson_content blocks
export const LESSON_CONFIG: Record<LessonType, LessonConfig> = {
  video: {
    icon: <PlayIcon width={20} height={20} fill="#3B82F6" />,
    calculateXP: () => LESSON_XP.VIDEO_BASE,
    displayXP: (xp) => `${xp} XP`,
  },
  text: {
    icon: <NotebookIcon className="h-4 w-4 text-gray-600" />,
    calculateXP: () => LESSON_XP.TEXT_BASE,
    displayXP: (xp) => `${xp} XP`,
  },
  quiz: {
    icon: <DumbbellIcon width={20} height={20} fill="#10B981" />,
    calculateXP: () => LESSON_XP.QUIZ_MAX,
    displayXP: () => `${LESSON_XP.QUIZ_MAX} XP`,
  },
  assignment: {
    icon: <DumbbellIcon width={20} height={20} fill="#10B981" />,
    calculateXP: () => LESSON_XP.ASSIGNMENT,
    displayXP: (xp) => `${xp} XP`,
  },
  // Unit-based lesson types
  theory: {
    icon: <BookOpenIcon className="h-4 w-4 text-blue-600" />,
    calculateXP: () => LESSON_XP.THEORY,
    displayXP: (xp) => `${xp} XP`,
  },
  easy_example: {
    icon: <LightbulbIcon className="h-4 w-4 text-green-500" />,
    calculateXP: () => LESSON_XP.EASY_EXAMPLE,
    displayXP: (xp) => `${xp} XP`,
  },
  hard_example: {
    icon: <BrainIcon className="h-4 w-4 text-orange-500" />,
    calculateXP: () => LESSON_XP.HARD_EXAMPLE,
    displayXP: (xp) => `${xp} XP`,
  },
};

export const getLessonIcon = (lessonType: string): ReactElement => {
  return (
    LESSON_CONFIG[lessonType as LessonType]?.icon || LESSON_CONFIG.video.icon
  );
};

// DEPRECATED: This function assumed lesson.lesson_type exists
// XP should now be calculated from lesson_content blocks
export const getLessonXP = (lesson: Lesson): string | null => {
  console.warn("getLessonXP is deprecated. Calculate XP from lesson_content blocks instead.");
  return null;
};
