"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import type { LessonStep } from "@/lib/lesson-step-utils";
import {
  getStepCompletionStatus,
  type StepCompletionStatus,
} from "@/lib/actions/lesson-step-progress";
import type {
  SidebarData,
  ProgressData,
  LessonInfo,
  LessonPlayerContextType,
} from "./types";

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
  const [completedStepsMap, setCompletedStepsMap] = useState<Map<string, Set<LessonStep>>>(new Map());
  const [stepCompletionLoading, setStepCompletionLoading] = useState<Set<string>>(new Set());
  const pendingFetches = useRef<Set<string>>(new Set());

  const setCurrentLesson = useCallback(
    (lessonId: string, step: LessonStep, steps: LessonStep[], unitQuiz = false, lessonInfo?: LessonInfo) => {
      setCurrentLessonId(lessonId);
      setCurrentStep(step);
      setAvailableSteps(steps);
      setIsUnitQuiz(unitQuiz);
      if (lessonInfo) setCurrentLessonInfo(lessonInfo);

      if (sidebarData?.units) {
        setSidebarData((prev) => {
          if (!prev?.units) return prev;
          const updatedUnits = prev.units.map((unit) => ({
            ...unit,
            items: unit.items.map((item) => ({ ...item, current: item.id === lessonId })),
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
      return { ...prev, progress: { ...prev.progress, ...newProgress } };
    });
  }, []);

  const markLessonComplete = useCallback((lessonId: string) => {
    setSidebarData((prev) => {
      if (!prev?.units) return prev;

      const updatedUnits = prev.units.map((unit) => ({
        ...unit,
        items: unit.items.map((item) => (item.id === lessonId ? { ...item, completed: true } : item)),
      }));

      const totalItems = updatedUnits.reduce((sum, unit) => sum + unit.items.length, 0);
      const completedItems = updatedUnits.reduce((sum, unit) => sum + unit.items.filter((i) => i.completed).length, 0);
      const percentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

      return {
        ...prev,
        units: updatedUnits,
        progress: { ...prev.progress, completed: completedItems, total: totalItems, percentage },
      };
    });
  }, []);

  const fetchStepCompletion = useCallback(
    async (lessonId: string, courseId: string): Promise<void> => {
      if (pendingFetches.current.has(lessonId) || completedStepsMap.has(lessonId)) return;

      pendingFetches.current.add(lessonId);
      setStepCompletionLoading((prev) => new Set(prev).add(lessonId));

      try {
        const status: StepCompletionStatus = await getStepCompletionStatus(lessonId, courseId);

        setCompletedStepsMap((prev) => {
          const newMap = new Map(prev);
          const existingSteps = prev.get(lessonId) || new Set<LessonStep>();
          const mergedSteps = new Set(existingSteps);
          if (status.theory) mergedSteps.add("theory");
          if (status.example) mergedSteps.add("example");
          if (status.test) mergedSteps.add("test");
          newMap.set(lessonId, mergedSteps);
          return newMap;
        });
      } finally {
        pendingFetches.current.delete(lessonId);
        setStepCompletionLoading((prev) => {
          const newSet = new Set(prev);
          newSet.delete(lessonId);
          return newSet;
        });
      }
    },
    [completedStepsMap]
  );

  const markStepComplete = useCallback((lessonId: string, step: LessonStep): void => {
    setCompletedStepsMap((prev) => {
      const newMap = new Map(prev);
      const existingSteps = prev.get(lessonId) || new Set<LessonStep>();
      const updatedSteps = new Set(existingSteps);
      updatedSteps.add(step);
      newMap.set(lessonId, updatedSteps);
      return newMap;
    });
  }, []);

  const refreshStepCompletion = useCallback(
    async (lessonId: string, courseId: string): Promise<void> => {
      if (pendingFetches.current.has(lessonId)) return;

      pendingFetches.current.add(lessonId);
      setStepCompletionLoading((prev) => new Set(prev).add(lessonId));

      try {
        const status: StepCompletionStatus = await getStepCompletionStatus(lessonId, courseId);

        setCompletedStepsMap((prev) => {
          const newMap = new Map(prev);
          const existingSteps = prev.get(lessonId) || new Set<LessonStep>();
          const mergedSteps = new Set(existingSteps);
          if (status.theory) mergedSteps.add("theory");
          if (status.example) mergedSteps.add("example");
          if (status.test) mergedSteps.add("test");
          newMap.set(lessonId, mergedSteps);
          return newMap;
        });
      } finally {
        pendingFetches.current.delete(lessonId);
        setStepCompletionLoading((prev) => {
          const newSet = new Set(prev);
          newSet.delete(lessonId);
          return newSet;
        });
      }
    },
    []
  );

  return (
    <LessonPlayerContext.Provider
      value={{
        currentLessonId,
        currentStep,
        availableSteps,
        isUnitQuiz,
        currentLessonInfo,
        sidebarData,
        completedStepsMap,
        stepCompletionLoading,
        setCurrentLesson,
        updateProgress,
        markLessonComplete,
        fetchStepCompletion,
        markStepComplete,
        refreshStepCompletion,
      }}
    >
      {children}
    </LessonPlayerContext.Provider>
  );
};

export const useLessonPlayer = () => {
  const context = useContext(LessonPlayerContext);
  if (!context) {
    throw new Error("useLessonPlayer must be used within LessonPlayerProvider");
  }
  return context;
};

// Re-export types
export type { SidebarData, ProgressData, LessonInfo } from "./types";
export type { UnitSection, LessonItem } from "./types";
