"use server";

import {
  getAuthenticatedUser,
  getUserEnrollment,
  upsertLessonProgress,
  checkAndAwardMilestones,
  revalidateUserPages,
  handleActionError,
} from "./helpers";

type QuizAttemptResult = {
  success: boolean;
  message: string;
  attemptId?: string;
  milestoneResults?: Array<{
    success: boolean;
    message: string;
    xpAwarded?: number;
  }>;
  streakBonusAwarded?: number;
  streakBonusMessage?: string;
  currentStreak?: number;
};

type QuizAnswer = {
  questionId: string;
  selectedOptionId: string;
  isCorrect: boolean;
  pointsEarned: number;
};

type BestScoreData = {
  bestScore: number;
  totalQuestions: number;
  bestPercentage: number;
  attempts: number;
};

/**
 * Save a completed quiz attempt
 * @param lessonId - UUID of the quiz lesson
 * @param courseId - UUID of the course
 * @param score - Number of correct answers
 * @param totalQuestions - Total questions in quiz
 * @param pointsEarned - Total points earned
 * @param answers - Array of individual answers
 * @returns Result object with success status
 */
export async function saveQuizAttempt(
  lessonId: string,
  courseId: string,
  score: number,
  totalQuestions: number,
  pointsEarned: number,
  answers: QuizAnswer[]
): Promise<QuizAttemptResult> {
  try {
    const { user, supabase, error: authError } = await getAuthenticatedUser();

    if (authError || !user) {
      return {
        success: false,
        message: "You must be logged in to save quiz attempts",
      };
    }

    // Get enrollment for this course
    const { enrollment, error: enrollmentError } = await getUserEnrollment(
      user.id,
      courseId
    );

    if (enrollmentError || !enrollment) {
      return {
        success: false,
        message: "You must be enrolled in this course",
      };
    }

    // Create quiz attempt
    const { data: attempt, error: attemptError } = await supabase
      .from("quiz_attempts")
      .insert({
        enrollment_id: enrollment.id,
        lesson_id: lessonId,
        score,
        total_questions: totalQuestions,
        points_earned: pointsEarned,
      })
      .select("id")
      .single();

    if (attemptError || !attempt) {
      return {
        success: false,
        message: "Error saving quiz attempt",
      };
    }

    // Save individual answers
    if (answers.length > 0) {
      const answerRecords = answers.map((answer) => ({
        attempt_id: attempt.id,
        question_id: answer.questionId,
        selected_option_id: answer.selectedOptionId,
        is_correct: answer.isCorrect,
        points_earned: answer.pointsEarned,
      }));

      const { error: answersError } = await supabase
        .from("quiz_answers")
        .insert(answerRecords);

      if (answersError) {
        // Continue anyway - attempt is saved
      }
    }

    // Calculate passing score (80%) and mark lesson as complete if passed
    const passingScore = totalQuestions * 0.8;
    let milestoneResults: Array<{
      success: boolean;
      message: string;
      xpAwarded?: number;
    }> = [];

    let streakBonusAwarded: number | undefined;
    let streakBonusMessage: string | undefined;
    let currentStreak: number | undefined;

    if (score >= passingScore) {
      // Mark lesson as complete
      await upsertLessonProgress(enrollment.id, lessonId, {
        isCompleted: true,
      });

      // Check for milestone XP and return results
      milestoneResults = await checkAndAwardMilestones(user.id, courseId);

      // Update user streak on completion
      const { updateUserStreak } = await import("./streak-actions");
      const streakResult = await updateUserStreak(user.id);

      if (streakResult.success) {
        currentStreak = streakResult.currentStreak;
        streakBonusAwarded = streakResult.streakBonusAwarded;
        streakBonusMessage = streakResult.streakBonusMessage;
      }
    }

    // Revalidate relevant pages
    revalidateUserPages();

    return {
      success: true,
      message: "Quiz attempt saved successfully",
      attemptId: attempt.id,
      milestoneResults:
        milestoneResults.length > 0 ? milestoneResults : undefined,
      streakBonusAwarded,
      streakBonusMessage,
      currentStreak,
    };
  } catch (error) {
    return handleActionError(error, "saveQuizAttempt") as QuizAttemptResult;
  }
}

/**
 * Get the best quiz score for a lesson
 * @param lessonId - UUID of the quiz lesson
 * @param courseId - UUID of the course
 * @returns Best score data or null
 */
export async function getBestQuizScore(
  lessonId: string,
  courseId: string
): Promise<BestScoreData | null> {
  try {
    const { user, supabase, error: authError } = await getAuthenticatedUser();

    if (authError || !user) {
      return null;
    }

    // Get enrollment for this course
    const { enrollment, error: enrollmentError } = await getUserEnrollment(
      user.id,
      courseId
    );

    if (enrollmentError || !enrollment) {
      return null;
    }

    // Get all attempts for this quiz, ordered by score (best first)
    const { data: attempts, error: attemptsError } = await supabase
      .from("quiz_attempts")
      .select("score, total_questions, points_earned")
      .eq("enrollment_id", enrollment.id)
      .eq("lesson_id", lessonId)
      .order("score", { ascending: false })
      .order("points_earned", { ascending: false });

    if (attemptsError || !attempts || attempts.length === 0) {
      return null;
    }

    const bestAttempt = attempts[0];
    const bestPercentage = Math.round(
      (bestAttempt.score / bestAttempt.total_questions) * 100
    );

    return {
      bestScore: bestAttempt.score,
      totalQuestions: bestAttempt.total_questions,
      bestPercentage,
      attempts: attempts.length,
    };
  } catch (error) {
    return null;
  }
}

/**
 * Get all quiz attempts for a lesson
 * @param lessonId - UUID of the quiz lesson
 * @param courseId - UUID of the course
 * @returns Array of quiz attempts
 */
export async function getQuizAttempts(lessonId: string, courseId: string) {
  try {
    const { user, supabase, error: authError } = await getAuthenticatedUser();

    if (authError || !user) {
      return { data: null, error: authError };
    }

    // Get enrollment for this course
    const { enrollment, error: enrollmentError } = await getUserEnrollment(
      user.id,
      courseId
    );

    if (enrollmentError || !enrollment) {
      return { data: null, error: enrollmentError };
    }

    // Get all attempts with their answers
    const { data: attempts, error: attemptsError } = await supabase
      .from("quiz_attempts")
      .select(
        `
        id,
        score,
        total_questions,
        points_earned,
        completed_at
      `
      )
      .eq("enrollment_id", enrollment.id)
      .eq("lesson_id", lessonId)
      .order("completed_at", { ascending: false });

    if (attemptsError) {
      return { data: null, error: "Error fetching attempts" };
    }

    return { data: attempts, error: null };
  } catch (error) {
    return { data: null, error: "An unexpected error occurred" };
  }
}
