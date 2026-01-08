"use client";

import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
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
      className="block min-w-[160px] w-[160px] sm:min-w-[240px] sm:w-[240px] md:min-w-[260px] md:w-[260px] lg:min-w-[280px] lg:w-[292px] shrink-0 group"
    >
      <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-3.5 md:p-4 hover:shadow-md transition-all duration-200 h-full flex flex-col">
        {/* Title - truncated by default, expands on hover */}
        {lesson.title && (
          <div className="bg-[#faf9f7] rounded p-2 sm:p-2.5 md:p-3 flex gap-1.5 sm:gap-2 items-start">
            {isCompleted && (
              <Checkbox
                checked
                className="w-3 h-3 sm:w-4 sm:h-4 border-[#415ff4] data-[state=checked]:bg-[#415ff4] data-[state=checked]:border-[#415ff4] pointer-events-none"
              />
            )}
            <p className="text-[11px] sm:text-xs text-gray-700 truncate group-hover:whitespace-normal group-hover:break-words flex-1 transition-all duration-200">
              {lesson.title}
            </p>
          </div>
        )}
      </div>
    </Link>
  );
};
