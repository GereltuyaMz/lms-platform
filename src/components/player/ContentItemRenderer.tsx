"use client";

import { BookOpen, Lightbulb, Brain, FileText, Paperclip } from "lucide-react";
import { VideoPlayer } from "./VideoPlayer";
import type { LessonContent } from "@/types/database/tables";
import type { ContentType } from "@/types/database/enums";

type ContentItemRendererProps = {
  content: LessonContent;
  lessonId: string;
  courseId: string;
};

const getContentIcon = (type: ContentType) => {
  switch (type) {
    case "theory":
      return <BookOpen className="h-5 w-5 text-blue-600" />;
    case "easy_example":
      return <Lightbulb className="h-5 w-5 text-green-600" />;
    case "hard_example":
      return <Brain className="h-5 w-5 text-purple-600" />;
    case "text":
      return <FileText className="h-5 w-5 text-gray-600" />;
    case "attachment":
      return <Paperclip className="h-5 w-5 text-orange-600" />;
    default:
      return <FileText className="h-5 w-5 text-gray-600" />;
  }
};

const getContentLabel = (type: ContentType): string => {
  switch (type) {
    case "theory":
      return "Теори";
    case "easy_example":
      return "Хялбар жишээ";
    case "hard_example":
      return "Хүнд жишээ";
    case "text":
      return "Текст";
    case "attachment":
      return "Хавсралт";
    default:
      return "";
  }
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
    <div className="mb-6">
      {/* Content header with icon and title */}
      <div className="flex items-center gap-2 mb-3">
        {getContentIcon(content.content_type)}
        <h3 className="font-semibold text-lg">
          {content.title || getContentLabel(content.content_type)}
        </h3>
      </div>

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
