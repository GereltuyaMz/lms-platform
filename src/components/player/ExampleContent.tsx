import { ContentItemRenderer } from "./ContentItemRenderer";
import type { LessonContent } from "@/types/database/tables";

type ExampleContentProps = {
  lessonContent: LessonContent[] | undefined;
  courseId: string;
  lessonId: string;
};

export const ExampleContent = ({
  lessonContent,
  courseId,
  lessonId,
}: ExampleContentProps) => {
  const exampleContent = lessonContent?.filter((c) => c.content_type === "example");

  if (!exampleContent || exampleContent.length === 0) {
    return (
      <div className="bg-white rounded-lg border p-6 mb-6">
        <p className="text-center text-muted-foreground">
          Энэ хичээлд жишээний контент байхгүй байна.
        </p>
      </div>
    );
  }

  return (
    <div>
      {exampleContent.map((content) => (
        <ContentItemRenderer
          key={content.id}
          content={content}
          lessonId={lessonId}
          courseId={courseId}
        />
      ))}
    </div>
  );
};
