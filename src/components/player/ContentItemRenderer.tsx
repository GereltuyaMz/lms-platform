"use client";

import { VideoPlayer } from "./VideoPlayer";
import type { LessonContent } from "@/types/database/tables";

type ContentItemRendererProps = {
  content: LessonContent;
  lessonId: string;
  courseId: string;
};

export const ContentItemRenderer = ({
  content,
  lessonId,
  courseId,
}: ContentItemRendererProps) => {
  const hasVideo = !!content.video_url;
  const hasText = !!content.content;
  const hasDescription = !!content.description;

  if (!hasVideo && !hasText) return null;

  return (
    <div>
      {/* Video content */}
      {hasVideo && (
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
          <div className="prose max-w-none">{content.content}</div>
        </div>
      )}

      {/* Additional text below video (if content field is also used) */}
      {hasText && hasVideo && (
        <div className="bg-gray-50 rounded-lg border p-4 mt-3">
          <div className="prose prose-sm max-w-none">{content.content}</div>
        </div>
      )}
    </div>
  );
};
