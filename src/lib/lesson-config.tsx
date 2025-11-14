import type { ReactElement } from "react"
import { PlayIcon, NotebookIcon, DumbbellIcon } from "@/icons"
import type { Lesson } from "@/types/database"

export type LessonType = "video" | "text" | "quiz" | "assignment"

type LessonConfig = {
  icon: ReactElement
  calculateXP: (lesson: Lesson) => number
  displayXP: (xp: number) => string
}

export const LESSON_XP = {
  VIDEO_BASE: 50,
  VIDEO_DURATION_BONUS_PER_5MIN: 5,
  QUIZ_MIN: 100,
  QUIZ_MAX: 200,
  ASSIGNMENT: 150,
  TEXT_BASE: 30,
  TEXT_LONG_FORM: 50,
} as const

export const LESSON_CONFIG: Record<LessonType, LessonConfig> = {
  video: {
    icon: <PlayIcon width={20} height={20} fill="#3B82F6" />,
    calculateXP: (lesson) => {
      const durationBonus = Math.floor((lesson.duration_seconds || 0) / 300) * LESSON_XP.VIDEO_DURATION_BONUS_PER_5MIN
      return LESSON_XP.VIDEO_BASE + durationBonus
    },
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
    displayXP: () => `Up to ${LESSON_XP.QUIZ_MAX} XP`,
  },
  assignment: {
    icon: <DumbbellIcon width={20} height={20} fill="#10B981" />,
    calculateXP: () => LESSON_XP.ASSIGNMENT,
    displayXP: (xp) => `${xp} XP`,
  },
}

export const getLessonIcon = (lessonType: string): ReactElement => {
  return LESSON_CONFIG[lessonType as LessonType]?.icon || LESSON_CONFIG.video.icon
}

export const getLessonXP = (lesson: Lesson): string | null => {
  const config = LESSON_CONFIG[lesson.lesson_type as LessonType]
  if (!config) return null

  const xp = config.calculateXP(lesson)
  return config.displayXP(xp)
}
