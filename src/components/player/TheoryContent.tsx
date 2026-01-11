import { ContentItemRenderer } from "./ContentItemRenderer";
import { LessonContentWrapper } from "./LessonContentWrapper";
import type { LessonContent, Lesson, LessonVideo } from "@/types/database/tables";
import type { LessonStep } from "@/lib/lesson-step-utils";
import type { LessonItem } from "@/lib/lesson-utils";

// Extended type for content with joined video data
type LessonContentWithVideo = LessonContent & {
  lesson_videos?: LessonVideo | null;
};

type TheoryContentProps = {
  lessonContent: LessonContentWithVideo[] | undefined;
  courseId: string;
  lessonId: string;
  // Wrapper props
  courseTitle: string;
  courseSlug: string;
  unitTitle?: string;
  lessonTitle: string;
  currentStep: LessonStep;
  availableSteps: LessonStep[];
  allLessons: Lesson[] | LessonItem[];
};

export const TheoryContent = ({
  lessonContent,
  courseId,
  lessonId,
  courseTitle,
  courseSlug,
  unitTitle,
  lessonTitle,
  currentStep,
  availableSteps,
  allLessons,
}: TheoryContentProps) => {
  const theoryContent = lessonContent?.filter(
    (c) => c.content_type === "theory"
  );

  const emptyState = (
    <div className="bg-white rounded-lg border p-6">
      <p className="text-center text-muted-foreground">
        Энэ хичээлд теорийн контент байхгүй байна.
      </p>
    </div>
  );

  return (
    <LessonContentWrapper
      courseTitle={courseTitle}
      courseSlug={courseSlug}
      courseId={courseId}
      unitTitle={unitTitle}
      lessonTitle={lessonTitle}
      lessonId={lessonId}
      currentStep={currentStep}
      availableSteps={availableSteps}
      allLessons={allLessons}
    >
      {!theoryContent || theoryContent.length === 0 ? (
        emptyState
      ) : (
        <div className="flex flex-col gap-4">
          {theoryContent.map((content) => (
            <ContentItemRenderer
              key={content.id}
              content={content}
              lessonId={lessonId}
              courseId={courseId}
              lessonVideo={content.lesson_videos}
            />
          ))}
        </div>
      )}
    </LessonContentWrapper>
  );
};
