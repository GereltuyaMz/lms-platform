"use client";

import { useEffect, useRef, useCallback } from "react";
import { useBunnyPlayer } from "@/hooks/useBunnyPlayer";
import { useVideoProgress } from "@/hooks/useVideoProgress";
import { useLessonPlayer } from "@/hooks/useLessonPlayer";

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
}: BunnyVideoPlayerProps) => {
  const lastSaveTimeRef = useRef(0);
  const isCompletedRef = useRef(false);
  const saveProgressRef = useRef<
    (position: number, completed: boolean, durationOverride?: number) => void
  >(() => {});
  const videoDurationRef = useRef(0);
  const hasInitialSeeked = useRef(false);
  const markLessonCompleteRef = useRef<(() => void) | null>(null);

  // Get markLessonComplete from context to update UI immediately
  const { markLessonComplete } = useLessonPlayer();

  const handleTimeUpdate = useCallback(
    (currentTime: number, duration: number) => {
      const played = currentTime / duration;

      // Check for 90% completion
      if (played >= 0.9 && !isCompletedRef.current) {
        isCompletedRef.current = true;
        saveProgressRef.current(currentTime, true, Math.floor(duration));
        markLessonCompleteRef.current?.(); // Update UI immediately
      }

      // Save progress every 5 seconds
      if (Math.abs(currentTime - lastSaveTimeRef.current) >= 5) {
        lastSaveTimeRef.current = currentTime;
        saveProgressRef.current(currentTime, false);
      }
    },
    []
  );

  const handleEnded = useCallback(() => {
    if (!isCompletedRef.current) {
      isCompletedRef.current = true;
      saveProgressRef.current(
        videoDurationRef.current,
        true,
        videoDurationRef.current
      );
      markLessonCompleteRef.current?.(); // Update UI immediately
    }
  }, []);

  const { iframeRef, isReady, videoDuration, setCurrentTime } = useBunnyPlayer({
    lessonId,
    bunnyVideoId,
    onTimeUpdate: handleTimeUpdate,
    onEnded: handleEnded,
  });

  const { isCompleted, lastSavedPosition, progressLoaded, saveProgress } =
    useVideoProgress({ lessonId, courseId, videoDuration });

  // Keep refs in sync with current values
  useEffect(() => {
    saveProgressRef.current = saveProgress;
  }, [saveProgress]);

  useEffect(() => {
    markLessonCompleteRef.current = () => markLessonComplete(lessonId);
  }, [markLessonComplete, lessonId]);

  useEffect(() => {
    videoDurationRef.current = videoDuration;
  }, [videoDuration]);

  // Sync completion ref with state
  useEffect(() => {
    isCompletedRef.current = isCompleted;
  }, [isCompleted]);

  // Reset refs when lesson or video changes
  useEffect(() => {
    lastSaveTimeRef.current = 0;
    isCompletedRef.current = false;
    hasInitialSeeked.current = false;
  }, [lessonId, bunnyVideoId]);

  // Seek to last saved position ONCE when ready
  // Don't seek if already completed (user is re-watching) or if saved position exceeds video duration
  useEffect(() => {
    if (
      progressLoaded &&
      lastSavedPosition > 0 &&
      isReady &&
      !hasInitialSeeked.current &&
      !isCompleted &&
      videoDuration > 0 &&
      lastSavedPosition < videoDuration
    ) {
      hasInitialSeeked.current = true;
      setCurrentTime(lastSavedPosition);
    }
  }, [progressLoaded, lastSavedPosition, isReady, setCurrentTime, isCompleted, videoDuration]);

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
