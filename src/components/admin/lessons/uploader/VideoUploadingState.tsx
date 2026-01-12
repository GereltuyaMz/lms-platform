"use client";

import { Video, Loader2, Upload } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import type { VideoStatus } from "@/types/database/tables";

type Props = {
  status: VideoStatus | null;
  uploadProgress: number;
  isUploading: boolean;
  label: string;
  fileName?: string;
  fileSize?: number;
};

const STATUS_LABELS: Record<VideoStatus, string> = {
  created: "Үүсгэж байна...",
  uploading: "Байршуулж байна...",
  processing: "Боловсруулж байна...",
  ready: "Бэлэн",
  failed: "Алдаа гарлаа",
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

export const VideoUploadingState = ({ status, uploadProgress, isUploading, label, fileName, fileSize }: Props) => (
  <div className="space-y-2">
    <label className="text-sm font-medium flex items-center gap-2">
      <Video className="h-4 w-4 text-gray-500" />
      {label}
    </label>
    <div className="border rounded-lg p-6 bg-gray-50">
      <div className="flex flex-col items-center gap-3">
        {isUploading ? (
          <Upload className="h-8 w-8 text-blue-500 animate-pulse" />
        ) : (
          <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
        )}
        <p className="text-sm font-medium">
          {status ? STATUS_LABELS[status] : "Байршуулж байна..."}
        </p>
        {fileName && (
          <p className="text-xs text-gray-600 truncate max-w-full px-4">
            {fileName}
          </p>
        )}
        {isUploading && (
          <div className="w-full max-w-xs space-y-1">
            <Progress value={uploadProgress} className="h-2" />
            <div className="flex justify-between text-xs text-gray-500">
              <span>{Math.round(uploadProgress)}%</span>
              {fileSize && (
                <span>
                  {formatFileSize(Math.round((uploadProgress / 100) * fileSize))} / {formatFileSize(fileSize)}
                </span>
              )}
            </div>
          </div>
        )}
        {status === "processing" && (
          <p className="text-xs text-gray-500">Энэ хэсэг хугацаа зарцуулж болно...</p>
        )}
      </div>
    </div>
  </div>
);
