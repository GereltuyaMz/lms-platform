import { VideoPlayer } from "./VideoPlayer";
import { QuizPlayer } from "./quiz/QuizPlayer";
import type { Lesson } from "@/types/database/tables";
import type { QuizData } from "@/types/quiz";

type LessonRendererProps = {
  lesson: Lesson;
  courseId: string;
  quizData?: QuizData | null;
};

export const LessonRenderer = ({
  lesson,
  courseId,
  quizData,
}: LessonRendererProps) => {
  switch (lesson.lesson_type) {
    case "video":
      return (
        <VideoPlayer
          videoUrl={lesson.video_url || ""}
          lessonId={lesson.id}
          courseId={courseId}
        />
      );

    case "text":
      return (
        <div className="bg-white rounded-lg border p-6 mb-6">
          <div className="prose max-w-none">
            {lesson.content || lesson.description || ""}
          </div>
        </div>
      );

    case "quiz":
      return (
        <QuizPlayer
          title={lesson.title}
          quizData={quizData ?? null}
          lessonId={lesson.id}
          courseId={courseId}
        />
      );

    case "assignment":
      return (
        <div className="bg-white rounded-lg border p-6 mb-6">
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground mb-4">
              📄 Assignment Component
            </p>
            <p className="text-sm text-muted-foreground">
              Assignment functionality coming soon
            </p>
          </div>
        </div>
      );

    default:
      return null;
  }
};
