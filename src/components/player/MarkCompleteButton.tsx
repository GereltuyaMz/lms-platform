"use client";

import { useState, useEffect } from "react";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { saveVideoProgress, getLessonProgress } from "@/lib/actions/lesson-progress";
import { useLessonPlayer } from "@/hooks/useLessonPlayer";

type MarkCompleteButtonProps = {
  lessonId: string;
  courseId: string;
};

export const MarkCompleteButton = ({
  lessonId,
  courseId,
}: MarkCompleteButtonProps) => {
  const { markLessonComplete } = useLessonPlayer();
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  // Check if lesson is already completed on mount
  useEffect(() => {
    const checkProgress = async () => {
      const progress = await getLessonProgress(lessonId, courseId);
      if (progress?.isCompleted) {
        setIsCompleted(true);
      }
      setIsChecking(false);
    };
    checkProgress();
  }, [lessonId, courseId]);

  const handleMarkComplete = async () => {
    if (isCompleted || isLoading) return;

    setIsLoading(true);
    try {
      const result = await saveVideoProgress(lessonId, courseId, 0, true);
      if (result.success) {
        setIsCompleted(true);
        // Update sidebar progress via context
        markLessonComplete(lessonId);
      }
    } catch (error) {
      console.error("Failed to mark lesson complete:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isChecking) {
    return (
      <div
        className={cn(
          "flex items-center justify-center gap-2",
          "px-5 py-3 rounded-lg",
          "bg-[#606099]/50 border border-[#e2e0f9]",
          "text-white text-base"
        )}
      >
        <Loader2 className="size-4 animate-spin" />
        <span>Шалгаж байна...</span>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div
        className={cn(
          "flex items-center justify-center gap-2",
          "px-5 py-3 rounded-lg",
          "bg-[#606099] border border-[#e2e0f9]",
          "text-white text-base"
        )}
      >
        <Check className="size-4" />
        <span>Дууссан</span>
      </div>
    );
  }

  return (
    <button
      onClick={handleMarkComplete}
      disabled={isLoading}
      className={cn(
        "flex items-center justify-center gap-2",
        "px-5 py-3 rounded-lg",
        "bg-[#606099] border border-[#e2e0f9]",
        "text-white text-base",
        "hover:bg-[#505085] transition-colors cursor-pointer",
        "disabled:opacity-70 disabled:cursor-not-allowed"
      )}
    >
      {isLoading ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          <span>Хадгалж байна...</span>
        </>
      ) : (
        <span>Дууссан гэж тэмдэглэх</span>
      )}
    </button>
  );
};
