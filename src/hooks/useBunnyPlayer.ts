import { useRef, useState, useEffect, useCallback, useLayoutEffect } from "react";

declare global {
  interface Window {
    playerjs: {
      Player: new (iframe: HTMLIFrameElement) => PlayerJS;
    };
  }
}

interface PlayerJS {
  on: (event: string, callback: (data?: { seconds?: number; duration?: number }) => void) => void;
  off: (event: string) => void;
  setCurrentTime: (seconds: number) => void;
  getCurrentTime: (callback: (seconds: number) => void) => void;
  getDuration: (callback: (duration: number) => void) => void;
}

type UseBunnyPlayerProps = {
  lessonId: string;
  bunnyVideoId: string;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onEnded?: () => void;
};

export const useBunnyPlayer = ({
  lessonId,
  bunnyVideoId,
  onTimeUpdate,
  onEnded,
}: UseBunnyPlayerProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<PlayerJS | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [videoDuration, setVideoDuration] = useState(0);
  const [playerJsReady, setPlayerJsReady] = useState(false);
  const [iframeMounted, setIframeMounted] = useState(false);

  // Use refs for callbacks to avoid dependency issues
  const onTimeUpdateRef = useRef(onTimeUpdate);
  const onEndedRef = useRef(onEnded);

  // Update refs synchronously on each render
  useLayoutEffect(() => {
    onTimeUpdateRef.current = onTimeUpdate;
    onEndedRef.current = onEnded;
  });

  // Callback ref to detect when iframe mounts
  const setIframeRef = useCallback((node: HTMLIFrameElement | null) => {
    iframeRef.current = node;
    setIframeMounted(!!node);
  }, []);

  // Check for player.js availability
  useEffect(() => {
    const checkPlayerJs = () => {
      if (window.playerjs) {
        setPlayerJsReady(true);
        return true;
      }
      return false;
    };

    if (checkPlayerJs()) return;

    const interval = setInterval(() => {
      if (checkPlayerJs()) {
        clearInterval(interval);
      }
    }, 100);

    const timeout = setTimeout(() => clearInterval(interval), 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  // Reset state when lesson/video changes
  useEffect(() => {
    setIsReady(false);
    setVideoDuration(0);
  }, [lessonId, bunnyVideoId]);

  // Initialize Player.js - depends on BOTH playerJsReady AND iframeMounted
  useEffect(() => {
    if (!playerJsReady || !iframeMounted || !iframeRef.current) return;

    let player: PlayerJS | null = null;
    let isCleanedUp = false;

    try {
      player = new window.playerjs.Player(iframeRef.current);
      playerRef.current = player;

      player.on("ready", () => {
        if (isCleanedUp) return;
        player?.getDuration((dur: number) => {
          if (!isCleanedUp && dur > 0) {
            setVideoDuration(Math.floor(dur));
            setIsReady(true);
          }
        });
      });

      player.on("timeupdate", (data) => {
        if (isCleanedUp || !data) return;
        const seconds = data.seconds || 0;
        const dur = data.duration || 0;
        if (dur > 0) {
          onTimeUpdateRef.current?.(seconds, dur);
        }
      });

      player.on("ended", () => {
        if (isCleanedUp) return;
        onEndedRef.current?.();
      });
    } catch (error) {
      console.error("Failed to initialize player.js:", error);
    }

    return () => {
      isCleanedUp = true;
      if (player) {
        try {
          player.off("ready");
          player.off("timeupdate");
          player.off("ended");
        } catch {
          // Ignore cleanup errors
        }
      }
      playerRef.current = null;
    };
  }, [lessonId, bunnyVideoId, playerJsReady, iframeMounted]);

  const setCurrentTime = useCallback((seconds: number) => {
    try {
      playerRef.current?.setCurrentTime(seconds);
    } catch {
      // Ignore seek errors
    }
  }, []);

  return {
    iframeRef: setIframeRef,  // Return callback ref instead of ref object
    isReady,
    videoDuration,
    setCurrentTime,
  };
};
