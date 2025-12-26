"use client";

import { useState } from "react";
import { ChevronDown, Zap, BookCheck, Crown, Star, Square } from "lucide-react";
import { useRouter } from "next/navigation";
import { EyeIcon } from "@/icons";
import { formatDuration, formatTime, cn } from "@/lib/utils";
import { getLessonIcon, getLessonXP } from "@/lib/lesson-config";
import type { Lesson } from "@/types/database";
import type { UnitWithLessons } from "@/types/database";
import ReactPlayer from "react-player";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type CourseContentProps = {
  // Support both legacy sections and new units
  lessonsBySection?: Record<string, Lesson[]>;
  units?: UnitWithLessons[];
  courseSlug: string;
  completedLessonIds?: string[];
  completedUnitQuizIds?: string[];
  unitQuizMap?: Map<string, boolean>;
};

// Unified section type for rendering
type SectionData = {
  id: string;
  title: string;
  description?: string | null;
  lessons: Lesson[];
  hasUnitQuiz?: boolean;
  unit?: UnitWithLessons;
};

// Completion Icon Component
const CompletionIcon = ({
  isCompleted,
  onClick,
  type = "lesson",
}: {
  isCompleted: boolean;
  onClick: (e: React.MouseEvent) => void;
  type?: "lesson" | "unit-quiz";
}) => {
  const icon =
    type === "unit-quiz" ? (
      <Star
        className={cn(
          "w-5 h-5",
          isCompleted ? "fill-yellow-400 text-yellow-400" : "text-gray-400"
        )}
      />
    ) : isCompleted ? (
      <Crown className="w-5 h-5 fill-purple-500 text-purple-500" />
    ) : (
      <Square className="w-5 h-5 text-gray-400" />
    );

  return (
    <button
      onClick={onClick}
      className="hover:scale-110 transition-transform cursor-pointer"
      aria-label={isCompleted ? "Completed" : "Not completed"}
    >
      {icon}
    </button>
  );
};

export const CourseContent = ({
  lessonsBySection,
  units,
  courseSlug,
  completedLessonIds = [],
  completedUnitQuizIds = [],
  unitQuizMap = new Map(),
}: CourseContentProps) => {
  const router = useRouter();
  // Convert data to unified format
  const sections: SectionData[] = units?.length
    ? units.map((unit) => ({
        id: unit.id,
        title: unit.title,
        description: unit.description,
        lessons: unit.lessons,
        hasUnitQuiz: unitQuizMap.get(unit.id) ?? false,
        unit,
      }))
    : Object.entries(lessonsBySection || {}).map(([title, lessons], index) => ({
        id: `section-${index}`,
        title,
        lessons,
      }));

  const [openSections, setOpenSections] = useState<string[]>(
    sections.length > 0 ? [sections[0].id] : []
  );

  const [previewLesson, setPreviewLesson] = useState<Lesson | null>(null);

  const toggleSection = (sectionId: string) => {
    setOpenSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((s) => s !== sectionId)
        : [...prev, sectionId]
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
        {sections.map((section) => {
          const isOpen = openSections.includes(section.id);

          return (
            <div key={section.id} className="border rounded-lg overflow-hidden">
              {/* Section Header */}
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 flex items-center justify-between transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <ChevronDown
                    className={cn(
                      "h-5 w-5 transition-transform",
                      isOpen && "rotate-180"
                    )}
                  />
                  <span className="font-semibold">{section.title}</span>
                  {section.hasUnitQuiz && (
                    <BookCheck className="w-4 h-4 text-purple-500" />
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  {section.lessons.length} хичээл •{" "}
                  {calculateSectionDuration(section.lessons)}
                </div>
              </button>

              {/* Unit Description (if available) */}
              {isOpen && section.description && (
                <div className="px-4 py-2 bg-blue-50 border-t text-sm text-blue-700">
                  {section.description}
                </div>
              )}

              {/* Lessons List */}
              {isOpen && (
                <div className="bg-white">
                  {section.lessons.map((lesson) => {
                    const isCompleted =
                      completedLessonIds.includes(lesson.id) ?? false;
                    const lessonUrl = `/courses/${courseSlug}/learn/lesson/${lesson.id}/theory`;

                    return (
                      <div
                        key={lesson.id}
                        onClick={(e) => {
                          // Don't navigate if clicking preview button
                          if ((e.target as HTMLElement).closest('.preview-button')) {
                            return;
                          }
                          router.push(lessonUrl);
                        }}
                        className="px-4 py-3 flex items-center justify-between hover:bg-gray-50 border-t transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          {/* Completion icon */}
                          <CompletionIcon
                            isCompleted={isCompleted}
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(lessonUrl);
                            }}
                            type="lesson"
                          />

                          {/* Lesson title */}
                          <span className="text-sm">
                            {lesson.title}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          {/* Preview Button */}
                          {lesson.is_preview && lesson.video_url && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setPreviewLesson(lesson);
                              }}
                              className="preview-button text-xs text-blue-600 font-medium flex items-center gap-1 underline cursor-pointer"
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
                    );
                  })}

                  {/* Unit Quiz Row (if exists) */}
                  {section.hasUnitQuiz && section.unit && (
                    <div
                      onClick={() =>
                        router.push(
                          `/courses/${courseSlug}/learn/lesson/${section.unit!.id}/unit-quiz`
                        )
                      }
                      className="px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors border-t-2 border-gray-200 cursor-pointer"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <CompletionIcon
                          isCompleted={
                            completedUnitQuizIds.includes(section.unit!.id) ??
                            false
                          }
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(
                              `/courses/${courseSlug}/learn/lesson/${section.unit!.id}/unit-quiz`
                            );
                          }}
                          type="unit-quiz"
                        />

                        <span className="text-sm font-medium">
                          {section.unit!.title} - Бүлгийн тест
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <span>Тест</span>
                      </div>
                    </div>
                  )}
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
