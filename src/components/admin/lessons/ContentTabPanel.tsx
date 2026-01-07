"use client";

import { useState, useEffect } from "react";
import { VideoUrlInput } from "./VideoUrlInput";
import { RichTextEditor } from "./RichTextEditor";
import { Label } from "@/components/ui/label";
import { upsertLessonContent } from "@/lib/actions/admin/lesson-content";
import { toast } from "sonner";
import type { LessonContent } from "@/types/database/tables";

type ContentTabPanelProps = {
  lessonId: string;
  contentType: "theory" | "example";
  initialContent?: LessonContent | null;
};

export const ContentTabPanel = ({
  lessonId,
  contentType,
  initialContent,
}: ContentTabPanelProps) => {
  const [videoUrl, setVideoUrl] = useState(initialContent?.video_url || null);
  const [content, setContent] = useState(initialContent?.content || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveVideoUrl = async (url: string | null) => {
    setVideoUrl(url);
    setIsSaving(true);

    try {
      const result = await upsertLessonContent(lessonId, contentType, {
        title: contentType === "theory" ? "Онол" : "Жишээ",
        video_url: url,
        content: content || null,
        duration_seconds: null,
      });

      if (result.success) {
        toast.success("Видео холбоос хадгалагдлаа");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Алдаа гарлаа");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveContent = async (html: string) => {
    setContent(html);
    setIsSaving(true);

    try {
      const result = await upsertLessonContent(lessonId, contentType, {
        title: contentType === "theory" ? "Онол" : "Жишээ",
        video_url: videoUrl,
        content: html || null,
        duration_seconds: null,
      });

      if (result.success) {
        toast.success("Агуулга хадгалагдлаа");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Алдаа гарлаа");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Video URL Input */}
      <VideoUrlInput
        initialUrl={initialContent?.video_url || null}
        onSave={handleSaveVideoUrl}
        label={`🎥 Видео холбоос (${contentType === "theory" ? "онол" : "жишээ"})`}
      />

      {/* Rich Text Editor */}
      <div className="space-y-2">
        <Label>📝 Агуулга (нэмэх боломжтой)</Label>
        <RichTextEditor
          initialContent={initialContent?.content || ""}
          onSave={handleSaveContent}
          placeholder={
            contentType === "theory"
              ? "Онолын тайлбар бичих..."
              : "Жишээний тайлбар бичих..."
          }
        />
        <p className="text-xs text-gray-500">
          Видео эсвэл текст дангаар нь, эсвэл хамтад нь ашиглаж болно
        </p>
      </div>

      {/* Auto-save indicator */}
      {isSaving && (
        <p className="text-xs text-gray-500 italic">Хадгалж байна...</p>
      )}
    </div>
  );
};
