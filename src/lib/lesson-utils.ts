import type { Lesson, LessonContent, Unit } from "@/types/database/tables";
import type { UnitWithLessons } from "@/types/database";
import type { QuizData } from "@/types/quiz";
import type { LessonType } from "@/types/database/enums";
import { formatTime } from "./utils";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getCourseXPEarned } from "./actions/xp-actions";
import { getUserStreak } from "./actions/streak-actions";
import { createClient } from "./supabase/server";

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
 * Uses lesson_content if available, falls back to legacy duration_seconds
 */
export const getLessonDurationDisplay = (
  lesson: Lesson & { lesson_content?: LessonContent[] }
): string => {
  // If lesson has content items, calculate from them
  if (lesson.lesson_content && lesson.lesson_content.length > 0) {
    const totalSeconds = calculateLessonDuration(lesson.lesson_content);
    return totalSeconds > 0 ? formatTime(totalSeconds) : "";
  }

  // Legacy: use direct lesson fields
  if (lesson.lesson_type === "video" && lesson.duration_seconds) {
    return formatTime(lesson.duration_seconds);
  }

  if (lesson.lesson_type === "quiz") return "Quiz";
  if (lesson.lesson_type === "assignment") return "Assignment";

  return "";
};

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

// =====================================================
// UNIT-BASED SIDEBAR TRANSFORMATION (NEW)
// =====================================================

/**
 * Transform units with lessons for sidebar display
 * Uses the new unit-based structure instead of section_title grouping
 * @param unitQuizMap - Optional map of unitId -> hasQuiz from fetchUnitsWithQuiz
 */
export const transformUnitsForSidebar = (
  units: UnitWithLessons[],
  currentLessonId: string,
  completedLessonIds: string[] = [],
  unitQuizMap: Map<string, boolean> = new Map()
): UnitSection[] => {
  return units.map((unit) => ({
    unit,
    items: unit.lessons.map((lesson) => ({
      id: lesson.id,
      title: lesson.title,
      duration: getLessonDurationDisplay(lesson),
      type: lesson.lesson_type,
      completed: completedLessonIds.includes(lesson.id),
      current: lesson.id === currentLessonId,
      locked: false,
    })),
    hasUnitQuiz: unitQuizMap.get(unit.id) ?? false,
  }));
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
        options: sortedOptions.map((opt) => opt.option_text),
        correctAnswer: sortedOptions.findIndex((opt) => opt.is_correct),
        explanation: q.explanation,
        points: q.points,
      };
    }),
  };
};
