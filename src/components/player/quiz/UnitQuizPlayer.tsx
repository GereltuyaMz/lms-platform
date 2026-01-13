"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { QuizProgress } from "./QuizProgress";
import { QuizQuestion } from "./QuizQuestion";
import { QuizNavigation } from "./QuizNavigation";
import { QuizExplanation } from "./QuizExplanation";
import { QuizResultsSection } from "./QuizResultsSection";
import { useQuizState, type QuizData } from "./useQuizState";
import {
  showQuizXpNotification,
  showMilestoneNotifications,
  showStreakNotification,
} from "./useQuizNotifications";
import {
  saveUnitQuizAttempt,
  awardUnitQuizCompletionXP,
  getLatestUnitQuizAttempt,
} from "@/lib/actions";
import { useLessonPlayer } from "@/hooks/useLessonPlayer";
import { toast } from "sonner";
import { QUIZ_PASSING_THRESHOLD } from "@/lib/constants";

type UnitQuizPlayerProps = {
  title: string;
  quizData: QuizData | null;
  unitId: string;
  courseId: string;
};

export const UnitQuizPlayer = ({
  title,
  quizData,
  unitId,
  courseId,
}: UnitQuizPlayerProps) => {
  const router = useRouter();
  const { markLessonComplete, markStepComplete, updateProgress, sidebarData } =
    useLessonPlayer();

  const loadPreviousAttempt = useCallback(
    () => getLatestUnitQuizAttempt(unitId, courseId),
    [unitId, courseId]
  );

  const {
    state,
    setSelectedAnswer,
    setShowExplanation,
    setXpAwarded,
    setIsSubmitting,
    setCurrentQuestion,
    handleSubmitAnswer,
    handlePreviousQuestion,
    handleRetry,
  } = useQuizState({ loadPreviousAttempt, idKey: `${unitId}-${courseId}` });

  const saveQuizAttemptToDatabase = useCallback(async () => {
    if (!quizData) return;

    const loadingToast = toast.loading("Хадгалж байна...", {
      description: "Бүлгийн тестийн үр дүнг хадгалж байна",
    });

    const pointsEarned = quizData.questions.reduce(
      (total, q, i) =>
        total + (state.userAnswers[i] === q.correctAnswer ? q.points || 10 : 0),
      0
    );
    const answers = quizData.questions
      .map((q, i) => {
        const idx = state.userAnswers[i];
        if (idx === undefined || idx >= q.options.length) return null;
        return {
          questionId: q.id.toString(),
          selectedOptionId: q.options[idx].id,
          isCorrect: idx === q.correctAnswer,
          pointsEarned: idx === q.correctAnswer ? q.points || 10 : 0,
        };
      })
      .filter((a): a is NonNullable<typeof a> => a !== null);

    const result = await saveUnitQuizAttempt(
      unitId,
      courseId,
      state.score,
      quizData.questions.length,
      pointsEarned,
      answers
    );
    toast.dismiss(loadingToast);

    if (result.success && result.attemptId) {
      const xpResult = await awardUnitQuizCompletionXP(
        result.attemptId,
        unitId,
        courseId,
        state.score,
        quizData.questions.length
      );
      setXpAwarded(xpResult.xpAwarded || 0);

      if (xpResult.success && xpResult.xpAwarded) {
        showQuizXpNotification(
          xpResult.xpAwarded,
          (state.score / quizData.questions.length) * 100,
          true
        );
        if (sidebarData?.progress)
          updateProgress({
            totalPlatformXp:
              sidebarData.progress.totalPlatformXp + xpResult.xpAwarded,
          });
      }

      showMilestoneNotifications(
        result.milestoneResults,
        updateProgress,
        sidebarData
      );
      showStreakNotification(result, updateProgress, sidebarData);

      const quizPassed =
        state.score >= quizData.questions.length * QUIZ_PASSING_THRESHOLD;
      if (quizPassed) {
        markLessonComplete(`unit-quiz-${unitId}`);
        markStepComplete(unitId, "test");
      }
      setTimeout(() => router.refresh(), 100);
    } else {
      toast.error("Алдаа гарлаа", {
        description: "Тестийн үр дүнг хадгалж чадсангүй",
      });
    }
  }, [
    quizData,
    state.userAnswers,
    state.score,
    unitId,
    courseId,
    router,
    markStepComplete,
    markLessonComplete,
    updateProgress,
    sidebarData,
    setXpAwarded,
  ]);

  const handleNext = useCallback(async () => {
    if (!quizData) return;
    if (state.currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion(state.currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setIsSubmitting(true);
      try {
        await saveQuizAttemptToDatabase();
        setCurrentQuestion(-1);
      } finally {
        setIsSubmitting(false);
      }
    }
  }, [
    quizData,
    state.currentQuestion,
    saveQuizAttemptToDatabase,
    setCurrentQuestion,
    setSelectedAnswer,
    setShowExplanation,
    setIsSubmitting,
  ]);

  if (state.isLoadingPreviousAttempt)
    return (
      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="p-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[#606099]" />
          <p className="text-muted-foreground">Ачааллаж байна...</p>
        </div>
      </div>
    );

  if (!quizData || quizData.questions.length === 0)
    return (
      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="p-8 text-center">
          <p className="text-lg text-muted-foreground mb-4">
            Асуулт байхгүй байна
          </p>
          <p className="text-sm text-muted-foreground">
            Энэ бүлгийн шалгалт хараахан үүсээгүй байна.
          </p>
        </div>
      </div>
    );

  const question = quizData.questions[state.currentQuestion];
  const passed =
    state.score >= quizData.questions.length * QUIZ_PASSING_THRESHOLD;

  return (
    <div className="bg-white rounded-xl border overflow-hidden">
      {state.currentQuestion === -1 ? (
        <QuizResultsSection
          score={state.score}
          totalQuestions={quizData.questions.length}
          xpAwarded={state.xpAwarded}
          passed={passed}
          onRetry={handleRetry}
        />
      ) : (
        <div className="p-4 md:p-6">
          <div className="mb-4 md:mb-6">
            <h2 className="text-xl md:text-2xl font-bold mb-2">{title}</h2>
            <p className="text-muted-foreground">Бүлгийн мэдлэгээ шалгаарай</p>
          </div>
          <QuizProgress
            currentQuestion={state.currentQuestion}
            totalQuestions={quizData.totalQuestions}
          />
          <QuizQuestion
            question={question.question}
            options={question.options}
            selectedAnswer={state.selectedAnswer}
            correctAnswer={question.correctAnswer}
            showExplanation={state.showExplanation}
            explanation={question.explanation}
            onAnswerSelect={setSelectedAnswer}
            questionId={question.id}
          />
          <QuizNavigation
            currentQuestion={state.currentQuestion}
            totalQuestions={quizData.questions.length}
            isFirstQuestion={state.currentQuestion === 0}
            isLastQuestion={
              state.currentQuestion === quizData.questions.length - 1
            }
            showExplanation={state.showExplanation}
            selectedAnswer={state.selectedAnswer}
            isSubmitting={state.isSubmitting}
            onPrevious={handlePreviousQuestion}
            onSubmit={() => handleSubmitAnswer(quizData)}
            onNext={handleNext}
          />
          {state.showExplanation && (
            <QuizExplanation
              isCorrect={state.selectedAnswer === question.correctAnswer}
              explanation={question.explanation}
            />
          )}
        </div>
      )}
    </div>
  );
};
