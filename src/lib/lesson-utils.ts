import type { Lesson, LessonContent, Unit } from "@/types/database/tables";
import type { UnitWithLessons } from "@/types/database";
import type { QuizData } from "@/types/quiz";
import type { LessonType } from "@/types/database/enums";
import { formatTime } from "./utils";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getCourseXPEarned } from "./actions/xp-actions";
import { getUserStreak } from "./actions/streak-actions";
import { createClient } from "./supabase/server";
import type { LessonStep } from "./lesson-step-utils";

// =====================================================
// TYPES FOR SIDEBAR
// =====================================================

export type LessonItem = {
  id: string;
  title: string;
  duration: string;
  type: LessonType;
  completed: boolean;
  current: boolean;
  locked: boolean;
  isUnitQuiz?: boolean;
  unitId?: string;
};

export type LessonSection = {
  section: string;
  items: LessonItem[];
};

export type UnitSection = {
  unit: Unit;
  items: LessonItem[];
  hasUnitQuiz: boolean;
};

// =====================================================
// DURATION HELPERS
// =====================================================

/**
 * Calculate total duration from lesson_content items
 */
export const calculateLessonDuration = (
  lessonContent: LessonContent[] | undefined
): number => {
  if (!lessonContent || lessonContent.length === 0) return 0;
  return lessonContent.reduce(
    (total, item) => total + (item.duration_seconds || 0),
    0
  );
};

/**
 * Get formatted duration string for a lesson
 * Uses lesson_content to calculate duration
 */
export const getLessonDurationDisplay = (
  lesson: Lesson & { lesson_content?: LessonContent[] }
): string => {
  // Calculate duration from lesson_content items
  if (lesson.lesson_content && lesson.lesson_content.length > 0) {
    const totalSeconds = calculateLessonDuration(lesson.lesson_content);
    return totalSeconds > 0 ? formatTime(totalSeconds) : "";
  }

  return "";
};

// DEPRECATED: Legacy section-based sidebar - use transformUnitsForSidebar instead
// This function is kept for backwards compatibility but should not be used
export const transformLessonsForSidebar = (
  allLessons: Lesson[],
  currentLessonId: string,
  completedLessonIds: string[] = []
) => {
  // All courses now use units - this function should not be called
  console.warn("transformLessonsForSidebar is deprecated. Use transformUnitsForSidebar instead.");
  return [];
};

// =====================================================
// UNIT-BASED SIDEBAR TRANSFORMATION (NEW)
// =====================================================

/**
 * Transform units with lessons for sidebar display
 * Uses the new unit-based structure instead of section_title grouping
 * @param unitQuizMap - Optional map of unitId -> hasQuiz from fetchUnitsWithQuiz
 * @param currentUnitQuizId - Current unit quiz ID if viewing a unit quiz
 * @param completedUnitQuizIds - Array of completed unit quiz IDs
 */
export const transformUnitsForSidebar = (
  units: UnitWithLessons[],
  currentLessonId: string,
  completedLessonIds: string[] = [],
  unitQuizMap: Map<string, boolean> = new Map(),
  currentUnitQuizId?: string,
  completedUnitQuizIds: string[] = []
): UnitSection[] => {
  return units.map((unit) => {
    const hasUnitQuiz = unitQuizMap.get(unit.id) ?? false;

    const lessonItems: LessonItem[] = unit.lessons.map((lesson) => ({
      id: lesson.id,
      title: lesson.title,
      duration: getLessonDurationDisplay(lesson),
      type: "video" as LessonType, // Default type - actual type determined by lesson_content
      completed: completedLessonIds.includes(lesson.id),
      current: lesson.id === currentLessonId,
      locked: false,
    }));

    // Append unit quiz as last item if it exists
    const unitQuizItem: LessonItem | null = hasUnitQuiz
      ? {
          id: `unit-quiz-${unit.id}`,
          title: `${unit.title} - Бүлгийн тест`,
          duration: "Тест",
          type: "unit-quiz" as LessonType,
          completed: completedUnitQuizIds.includes(unit.id),
          current: currentLessonId === `unit-quiz-${unit.id}` || currentUnitQuizId === unit.id,
          locked: false,
          isUnitQuiz: true,
          unitId: unit.id,
        }
      : null;

    return {
      unit,
      items: unitQuizItem ? [...lessonItems, unitQuizItem] : lessonItems,
      hasUnitQuiz,
    };
  });
};

