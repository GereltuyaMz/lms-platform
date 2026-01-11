"use client";

import { Video, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import type { VideoStatus } from "@/types/database/tables";

type Props = {
  status: VideoStatus | null;
  uploadProgress: number;
  isUploading: boolean;
  label: string;
};

const STATUS_LABELS: Record<VideoStatus, string> = {
  created: "Үүсгэж байна...",
  uploading: "Байршуулж байна...",
  processing: "Боловсруулж байна...",
  ready: "Бэлэн",
  failed: "Алдаа гарлаа",
};

export const VideoUploadingState = ({ status, uploadProgress, isUploading, label }: Props) => (
  <div className="space-y-2">
    <label className="text-sm font-medium flex items-center gap-2">
      <Video className="h-4 w-4 text-gray-500" />
      {label}
    </label>
    <div className="border rounded-lg p-6 bg-gray-50">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
        <p className="text-sm font-medium">
          {status ? STATUS_LABELS[status] : "Байршуулж байна..."}
        </p>
        {isUploading && (
          <div className="w-full max-w-xs">
            <Progress value={uploadProgress} className="h-2" />
            <p className="text-xs text-gray-500 text-center mt-1">
              {Math.round(uploadProgress)}%
            </p>
          </div>
        )}
        {status === "processing" && (
          <p className="text-xs text-gray-500">Энэ хэсэг хугацаа зарцуулж болно...</p>
        )}
      </div>
    </div>
  </div>
);
