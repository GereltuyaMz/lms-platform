"use client";

import { toast } from "sonner";
import type { SidebarData, ProgressData } from "@/hooks/useLessonPlayer";

type QuizResultNotifications = {
  milestoneResults?: Array<{ success: boolean; message: string; xpAwarded?: number }>;
  unitXpAwarded?: number;
  streakBonusAwarded?: number;
  streakBonusMessage?: string;
  currentStreak?: number;
};

export const showQuizXpNotification = (
  xpAwarded: number,
  scorePercentage: number,
  isUnit: boolean
) => {
  const type = isUnit ? "бүлгийн тестээ" : "тестээ";
  toast.success(`🎉 +${xpAwarded} XP`, {
    description: `Та ${type} ${Math.round(scorePercentage)}% үнэлгээтэй давлаа!`,
  });
};

export const showMilestoneNotifications = (
  milestoneResults: Array<{ success: boolean; message: string; xpAwarded?: number }> | undefined,
  updateProgress: (newProgress: Partial<ProgressData>) => void,
  sidebarData: SidebarData | null
) => {
  milestoneResults?.forEach((milestone) => {
    if (milestone.success && milestone.xpAwarded) {
      toast.success(`🏆 +${milestone.xpAwarded} XP`, { description: milestone.message, duration: 5000 });
      if (sidebarData?.progress) {
        updateProgress({ totalPlatformXp: sidebarData.progress.totalPlatformXp + milestone.xpAwarded });
      }
    }
  });
};

export const showUnitCompletionNotification = (
  unitXpAwarded: number | undefined,
  updateProgress: (newProgress: Partial<ProgressData>) => void,
  sidebarData: SidebarData | null
) => {
  if (unitXpAwarded && unitXpAwarded > 0) {
    toast.success(`🏆 +${unitXpAwarded} XP`, { description: "Unit амжилттай дууссан!", duration: 5000 });
    if (sidebarData?.progress) {
      updateProgress({ totalPlatformXp: sidebarData.progress.totalPlatformXp + unitXpAwarded });
    }
  }
};

export const showStreakNotification = (
  result: QuizResultNotifications,
  updateProgress: (newProgress: Partial<ProgressData>) => void,
  sidebarData: SidebarData | null
) => {
  if (result.streakBonusAwarded && result.streakBonusMessage) {
    toast.success(`🔥 +${result.streakBonusAwarded} XP`, { description: result.streakBonusMessage, duration: 5000 });
    if (sidebarData?.progress) {
      updateProgress({ totalPlatformXp: sidebarData.progress.totalPlatformXp + result.streakBonusAwarded });
    }
  }

  if (result.currentStreak && result.currentStreak > 0 && !result.streakBonusAwarded) {
    toast.success(`🔥 ${result.currentStreak} өдөр стрик!`, { description: "Ингээд үргэлжлээрэй!", duration: 3000 });
  }
};
