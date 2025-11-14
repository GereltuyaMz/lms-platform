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
  }, []);

  // Event handlers
  const handleReady = () => {
    setIsReady(true);
  };

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleDurationChange = () => {
    const player = playerRef.current;
    if (!player) return;

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
