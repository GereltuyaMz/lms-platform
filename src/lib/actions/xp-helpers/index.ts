/**
 * XP helpers barrel export
 * Internal utilities for XP calculations and database operations
 */

// Queries
export {
  hasXPBeenAwarded,
  getEnrollmentId,
  isFirstLessonInCourse,
  isQuizRetry,
  isUnitQuizRetry,
  getUnitTitle,
  getLessonTitle,
  getCourseTitle,
  getCompletedCoursesCount,
} from "./queries";

// Calculations
export {
  calculateVideoXP,
  calculateQuizXP,
  calculateLessonQuizXP,
  calculateMockTestXP,
} from "./calculations";

// Transactions
export { insertXPTransaction, getUserLevel } from "./transactions";

// Completion bonuses
export {
  checkAndAwardCourseCompletion,
  checkAndAwardUnitCompletion,
} from "./completion-bonuses";
