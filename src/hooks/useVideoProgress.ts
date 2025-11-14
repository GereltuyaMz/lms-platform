import { useState, useEffect, useRef } from "react";
import {
  saveVideoProgress,
  getLessonProgress,
  awardVideoCompletionXP,
} from "@/lib/actions";
import { toast } from "sonner";

type UseVideoProgressProps = {
  lessonId: string;
  courseId: string;
  videoDuration: number;
};

export const useVideoProgress = ({
  lessonId,
  courseId,
  videoDuration,
}: UseVideoProgressProps) => {
  const [isCompleted, setIsCompleted] = useState(false);
  const [lastSavedPosition, setLastSavedPosition] = useState(0);
  const [progressLoaded, setProgressLoaded] = useState(false);
  const xpAwarded = useRef(false);

  // Load saved progress on mount or when lesson changes
  useEffect(() => {
    const loadProgress = async () => {
      setProgressLoaded(false);
      xpAwarded.current = false;

      const progress = await getLessonProgress(lessonId, courseId);

      if (progress) {
        setIsCompleted(progress.isCompleted);
        setLastSavedPosition(progress.lastPosition);
      }
      setProgressLoaded(true);
    };

    loadProgress();
  }, [lessonId, courseId]);

  // Save progress to database
  const saveProgress = async (position: number, completed: boolean) => {
    const result = await saveVideoProgress(
      lessonId,
      courseId,
      position,
      completed
    );

    if (result.success) {
      setLastSavedPosition(position);

      if (completed) {
        setIsCompleted(true);

        // Award XP on first completion
        if (!xpAwarded.current && videoDuration > 0) {
          xpAwarded.current = true;

          const xpResult = await awardVideoCompletionXP(
            lessonId,
            courseId,
            videoDuration
          );

          if (xpResult.success && xpResult.xpAwarded) {
            toast.success(`🎉 +${xpResult.xpAwarded} XP`, {
              description: "Lesson completed!",
            });
          }
        }

        // Show milestone XP notifications
        if (result.milestoneResults && result.milestoneResults.length > 0) {
          result.milestoneResults.forEach((milestone) => {
            if (milestone.success && milestone.xpAwarded) {
              toast.success(`🏆 +${milestone.xpAwarded} XP`, {
                description: milestone.message,
                duration: 5000,
              });
            }
          });
        }

        // Show streak bonus notification
        if (result.streakBonusAwarded && result.streakBonusMessage) {
          toast.success(`🔥 +${result.streakBonusAwarded} XP`, {
            description: result.streakBonusMessage,
            duration: 5000,
          });
        }

        // Show streak update (without bonus)
        if (
          result.currentStreak &&
          result.currentStreak > 0 &&
          !result.streakBonusAwarded
        ) {
          toast.success(`🔥 ${result.currentStreak} day streak!`, {
            description: "Keep it up!",
            duration: 3000,
          });
        }
      }
    }
  };

  return {
    isCompleted,
    lastSavedPosition,
    progressLoaded,
    saveProgress,
  };
};
