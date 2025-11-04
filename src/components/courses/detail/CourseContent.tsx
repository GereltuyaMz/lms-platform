"use client";

import { useState } from "react";
import { ChevronDown, Zap } from "lucide-react";
import { PlayIcon, NotebookIcon, DumbbellIcon, EyeIcon } from "@/icons";
import { formatDuration, formatTime, cn } from "@/lib/utils";
import type { Lesson } from "@/types/database";

const getLessonIcon = (lessonType: string) => {
  switch (lessonType) {
    case "video":
      return <PlayIcon width={20} height={20} fill="#3B82F6" />;
    case "text":
      return <NotebookIcon className="h-4 w-4 text-gray-600" />;
    case "quiz":
      return <DumbbellIcon width={20} height={20} fill="#10B981" />;
    case "assignment":
      return <DumbbellIcon width={20} height={20} fill="#10B981" />;
    default:
      return <PlayIcon width={20} height={20} fill="#3B82F6" />;
  }
};

type CourseContentProps = {
  lessonsBySection: Record<string, Lesson[]>;
};

export const CourseContent = ({ lessonsBySection }: CourseContentProps) => {
  const [openSections, setOpenSections] = useState<string[]>([
    Object.keys(lessonsBySection)[0],
  ]);

  const toggleSection = (sectionTitle: string) => {
    setOpenSections((prev) =>
      prev.includes(sectionTitle)
        ? prev.filter((s) => s !== sectionTitle)
        : [...prev, sectionTitle]
    );
  };

  const calculateSectionDuration = (lessons: Lesson[]) => {
    const totalMinutes = lessons.reduce(
      (sum, lesson) => sum + (lesson.duration_minutes || 0),
      0
    );
    return formatDuration(totalMinutes);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Course content</h2>

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
                  {lessons.length} lesson {calculateSectionDuration(lessons)}
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
                        {lesson.is_preview && (
                          <span className="text-xs text-blue-600 font-medium flex items-center gap-1">
                            <EyeIcon width={20} height={20} fill="#3B82F6" />
                            <a href="#" className="underline">
                              Preview
                            </a>
                          </span>
                        )}
                        {lesson.lesson_type === "quiz" ||
                        lesson.lesson_type === "assignment" ? (
                          <div className="flex items-center gap-1 text-yellow-600 text-xs">
                            <Zap className="h-5 w-5" />
                            <span>50 XP</span>
                          </div>
                        ) : null}
                        <span className="text-md text-muted-foreground min-w-[50px] text-right">
                          {lesson.duration_minutes
                            ? formatTime(lesson.duration_minutes * 60)
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
    </div>
  );
};
