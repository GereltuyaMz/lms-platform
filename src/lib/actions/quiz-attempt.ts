/**
 * @deprecated This file is maintained for backward compatibility.
 * Import from "./quiz" instead for new code.
 * NOTE: No "use server" here - the individual modules have it, and this file exports types
 */

// Re-export types
export type { QuizAttemptResult, QuizAnswer, BestScoreData, LatestAttemptData } from "./quiz";

// Re-export functions
export {
  saveQuizAttempt,
  getBestQuizScore,
  getQuizAttempts,
  getLatestQuizAttempt,
  saveUnitQuizAttempt,
  getBestUnitQuizScore,
  getLatestUnitQuizAttempt,
} from "./quiz";
