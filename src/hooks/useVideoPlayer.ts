import { useState, useRef, useEffect, useCallback } from "react";

type UseVideoPlayerProps = {
  lessonId: string;
};

export const useVideoPlayer = ({ lessonId }: UseVideoPlayerProps) => {
  const playerRef = useRef<HTMLVideoElement | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoDuration, setVideoDuration] = useState(0);

  // Reset states when lesson changes
  useEffect(() => {
    setIsReady(false);
    setVideoDuration(0);
    setIsPlaying(false);
  }, [lessonId]);

  // Set player ref callback
  const setPlayerRef = useCallback((player: HTMLVideoElement) => {
    if (!player) return;
    playerRef.current = player;
    console.log("✅ Player ref set:", player);
  }, []);

  // Event handlers
  const handleReady = () => {
    console.log("▶️ Player ready");
    setIsReady(true);
  };

  const handlePlay = () => {
    console.log("▶️ Video playing");
    setIsPlaying(true);
  };

  const handlePause = () => {
    console.log("⏸️ Video paused");
    setIsPlaying(false);
  };

  const handleDurationChange = () => {
    const player = playerRef.current;
    if (!player) return;

    console.log("⏱️ Duration loaded:", Math.floor(player.duration), "seconds");
    setVideoDuration(Math.floor(player.duration));
  };

  return {
    playerRef,
    isReady,
    isPlaying,
    videoDuration,
    setPlayerRef,
    handleReady,
    handlePlay,
    handlePause,
    handleDurationChange,
  };
};
