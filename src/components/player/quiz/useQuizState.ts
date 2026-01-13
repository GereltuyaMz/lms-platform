"use client";

import { useState, useCallback, useEffect } from "react";
import type { QuizOptionUI } from "@/types/quiz";

export type QuizQuestionData = {
  id: string | number;
  question: string;
  options: QuizOptionUI[];
  correctAnswer: number;
  explanation: string;
  points?: number;
};

export type QuizData = {
  totalQuestions: number;
  questions: QuizQuestionData[];
};

export type QuizState = {
  currentQuestion: number;
  selectedAnswer: number | null;
  showExplanation: boolean;
  score: number;
  userAnswers: Record<number, number>;
  xpAwarded: number;
  isSubmitting: boolean;
  isLoadingPreviousAttempt: boolean;
};

type UseQuizStateOptions = {
  loadPreviousAttempt: () => Promise<{ score: number } | null>;
  idKey: string;
};

export const useQuizState = ({ loadPreviousAttempt, idKey }: UseQuizStateOptions) => {
  const [state, setState] = useState<QuizState>({
    currentQuestion: 0,
    selectedAnswer: null,
    showExplanation: false,
    score: 0,
    userAnswers: {},
    xpAwarded: 0,
    isSubmitting: false,
    isLoadingPreviousAttempt: true,
  });

  // Load previous attempt when idKey changes
  useEffect(() => {
    setState((prev) => ({ ...prev, isLoadingPreviousAttempt: true }));

    const loadAttempt = async () => {
      try {
        const previousAttempt = await loadPreviousAttempt();

        if (previousAttempt) {
          setState((prev) => ({
            ...prev,
            currentQuestion: -1,
            score: previousAttempt.score,
            xpAwarded: 0,
            isLoadingPreviousAttempt: false,
          }));
        } else {
          setState((prev) => ({
            ...prev,
            currentQuestion: 0,
            score: 0,
            xpAwarded: 0,
            isLoadingPreviousAttempt: false,
          }));
        }
      } catch {
        setState((prev) => ({
          ...prev,
          currentQuestion: 0,
          score: 0,
          xpAwarded: 0,
          isLoadingPreviousAttempt: false,
        }));
      }
    };

    loadAttempt();
  }, [idKey, loadPreviousAttempt]);

  const setSelectedAnswer = useCallback((answer: number | null) => {
    setState((prev) => ({ ...prev, selectedAnswer: answer }));
  }, []);

  const setShowExplanation = useCallback((show: boolean) => {
    setState((prev) => ({ ...prev, showExplanation: show }));
  }, []);

  const setXpAwarded = useCallback((xp: number) => {
    setState((prev) => ({ ...prev, xpAwarded: xp }));
  }, []);

  const setIsSubmitting = useCallback((submitting: boolean) => {
    setState((prev) => ({ ...prev, isSubmitting: submitting }));
  }, []);

  const setCurrentQuestion = useCallback((question: number) => {
    setState((prev) => ({ ...prev, currentQuestion: question }));
  }, []);

  const handleSubmitAnswer = useCallback(
    (quizData: QuizData | null) => {
      if (!quizData) return;

      const question = quizData.questions[state.currentQuestion];
      const isCorrect = state.selectedAnswer === question?.correctAnswer;

      if (state.selectedAnswer !== null) {
        setState((prev) => ({
          ...prev,
          showExplanation: true,
          userAnswers: { ...prev.userAnswers, [prev.currentQuestion]: state.selectedAnswer! },
          score: isCorrect ? prev.score + 1 : prev.score,
        }));
      }
    },
    [state.currentQuestion, state.selectedAnswer]
  );

  const handleNextQuestion = useCallback((totalQuestions: number) => {
    setState((prev) => {
      if (prev.currentQuestion < totalQuestions - 1) {
        return {
          ...prev,
          currentQuestion: prev.currentQuestion + 1,
          selectedAnswer: null,
          showExplanation: false,
        };
      }
      return prev;
    });
  }, []);

  const handlePreviousQuestion = useCallback(() => {
    setState((prev) => {
      if (prev.currentQuestion > 0) {
        return {
          ...prev,
          currentQuestion: prev.currentQuestion - 1,
          selectedAnswer: null,
          showExplanation: false,
        };
      }
      return prev;
    });
  }, []);

  const handleRetry = useCallback(() => {
    setState({
      currentQuestion: 0,
      selectedAnswer: null,
      showExplanation: false,
      score: 0,
      userAnswers: {},
      xpAwarded: 0,
      isSubmitting: false,
      isLoadingPreviousAttempt: false,
    });
  }, []);

  return {
    state,
    setSelectedAnswer,
    setShowExplanation,
    setXpAwarded,
    setIsSubmitting,
    setCurrentQuestion,
    handleSubmitAnswer,
    handleNextQuestion,
    handlePreviousQuestion,
    handleRetry,
  };
};
