import { createClient } from "@/lib/supabase/server";

type XPCalculation = {
  amount: number;
  metadata: Record<string, unknown>;
};

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
    metadata: { duration_seconds: durationSeconds, is_first_lesson: isFirstLesson },
  };
}

/**
 * Calculate quiz completion XP (legacy)
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
 * Calculate lesson quiz XP using V2 system (15-22 XP based on score)
 */
export async function calculateLessonQuizXP(
  scoreCorrect: number,
  totalQuestions: number,
  isRetry: boolean
): Promise<XPCalculation> {
  const supabase = await createClient();

  const { data: xpAmount } = await supabase.rpc("calculate_lesson_quiz_xp", {
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
 * Calculate mock test XP (80 XP for passing, 10 XP for attempt)
 */
export async function calculateMockTestXP(
  scorePercentage: number,
  isRetry: boolean
): Promise<XPCalculation> {
  const supabase = await createClient();

  const { data: xpAmount } = await supabase.rpc("calculate_mock_test_xp", {
    score_percentage: scorePercentage,
    is_retry: isRetry,
  });

  return {
    amount: (xpAmount as number) || 0,
    metadata: { score_percentage: scorePercentage, is_retry: isRetry },
  };
}
