"use server";

export type ProgressResult = {
  success: boolean;
  message: string;
  milestoneResults?: Array<{
    success: boolean;
    message: string;
    xpAwarded?: number;
  }>;
  streakBonusAwarded?: number;
  streakBonusMessage?: string;
  currentStreak?: number;
  videoXpAwarded?: number;
};

export type LessonProgressData = {
  isCompleted: boolean;
  lastPosition: number;
  completedAt: string | null;
};

export type ContentProgressData = {
  contentId: string;
  contentType: string;
  title: string;
  orderIndex: number;
  isCompleted: boolean;
  lastPosition: number;
  xpAwarded: number;
  completedAt: string | null;
};

export type LessonCompletionResult = {
  success: boolean;
  message: string;
  lessonComplete: boolean;
  missingRequirement?: string;
};

export type LessonCompletionStatus = {
  contentComplete: boolean;
  quizPassed: boolean;
  lessonComplete: boolean;
  unitXpAwarded?: number;
};

export type LessonRequirements = {
  contentComplete: boolean;
  quizPassed: boolean;
  canComplete: boolean;
};
