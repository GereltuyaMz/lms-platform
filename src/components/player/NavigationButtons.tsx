"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type NavigationButtonsProps = {
  previousLessonUrl?: string;
  nextLessonUrl?: string;
};

export const NavigationButtons = ({
  previousLessonUrl,
  nextLessonUrl,
}: NavigationButtonsProps) => {
  return (
    <div className="flex items-center justify-between gap-4">
      {/* Previous Button */}
      {previousLessonUrl ? (
        <Button variant="outline" asChild className="flex items-center gap-2">
          <Link href={previousLessonUrl}>
            <ChevronLeft className="w-4 h-4" />
            Previous Lesson
          </Link>
        </Button>
      ) : (
        <Button
          variant="outline"
          disabled
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous Lesson
        </Button>
      )}

      {/* Next Button */}
      {nextLessonUrl ? (
        <Button asChild className="flex items-center gap-2">
          <Link href={nextLessonUrl}>
            Next Lesson
            <ChevronRight className="w-4 h-4" />
          </Link>
        </Button>
      ) : (
        <Button disabled className="flex items-center gap-2">
          Next Lesson
          <ChevronRight className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};
