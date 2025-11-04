"use client";

import { useState } from "react";
import { X, CheckCircle, XCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

type QuizModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

// Mock quiz data
const mockQuiz = {
  title: "Practice Quiz",
  totalQuestions: 5,
  questions: [
    {
      id: 1,
      question: "What is the sum of angles in a triangle?",
      options: ["90°", "180°", "270°", "360°"],
      correctAnswer: 1,
      explanation: "The sum of all interior angles in any triangle is always 180°.",
    },
    {
      id: 2,
      question: "Which tool is used to measure angles?",
      options: ["Ruler", "Compass", "Protractor", "Set Square"],
      correctAnswer: 2,
      explanation: "A protractor is specifically designed to measure angles in degrees.",
    },
  ],
};

export const QuizModal = ({ isOpen, onClose }: QuizModalProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState(0);

  const question = mockQuiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / mockQuiz.totalQuestions) * 100;
  const isCorrect = selectedAnswer === question?.correctAnswer;

  const handleSubmit = () => {
    if (selectedAnswer !== null) {
      setShowExplanation(true);
      if (isCorrect) {
        setScore(score + 1);
      }
      setAnsweredQuestions(answeredQuestions + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < mockQuiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      // Show results
      setCurrentQuestion(-1); // Results screen
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold">
              {mockQuiz.title}
            </DialogTitle>
            <button
              onClick={onClose}
              className="rounded-full hover:bg-gray-100 p-1 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </DialogHeader>

        {/* Results Screen */}
        {currentQuestion === -1 ? (
          <div className="py-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Quiz Completed!</h3>
            <p className="text-lg text-muted-foreground mb-6">
              You scored {score} out of {mockQuiz.questions.length}
            </p>

            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-lg p-6 mb-6">
              <p className="text-amber-900 font-semibold text-lg">
                🎉 +{score * 20} XP Earned!
              </p>
            </div>

            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button
                onClick={() => {
                  setCurrentQuestion(0);
                  setScore(0);
                  setAnsweredQuestions(0);
                  setSelectedAnswer(null);
                  setShowExplanation(false);
                }}
              >
                Retry Quiz
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Progress Bar */}
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Question {currentQuestion + 1} of {mockQuiz.totalQuestions}</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} />
            </div>

            {/* Question */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">{question.question}</h3>

              <RadioGroup
                value={selectedAnswer?.toString()}
                onValueChange={(value) => setSelectedAnswer(parseInt(value))}
                disabled={showExplanation}
              >
                <div className="space-y-3">
                  {question.options.map((option, index) => (
                    <div
                      key={index}
                      className={`
                        flex items-center space-x-3 p-4 rounded-lg border-2 transition-colors
                        ${showExplanation
                          ? index === question.correctAnswer
                            ? "border-green-500 bg-green-50"
                            : index === selectedAnswer
                              ? "border-red-500 bg-red-50"
                              : "border-gray-200"
                          : selectedAnswer === index
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }
                      `}
                    >
                      <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                      <Label
                        htmlFor={`option-${index}`}
                        className="flex-1 cursor-pointer"
                      >
                        {option}
                      </Label>
                      {showExplanation && index === question.correctAnswer && (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )}
                      {showExplanation && index === selectedAnswer && index !== question.correctAnswer && (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            {/* Explanation */}
            {showExplanation && (
              <div
                className={`p-4 rounded-lg mb-6 ${
                  isCorrect ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
                }`}
              >
                <div className="flex items-start gap-3">
                  {isCorrect ? (
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className={`font-semibold mb-1 ${isCorrect ? "text-green-900" : "text-red-900"}`}>
                      {isCorrect ? "Correct!" : "Incorrect"}
                    </p>
                    <p className={`text-sm ${isCorrect ? "text-green-700" : "text-red-700"}`}>
                      {question.explanation}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center pt-4 border-t">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
              >
                Previous
              </Button>

              {!showExplanation ? (
                <Button
                  onClick={handleSubmit}
                  disabled={selectedAnswer === null}
                >
                  Submit Answer
                </Button>
              ) : (
                <Button onClick={handleNext}>
                  {currentQuestion < mockQuiz.questions.length - 1 ? "Next Question" : "See Results"}
                </Button>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
