"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

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
  title?: string;
  onProgress?: (progress: { played: number; playedSeconds: number }) => void;
  onComplete?: () => void;
  initialProgress?: number;
};

export const VideoPlayer = ({
  videoUrl,
  // title, // Not currently used but kept in props for future use
  // onProgress, // Not currently used but kept in props for future use
  // onComplete, // Not currently used but kept in props for future use
  // initialProgress = 0, // Not currently used but kept in props for future use
}: VideoPlayerProps) => {
  // const playerRef = useRef<any>(null);
  const [error] = useState<string | null>(null);

  // Show error state
  if (error) {
    return (
      <div className="bg-white rounded-lg border overflow-hidden mb-6">
        <div className="aspect-video bg-red-50 flex items-center justify-center">
          <div className="text-center p-4">
            <p className="text-red-600 mb-2">⚠️ {error}</p>
            <p className="text-xs text-gray-600 mb-2">Video URL: {videoUrl}</p>
            <button
              onClick={() => window.open(videoUrl, "_blank")}
              className="text-xs text-blue-600 underline"
            >
              Test URL in new tab
            </button>
          </div>
        </div>
      </div>
    );
  }

  // const PlayerComponent = ReactPlayer as any;

  return (
    <div className="bg-white rounded-lg border overflow-hidden mb-6">
      <div className="relative aspect-video bg-black">
        <ReactPlayer
          // ref={playerRef}
          // url={videoUrl}
          src={videoUrl}
          width="100%"
          height="100%"
          controls
          // playing={false}
          // onReady={handleReady}
          // onProgress={handleProgress}
          // onEnded={handleEnded}
          // onError={handleError}
          // progressInterval={1000}
        />
      </div>
    </div>
  );
};
