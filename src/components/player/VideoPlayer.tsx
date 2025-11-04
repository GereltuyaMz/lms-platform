"use client";

import { Play, Pause, Volume2, Maximize, Settings } from "lucide-react";
import { Slider } from "@/components/ui/slider";

type VideoPlayerProps = {
  videoUrl: string;
  title: string;
};

export const VideoPlayer = ({ videoUrl, title }: VideoPlayerProps) => {
  return (
    <div className="bg-white rounded-lg border overflow-hidden mb-6">
      {/* Video Container */}
      <div className="relative aspect-video bg-gray-900 group">
        {/* Placeholder for actual video player */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <Play className="w-10 h-10 text-white ml-1" fill="white" />
            </div>
            <p className="text-white/80 text-sm">Video Player Placeholder</p>
            <p className="text-white/60 text-xs mt-1">{videoUrl}</p>
          </div>
        </div>

        {/* Custom Video Controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Progress Bar */}
          <div className="mb-3">
            <Slider
              defaultValue={[35]}
              max={100}
              step={1}
              className="cursor-pointer"
            />
            <div className="flex justify-between text-xs text-white/80 mt-1">
              <span>02:15</span>
              <span>05:12</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Play/Pause */}
              <button className="text-white hover:text-white/80 transition">
                <Play className="w-5 h-5" fill="white" />
              </button>

              {/* Volume */}
              <div className="flex items-center gap-2">
                <button className="text-white hover:text-white/80 transition">
                  <Volume2 className="w-5 h-5" />
                </button>
                <Slider
                  defaultValue={[70]}
                  max={100}
                  step={1}
                  className="w-20"
                />
              </div>

              {/* Time Display */}
              <span className="text-sm text-white/90">02:15 / 05:12</span>
            </div>

            <div className="flex items-center gap-3">
              {/* Speed Control */}
              <button className="text-white hover:text-white/80 transition text-sm font-medium">
                1x
              </button>

              {/* Settings */}
              <button className="text-white hover:text-white/80 transition">
                <Settings className="w-5 h-5" />
              </button>

              {/* Fullscreen */}
              <button className="text-white hover:text-white/80 transition">
                <Maximize className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Resume Indicator */}
        <div className="absolute top-4 left-4 bg-blue-500 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-2">
          <span>Resume from 2:15</span>
        </div>
      </div>
    </div>
  );
};
