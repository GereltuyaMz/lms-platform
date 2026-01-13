"use server";

import {
  getAuthenticatedUser,
  getUserEnrollment,
} from "./helpers";

export type StepCompletionStatus = {
  theory: boolean;
  example: boolean;
  test: boolean;
};

const PASSING_THRESHOLD = 0.8; // 80% to pass quiz

/**
 * Get completion status for all lesson steps (theory, example, test)
 * This unified fetcher queries BOTH lesson_content_progress AND quiz_attempts
 * to provide a complete picture of step completion.
 *
 * @param lessonId - UUID of the lesson
 * @param courseId - UUID of the course
 * @returns StepCompletionStatus with boolean for each step type
 */
export async function getStepCompletionStatus(
  lessonId: string,
  courseId: string
): Promise<StepCompletionStatus> {
  try {
    const { user, supabase, error: authError } = await getAuthenticatedUser();

    if (authError || !user) {
      return { theory: false, example: false, test: false };
    }

    const { enrollment, error: enrollmentError } = await getUserEnrollment(
      user.id,
      courseId
    );

    if (enrollmentError || !enrollment) {
      return { theory: false, example: false, test: false };
    }

    // Fetch content items, progress, and quiz attempts in parallel
    const [contentItems, progressData, quizResult] = await Promise.all([
      // Get all content items for this lesson
      supabase
        .from("lesson_content")
        .select("id, content_type")
        .eq("lesson_id", lessonId),

      // Get progress for this lesson's content
      supabase
        .from("lesson_content_progress")
        .select("lesson_content_id, is_completed")
        .eq("enrollment_id", enrollment.id),

      // Get best quiz attempt for this lesson
      supabase
        .from("quiz_attempts")
        .select("score, total_questions")
        .eq("enrollment_id", enrollment.id)
        .eq("lesson_id", lessonId)
        .order("score", { ascending: false })
        .limit(1),
    ]);

    // Process content progress
    let theoryCompleted = false;
    let exampleCompleted = false;

    const contentList = contentItems.data || [];
    const progressList = progressData.data || [];

    // Create a map of content progress
    const progressMap = new Map(
      progressList.map((p) => [p.lesson_content_id, p.is_completed])
    );

    // Filter content by type
    const theoryItems = contentList.filter((item) => item.content_type === "theory");
    const exampleItems = contentList.filter((item) => item.content_type === "example");

    // Theory is complete if all theory items are completed (or no theory items exist)
    theoryCompleted =
      theoryItems.length === 0 ||
      theoryItems.every((item) => progressMap.get(item.id) === true);

    // Example is complete if all example items are completed (or no example items exist)
    exampleCompleted =
      exampleItems.length === 0 ||
      exampleItems.every((item) => progressMap.get(item.id) === true);

    // Process quiz completion (passed = score >= 80%)
    let testCompleted = false;
    if (quizResult.data && quizResult.data.length > 0) {
      const bestAttempt = quizResult.data[0];
      const passingScore = bestAttempt.total_questions * PASSING_THRESHOLD;
      testCompleted = bestAttempt.score >= passingScore;
    }

    return {
      theory: theoryCompleted,
      example: exampleCompleted,
      test: testCompleted,
    };
  } catch {
    return { theory: false, example: false, test: false };
  }
}

/**
 * Get completion status for a unit quiz
 *
 * @param unitId - UUID of the unit
 * @param courseId - UUID of the course
 * @returns boolean indicating if unit quiz is passed
 */
export async function getUnitQuizCompletionStatus(
  unitId: string,
  courseId: string
): Promise<boolean> {
  try {
    const { user, supabase, error: authError } = await getAuthenticatedUser();

    if (authError || !user) {
      return false;
    }

    const { enrollment, error: enrollmentError } = await getUserEnrollment(
      user.id,
      courseId
    );

    if (enrollmentError || !enrollment) {
      return false;
    }

    // Get best unit quiz attempt
    const { data: attempts } = await supabase
      .from("quiz_attempts")
      .select("score, total_questions")
      .eq("enrollment_id", enrollment.id)
      .eq("unit_id", unitId)
      .order("score", { ascending: false })
      .limit(1);

    if (attempts && attempts.length > 0) {
      const bestAttempt = attempts[0];
      const passingScore = bestAttempt.total_questions * PASSING_THRESHOLD;
      return bestAttempt.score >= passingScore;
    }

    return false;
  } catch {
    return false;
  }
}
