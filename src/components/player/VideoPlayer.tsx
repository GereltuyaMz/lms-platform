"use client";

import dynamic from "next/dynamic";
import { CheckCircle2 } from "lucide-react";
import { useVideoPlayer } from "@/hooks/useVideoPlayer";
import { useVideoProgress } from "@/hooks/useVideoProgress";

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
  lessonId: string;
  courseId: string;
};

export const VideoPlayer = ({
  videoUrl,
  lessonId,
  courseId,
}: VideoPlayerProps) => {
  const {
    playerRef,
    isReady,
    isPlaying,
    videoDuration,
    setPlayerRef,
    handleReady: onReady,
    handlePlay: onPlay,
    handlePause: onPause,
    handleDurationChange: onDurationChange,
  } = useVideoPlayer({ lessonId });

  const { isCompleted, lastSavedPosition, progressLoaded, saveProgress } =
    useVideoProgress({ lessonId, courseId, videoDuration });

  // Seek when progress is loaded and we have a saved position
  const handleReady = () => {
    onReady();
    if (progressLoaded && lastSavedPosition > 0 && playerRef.current) {
      playerRef.current.currentTime = lastSavedPosition;
    }
  };

  const handleTimeUpdate = () => {
    const player = playerRef.current;
    if (!player || !player.duration) return;

    const currentTime = player.currentTime;
    const played = currentTime / player.duration;

    if (played >= 0.9 && !isCompleted) {
      saveProgress(currentTime, true);
    }

    if (Math.abs(currentTime - lastSavedPosition) >= 5) {
      saveProgress(currentTime, false);
    }
  };

  const handleEnded = () => {
    const player = playerRef.current;
    if (!isCompleted && player) {
      saveProgress(player.currentTime, true);
    }
  };

  const PlayerComponent = ReactPlayer as React.ComponentType<{
    ref: (player: HTMLVideoElement) => void;
    src: string;
    width: string;
    height: string;
    controls: boolean;
    playing: boolean;
    onReady: () => void;
    onPlay: () => void;
    onPause: () => void;
    onDurationChange: () => void;
    onTimeUpdate: () => void;
    onEnded: () => void;
  }>;

  return (
    <div className="bg-white rounded-lg border overflow-hidden mb-6">
      <div className="relative aspect-video bg-black">
        <PlayerComponent
          ref={setPlayerRef}
          src={videoUrl}
          width="100%"
          height="100%"
          controls
          playing={isPlaying}
          onReady={handleReady}
          onPlay={onPlay}
          onPause={onPause}
          onDurationChange={onDurationChange}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
        />
      </div>

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
