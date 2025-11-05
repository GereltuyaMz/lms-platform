"use client";

import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type NavigationButtonsProps = {
  previousLessonUrl?: string;
  nextLessonUrl?: string;
  isCompleted: boolean;
};

export const NavigationButtons = ({
  previousLessonUrl,
  nextLessonUrl,
  isCompleted,
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

      <div className="flex items-center gap-3">
        {/* Mark as Complete Button */}
        {!isCompleted && (
          <Button className="flex items-center gap-2 bg-green-600 hover:bg-green-700">
            <CheckCircle className="w-4 h-4" />
            Mark as Complete
          </Button>
        )}

        {isCompleted && (
          <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
            <CheckCircle className="w-5 h-5" />
            Completed
          </div>
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
    </div>
  );
};
