"use server";

import { createClient } from "@/lib/supabase/server";
import type {
  UnitWithLessons,
  UnitWithQuiz,
  LessonWithContent,
  LessonComplete,
} from "@/types/database";

/**
 * Fetch all units for a course with their lessons
 */
export const getCourseUnits = async (
  courseId: string
): Promise<UnitWithLessons[]> => {
  const supabase = await createClient();

  const { data: units, error } = await supabase
    .from("units")
    .select(
      `
      *,
      lessons (
        id,
        title,
        slug,
        description,
        video_url,
        duration_seconds,
        order_index,
        order_in_unit,
        lesson_type,
        is_preview
      )
    `
    )
    .eq("course_id", courseId)
    .order("order_index");

  if (error) {
    console.error("Error fetching course units:", error);
    return [];
  }

  // Sort lessons within each unit by order_in_unit
  return (units || []).map((unit) => ({
    ...unit,
    lessons: (unit.lessons || []).sort(
      (a: { order_in_unit: number | null }, b: { order_in_unit: number | null }) =>
        (a.order_in_unit || 0) - (b.order_in_unit || 0)
    ),
  }));
};

/**
 * Fetch a single unit with its lessons and quiz info
 */
export const getUnitWithQuiz = async (
  unitId: string
): Promise<UnitWithQuiz | null> => {
  const supabase = await createClient();

  const { data: unit, error } = await supabase
    .from("units")
    .select(
      `
      *,
      lessons (
        id,
        title,
        slug,
        description,
        video_url,
        duration_seconds,
        order_in_unit,
        lesson_type,
        is_preview
      )
    `
    )
    .eq("id", unitId)
    .single();

  if (error || !unit) {
    console.error("Error fetching unit:", error);
    return null;
  }

  // Check if unit has quiz questions
  const { count: quizCount } = await supabase
    .from("quiz_questions")
    .select("*", { count: "exact", head: true })
    .eq("unit_id", unitId);

  return {
    ...unit,
    lessons: (unit.lessons || []).sort(
      (a: { order_in_unit: number | null }, b: { order_in_unit: number | null }) =>
        (a.order_in_unit || 0) - (b.order_in_unit || 0)
    ),
    hasQuiz: (quizCount || 0) > 0,
    quizQuestionCount: quizCount || 0,
  };
};

/**
 * Fetch quiz questions for a unit
 */
export const getUnitQuizQuestions = async (unitId: string) => {
  const supabase = await createClient();

  const { data, error } = await supabase
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
    .eq("unit_id", unitId)
    .order("order_index");

  if (error) {
    console.error("Error fetching unit quiz questions:", error);
    return [];
  }

  return (data || []).map((q) => ({
    ...q,
    options: (q.quiz_options || []).sort(
      (a: { order_index: number }, b: { order_index: number }) =>
        a.order_index - b.order_index
    ),
  }));
};

/**
 * Get user's best quiz attempt for a unit
 */
export const getBestUnitQuizAttempt = async (
  enrollmentId: string,
  unitId: string
) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("quiz_attempts")
    .select("*")
    .eq("enrollment_id", enrollmentId)
    .eq("unit_id", unitId)
    .order("score", { ascending: false })
    .order("completed_at", { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== "PGRST116") {
    // PGRST116 = no rows returned
    console.error("Error fetching best quiz attempt:", error);
  }

  return data;
};

/**
 * Check if all lessons in a unit are completed
 */
export const isUnitComplete = async (
  enrollmentId: string,
  unitId: string
): Promise<boolean> => {
  const supabase = await createClient();

  // Get all lessons in the unit
  const { data: lessons } = await supabase
    .from("lessons")
    .select("id")
    .eq("unit_id", unitId);

  if (!lessons || lessons.length === 0) return false;

  const lessonIds = lessons.map((l) => l.id);

  // Get completed lessons
  const { data: progress } = await supabase
    .from("lesson_progress")
    .select("lesson_id")
    .eq("enrollment_id", enrollmentId)
    .eq("is_completed", true)
    .in("lesson_id", lessonIds);

  const completedCount = progress?.length || 0;

  return completedCount >= lessons.length;
};

