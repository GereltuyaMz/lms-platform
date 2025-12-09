"use client";

import { useState } from "react";
import { ChevronDown, Zap } from "lucide-react";
import { EyeIcon } from "@/icons";
import { formatDuration, formatTime, cn } from "@/lib/utils";
import { getLessonIcon, getLessonXP } from "@/lib/lesson-config";
import type { Lesson } from "@/types/database";
import ReactPlayer from "react-player";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type CourseContentProps = {
  lessonsBySection: Record<string, Lesson[]>;
};

export const CourseContent = ({ lessonsBySection }: CourseContentProps) => {
  const [openSections, setOpenSections] = useState<string[]>([
    Object.keys(lessonsBySection)[0],
  ]);

  const [previewLesson, setPreviewLesson] = useState<Lesson | null>(null);

  const toggleSection = (sectionTitle: string) => {
    setOpenSections((prev) =>
      prev.includes(sectionTitle)
        ? prev.filter((s) => s !== sectionTitle)
        : [...prev, sectionTitle]
    );
  };

  const calculateSectionDuration = (lessons: Lesson[]) => {
    const totalSeconds = lessons.reduce(
      (sum, lesson) => sum + (lesson.duration_seconds || 0),
      0
    );
    return formatDuration(Math.floor(totalSeconds / 60));
  };

  return (
    <>
      <h2 className="text-2xl font-bold mb-6">Хичээлийн агуулга</h2>

      <div className="space-y-2">
        {Object.entries(lessonsBySection).map(([sectionTitle, lessons]) => {
          const isOpen = openSections.includes(sectionTitle);

          return (
            <div
              key={sectionTitle}
              className="border rounded-lg overflow-hidden"
            >
              {/* Section Header */}
              <button
                onClick={() => toggleSection(sectionTitle)}
                className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2">
                  <ChevronDown
                    className={cn(
                      "h-5 w-5 transition-transform",
                      isOpen && "rotate-180"
                    )}
                  />
                  <span className="font-semibold">{sectionTitle}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {lessons.length} хичээл • {calculateSectionDuration(lessons)}
                </div>
              </button>

              {/* Lessons List */}
              {isOpen && (
                <div className="bg-white">
                  {lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className="px-4 py-3 flex items-center justify-between hover:bg-gray-50 border-t"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        {getLessonIcon(lesson.lesson_type)}
                        <span className="text-sm">{lesson.title}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Preview Button */}
                        {lesson.is_preview && lesson.video_url && (
                          <button
                            onClick={() => setPreviewLesson(lesson)}
                            className="text-xs text-blue-600 font-medium flex items-center gap-1 underline cursor-pointer"
                          >
                            <EyeIcon width={20} height={20} fill="#3B82F6" />
                            Урьдчилан үзэх
                          </button>
                        )}

                        {/* XP */}
                        {getLessonXP(lesson) && (
                          <div className="flex items-center gap-1 text-yellow-600 text-xs">
                            <Zap className="h-5 w-5" />
                            <span>{getLessonXP(lesson)}</span>
                          </div>
                        )}

                        {/* Duration */}
                        <span className="text-md text-muted-foreground min-w-[50px] text-right">
                          {lesson.duration_seconds
                            ? formatTime(lesson.duration_seconds)
                            : "—"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ================================
          VIDEO PREVIEW MODAL (ReactPlayer)
      ================================= */}
      <Dialog
        open={!!previewLesson}
        onOpenChange={() => setPreviewLesson(null)}
      >
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          <DialogHeader className="p-4">
            <DialogTitle className="text-lg font-semibold">
              {previewLesson?.title}
            </DialogTitle>
          </DialogHeader>

          {previewLesson?.video_url ? (
            <div className="relative w-full h-[500px] bg-black">
              <ReactPlayer
                src={previewLesson.video_url}
                playing
                controls
                width="100%"
                height="100%"
              />
            </div>
          ) : (
            <div className="p-6 text-center text-sm text-muted-foreground">
              Энэ хичээлд видео байхгүй.
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
