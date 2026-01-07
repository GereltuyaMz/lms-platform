"use client";

import { Label } from "@/components/ui/label";
import { VideoUrlInputControlled } from "./VideoUrlInputControlled";
import { RichTextEditorControlled } from "./RichTextEditorControlled";

type ContentState = {
  videoUrl: string | null;
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

  return (
    <div className="space-y-6">
      <VideoUrlInputControlled
        value={value.videoUrl || ""}
        onChange={(url) => onChange({ ...value, videoUrl: url })}
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