/**
 * Get unit progress for a user
 */
export const getUnitProgress = async (
  enrollmentId: string,
  unitId: string
): Promise<{
  lessonsCompleted: number;
  totalLessons: number;
  quizPassed: boolean;
  bestQuizScore: number | null;
}> => {
  const supabase = await createClient();

  // Get all lessons in the unit
  const { data: lessons } = await supabase
    .from("lessons")
    .select("id")
    .eq("unit_id", unitId);

  const totalLessons = lessons?.length || 0;
  const lessonIds = lessons?.map((l) => l.id) || [];

  // Get completed lessons
  const { data: progress } = await supabase
    .from("lesson_progress")
    .select("lesson_id")
    .eq("enrollment_id", enrollmentId)
    .eq("is_completed", true)
    .in("lesson_id", lessonIds);

  const lessonsCompleted = progress?.length || 0;

  // Get best quiz attempt
  const bestAttempt = await getBestUnitQuizAttempt(enrollmentId, unitId);
  const quizPassed = bestAttempt
    ? bestAttempt.score / bestAttempt.total_questions >= 0.8
    : false;

  return {
    lessonsCompleted,
    totalLessons,
    quizPassed,
    bestQuizScore: bestAttempt?.score ?? null,
  };
};

// =====================================================
// LESSON CONTENT FUNCTIONS
// =====================================================

/**
 * Fetch a lesson with its content items (theory, examples)
 */
export const getLessonWithContent = async (
  lessonId: string
): Promise<LessonWithContent | null> => {
  const supabase = await createClient();

  const { data: lesson, error } = await supabase
    .from("lessons")
    .select(
      `
      *,
      lesson_content (
        id,
        title,
        content_type,
        video_url,
        content,
        description,
        duration_seconds,
        order_index
      )
    `
    )
    .eq("id", lessonId)
    .single();

  if (error || !lesson) {
    console.error("Error fetching lesson with content:", error);
    return null;
  }

  // Sort content by order_index
  return {
    ...lesson,
    lesson_content: (lesson.lesson_content || []).sort(
      (a: { order_index: number }, b: { order_index: number }) =>
        a.order_index - b.order_index
    ),
  };
};

/**
 * Fetch a lesson with content and quiz questions
 */
export const getLessonComplete = async (
  lessonId: string
): Promise<LessonComplete | null> => {
  const supabase = await createClient();

  // Fetch lesson with content
  const { data: lesson, error: lessonError } = await supabase
    .from("lessons")
    .select(
      `
      *,
      lesson_content (
        id,
        title,
        content_type,
        video_url,
        content,
        description,
        duration_seconds,
        order_index
      )
    `
    )
    .eq("id", lessonId)
    .single();

  if (lessonError || !lesson) {
    console.error("Error fetching lesson:", lessonError);
    return null;
  }

  // Fetch quiz questions for this lesson
  const { data: questions, error: quizError } = await supabase
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
    .order("order_index");

  if (quizError) {
    console.error("Error fetching lesson quiz:", quizError);
  }

  return {
    ...lesson,
    lesson_content: (lesson.lesson_content || []).sort(
      (a: { order_index: number }, b: { order_index: number }) =>
        a.order_index - b.order_index
    ),
    quiz_questions: questions || [],
    hasQuiz: (questions?.length || 0) > 0,
  };
};

/**
 * Get total duration of all content in a lesson
 */
export const getLessonTotalDuration = async (
  lessonId: string
): Promise<number> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("lesson_content")
    .select("duration_seconds")
    .eq("lesson_id", lessonId);

  if (error) {
    console.error("Error fetching lesson duration:", error);
    return 0;
  }

  return (data || []).reduce(
    (total, item) => total + (item.duration_seconds || 0),
    0
  );
};
