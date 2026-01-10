"use client";

import { useLessonPlayer } from "@/hooks/useLessonPlayer";
import { AIChatWidget } from "@/components/ai-teacher";

export const AIChatWidgetWrapper = () => {
  const { currentLessonId, currentStep, currentLessonInfo } = useLessonPlayer();

  // Don't render if no lesson is active
  if (!currentLessonId || !currentLessonInfo) {
    return null;
  }

  return (
    <AIChatWidget
      lessonId={currentLessonId}
      lessonStep={currentStep}
      lessonTitle={currentLessonInfo.title}
      lessonContent={currentLessonInfo.content}
    />
  );
};
