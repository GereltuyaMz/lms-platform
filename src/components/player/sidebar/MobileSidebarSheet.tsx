"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SidebarContent } from "./SidebarContent";
import type { LessonStep } from "@/lib/lesson-step-utils";

type MobileSidebarSheetProps = {
  courseTitle: string;
  courseSlug: string;
  progress: {
    completed: number;
    total: number;
    percentage: number;
    streak?: number;
    totalXp: number;
    totalPlatformXp: number;
  };
  currentLessonId: string;
  currentStep: LessonStep;
  availableSteps: LessonStep[];
  isCompleted: boolean;
  isUnitQuiz: boolean;
  unitId?: string;
  unitQuizCompleted?: boolean;
  completedSteps?: Set<LessonStep>;
};

export const MobileSidebarSheet = ({
  courseTitle,
  courseSlug,
  progress,
  currentLessonId,
  currentStep,
  availableSteps,
  isCompleted,
  isUnitQuiz,
  unitId,
  unitQuizCompleted,
  completedSteps,
}: MobileSidebarSheetProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="md:hidden w-9 h-9 rounded-[10px] shadow-sm border-[#e5e5e5] hover:bg-gray-50 cursor-pointer"
        >
          <Menu className="w-4 h-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] p-0 overflow-y-auto">
        <SheetHeader className="sr-only">
          <SheetTitle>Course Navigation</SheetTitle>
        </SheetHeader>
        <div className="h-full pt-14 pb-6 px-4">
          <SidebarContent
            courseTitle={courseTitle}
            courseSlug={courseSlug}
            progress={progress}
            currentLessonId={currentLessonId}
            currentStep={currentStep}
            availableSteps={availableSteps}
            isCompleted={isCompleted}
            isUnitQuiz={isUnitQuiz}
            unitId={unitId}
            unitQuizCompleted={unitQuizCompleted}
            completedSteps={completedSteps}
            onNavigate={() => setOpen(false)}
            showBackButton={false}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};
