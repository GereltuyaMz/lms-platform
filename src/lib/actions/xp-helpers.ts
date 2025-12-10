import { createClient } from "@/lib/supabase/server";

type XPCalculation = {
  amount: number;
  metadata: Record<string, unknown>;
};

/**
 * Check if XP already awarded for a specific source
 */
export async function hasXPBeenAwarded(
  userId: string,
  sourceType: string,
  sourceId: string
): Promise<boolean> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("xp_transactions")
    .select("id")
    .eq("user_id", userId)
    .eq("source_type", sourceType)
    .eq("source_id", sourceId)
    .single();

  return !!data;
}

/**
 * Get enrollment ID for user and course
 */
export async function getEnrollmentId(
  userId: string,
  courseId: string
): Promise<string | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("enrollments")
    .select("id")
    .eq("user_id", userId)
    .eq("course_id", courseId)
    .single();

  if (error || !data) {
    return null;
  }

  return data.id;
}

/**
 * Check if lesson is user's first completion in course
 */
export async function isFirstLessonInCourse(
  enrollmentId: string
): Promise<boolean> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("lesson_progress")
    .select("lesson_id")
    .eq("enrollment_id", enrollmentId)
    .eq("is_completed", true);

  return !data || data.length === 0;
}

/**
 * Check if user has previous quiz attempts on same lesson
 */
export async function isQuizRetry(
  userId: string,
  lessonId: string,
  currentAttemptId: string
): Promise<boolean> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("quiz_attempts")
    .select("id, enrollment_id!inner(user_id)")
    .eq("enrollment_id.user_id", userId)
    .eq("lesson_id", lessonId)
    .neq("id", currentAttemptId);

  return !!data && data.length > 0;
}

/**
 * Get lesson title by ID
 */
export async function getLessonTitle(lessonId: string): Promise<string> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("lessons")
    .select("title")
    .eq("id", lessonId)
    .single();

  return data?.title || "Lesson";
}

/**
 * Calculate video completion XP
 */
export async function calculateVideoXP(
  durationSeconds: number,
  isFirstLesson: boolean
): Promise<XPCalculation> {
  const supabase = await createClient();

  const { data: xpAmount } = await supabase.rpc("calculate_video_xp", {
    duration_seconds: durationSeconds,
    is_first_lesson: isFirstLesson,
  });

  return {
    amount: (xpAmount as number) || 0,
    metadata: {
      duration_seconds: durationSeconds,
      is_first_lesson: isFirstLesson,
    },
  };
}

/**
 * Calculate quiz completion XP
 */
export async function calculateQuizXP(
  scoreCorrect: number,
  totalQuestions: number,
  isRetry: boolean
): Promise<XPCalculation> {
  const supabase = await createClient();

  const { data: xpAmount } = await supabase.rpc("calculate_quiz_xp", {
    score_correct: scoreCorrect,
    total_questions: totalQuestions,
    is_retry: isRetry,
  });

  const scorePercentage = totalQuestions > 0 ? (scoreCorrect / totalQuestions) * 100 : 0;

  return {
    amount: (xpAmount as number) || 0,
    metadata: {
      score_percentage: scorePercentage,
      score_correct: scoreCorrect,
      total_questions: totalQuestions,
      is_retry: isRetry,
    },
  };
}

/**
 * Insert XP transaction
 */
export async function insertXPTransaction(
  userId: string,
  amount: number,
  sourceType: string,
  sourceId: string,
  description: string,
  metadata: Record<string, unknown>
): Promise<boolean> {
  const supabase = await createClient();

  const { error } = await supabase.from("xp_transactions").insert({
    user_id: userId,
    amount,
    source_type: sourceType,
    source_id: sourceId,
    description,
    metadata,
  });

  if (error) {
    return false;
  }

  return true;
}

/**
 * Get course title by ID
 */
export async function getCourseTitle(courseId: string): Promise<string> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("courses")
    .select("title")
    .eq("id", courseId)
    .single();

  return data?.title || "Course";
}

/**
 * Count completed courses for user
 */
export async function getCompletedCoursesCount(
  userId: string
): Promise<number> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("enrollments")
    .select("id")
    .eq("user_id", userId)
    .eq("progress_percentage", 100);

  return data?.length || 0;
}
