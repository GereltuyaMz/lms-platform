"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  saveIndividualContentProgress,
  getLessonContentProgress,
} from "@/lib/actions";
import { useLessonPlayer } from "@/hooks/useLessonPlayer";
import { toast } from "sonner";

type BunnyVideoPlayerProps = {
  bunnyVideoId: string;
  bunnyLibraryId: string;
  contentId: string;
  lessonId: string;
  courseId: string;
  duration?: number;
  contentType: "theory" | "example"; // Step type for cache update
};

export const BunnyVideoPlayer = ({
  bunnyVideoId,
  bunnyLibraryId,
  contentId,
  lessonId,
  courseId,
  duration,
  contentType,
}: BunnyVideoPlayerProps) => {
  const router = useRouter();
  const { markStepComplete, updateProgress, sidebarData, markLessonComplete } = useLessonPlayer();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [lastSavedPosition, setLastSavedPosition] = useState(0);
  const [progressLoaded, setProgressLoaded] = useState(false);
  const xpAwarded = useRef(false);
  const videoDuration = useRef(duration || 0);
  const lastSaveTime = useRef(0);

  // Load saved progress for this specific content item
  useEffect(() => {
    const loadProgress = async () => {
      setProgressLoaded(false);
      xpAwarded.current = false;
      const { data } = await getLessonContentProgress(lessonId, courseId);
      if (data) {
        const thisContent = data.find((c) => c.contentId === contentId);
        if (thisContent) {
          setIsCompleted(thisContent.isCompleted);
          setLastSavedPosition(thisContent.lastPosition);
        }
      }
      setProgressLoaded(true);
    };
    loadProgress();
  }, [lessonId, courseId, contentId]);

  const saveProgress = useCallback(
    async (position: number, completed: boolean) => {
      if (completed && !xpAwarded.current) {
        setIsCompleted(true);

        const loadingToast = toast.loading("Хадгалж байна...");
        const result = await saveIndividualContentProgress(
          contentId,
          lessonId,
          courseId,
          position,
          completed
        );
        toast.dismiss(loadingToast);

        if (result.success) {
          // Set flag only after successful completion
          xpAwarded.current = true;
          setLastSavedPosition(position);

          if (result.videoXpAwarded) {
            toast.success(`🎉 +${result.videoXpAwarded} XP`, {
              description: "Видео амжилттай үзлээ!",
            });
            // Update XP in sidebar immediately
            if (sidebarData?.progress) {
              updateProgress({
                totalPlatformXp: sidebarData.progress.totalPlatformXp + result.videoXpAwarded,
              });
            }
          }
          result.milestoneResults?.forEach((m) => {
            if (m.success && m.xpAwarded) {
              toast.success(`🏆 +${m.xpAwarded} XP`, {
                description: m.message,
                duration: 5000,
              });
              // Update XP in sidebar immediately for each milestone
              if (sidebarData?.progress) {
                updateProgress({
                  totalPlatformXp: sidebarData.progress.totalPlatformXp + m.xpAwarded,
                });
              }
            }
          });
          // Optimistically mark step as complete for immediate icon update
          markStepComplete(lessonId, contentType);
          markLessonComplete(lessonId);
          setTimeout(() => router.refresh(), 100);
        } else {
          setIsCompleted(false);
          xpAwarded.current = false;
          toast.error("Алдаа гарлаа", {
            description: result.message || "Дахин оролдоно уу",
          });
        }
      } else {
        const result = await saveIndividualContentProgress(
          contentId,
          lessonId,
          courseId,
          position,
          completed
        );
        if (result.success) setLastSavedPosition(position);
      }
    },
    [contentId, lessonId, courseId, router, markStepComplete, contentType, sidebarData, updateProgress, markLessonComplete]
  );

  // Handle postMessage events from Bunny iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!event.data || typeof event.data !== "object") return;
      const data = event.data;

      if (data.event === "videoProgress" || data.event === "timeupdate") {
        const currentTime = data.currentTime || data.time || 0;
        const totalDuration = data.duration || videoDuration.current;

        if (totalDuration > 0) {
          videoDuration.current = totalDuration;
          const played = currentTime / totalDuration;

          if (played >= 0.9 && !isCompleted) {
            saveProgress(currentTime, true);
          }
          if (Math.abs(currentTime - lastSaveTime.current) >= 5) {
            lastSaveTime.current = currentTime;
            saveProgress(currentTime, false);
          }
        }
      } else if (data.event === "ended" || data.event === "videoEnded") {
        if (!isCompleted) saveProgress(videoDuration.current, true);
      } else if (data.event === "ready" && data.duration) {
        videoDuration.current = data.duration;
        if (
          progressLoaded &&
          lastSavedPosition > 0 &&
          iframeRef.current?.contentWindow
        ) {
          iframeRef.current.contentWindow.postMessage(
            { event: "seek", time: lastSavedPosition },
            "*"
          );
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [isCompleted, progressLoaded, lastSavedPosition, saveProgress]);

  const iframeUrl = `https://iframe.mediadelivery.net/embed/${bunnyLibraryId}/${bunnyVideoId}?autoplay=false&preload=true&responsive=true`;

  return (
    <div className="bg-white rounded-lg border overflow-hidden mb-6">
      <div className="relative aspect-video bg-black">
        <iframe
          ref={iframeRef}
          src={iframeUrl}
          loading="lazy"
          className="absolute inset-0 w-full h-full border-0"
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
};
