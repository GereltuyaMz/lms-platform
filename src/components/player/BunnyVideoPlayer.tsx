"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { saveVideoProgress, getLessonProgress } from "@/lib/actions";
import { toast } from "sonner";

type BunnyVideoPlayerProps = {
  bunnyVideoId: string;
  bunnyLibraryId: string;
  lessonId: string;
  courseId: string;
  duration?: number;
};

export const BunnyVideoPlayer = ({
  bunnyVideoId,
  bunnyLibraryId,
  lessonId,
  courseId,
  duration,
}: BunnyVideoPlayerProps) => {
  const router = useRouter();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [lastSavedPosition, setLastSavedPosition] = useState(0);
  const [progressLoaded, setProgressLoaded] = useState(false);
  const xpAwarded = useRef(false);
  const videoDuration = useRef(duration || 0);
  const lastSaveTime = useRef(0);

  const iframeUrl = `https://iframe.mediadelivery.net/embed/${bunnyLibraryId}/${bunnyVideoId}?autoplay=false&preload=true&responsive=true`;

  // Load saved progress
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

  const saveProgress = useCallback(
    async (position: number, completed: boolean) => {
      if (completed && !xpAwarded.current) {
        setIsCompleted(true);
        xpAwarded.current = true;

        const loadingToast = toast.loading("Хадгалж байна...");
        const result = await saveVideoProgress(lessonId, courseId, position, completed, videoDuration.current);
        toast.dismiss(loadingToast);

        if (result.success) {
          setLastSavedPosition(position);
          if (result.videoXpAwarded) {
            toast.success(`🎉 +${result.videoXpAwarded} XP`, { description: "Хичээлээ амжилттай дуусгалаа!" });
          }
          result.milestoneResults?.forEach((m) => {
            if (m.success && m.xpAwarded) toast.success(`🏆 +${m.xpAwarded} XP`, { description: m.message, duration: 5000 });
          });
          if (result.streakBonusAwarded) {
            toast.success(`🔥 +${result.streakBonusAwarded} XP`, { description: result.streakBonusMessage, duration: 5000 });
          } else if (result.currentStreak && result.currentStreak > 0) {
            toast.success(`🔥 ${result.currentStreak} өдөр стрик!`, { description: "Ингээд үргэлжлээрэй!", duration: 3000 });
          }
          setTimeout(() => router.refresh(), 100);
        } else {
          setIsCompleted(false);
          xpAwarded.current = false;
          toast.error("Алдаа гарлаа", { description: result.message || "Дахин оролдоно уу" });
        }
      } else {
        const result = await saveVideoProgress(lessonId, courseId, position, completed, undefined);
        if (result.success) setLastSavedPosition(position);
      }
    },
    [lessonId, courseId, router]
  );

  // Listen for Bunny iframe postMessage events
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!event.origin.includes("mediadelivery.net")) return;
      const data = event.data;
      if (!data || typeof data !== "object") return;

      if (data.event === "videoProgress" || data.event === "timeupdate") {
        const currentTime = data.currentTime || data.time || 0;
        const totalDuration = data.duration || videoDuration.current;
        if (totalDuration > 0) {
          videoDuration.current = totalDuration;
          const played = currentTime / totalDuration;
          if (played >= 0.9 && !isCompleted) saveProgress(currentTime, true);
          if (Math.abs(currentTime - lastSaveTime.current) >= 5) {
            lastSaveTime.current = currentTime;
            saveProgress(currentTime, false);
          }
        }
      } else if (data.event === "ended" || data.event === "videoEnded") {
        if (!isCompleted) saveProgress(videoDuration.current, true);
      } else if (data.event === "ready" && data.duration) {
        videoDuration.current = data.duration;
        if (progressLoaded && lastSavedPosition > 0 && iframeRef.current?.contentWindow) {
          iframeRef.current.contentWindow.postMessage({ event: "seek", time: lastSavedPosition }, "*");
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [isCompleted, progressLoaded, lastSavedPosition, saveProgress]);

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
