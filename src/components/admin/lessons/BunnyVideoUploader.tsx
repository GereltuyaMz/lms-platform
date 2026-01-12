"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { uploadVideoWithTus, type UploadControl } from "@/lib/bunny/client-upload";
import {
  createBunnyVideo,
  getVideoStatus,
  deleteBunnyVideo,
  getVideoById,
} from "@/lib/actions/admin/lesson-videos";
import type { LessonVideo, VideoStatus } from "@/types/database/tables";
import { Label } from "@/components/ui/label";
import { VideoReadyState } from "./uploader/VideoReadyState";
import { VideoUploadingState } from "./uploader/VideoUploadingState";
import { VideoErrorState } from "./uploader/VideoErrorState";
import { VideoDropzone } from "./uploader/VideoDropzone";

type BunnyVideoUploaderProps = {
  lessonVideoId: string | null;
  onVideoReady: (video: LessonVideo) => void;
  onVideoRemoved: () => void;
  label?: string;
};

export const BunnyVideoUploader = ({
  lessonVideoId,
  onVideoReady,
  onVideoRemoved,
  label = "Видео байршуулах",
}: BunnyVideoUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [status, setStatus] = useState<VideoStatus | null>(null);
  const [video, setVideo] = useState<LessonVideo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingFile, setUploadingFile] = useState<{ name: string; size: number } | null>(null);

  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentBunnyVideoIdRef = useRef<string | null>(null);
  const currentDbIdRef = useRef<string | null>(null);
  const uploadControlRef = useRef<UploadControl | null>(null);

  useEffect(() => {
    // Only load if we have a lessonVideoId AND it's different from what we already have
    if (lessonVideoId && lessonVideoId !== currentDbIdRef.current) {
      loadExistingVideo(lessonVideoId);
    }
    // If lessonVideoId is cleared, reset state
    if (!lessonVideoId && currentDbIdRef.current) {
      setVideo(null);
      setStatus(null);
      currentDbIdRef.current = null;
      currentBunnyVideoIdRef.current = null;
    }
    return () => {
      // Clear interval on unmount
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
      // Abort any in-progress upload
      if (uploadControlRef.current) {
        uploadControlRef.current.abort();
        uploadControlRef.current = null;
      }
      // Reset refs on unmount so that remount triggers reload
      // (refs persist across unmount but state resets, causing mismatch)
      currentDbIdRef.current = null;
      currentBunnyVideoIdRef.current = null;
    };
  }, [lessonVideoId]);

  const loadExistingVideo = async (id: string) => {
    setIsLoading(true);
    const result = await getVideoById(id);
    if (result.success && result.video) {
      setVideo(result.video);
      setStatus(result.video.status);
      currentDbIdRef.current = result.video.id;
      currentBunnyVideoIdRef.current = result.video.bunny_video_id;
      if (result.video.status === "processing" || result.video.status === "uploading") {
        startPolling(result.video.bunny_video_id);
      }
    }
    setIsLoading(false);
  };

  const startPolling = (bunnyVideoId: string) => {
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);

    pollIntervalRef.current = setInterval(async () => {
      const result = await getVideoStatus(bunnyVideoId);
      if (result.success && result.video) {
        setVideo(result.video);
        setStatus(result.video.status);
        // Store the database ID to prevent re-fetching when parent updates lessonVideoId
        currentDbIdRef.current = result.video.id;
        currentBunnyVideoIdRef.current = result.video.bunny_video_id;
        if (result.video.status === "ready") {
          clearInterval(pollIntervalRef.current!);
          pollIntervalRef.current = null;
          onVideoReady(result.video);
        } else if (result.video.status === "failed") {
          clearInterval(pollIntervalRef.current!);
          pollIntervalRef.current = null;
          setError(result.video.error_message || "Видео боловсруулалт амжилтгүй");
        }
      }
    }, 3000);
  };

  const handleFileSelect = useCallback(async (file: File) => {
    if (!file.type.startsWith("video/")) {
      setError("Зөвхөн видео файл сонгоно уу");
      return;
    }
    if (file.size > 2 * 1024 * 1024 * 1024) {
      setError("Файлын хэмжээ 2GB-ээс бага байх ёстой");
      return;
    }

    setError(null);
    setIsUploading(true);
    setUploadProgress(0);
    setStatus("created");
    setUploadingFile({ name: file.name, size: file.size });

    try {
      const createResult = await createBunnyVideo(file.name, file.name);
      if (!createResult.success || !createResult.bunnyVideoId || !createResult.tusAuth) {
        throw new Error(createResult.error || "Видео үүсгэж чадсангүй");
      }

      currentBunnyVideoIdRef.current = createResult.bunnyVideoId;
      setStatus("uploading");
      setUploadProgress(5);

      // Use TUS for direct upload to Bunny
      uploadControlRef.current = uploadVideoWithTus(
        createResult.tusAuth,
        file,
        (percent) => {
          // Map 0-100% to 5-95% for visual feedback
          setUploadProgress(5 + percent * 0.9);
        },
        () => {
          // Success callback
          setUploadProgress(100);
          setStatus("processing");
          setIsUploading(false);
          uploadControlRef.current = null;
          startPolling(createResult.bunnyVideoId!);
        },
        (err) => {
          // Error callback
          setError(err.message || "Видео байршуулж чадсангүй");
          setIsUploading(false);
          setStatus(null);
          uploadControlRef.current = null;
        }
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Алдаа гарлаа");
      setIsUploading(false);
      setStatus(null);
    }
  }, []);

  const handleDelete = async () => {
    if (!currentBunnyVideoIdRef.current) return;
    setIsDeleting(true);
    const result = await deleteBunnyVideo(currentBunnyVideoIdRef.current);
    if (result.success) {
      setVideo(null);
      setStatus(null);
      currentDbIdRef.current = null;
      currentBunnyVideoIdRef.current = null;
      onVideoRemoved();
    } else {
      setError(result.error || "Устгаж чадсангүй");
    }
    setIsDeleting(false);
  };

  if (video && status === "ready") {
    return (
      <VideoReadyState
        video={video}
        label={label}
        isDeleting={isDeleting}
        onDelete={handleDelete}
      />
    );
  }

  if (isUploading || status === "processing") {
    return (
      <VideoUploadingState
        status={status}
        uploadProgress={uploadProgress}
        isUploading={isUploading}
        label={label}
        fileName={uploadingFile?.name}
        fileSize={uploadingFile?.size}
      />
    );
  }

  if (error) {
    return (
      <VideoErrorState
        error={error}
        label={label}
        onRetry={() => {
          setError(null);
          setStatus(null);
        }}
      />
    );
  }

  // Show loading state when we have lessonVideoId but haven't loaded yet
  if (lessonVideoId && !video && !isUploading) {
    return (
      <div className="space-y-2">
        <Label>{label}</Label>
        <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
          <p className="text-sm text-gray-400 mt-2">Видео ачааллаж байна...</p>
        </div>
      </div>
    );
  }

  return <VideoDropzone label={label} onFileSelect={handleFileSelect} />;
};
