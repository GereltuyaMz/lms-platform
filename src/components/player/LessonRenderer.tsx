import { ContentItemRenderer } from "./ContentItemRenderer";
import { QuizPlayer } from "./quiz/QuizPlayer";
import type { Lesson, LessonContent, LessonVideo } from "@/types/database/tables";
import type { QuizData } from "@/types/quiz";

// Extended type for content with joined video data
type LessonContentWithVideo = LessonContent & {
  lesson_videos?: LessonVideo | null;
};

type LessonRendererProps = {
  lesson: Lesson & { lesson_content?: LessonContentWithVideo[] };
  courseId: string;
  quizData?: QuizData | null;
};

export const LessonRenderer = ({
  lesson,
  courseId,
  quizData,
}: LessonRendererProps) => {
  const hasContentItems =
    lesson.lesson_content && lesson.lesson_content.length > 0;

  // New structure: render multiple content items
  if (hasContentItems) {
    return (
      <div>
        {lesson.lesson_content!.map((content) => (
          <ContentItemRenderer
            key={content.id}
            content={content}
            lessonId={lesson.id}
            courseId={courseId}
            lessonVideo={content.lesson_videos}
          />
        ))}

        {/* Render quiz after content if lesson has quiz data */}
        {quizData && (
          <QuizPlayer
            title={`${lesson.title} - Тест`}
            quizData={quizData}
            lessonId={lesson.id}
            courseId={courseId}
          />
        )}
      </div>
    );
  }

  // No lesson content - show empty state or quiz if available
  if (quizData) {
    return (
      <QuizPlayer
        title={lesson.title}
        quizData={quizData}
        lessonId={lesson.id}
        courseId={courseId}
      />
    );
  }

  // Empty lesson - no content blocks
  return (
    <div className="bg-white rounded-lg border p-6 mb-6">
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground mb-4">
          Агуулга байхгүй байна
        </p>
        <p className="text-sm text-muted-foreground">
          Энэ хичээлд агуулга оруулаагүй байна.
        </p>
      </div>
    </div>
  );
};
