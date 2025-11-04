"use client";

import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

type NavigationButtonsProps = {
  hasPrevious: boolean;
  hasNext: boolean;
  isCompleted: boolean;
};

export const NavigationButtons = ({
  hasPrevious,
  hasNext,
  isCompleted,
}: NavigationButtonsProps) => {
  return (
    <div className="flex items-center justify-between gap-4">
      {/* Previous Button */}
      <Button
        variant="outline"
        disabled={!hasPrevious}
        className="flex items-center gap-2"
      >
        <ChevronLeft className="w-4 h-4" />
        Previous Lesson
      </Button>

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
        <Button
          disabled={!hasNext}
          className="flex items-center gap-2"
        >
          Next Lesson
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
