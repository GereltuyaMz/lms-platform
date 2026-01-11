"use client";

import { Label } from "@/components/ui/label";
import { VideoInput } from "./VideoInput";
import { RichTextEditorControlled } from "./RichTextEditorControlled";
import type { LessonVideo } from "@/types/database/tables";

type ContentState = {
  videoUrl: string | null;
  lessonVideoId: string | null;
  content: string;
};

type LessonContentTabProps = {
  type: "theory" | "example";
  value: ContentState;
  onChange: (value: ContentState) => void;
};

const labels = {
  theory: {
    video: "Онолын видео",
    content: "📝 Онолын агуулга",
    placeholder: "Онолын тайлбар бичих...",
  },
  example: {
    video: "Жишээний видео",
    content: "📝 Жишээний агуулга",
    placeholder: "Жишээний тайлбар бичих...",
  },
};

export const LessonContentTab = ({
  type,
  value,
  onChange,
}: LessonContentTabProps) => {
  const label = labels[type];

  const handleLessonVideoChange = (videoId: string | null, _video: LessonVideo | null) => {
    // Atomic update: when setting videoId, also clear videoUrl to prevent stale closure race condition
    onChange({
      ...value,
      lessonVideoId: videoId,
      videoUrl: videoId ? null : value.videoUrl,
    });
  };

  return (
    <div className="space-y-6">
      <VideoInput
        videoUrl={value.videoUrl}
        lessonVideoId={value.lessonVideoId}
        onVideoUrlChange={(url) => onChange({
          ...value,
          videoUrl: url,
          lessonVideoId: url ? null : value.lessonVideoId,
        })}
        onLessonVideoChange={handleLessonVideoChange}
        label={label.video}
      />

      <div className="space-y-2">
        <Label>{label.content}</Label>
        <RichTextEditorControlled
          value={value.content}
          onChange={(html) => onChange({ ...value, content: html })}
          placeholder={label.placeholder}
        />
        <p className="text-xs text-gray-500">
          Видео эсвэл текст дангаар нь, эсвэл хамтад нь ашиглаж болно
        </p>
      </div>
    </div>
  );
};
