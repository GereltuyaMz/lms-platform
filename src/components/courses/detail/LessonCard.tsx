"use client";

import Link from "next/link";
import { Crown } from "lucide-react";
import type { Lesson } from "@/types/database";

type LessonCardProps = {
  lesson: Lesson;
  courseSlug: string;
  isCompleted: boolean;
};

export const LessonCard = ({
  lesson,
  courseSlug,
  isCompleted,
}: LessonCardProps) => {
  const lessonUrl = `/courses/${courseSlug}/learn/lesson/${lesson.id}/theory`;

  return (
    <Link
      href={lessonUrl}
      className="block w-full min-w-[280px] md:w-[292px] group"
    >
      <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all duration-200 h-full flex flex-col">
        {/* Header */}

        {/* Description Box */}
        {lesson.title ? (
          <div className="bg-[#faf9f7] rounded p-3  flex gap-2 items-center">
            <div className="flex items-center h-full justify-between gap-2  ">
              {isCompleted && (
                <Crown className="w-4 h-4 text-purple-500 fill-purple-500 flex-shrink-0 " />
              )}
            </div>
            <p className="text-xs text-gray-700 line-clamp-3">{lesson.title}</p>
          </div>
        ) : (
          <div className="flex-1 mb-3" />
        )}

        {/* Preview functionality removed - lesson.is_preview and lesson.video_url no longer exist */}
      </div>
    </Link>
  );
};
