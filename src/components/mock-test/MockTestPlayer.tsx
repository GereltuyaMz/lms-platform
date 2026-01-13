"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { MockTest, UserAnswers } from "@/types/mock-test";
import { MockTestTimer } from "./MockTestTimer";
import { MockTestSectionNav } from "./MockTestSectionNav";
import { MockTestProgress } from "./MockTestProgress";
import { MockTestProblemGroup } from "./MockTestProblemGroup";
import { Button } from "@/components/ui/button";
import { submitMockTestWithAnswers, saveMockTestAnswer } from "@/lib/actions";
import { AlertCircle } from "lucide-react";

type MockTestPlayerProps = {
  testData: MockTest;
  attemptId: string;
  endTime: string;
  savedAnswers?: UserAnswers;
};

export const MockTestPlayer = ({
  testData,
  attemptId,
  endTime,
  savedAnswers = {},
}: MockTestPlayerProps) => {
  const router = useRouter();
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswers>(savedAnswers);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  // Restore answers from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(`mock_test_answers_${attemptId}`);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUserAnswers((prev) => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error("Failed to restore from localStorage:", error);
      }
    }
  }, [attemptId]);

  // Count total answered questions
  const answeredCount = Object.keys(userAnswers).length;
  const totalQuestions = testData.total_questions;

  // Handle answer selection
  const handleAnswerSelect = useCallback(
    (questionId: string, optionId: string) => {
      setUserAnswers((prev) => {
        const newAnswers = {
          ...prev,
          [questionId]: optionId,
        };

        // Sync to localStorage
        try {
          localStorage.setItem(
            `mock_test_answers_${attemptId}`,
            JSON.stringify(newAnswers)
          );
        } catch (error) {
          console.error("Failed to save to localStorage:", error);
          toast.error("Хариулт хадгалагдсангүй");
        }

        return newAnswers;
      });

      // Save to database in real-time (don't await to avoid blocking UI)
      saveMockTestAnswer(attemptId, questionId, optionId).catch((error) => {
        console.error("Failed to save answer to database:", error);
        // Don't show error to user - localStorage is backup
      });
    },
    [attemptId]
  );

  // Handle submit
  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      // Submit with answers payload
      const result = await submitMockTestWithAnswers(attemptId, userAnswers);

      if (result.success && result.data) {
        // Clear localStorage on success
        localStorage.removeItem(`mock_test_answers_${attemptId}`);

        // Show success toast with XP
        const xpText =
          result.data.xpAwarded > 0 ? ` • +${result.data.xpAwarded} XP` : "";

        toast.success("Амжилттай илгээлээ!", {
          description: `Та ${result.data.total_score}/100 оноо авлаа${xpText}`,
        });

        // Redirect to results page
        router.push(`/mock-test/results/${attemptId}`);
      } else {
        console.error("Submission failed:", result.message);
        toast.error(result.message || "Тест илгээж чадсангүй");

        // If already submitted, redirect anyway
        if (result.message?.includes("already submitted")) {
          router.push(`/mock-test/results/${attemptId}`);
        }
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Тест илгээхэд алдаа гарлаа");
    } finally {
      setIsSubmitting(false);
      setShowSubmitConfirm(false);
    }
  }, [attemptId, userAnswers, isSubmitting, router]);

  // Handle timer expiration (auto-submit)
  const handleTimeExpired = useCallback(() => {
    toast.warning("Цаг дууслаа!", {
      description: "Тест автоматаар илгээгдэж байна...",
    });
    handleSubmit();
  }, [handleSubmit]);

  const currentSection = testData.sections[currentSectionIndex];

  return (
    <div className="min-h-screen bg-gray-50 pb-32 md:pb-24">
      {/* Unified Sticky Header with Title and Section Navigation */}
      <MockTestSectionNav
        sections={testData.sections}
        currentSectionIndex={currentSectionIndex}
        onSectionChange={setCurrentSectionIndex}
        userAnswers={userAnswers}
        testTitle={testData.title}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Section Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {currentSection.title}
          </h2>
          <p className="text-gray-600 mt-1">
            {currentSection.problems.length} асуулт
          </p>
        </div>

        {/* Problems */}
        <div className="space-y-6">
          {currentSection.problems.map((problem) => (
            <MockTestProblemGroup
              key={problem.id}
              problem={problem}
              userAnswers={userAnswers}
              onAnswerSelect={handleAnswerSelect}
            />
          ))}
        </div>
      </div>

      {/* Fixed Bottom Navigation - Always visible */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3">
          {/* Progress Bar */}
          <div className="mb-3">
            <MockTestProgress
              answeredCount={answeredCount}
              totalQuestions={totalQuestions}
            />
          </div>

          {/* Timer and Submit Button */}
          <div className="flex items-center justify-between gap-4">
            <MockTestTimer
              endTime={endTime}
              onTimeExpired={handleTimeExpired}
            />
            <Button
              variant="landing"
              onClick={() => setShowSubmitConfirm(true)}
              size="lg"
              disabled={isSubmitting}
            >
              Илгээх
            </Button>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Dialog */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-start gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-lg mb-2">Тест илгээх үү?</h3>
                <p className="text-gray-600 text-sm mb-2">
                  Та {answeredCount}/{totalQuestions} асуултанд хариулсан байна.
                </p>
                {answeredCount < totalQuestions && (
                  <p className="text-yellow-600 text-sm font-medium">
                    Та бүх асуултанд хариулаагүй байна!
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="landingOutline"
                onClick={() => setShowSubmitConfirm(false)}
                className="flex-1"
              >
                Үргэлжлүүлэх
              </Button>
              <Button
                variant="landing"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? "Илгээж байна..." : "Илгээх"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
