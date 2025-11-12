import type { Lesson } from "@/types/database/tables";
import type { QuizData } from "@/types/quiz";
import { formatTime } from "./utils";
import type { SupabaseClient } from "@supabase/supabase-js";

// Transform lessons for sidebar display
export const transformLessonsForSidebar = (
  allLessons: Lesson[],
  currentLessonId: string,
  completedLessonIds: string[] = []
) => {
  // Group lessons by section
  const lessonsBySection = allLessons.reduce(
    (acc, lesson) => {
      const sectionTitle = lesson.section_title || "Uncategorized";
      if (!acc[sectionTitle]) {
        acc[sectionTitle] = [];
      }
      acc[sectionTitle].push(lesson);
      return acc;
    },
    {} as Record<string, Lesson[]>
  );

  // Transform for sidebar
  return Object.entries(lessonsBySection).map(([section, lessons]) => ({
    section,
    items: lessons.map((lesson) => ({
      id: lesson.id,
      title: lesson.title,
      duration:
        lesson.lesson_type === "video" && lesson.duration_seconds
          ? formatTime(lesson.duration_seconds)
          : lesson.lesson_type === "quiz"
            ? "Quiz"
            : "Assignment",
      type: lesson.lesson_type,
      completed: completedLessonIds.includes(lesson.id),
      current: lesson.id === currentLessonId,
      locked: false, // TODO: implement lock logic based on enrollment
    })),
  }));
};

// Calculate progress for a course
export const calculateCourseProgress = (
  totalLessons: number,
  completedLessons: number = 0
) => {
  const progressPercentage =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return {
    completed: completedLessons,
    total: totalLessons,
    percentage: progressPercentage,
    totalXp: 0, // Static for now, will be calculated from xp_transactions
  };
};

// Get navigation URLs for previous/next lessons
export const getNavigationUrls = (
  allLessons: Lesson[],
  currentLessonId: string,
  courseSlug: string
) => {
  const currentIndex = allLessons.findIndex((l) => l.id === currentLessonId);
  const previousLesson =
    currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  return {
    previousLessonUrl: previousLesson
      ? `/courses/${courseSlug}/learn/${previousLesson.id}`
      : undefined,
    nextLessonUrl: nextLesson
      ? `/courses/${courseSlug}/learn/${nextLesson.id}`
      : undefined,
  };
};

// Fetch and transform quiz data
export const fetchQuizData = async (
  supabase: SupabaseClient,
  lessonId: string
): Promise<QuizData | null> => {
  type QuizOptionFromDB = {
    id: string;
    option_text: string;
    is_correct: boolean;
    order_index: number;
  };

  type QuizQuestionFromDB = {
    id: string;
    question: string;
    explanation: string;
    order_index: number;
    points: number;
    quiz_options: QuizOptionFromDB[];
  };

  const { data: quizQuestions } = await supabase
    .from("quiz_questions")
    .select(
      `
      id,
      question,
      explanation,
      order_index,
      points,
      quiz_options (
        id,
        option_text,
        is_correct,
        order_index
      )
    `
    )
    .eq("lesson_id", lessonId)
    .order("order_index", { ascending: true });

  if (!quizQuestions || quizQuestions.length === 0) {
    return null;
  }

  return {
    totalQuestions: quizQuestions.length,
    questions: (quizQuestions as QuizQuestionFromDB[]).map((q) => {
      const sortedOptions = [...(q.quiz_options || [])].sort(
        (a, b) => a.order_index - b.order_index
      );

      return {
        id: q.id,
        question: q.question,
        options: sortedOptions.map((opt) => opt.option_text),
        correctAnswer: sortedOptions.findIndex((opt) => opt.is_correct),
        explanation: q.explanation,
        points: q.points,
      };
    }),
  };
};
