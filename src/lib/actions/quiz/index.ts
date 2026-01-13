/**
 * Quiz attempt actions barrel export
 */

// Types
export type { QuizAttemptResult, QuizAnswer, BestScoreData, LatestAttemptData } from "./types";

// Lesson quiz
export { saveQuizAttempt } from "./save-lesson-quiz";
export { getBestQuizScore, getQuizAttempts, getLatestQuizAttempt } from "./get-lesson-quiz";

// Unit quiz
export { saveUnitQuizAttempt } from "./save-unit-quiz";
export { getBestUnitQuizScore, getLatestUnitQuizAttempt } from "./get-unit-quiz";
