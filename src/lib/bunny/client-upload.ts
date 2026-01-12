import * as tus from "tus-js-client";

/**
 * TUS authentication data from edge function
 */
export type TusAuthData = {
  signature: string;
  expirationTime: number;
  libraryId: string;
  videoId: string;
  endpoint: string;
};

/**
 * Upload control handle for pause/resume/abort
 */
export type UploadControl = {
  abort: () => void;
};

/**
 * Upload video file directly to Bunny Stream using TUS protocol
 * This provides resumable uploads with real progress tracking
 */
export function uploadVideoWithTus(
  tusAuth: TusAuthData,
  file: File,
  onProgress?: (percent: number, bytesUploaded: number, bytesTotal: number) => void,
  onSuccess?: () => void,
  onError?: (error: Error) => void
): UploadControl {
  const upload = new tus.Upload(file, {
    endpoint: tusAuth.endpoint,
    retryDelays: [0, 1000, 3000, 5000, 10000], // Retry with increasing delays
    chunkSize: 5 * 1024 * 1024, // 5MB chunks for better resume granularity
    headers: {
      AuthorizationSignature: tusAuth.signature,
      AuthorizationExpire: tusAuth.expirationTime.toString(),
      VideoId: tusAuth.videoId,
      LibraryId: tusAuth.libraryId,
    },
    metadata: {
      filetype: file.type,
      title: file.name,
    },
    onProgress: (bytesUploaded, bytesTotal) => {
      const percent = (bytesUploaded / bytesTotal) * 100;
      onProgress?.(percent, bytesUploaded, bytesTotal);
    },
    onSuccess: () => {
      onSuccess?.();
    },
    onError: (error) => {
      console.error("TUS upload error:", error);
      onError?.(error);
    },
  });

  // Check for previous uploads to resume
  upload.findPreviousUploads().then((previousUploads) => {
    if (previousUploads.length > 0) {
      // Resume the most recent upload
      upload.resumeFromPreviousUpload(previousUploads[0]);
    }
    // Start the upload
    upload.start();
  });

  return {
    abort: () => upload.abort(),
  };
}
