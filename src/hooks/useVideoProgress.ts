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

      console.log("📥 Loading progress for lesson:", lessonId);
      const progress = await getLessonProgress(lessonId, courseId);

      if (progress) {
        console.log("📊 Progress loaded:", {
          isCompleted: progress.isCompleted,
          lastPosition: progress.lastPosition,
        });
        setIsCompleted(progress.isCompleted);
        setLastSavedPosition(progress.lastPosition);
      } else {
        console.log("🆕 No previous progress found");
      }
      setProgressLoaded(true);
    };

    loadProgress();
  }, [lessonId, courseId]);

  // Save progress to database
  const saveProgress = async (position: number, completed: boolean) => {
    console.log("💾 Saving progress:", {
      position: Math.floor(position),
      completed,
      duration: videoDuration,
    });

    const result = await saveVideoProgress(
      lessonId,
      courseId,
      position,
      completed
    );

    if (result.success) {
      console.log("✅ Progress saved successfully");
      setLastSavedPosition(position);

      if (completed) {
        console.log("🎉 Lesson marked as completed!");
        setIsCompleted(true);

        // Award XP on first completion
        if (!xpAwarded.current && videoDuration > 0) {
          xpAwarded.current = true;
          console.log("🎁 Awarding XP...");

          const xpResult = await awardVideoCompletionXP(
            lessonId,
            courseId,
            videoDuration
          );

          if (xpResult.success && xpResult.xpAwarded) {
            console.log("✨ XP awarded:", xpResult.xpAwarded);
            toast.success(`🎉 +${xpResult.xpAwarded} XP`, {
              description: "Lesson completed!",
            });
          } else {
            console.log("⚠️ XP award failed or already awarded");
          }
        }

        // Show milestone XP notifications
        if (result.milestoneResults && result.milestoneResults.length > 0) {
          console.log("🏆 Milestone XP awarded:", result.milestoneResults);
          result.milestoneResults.forEach((milestone) => {
            if (milestone.success && milestone.xpAwarded) {
              toast.success(`🏆 +${milestone.xpAwarded} XP`, {
                description: milestone.message,
                duration: 5000,
              });
            }
          });
        }
      }
    } else {
      console.error("❌ Failed to save progress:", result.message);
    }
  };

  return {
    isCompleted,
    lastSavedPosition,
    progressLoaded,
    saveProgress,
  };
};
