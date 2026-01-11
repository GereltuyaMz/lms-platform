"use client";

import { Video, Check, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { LessonVideo } from "@/types/database/tables";

type Props = {
  video: LessonVideo;
  label: string;
  isDeleting: boolean;
  onDelete: () => void;
};

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const formatFileSize = (bytes: number) => {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const VideoReadyState = ({ video, label, isDeleting, onDelete }: Props) => (
  <div className="space-y-2">
    <label className="text-sm font-medium flex items-center gap-2">
      <Video className="h-4 w-4 text-gray-500" />
      {label}
    </label>
    <div className="border rounded-lg p-4 bg-gray-50">
      <div className="flex gap-4">
        {video.thumbnail_url && (
          <img
            src={video.thumbnail_url}
            alt="Thumbnail"
            className="w-32 h-20 object-cover rounded"
          />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-green-600 mb-1">
            <Check className="h-4 w-4" />
            <span className="text-sm font-medium">Бэлэн</span>
          </div>
          <p className="text-sm text-gray-700 truncate">{video.title}</p>
          <div className="flex gap-3 text-xs text-gray-500 mt-1">
            {video.duration_seconds && (
              <span>⏱ {formatDuration(video.duration_seconds)}</span>
            )}
            {video.file_size_bytes && (
              <span>📦 {formatFileSize(video.file_size_bytes)}</span>
            )}
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          disabled={isDeleting}
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
        >
          {isDeleting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  </div>
);
