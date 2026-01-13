// Re-export all from progress module for backward compatibility
// This file can be deleted once all imports are updated to use ./progress
// NOTE: No "use server" here - the individual modules have it, and this file exports types

export type {
  ProgressResult,
  LessonProgressData,
  ContentProgressData,
  LessonCompletionResult,
  LessonCompletionStatus,
  LessonRequirements,
} from "./progress";

export {
  saveIndividualContentProgress,
  saveVideoProgress,
  getLessonProgress,
  getLessonContentProgress,
  getCourseProgress,
  isLessonQuizPassed,
  checkLessonRequirements,
  markLessonCompleteIfReady,
  checkAndCompleteLessonIfReady,
} from "./progress";
