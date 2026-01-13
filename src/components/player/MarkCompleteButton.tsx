"use client";

import { useState, useEffect } from "react";
import { Check, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { getLessonProgress, checkLessonRequirements, markLessonCompleteIfReady } from "@/lib/actions/lesson-progress";
import { useLessonPlayer } from "@/hooks/useLessonPlayer";
import { toast } from "sonner";

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
  const [canComplete, setCanComplete] = useState(false);
  const [missingRequirement, setMissingRequirement] = useState<string>("");

  // Check if lesson is already completed and requirements status
  useEffect(() => {
    const checkProgress = async () => {
      const progress = await getLessonProgress(lessonId, courseId);
      if (progress?.isCompleted) {
        setIsCompleted(true);
        setCanComplete(true);
      } else {
        // Check requirements
        const requirements = await checkLessonRequirements(lessonId, courseId);

        if (!requirements.contentComplete) {
          setMissingRequirement("Эхлээд бүх видео үзнэ үү");
          setCanComplete(false);
        } else if (!requirements.quizPassed) {
          setMissingRequirement("Эхлээд хичээлийн тестийг өгнө үү");
          setCanComplete(false);
        } else {
          setCanComplete(true);
        }
      }
      setIsChecking(false);
    };
    checkProgress();
  }, [lessonId, courseId]);

  const handleMarkComplete = async () => {
    if (isCompleted || isLoading) return;

    setIsLoading(true);
    try {
      // Attempt to mark complete (validates requirements internally)
      const result = await markLessonCompleteIfReady(lessonId, courseId);

      if (result.success && result.lessonComplete) {
        setIsCompleted(true);
        markLessonComplete(lessonId);
        toast.success("Хичээл амжилттай дууссан! 🎉");
      } else if (result.missingRequirement === "content") {
        toast.error("Бүх видео үзээгүй байна", {
          description: "Хичээлийг дуусгахын тулд эхлээд бүх theory болон example видеог үзнэ үү",
          icon: <AlertCircle className="size-4" />,
        });
      } else if (result.missingRequirement === "quiz") {
        toast.error("Тест өгөөгүй байна", {
          description: "Хичээлийг дуусгахын тулд эхлээд lesson quiz-ийг 80%-иас дээш оноотой өгнө үү",
          icon: <AlertCircle className="size-4" />,
        });
      } else {
        toast.error("Алдаа гарлаа", {
          description: result.message || "Дахин оролдоно уу",
        });
      }
    } catch (error) {
      console.error("Failed to mark lesson complete:", error);
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
