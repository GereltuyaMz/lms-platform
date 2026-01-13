import type { LessonStep } from "@/lib/lesson-step-utils";
import type { UnitSection, LessonItem } from "@/lib/lesson-utils";

export type ProgressData = {
  completed: number;
  total: number;
  percentage: number;
  streak?: number;
  totalXp: number;
  totalPlatformXp: number;
};

export type SidebarData = {
  courseTitle: string;
  courseSlug: string;
  courseId: string;
  units?: UnitSection[];
  progress: ProgressData;
  lessonStepsMap: Map<string, LessonStep[]>;
};

export type LessonInfo = {
  title: string;
  content?: string;
};

export type LessonPlayerContextType = {
  // Current lesson state
  currentLessonId: string | null;
  currentStep: LessonStep;
  availableSteps: LessonStep[];
  isUnitQuiz: boolean;
  currentLessonInfo: LessonInfo | null;

  // Sidebar data
  sidebarData: SidebarData | null;

  // Step completion cache
  completedStepsMap: Map<string, Set<LessonStep>>;
  stepCompletionLoading: Set<string>;

  // Actions
  setCurrentLesson: (
    lessonId: string,
    step: LessonStep,
    availableSteps: LessonStep[],
    isUnitQuiz?: boolean,
    lessonInfo?: LessonInfo
  ) => void;
  updateProgress: (newProgress: Partial<ProgressData>) => void;
  markLessonComplete: (lessonId: string) => void;

  // Centralized step completion management
  fetchStepCompletion: (lessonId: string, courseId: string) => Promise<void>;
  markStepComplete: (lessonId: string, step: LessonStep) => void;
  refreshStepCompletion: (lessonId: string, courseId: string) => Promise<void>;
};

// Re-export types for external use
export type { UnitSection, LessonItem };
