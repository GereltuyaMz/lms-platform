import { ContentItemRenderer } from "./ContentItemRenderer";
import type { LessonContent } from "@/types/database/tables";

type TheoryContentProps = {
  lessonContent: LessonContent[] | undefined;
  courseId: string;
  lessonId: string;
};

export const TheoryContent = ({
  lessonContent,
  courseId,
  lessonId,
}: TheoryContentProps) => {
  const theoryContent = lessonContent?.filter((c) => c.content_type === "theory");

  if (!theoryContent || theoryContent.length === 0) {
    return (
      <div className="bg-white rounded-lg border p-6 mb-6">
        <p className="text-center text-muted-foreground">
          Энэ хичээлд теорийн контент байхгүй байна.
        </p>
      </div>
    );
  }

  return (
    <div>
      {theoryContent.map((content) => (
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
