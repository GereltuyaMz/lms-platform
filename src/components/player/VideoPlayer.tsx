"use client";

import dynamic from "next/dynamic";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2 } from "lucide-react";
import {
  saveVideoProgress,
  getLessonProgress,
} from "@/lib/actions/lesson-progress";
import { awardVideoCompletionXP } from "@/lib/actions/xp-actions";
import { toast } from "sonner";

const ReactPlayer = dynamic(() => import("react-player"), {
  ssr: false,
  loading: () => (
    <div className="aspect-video bg-gray-900 flex items-center justify-center">
      <p className="text-white">Loading player...</p>
    </div>
  ),
});

type VideoPlayerProps = {
  videoUrl: string;
  title: string;
  lessonId: string;
  courseId: string;
};

export const VideoPlayer = ({
  videoUrl,
  title,
  lessonId,
  courseId,
}: VideoPlayerProps) => {
  const playerRef = useRef<HTMLVideoElement | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [lastSavedPosition, setLastSavedPosition] = useState(0);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [isMarking, setIsMarking] = useState(false);
  const [progressLoaded, setProgressLoaded] = useState(false);
  const [videoDuration, setVideoDuration] = useState(0);
  const saveIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasSeeked = useRef(false);
  const xpAwarded = useRef(false);

  // Load saved progress on mount or when lesson changes
  useEffect(() => {
    const loadProgress = async () => {
      // Reset states when lesson changes
      setProgressLoaded(false);
      hasSeeked.current = false;
      xpAwarded.current = false;
      setIsReady(false);

      const progress = await getLessonProgress(lessonId, courseId);
      if (progress) {
        setIsCompleted(progress.isCompleted);
        setLastSavedPosition(progress.lastPosition);
      }
      setProgressLoaded(true);
    };
    loadProgress();
  }, [lessonId, courseId]);

  // Seek to saved position when both player is ready and progress is loaded
  useEffect(() => {
    if (
      isReady &&
      progressLoaded &&
      lastSavedPosition > 0 &&
      !hasSeeked.current &&
      playerRef.current
    ) {
      (playerRef.current as any).seekTo(lastSavedPosition, "seconds");
      hasSeeked.current = true;
    }
  }, [isReady, progressLoaded, lastSavedPosition]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (saveIntervalRef.current) {
        clearInterval(saveIntervalRef.current);
      }
    };
  }, []);

  // Handle player ready
  const handleReady = () => {
    setIsReady(true);
  };

  // Handle duration loaded
  const handleDuration = (duration: number) => {
    setVideoDuration(Math.floor(duration));
  };

  // Handle progress updates
  const handleProgress = (state: { played: number; playedSeconds: number }) => {
    setCurrentPosition(state.playedSeconds);

    // Auto-mark complete at 90%
    if (state.played >= 0.9 && !isCompleted) {
      handleAutoComplete(state.playedSeconds);
    }

    // Save progress every 5 seconds
    if (Math.abs(state.playedSeconds - lastSavedPosition) >= 5) {
      saveProgress(state.playedSeconds, false);
    }
  };

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
      }
    }
  };

  // Auto-mark complete when reaching 90%
  const handleAutoComplete = async (position: number) => {
    await saveProgress(position, true);
  };

  // Handle video ended
  const handleEnded = () => {
    if (!isCompleted) {
      saveProgress(currentPosition, true);
    }
  };

  // Manual mark as complete
  const handleMarkComplete = async () => {
    setIsMarking(true);
    // Use saveProgress to preserve video position
    await saveProgress(currentPosition, true);
    setIsMarking(false);
  };

  const PlayerComponent = ReactPlayer as any;
  console.log("videoDuration", videoDuration);
  return (
    <div className="bg-white rounded-lg border overflow-hidden mb-6">
      <div className="relative aspect-video bg-black">
        <PlayerComponent
          ref={playerRef}
          src={videoUrl}
          width="100%"
          height="100%"
          controls
          playing={false}
          onReady={handleReady}
          onDuration={handleDuration}
          onProgress={handleProgress}
          onEnded={handleEnded}
          progressInterval={1000}
        />
      </div>

      {/* Mark as Complete Button */}
      {isReady && !isCompleted && (
        <div className="p-4 border-t bg-gray-50">
          <Button
            onClick={handleMarkComplete}
            disabled={isMarking}
            variant="outline"
            className="w-full"
          >
            {isMarking ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Marking as complete...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Mark as complete
              </>
            )}
          </Button>
        </div>
      )}

      {/* Completed Badge */}
      {isCompleted && (
        <div className="p-4 border-t bg-emerald-50">
          <div className="flex items-center justify-center text-emerald-700">
            <CheckCircle2 className="w-5 h-5 mr-2" />
            <span className="font-semibold">Lesson completed!</span>
          </div>
        </div>
      )}
    </div>
  );
};
