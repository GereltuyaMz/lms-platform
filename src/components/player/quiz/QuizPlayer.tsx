"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuizProgress } from "./QuizProgress";
import { QuizQuestion } from "./QuizQuestion";
import { QuizResults } from "./QuizResults";
import { saveQuizAttempt, awardQuizCompletionXP } from "@/lib/actions";
import { toast } from "sonner";

type QuizQuestionData = {
  id: string | number;
  question: string;
  options: string[];
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

  // If no quiz data, show error message
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
  const isCorrect = selectedAnswer === question?.correctAnswer;

  const handleSubmit = () => {
    if (selectedAnswer !== null) {
      setShowExplanation(true);
      // Save the user's answer
      setUserAnswers({ ...userAnswers, [currentQuestion]: selectedAnswer });
      if (isCorrect) {
        setScore(score + 1);
      }
    }
  };

  const handleNext = async () => {
    if (currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
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
  };

  const saveQuizAttemptToDatabase = async () => {
    if (!quizData) return;

    // Calculate total points earned
    const pointsEarned = quizData.questions.reduce((total, question, index) => {
      const userAnswer = userAnswers[index];
      const isCorrect = userAnswer === question.correctAnswer;
      return total + (isCorrect ? question.points || 10 : 0);
    }, 0);

    // Prepare answers array (empty for now - quiz structure doesn't have option IDs yet)
    const answers: Array<{
      questionId: string;
      selectedOptionId: string;
      isCorrect: boolean;
      pointsEarned: number;
    }> = [];

    const result = await saveQuizAttempt(
      lessonId,
      courseId,
      score,
      quizData.questions.length,
      pointsEarned,
      answers
    );

    // Award XP if quiz attempt saved successfully
    if (result.success && result.attemptId) {
      const scorePercentage = (score / quizData.questions.length) * 100;

      const xpResult = await awardQuizCompletionXP(
        result.attemptId,
        lessonId,
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
      router.refresh();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const handleRetry = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setUserAnswers({});
    setXpAwarded(0);
    setIsSubmitting(false);
  };

  return (
    <div className="bg-white rounded-lg border overflow-hidden mb-6">
      {currentQuestion === -1 ? (
        <QuizResults
          score={score}
          totalQuestions={quizData.questions.length}
          xpAwarded={xpAwarded}
          onRetry={handleRetry}
        />
      ) : (
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">{title}</h2>
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

          <div className="flex justify-between items-center pt-4 border-t">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
            >
              Өмнөх
            </Button>

            {!showExplanation ? (
              <Button onClick={handleSubmit} disabled={selectedAnswer === null}>
                Хариу илгээх
              </Button>
            ) : (
              <Button onClick={handleNext} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Хадгалж байна...
                  </>
                ) : currentQuestion < quizData.questions.length - 1 ? (
                  "Дараагийн асуулт"
                ) : (
                  "Үр дүнг харах"
                )}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
