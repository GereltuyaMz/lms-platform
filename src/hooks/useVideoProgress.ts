import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { saveVideoProgress, getLessonProgress } from "@/lib/actions";
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
  const router = useRouter();
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
    // Optimistic UI: Update state and show loading toast immediately
    if (completed && !xpAwarded.current) {
      setIsCompleted(true);
      xpAwarded.current = true;

      // Show loading state
      const loadingToast = toast.loading("Хадгалж байна...", {
        description: "Хичээлийн явцыг хадгалж байна",
      });

      // Call server action in background
      const result = await saveVideoProgress(
        lessonId,
        courseId,
        position,
        completed,
        videoDuration
      );

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      if (result.success) {
        setLastSavedPosition(position);

        // Show success notifications
        if (result.videoXpAwarded) {
          toast.success(`🎉 +${result.videoXpAwarded} XP`, {
            description: "Хичээлээ амжилттай дуусгалаа!",
          });
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
          toast.success(`🔥 ${result.currentStreak} өдөр стрик!`, {
            description: "Ингээд үргэлжлээрэй!",
            duration: 3000,
          });
        }

        // Refresh router to update sidebar checkmark
        // Small delay to ensure revalidatePath completes
        setTimeout(() => router.refresh(), 100);
      } else {
        // Revert optimistic update on failure
        setIsCompleted(false);
        xpAwarded.current = false;
        toast.error("Алдаа гарлаа", {
          description: result.message || "Дахин оролдоно уу",
        });
      }
    } else {
      // For non-completion progress saves (every 5 seconds)
      const result = await saveVideoProgress(
        lessonId,
        courseId,
        position,
        completed,
        undefined
      );

      if (result.success) {
        setLastSavedPosition(position);
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
