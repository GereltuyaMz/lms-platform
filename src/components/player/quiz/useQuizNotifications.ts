"use client";

import { toast } from "sonner";
import type { SidebarData, ProgressData } from "@/hooks/useLessonPlayer";

type QuizResultNotifications = {
  milestoneResults?: Array<{
    success: boolean;
    message: string;
    xpAwarded?: number;
  }>;
  unitXpAwarded?: number;
  streakBonusAwarded?: number;
  streakBonusMessage?: string;
  currentStreak?: number;
  badgeXpAwarded?: number;
  badgeMessage?: string;
};

export const showQuizXpNotification = (
  xpAwarded: number,
  scorePercentage: number,
  isUnit: boolean
) => {
  const type = isUnit ? "бүлгийн тестээ" : "тестээ";
  toast.success(`🎉 +${xpAwarded} XP`, {
    description: `Та ${type} ${Math.round(
      scorePercentage
    )}% үнэлгээтэй давлаа!`,
  });
};

export const showMilestoneNotifications = (
  milestoneResults:
    | Array<{ success: boolean; message: string; xpAwarded?: number }>
    | undefined,
  updateProgress: (newProgress: Partial<ProgressData>) => void,
  sidebarData: SidebarData | null
) => {
  milestoneResults?.forEach((milestone) => {
    if (milestone.success && milestone.xpAwarded) {
      toast.success(`🏆 +${milestone.xpAwarded} XP`, {
        description: milestone.message,
        duration: 5000,
      });
      if (sidebarData?.progress) {
        updateProgress({
          totalPlatformXp:
            sidebarData.progress.totalPlatformXp + milestone.xpAwarded,
        });
      }
    }
  });
};

export const showStreakNotification = (
  result: QuizResultNotifications,
  updateProgress: (newProgress: Partial<ProgressData>) => void,
  sidebarData: SidebarData | null
) => {
  if (result.streakBonusAwarded && result.streakBonusMessage) {
    toast.success(`🔥 +${result.streakBonusAwarded} XP`, {
      description: result.streakBonusMessage,
      duration: 5000,
    });
    if (sidebarData?.progress) {
      updateProgress({
        totalPlatformXp:
          sidebarData.progress.totalPlatformXp + result.streakBonusAwarded,
        streak: result.currentStreak,
      });
    }
  } else if (result.currentStreak && result.currentStreak > 0) {
    toast.success(`🔥 ${result.currentStreak} өдөр стрик!`, {
      description: "Ингээд үргэлжлээрэй!",
      duration: 3000,
    });
    // Update sidebar streak display
    if (sidebarData?.progress) {
      updateProgress({ streak: result.currentStreak });
    }
  }
};

export const showBadgeNotification = (
  result: QuizResultNotifications,
  updateProgress: (newProgress: Partial<ProgressData>) => void,
  sidebarData: SidebarData | null
) => {
  if (result.badgeXpAwarded && result.badgeXpAwarded > 0) {
    toast.success(`🏅 +${result.badgeXpAwarded} XP`, {
      description: result.badgeMessage || "Шинэ медаль олж авлаа!",
      duration: 5000,
    });
    if (sidebarData?.progress) {
      updateProgress({
        totalPlatformXp:
          sidebarData.progress.totalPlatformXp + result.badgeXpAwarded,
      });
    }
  }
};
