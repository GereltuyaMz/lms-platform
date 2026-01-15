"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  saveContentProgress,
  getContentProgress,
} from "@/lib/actions/lesson-content-progress";
import { useLessonPlayer } from "@/hooks/useLessonPlayer";
import { toast } from "sonner";

type ContentCompleteButtonProps = {
  contentId: string;
  lessonId: string;
  courseId: string;
  contentTitle?: string;
  contentType: "theory" | "example"; // Step type for cache update
};

export const ContentCompleteButton = ({
  contentId,
  lessonId,
  courseId,
  contentTitle,
  contentType,
}: ContentCompleteButtonProps) => {
  const router = useRouter();
  const { markLessonComplete, markStepComplete, updateProgress, sidebarData } = useLessonPlayer();
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkProgress = async () => {
      const contentProgress = await getContentProgress(lessonId, courseId);
      const thisContent = contentProgress.find(
        (c) => c.contentId === contentId
      );

      if (thisContent?.isCompleted) {
        setIsCompleted(true);
      }

      setIsChecking(false);
    };

    checkProgress();
  }, [contentId, lessonId, courseId]);

  const handleMarkComplete = async () => {
    if (isCompleted || isLoading) return;

    setIsLoading(true);

    try {
      const result = await saveContentProgress(
        contentId,
        lessonId,
        courseId,
        0,
        true
      );

      if (result.success) {
        setIsCompleted(true);

        // Optimistically mark step as complete for immediate icon update
        markStepComplete(lessonId, contentType);

        if (result.xpAwarded && result.xpAwarded > 0) {
          toast.success(`🎉 +${result.xpAwarded} XP`, {
            description: contentTitle
              ? `"${contentTitle}" амжилттай дууссан!`
              : "Контент амжилттай дууссан!",
          });
          // Update XP in sidebar immediately
          if (sidebarData?.progress) {
            updateProgress({
              totalPlatformXp: sidebarData.progress.totalPlatformXp + result.xpAwarded,
            });
          }
        }

        // Update XP for unit completion (no toast - XP claimable via badge)
        if (result.unitXpAwarded && result.unitXpAwarded > 0 && sidebarData?.progress) {
          updateProgress({
            totalPlatformXp: sidebarData.progress.totalPlatformXp + result.unitXpAwarded,
          });
        }

        if (result.lessonComplete) {
          markLessonComplete(lessonId);
          toast.success("🎓 Хичээл амжилттай дууслаа.");
        }

        router.refresh();
      } else {
        toast.error("Алдаа гарлаа", {
          description: result.message || "Дахин оролдоно уу",
        });
      }
    } catch (error) {
      console.error("Failed to mark content complete:", error);
      toast.error("Алдаа гарлаа", {
        description: "Дахин оролдоно уу",
      });
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