/**
 * Get all lessons from units in flat array (for navigation)
 */
export const getAllLessonsFromUnits = (units: UnitWithLessons[]): Lesson[] => {
  return units.flatMap((unit) => unit.lessons);
};

// Calculate progress for a course
export const calculateCourseProgress = async (
  totalLessons: number,
  completedLessons: number = 0,
  courseId: string
) => {
  const progressPercentage =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  // Get authenticated user for streak data
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch total XP and streak in parallel
  const [totalXp, streakData] = await Promise.all([
    getCourseXPEarned(courseId),
    user ? getUserStreak(user.id) : Promise.resolve({ currentStreak: 0 }),
  ]);

  return {
    completed: completedLessons,
    total: totalLessons,
    percentage: progressPercentage,
    totalXp,
    streak: streakData.currentStreak,
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
      ? `/courses/${courseSlug}/learn/lesson/${previousLesson.id}`
      : undefined,
    nextLessonUrl: nextLesson
      ? `/courses/${courseSlug}/learn/lesson/${nextLesson.id}`
      : undefined,
  };
};

// =====================================================
// UNIT QUIZ HELPERS
// =====================================================

/**
 * Fetch which units have quizzes (batch query for efficiency)
 * Returns a Map of unitId -> hasQuiz
 */
export const fetchUnitsWithQuiz = async (
  supabase: SupabaseClient,
  unitIds: string[]
): Promise<Map<string, boolean>> => {
  const map = new Map<string, boolean>();

  if (unitIds.length === 0) return map;

  const { data } = await supabase
    .from("quiz_questions")
    .select("unit_id")
    .in("unit_id", unitIds)
    .not("unit_id", "is", null);

  if (data) {
    const unitsWithQuiz = new Set(data.map((q) => q.unit_id));
    unitIds.forEach((id) => map.set(id, unitsWithQuiz.has(id)));
  } else {
    unitIds.forEach((id) => map.set(id, false));
  }

  return map;
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
        options: sortedOptions.map((opt) => ({
          id: opt.id,
          text: opt.option_text,
          orderIndex: opt.order_index,
        })),
        correctAnswer: sortedOptions.findIndex((opt) => opt.is_correct),
        explanation: q.explanation,
        points: q.points,
      };
    }),
  };
};

/**
 * Batch fetch available steps for multiple lessons
 * Returns a Map of lessonId -> availableSteps
 */
export const fetchAvailableStepsForLessons = async (
  supabase: SupabaseClient,
  lessonIds: string[]
): Promise<Map<string, LessonStep[]>> => {
  const map = new Map<string, LessonStep[]>();

  if (lessonIds.length === 0) return map;

  // Fetch lesson content for all lessons in parallel
  const { data: lessonContents } = await supabase
    .from("lesson_content")
    .select("lesson_id, content_type")
    .in("lesson_id", lessonIds);

  // Fetch quiz data for all lessons in parallel
  const { data: quizQuestions } = await supabase
    .from("quiz_questions")
    .select("lesson_id")
    .in("lesson_id", lessonIds)
    .not("lesson_id", "is", null);

  // Group content by lesson
  const contentByLesson = new Map<string, string[]>();
  lessonContents?.forEach((lc) => {
    if (!contentByLesson.has(lc.lesson_id)) {
      contentByLesson.set(lc.lesson_id, []);
    }
    contentByLesson.get(lc.lesson_id)!.push(lc.content_type);
  });

  // Track which lessons have quizzes
  const lessonsWithQuiz = new Set(quizQuestions?.map((q) => q.lesson_id) || []);

  // Build available steps for each lesson
  lessonIds.forEach((lessonId) => {
    const steps: LessonStep[] = [];
    const contentTypes = contentByLesson.get(lessonId) || [];

    if (contentTypes.includes("theory")) steps.push("theory");
    if (contentTypes.includes("example")) steps.push("example");
    if (lessonsWithQuiz.has(lessonId)) steps.push("test");

    map.set(lessonId, steps);
  });

  return map;
};

// Re-export client-safe step helpers
export { getAvailableSteps, getStepLabel, type LessonStep } from './lesson-step-utils';
