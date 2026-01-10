"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { LessonStep } from "@/lib/lesson-step-utils";
import type { UnitSection, LessonItem } from "@/lib/lesson-utils";

type ProgressData = {
  completed: number;
  total: number;
  percentage: number;
  streak?: number;
  totalXp: number;
};

type SidebarData = {
  courseTitle: string;
  courseSlug: string;
  courseId: string;
  units?: UnitSection[];
  progress: ProgressData;
  lessonStepsMap: Map<string, LessonStep[]>;
};

type LessonInfo = {
  title: string;
  content?: string;
};

type LessonPlayerContextType = {
  // Current lesson state
  currentLessonId: string | null;
  currentStep: LessonStep;
  availableSteps: LessonStep[];
  isUnitQuiz: boolean;
  currentLessonInfo: LessonInfo | null;

  // Sidebar data
  sidebarData: SidebarData | null;

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
};

const LessonPlayerContext = createContext<LessonPlayerContextType | null>(null);

type LessonPlayerProviderProps = {
  children: ReactNode;
  initialData: SidebarData;
};

export const LessonPlayerProvider = ({
  children,
  initialData,
}: LessonPlayerProviderProps) => {
  const [sidebarData, setSidebarData] = useState<SidebarData>(initialData);
  const [currentLessonId, setCurrentLessonId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<LessonStep>("theory");
  const [availableSteps, setAvailableSteps] = useState<LessonStep[]>([]);
  const [isUnitQuiz, setIsUnitQuiz] = useState(false);
  const [currentLessonInfo, setCurrentLessonInfo] = useState<LessonInfo | null>(null);

  const setCurrentLesson = useCallback(
    (
      lessonId: string,
      step: LessonStep,
      steps: LessonStep[],
      unitQuiz = false,
      lessonInfo?: LessonInfo
    ) => {
      setCurrentLessonId(lessonId);
      setCurrentStep(step);
      setAvailableSteps(steps);
      setIsUnitQuiz(unitQuiz);
      if (lessonInfo) {
        setCurrentLessonInfo(lessonInfo);
      }

      // Update the current lesson in units
      if (sidebarData?.units) {
        setSidebarData((prev) => {
          if (!prev?.units) return prev;

          const updatedUnits = prev.units.map((unit) => ({
            ...unit,
            items: unit.items.map((item) => ({
              ...item,
              current: item.id === lessonId,
            })),
          }));

          return { ...prev, units: updatedUnits };
        });
      }
    },
    [sidebarData?.units]
  );

  const updateProgress = useCallback((newProgress: Partial<ProgressData>) => {
    setSidebarData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        progress: { ...prev.progress, ...newProgress },
      };
    });
  }, []);

  const markLessonComplete = useCallback((lessonId: string) => {
    setSidebarData((prev) => {
      if (!prev?.units) return prev;

      // Find and mark the lesson as completed
      const updatedUnits = prev.units.map((unit) => ({
        ...unit,
        items: unit.items.map((item) =>
          item.id === lessonId ? { ...item, completed: true } : item
        ),
      }));

      // Recalculate progress (including unit quizzes)
      const totalItems = updatedUnits.reduce(
        (sum, unit) => sum + unit.items.length,
        0
      );
      const completedItems = updatedUnits.reduce(
        (sum, unit) => sum + unit.items.filter((i) => i.completed).length,
        0
      );
      const percentage =
        totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

      return {
        ...prev,
        units: updatedUnits,
        progress: {
          ...prev.progress,
          completed: completedItems,
          total: totalItems,
          percentage,
        },
      };
    });
  }, []);

  return (
    <LessonPlayerContext.Provider
      value={{
        currentLessonId,
        currentStep,
        availableSteps,
        isUnitQuiz,
        currentLessonInfo,
        sidebarData,
        setCurrentLesson,
        updateProgress,
        markLessonComplete,
      }}
    >
      {children}
    </LessonPlayerContext.Provider>
  );
};

export const useLessonPlayer = () => {
  const context = useContext(LessonPlayerContext);
  if (!context) {
    throw new Error(
      "useLessonPlayer must be used within LessonPlayerProvider"
    );
  }
  return context;
};

// Export types for use in other components
export type { SidebarData, UnitSection, LessonItem, ProgressData, LessonInfo };
