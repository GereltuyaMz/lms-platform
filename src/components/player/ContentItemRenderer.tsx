"use client";

import { VideoPlayer } from "./VideoPlayer";
import { BunnyVideoPlayer } from "./BunnyVideoPlayer";
import { ContentCompleteButton } from "./ContentCompleteButton";
import type { LessonContent, LessonVideo } from "@/types/database/tables";

type ContentItemRendererProps = {
  content: LessonContent;
  lessonId: string;
  courseId: string;
  lessonVideo?: LessonVideo | null; // Bunny video data if available
  showCompleteButton?: boolean;
};

export const ContentItemRenderer = ({
  content,
  lessonId,
  courseId,
  lessonVideo,
  showCompleteButton = false,
}: ContentItemRendererProps) => {
  const hasBunnyVideo = !!lessonVideo && lessonVideo.status === "ready";
  const hasUrlVideo = !!content.video_url;
  const hasVideo = hasBunnyVideo || hasUrlVideo;
  const hasText = !!content.content;
  const hasDescription = !!content.description;

  if (!hasVideo && !hasText) return null;

  return (
    <div>
      {/* Bunny video (priority) */}
      {hasBunnyVideo && (
        <BunnyVideoPlayer
          bunnyVideoId={lessonVideo.bunny_video_id}
          bunnyLibraryId={lessonVideo.bunny_library_id}
          contentId={content.id}
          lessonId={lessonId}
          courseId={courseId}
          duration={lessonVideo.duration_seconds || undefined}
          contentType={content.content_type as "theory" | "example"}
        />
      )}

      {/* Fallback to URL video (YouTube/Vimeo) */}
      {!hasBunnyVideo && hasUrlVideo && (
        <VideoPlayer
          videoUrl={content.video_url!}
          lessonId={lessonId}
          courseId={courseId}
        />
      )}

      {/* Description below video */}
      {hasDescription && hasVideo && (
        <div className="bg-blue-50 rounded-lg border border-blue-100 p-4 mt-3">
          <p className="text-sm text-gray-700 leading-relaxed">
            {content.description}
          </p>
        </div>
      )}

      {/* Text content (for text-only content items) */}
      {hasText && !hasVideo && (
        <div className="bg-white rounded-lg border p-6">
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: content.content! }}
          />
        </div>
      )}

      {/* Additional text below video (if content field is also used) */}
      {hasText && hasVideo && (
        <div className="bg-gray-50 rounded-lg border p-4 mt-3">
          <div
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: content.content! }}
          />
        </div>
      )}

      {/* Complete Button */}
      {showCompleteButton && hasVideo && (
        <div className="mt-3 flex justify-start">
          <ContentCompleteButton
            contentId={content.id}
            lessonId={lessonId}
            courseId={courseId}
            contentTitle={content.title}
            contentType={content.content_type as "theory" | "example"}
          />
        </div>
      )}
    </div>
  );
};
