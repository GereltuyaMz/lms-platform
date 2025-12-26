"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type LessonBreadcrumbProps = {
  courseTitle: string;
  courseSlug: string;
  unitOrSectionTitle?: string;
  lessonTitle: string;
  compact?: boolean;
};

export const LessonBreadcrumb = ({
  courseTitle,
  courseSlug,
  unitOrSectionTitle,
  lessonTitle,
  compact = false,
}: LessonBreadcrumbProps) => {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center flex-wrap gap-1 text-xs">
      {/* Level 1: Course Title */}
      <Link
        href={`/courses/${courseSlug}`}
        className={cn(
          "text-muted-foreground hover:text-foreground transition-colors truncate",
          compact && "max-w-[100px]"
        )}
        title={courseTitle}
      >
        {courseTitle}
      </Link>

      {/* Level 2: Unit/Section (Optional) */}
      {unitOrSectionTitle && (
        <>
          <ChevronRight className="w-3 h-3 text-muted-foreground shrink-0" />
          <span
            className={cn(
              "text-muted-foreground truncate",
              compact && "max-w-[80px]"
            )}
            title={unitOrSectionTitle}
          >
            {unitOrSectionTitle}
          </span>
        </>
      )}

      <ChevronRight className="w-3 h-3 text-muted-foreground shrink-0" />

      {/* Level 3: Lesson Title (Current, non-clickable) */}
      <span
        className={cn(
          "font-semibold text-foreground truncate",
          compact && "max-w-[120px]"
        )}
        title={lessonTitle}
      >
        {lessonTitle}
      </span>
    </nav>
  );
};
