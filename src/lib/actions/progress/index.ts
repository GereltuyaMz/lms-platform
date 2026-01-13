// Barrel export for progress module
// Maintains backward compatibility with lesson-progress.ts imports

export type {
  ProgressResult,
  LessonProgressData,
  ContentProgressData,
  LessonCompletionResult,
  LessonCompletionStatus,
  LessonRequirements,
} from "./types";

export {
  saveIndividualContentProgress,
  saveVideoProgress,
} from "./save-progress";

export {
  getLessonProgress,
  getLessonContentProgress,
  getCourseProgress,
} from "./get-progress";

export {
  isLessonQuizPassed,
  checkLessonRequirements,
  markLessonCompleteIfReady,
  checkAndCompleteLessonIfReady,
} from "./lesson-completion";
