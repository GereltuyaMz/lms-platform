"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

type QuizAttemptResult = {
  success: boolean;
  message: string;
  attemptId?: string;
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
    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        message: "You must be logged in to save quiz attempts",
      };
    }

    // Get enrollment for this course
    const { data: enrollment, error: enrollmentError } = await supabase
      .from("enrollments")
      .select("id")
      .eq("user_id", user.id)
      .eq("course_id", courseId)
      .single();

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
      console.error("Error creating quiz attempt:", attemptError);
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
        console.error("Error saving quiz answers:", answersError);
        // Continue anyway - attempt is saved
      }
    }

    // Calculate passing score (80%) and mark lesson as complete if passed
    const passingScore = totalQuestions * 0.8;
    if (score >= passingScore) {
      // Mark lesson as complete in lesson_progress
      await supabase.from("lesson_progress").upsert(
        {
          enrollment_id: enrollment.id,
          lesson_id: lessonId,
          is_completed: true,
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "enrollment_id,lesson_id",
        }
      );
    }

    // Revalidate relevant pages
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Quiz attempt saved successfully",
      attemptId: attempt.id,
    };
  } catch (error) {
    console.error("Unexpected error in saveQuizAttempt:", error);
    return {
      success: false,
      message: "An unexpected error occurred",
    };
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
    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return null;
    }

    // Get enrollment for this course
    const { data: enrollment, error: enrollmentError } = await supabase
      .from("enrollments")
      .select("id")
      .eq("user_id", user.id)
      .eq("course_id", courseId)
      .single();

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
    console.error("Error getting best quiz score:", error);
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
    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { data: null, error: "Not authenticated" };
    }

    // Get enrollment for this course
    const { data: enrollment, error: enrollmentError } = await supabase
      .from("enrollments")
      .select("id")
      .eq("user_id", user.id)
      .eq("course_id", courseId)
      .single();

    if (enrollmentError || !enrollment) {
      return { data: null, error: "Not enrolled" };
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
      console.error("Error fetching quiz attempts:", attemptsError);
      return { data: null, error: "Error fetching attempts" };
    }

    return { data: attempts, error: null };
  } catch (error) {
    console.error("Unexpected error in getQuizAttempts:", error);
    return { data: null, error: "An unexpected error occurred" };
  }
}
