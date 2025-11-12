"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { QuizProgress } from "./QuizProgress";
import { QuizQuestion } from "./QuizQuestion";
import { QuizResults } from "./QuizResults";
import { saveQuizAttempt } from "@/lib/actions/quiz-attempt";
import { awardQuizCompletionXP } from "@/lib/actions/xp-actions";
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
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});

  // If no quiz data, show error message
  if (!quizData || quizData.questions.length === 0) {
    return (
      <div className="bg-white rounded-lg border overflow-hidden mb-6">
        <div className="p-8 text-center">
          <p className="text-lg text-muted-foreground mb-4">
            No quiz questions available
          </p>
          <p className="text-sm text-muted-foreground">
            Quiz questions have not been created for this lesson yet.
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
      await saveQuizAttemptToDatabase();
      setCurrentQuestion(-1);
    }
  };

  const saveQuizAttemptToDatabase = async () => {
    if (!quizData) return;

    // Calculate total points earned
    const pointsEarned = quizData.questions.reduce((total, question, index) => {
      const userAnswer = userAnswers[index];
      const isCorrect = userAnswer === question.correctAnswer;
      return total + (isCorrect ? (question.points || 10) : 0);
    }, 0);

    // Prepare answers array (we don't have option IDs in the current structure)
    // For now, we'll skip saving individual answers
    const answers: any[] = [];

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
        scorePercentage
      );

      if (xpResult.success && xpResult.xpAwarded) {
        toast.success(`🎉 +${xpResult.xpAwarded} XP`, {
          description: `Quiz completed with ${Math.round(scorePercentage)}%!`,
        });
      }
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
  };

  return (
    <div className="bg-white rounded-lg border overflow-hidden mb-6">
      {currentQuestion === -1 ? (
        <QuizResults
          score={score}
          totalQuestions={quizData.questions.length}
          onRetry={handleRetry}
        />
      ) : (
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">{title}</h2>
            <p className="text-muted-foreground">
              Test your knowledge with this practice quiz
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
              Previous
            </Button>

            {!showExplanation ? (
              <Button onClick={handleSubmit} disabled={selectedAnswer === null}>
                Submit Answer
              </Button>
            ) : (
              <Button onClick={handleNext}>
                {currentQuestion < quizData.questions.length - 1
                  ? "Next Question"
                  : "See Results"}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
