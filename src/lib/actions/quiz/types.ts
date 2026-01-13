"use server";

export type QuizAttemptResult = {
  success: boolean;
  message: string;
  attemptId?: string;
  lessonComplete?: boolean;
  requiresContentCompletion?: boolean;
  milestoneResults?: Array<{
    success: boolean;
    message: string;
    xpAwarded?: number;
  }>;
  streakBonusAwarded?: number;
  streakBonusMessage?: string;
  currentStreak?: number;
  unitXpAwarded?: number;
};

export type QuizAnswer = {
  questionId: string;
  selectedOptionId: string;
  isCorrect: boolean;
  pointsEarned: number;
};

export type BestScoreData = {
  bestScore: number;
  totalQuestions: number;
  bestPercentage: number;
  attempts: number;
};

export type LatestAttemptData = {
  score: number;
  totalQuestions: number;
  completedAt: string;
};
