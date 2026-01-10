import { ContentItemRenderer } from "./ContentItemRenderer";
import { LessonContentWrapper } from "./LessonContentWrapper";
import type { LessonContent, Lesson } from "@/types/database/tables";
import type { LessonStep } from "@/lib/lesson-step-utils";
import type { LessonItem } from "@/lib/lesson-utils";

type ExampleContentProps = {
  lessonContent: LessonContent[] | undefined;
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

export const ExampleContent = ({
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
}: ExampleContentProps) => {
  const exampleContent = lessonContent?.filter((c) => c.content_type === "example");

  const emptyState = (
    <div className="bg-white rounded-lg border p-6">
      <p className="text-center text-muted-foreground">
        Энэ хичээлд жишээний контент байхгүй байна.
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
      {!exampleContent || exampleContent.length === 0 ? (
        emptyState
      ) : (
        <div className="flex flex-col gap-4">
          {exampleContent.map((content) => (
            <ContentItemRenderer
              key={content.id}
              content={content}
              lessonId={lessonId}
              courseId={courseId}
            />
          ))}
        </div>
      )}
    </LessonContentWrapper>
  );
};
