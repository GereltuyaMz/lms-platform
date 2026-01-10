"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { QuizProgress } from "./QuizProgress";
import { QuizQuestion } from "./QuizQuestion";
import { QuizResults } from "./QuizResults";
import { saveQuizAttempt, awardQuizCompletionXP } from "@/lib/actions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { QuizOptionUI } from "@/types/quiz";

type QuizQuestionData = {
  id: string | number;
  question: string;
  options: QuizOptionUI[];
  correctAnswer: number;
  explanation: string;
  points?: number;
};

type QuizData = {
  totalQuestions: number;
  questions: QuizQuestionData[];
};

type QuizPlayerProps = {
  title: string;
  quizData: QuizData | null;
  lessonId: string;
  courseId: string;
};

export const QuizPlayer = ({
  title,
  quizData,
  lessonId,
  courseId,
}: QuizPlayerProps) => {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [xpAwarded, setXpAwarded] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const saveQuizAttemptToDatabase = useCallback(async () => {
    if (!quizData) return;

    // Show loading toast immediately
    const loadingToast = toast.loading("Хадгалж байна...", {
      description: "Тестийн үр дүнг хадгалж байна",
    });

    // Calculate total points earned
    const pointsEarned = quizData.questions.reduce((total, question, index) => {
      const userAnswer = userAnswers[index];
      const isCorrect = userAnswer === question.correctAnswer;
      return total + (isCorrect ? question.points || 10 : 0);
    }, 0);

    // Build answers array from userAnswers
    const answers = quizData.questions
      .map((question, index) => {
        const selectedIndex = userAnswers[index];

        // Skip unanswered questions
        if (selectedIndex === undefined || selectedIndex === null) {
          return null;
        }

        // Bounds checking
        if (selectedIndex >= question.options.length) {
          return null;
        }

        const selectedOption = question.options[selectedIndex];
        const isCorrect = selectedIndex === question.correctAnswer;

        return {
          questionId: question.id.toString(),
          selectedOptionId: selectedOption.id,
          isCorrect,
          pointsEarned: isCorrect ? question.points || 10 : 0,
        };
      })
      .filter((answer): answer is NonNullable<typeof answer> => answer !== null);

    // Parallel execution: Save attempt and award XP simultaneously
    const scorePercentage = (score / quizData.questions.length) * 100;

    const result = await saveQuizAttempt(
      lessonId,
      courseId,
      score,
      quizData.questions.length,
      pointsEarned,
      answers
    );

    // Dismiss loading toast
    toast.dismiss(loadingToast);

    // Award XP if quiz attempt saved successfully
    if (result.success && result.attemptId) {
      const xpResult = await awardQuizCompletionXP(
        result.attemptId,
        lessonId,
        courseId,
        score,
        quizData.questions.length
      );

      // Always update XP state (even if 0 for retries)
      setXpAwarded(xpResult.xpAwarded || 0);

      if (xpResult.success && xpResult.xpAwarded) {
        toast.success(`🎉 +${xpResult.xpAwarded} XP`, {
          description: `Та тестээ ${Math.round(
            scorePercentage
          )}% үнэлгээтэй давлаа!`,
        });
      }

      // Show milestone XP notifications
      if (result.milestoneResults && result.milestoneResults.length > 0) {
        result.milestoneResults.forEach((milestone) => {
          if (milestone.success && milestone.xpAwarded) {
            toast.success(`🏆 +${milestone.xpAwarded} XP`, {
              description: milestone.message,
              duration: 5000,
            });
          }
        });
      }

      // Show streak bonus notification
      if (result.streakBonusAwarded && result.streakBonusMessage) {
        toast.success(`🔥 +${result.streakBonusAwarded} XP`, {
          description: result.streakBonusMessage,
          duration: 5000,
        });
      }

      // Show streak update (without bonus)
      if (
        result.currentStreak &&
        result.currentStreak > 0 &&
        !result.streakBonusAwarded
      ) {
        toast.success(`🔥 ${result.currentStreak} өдөр стрик!`, {
          description: "Ингээд үргэлжлээрэй!",
          duration: 3000,
        });
      }

      // Refresh router to update sidebar checkmark
      // Small delay to ensure revalidatePath completes
      setTimeout(() => router.refresh(), 100);
    } else {
      toast.error("Алдаа гарлаа", {
        description: "Тестийн үр дүнг хадгалж чадсангүй",
      });
    }
  }, [quizData, userAnswers, score, lessonId, courseId, router]);

  const handleSubmit = useCallback(() => {
    if (!quizData) return;
    const question = quizData.questions[currentQuestion];
    const isCorrect = selectedAnswer === question?.correctAnswer;

    if (selectedAnswer !== null) {
      setShowExplanation(true);
      // Save the user's answer
      setUserAnswers((prev) => ({ ...prev, [currentQuestion]: selectedAnswer }));
      if (isCorrect) {
        setScore((prev) => prev + 1);
      }
    }
  }, [quizData, currentQuestion, selectedAnswer]);

  const handleNext = useCallback(async () => {
    if (!quizData) return;

    if (currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      // Quiz finished - save attempt to database
      setIsSubmitting(true);
      try {
        await saveQuizAttemptToDatabase();
        setCurrentQuestion(-1);
      } finally {
        setIsSubmitting(false);
      }
    }
  }, [quizData, currentQuestion, saveQuizAttemptToDatabase]);

  const handlePrevious = useCallback(() => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  }, [currentQuestion]);

  const handleRetry = useCallback(() => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setUserAnswers({});
    setXpAwarded(0);
    setIsSubmitting(false);
  }, []);

  // If no quiz data, show error message (after hooks)
  if (!quizData || quizData.questions.length === 0) {
    return (
      <div className="bg-white rounded-lg border overflow-hidden mb-6">
        <div className="p-8 text-center">
          <p className="text-lg text-muted-foreground mb-4">
            Асуулт байхгүй байна
          </p>
          <p className="text-sm text-muted-foreground">
            Энэ хичээлийн асуултууд хараахан үүсээгүй байна.
          </p>
        </div>
      </div>
    );
  }

  const question = quizData.questions[currentQuestion];

  const isFirstQuestion = currentQuestion === 0;
  const isLastQuestion = currentQuestion === quizData.questions.length - 1;

  return (
    <div className="bg-white rounded-xl border overflow-hidden">
      {currentQuestion === -1 ? (
        <>
          <QuizResults
            score={score}
            totalQuestions={quizData.questions.length}
            xpAwarded={xpAwarded}
          />
          {/* Results Navigation */}
          <div className="px-4 md:px-6 pb-4 md:pb-6 pt-2 flex items-center justify-center border-t bg-gray-50">
            <Button variant="outline" onClick={handleRetry}>
              Дахин турших
            </Button>
          </div>
        </>
      ) : (
        <div className="p-4 md:p-6">
          <div className="mb-4 md:mb-6">
            <h2 className="text-xl md:text-2xl font-bold mb-2">{title}</h2>
            <p className="text-muted-foreground">
              Энэ тестээр мэдлэгээ шалгаарай
            </p>
          </div>

          <QuizProgress
            currentQuestion={currentQuestion}
            totalQuestions={quizData.totalQuestions}
          />

          <QuizQuestion
            question={question.question}
            options={question.options}
            selectedAnswer={selectedAnswer}
            correctAnswer={question.correctAnswer}
            showExplanation={showExplanation}
            explanation={question.explanation}
            onAnswerSelect={setSelectedAnswer}
            questionId={question.id}
          />

          {/* Quiz Navigation - Inside the card */}
          <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={isFirstQuestion || showExplanation}
            >
              Өмнөх
            </Button>

            <span className="text-sm font-medium text-muted-foreground">
              {currentQuestion + 1} / {quizData.questions.length}
            </span>

            {!showExplanation ? (
              <Button
                onClick={handleSubmit}
                disabled={selectedAnswer === null}
                className="bg-[#606099] hover:bg-[#505085]"
              >
                Хариу илгээх
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={isSubmitting}
                className="bg-[#606099] hover:bg-[#505085]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Хадгалж байна...
                  </>
                ) : isLastQuestion ? (
                  "Үр дүнг харах"
                ) : (
                  "Дараагийн асуулт"
                )}
              </Button>
            )}
          </div>

          {/* Explanation - Below navigation */}
          {showExplanation && (
            <div
              className={`p-3 md:p-4 rounded-lg mt-4 md:mt-6 ${
                selectedAnswer === question.correctAnswer
                  ? "bg-green-50 border border-green-200"
                  : "bg-red-50 border border-red-200"
              }`}
            >
              <div className="flex items-start gap-3">
                {selectedAnswer === question.correctAnswer ? (
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <p
                    className={`font-semibold mb-1 ${
                      selectedAnswer === question.correctAnswer
                        ? "text-green-900"
                        : "text-red-900"
                    }`}
                  >
                    {selectedAnswer === question.correctAnswer
                      ? "Зөв байна!"
                      : "Буруу байна"}
                  </p>
                  <p
                    className={`text-sm ${
                      selectedAnswer === question.correctAnswer
                        ? "text-green-700"
                        : "text-red-700"
                    }`}
                  >
                    {question.explanation}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
