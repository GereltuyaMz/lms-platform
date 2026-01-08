"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ArrowLeft, RotateCcw, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { MockTestResults } from "./MockTestResults";
import { MockTestDetailedResults } from "./MockTestDetailedResults";
import type {
  MockTestAttempt,
  MockTest,
  DetailedAnswer,
  MockTestProblem,
} from "@/types/mock-test";

type MockTestResultsPageProps = {
  attempt: MockTestAttempt;
  test: MockTest;
  answers: Record<string, DetailedAnswer>;
  wasExpired?: boolean;
};

const formatMongolianDateTime = (date: Date): string => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${year} оны ${month} сарын ${day} ${hours}:${minutes}`;
};

export const MockTestResultsPage = ({
  attempt,
  test,
  answers,
  wasExpired = false,
}: MockTestResultsPageProps) => {
  const router = useRouter();
  const [formattedDate, setFormattedDate] = useState("");

  // Flatten all problems from all sections
  const allProblems: MockTestProblem[] = test.sections.flatMap(
    (section) => section.problems
  );

  // Format date on client side only to prevent hydration mismatch
  useEffect(() => {
    setFormattedDate(formatMongolianDateTime(new Date(attempt.completed_at!)));
  }, [attempt.completed_at]);

  // Show expiration notification if test was auto-completed due to time expiry
  useEffect(() => {
    if (wasExpired) {
      toast.warning("Тестийн хугацаа дууссан", {
        description:
          "Таны тестийн хугацаа дууссан тул таны хариулсан асуултууд автоматаар илгээгдсэн байна.",
        duration: 5000,
      });
    }
  }, [wasExpired]);

  const handleBackToDashboard = () => {
    router.push("/dashboard?tab=test-results");
  };

  const handleRetake = () => {
    router.push(`/mock-test/${test.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {wasExpired && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
            <Clock className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-900 mb-1">
                Тестийн хугацаа дууссан
              </h3>
              <p className="text-sm text-yellow-700">
                Таны тестийн хугацаа дууссан тул таны хариулсан асуултууд
                автоматаар илгээгдсэн байна. Та хариулаагүй асуултуудад оноо авч
                чадаагүй болно.
              </p>
            </div>
          </div>
        )}
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={handleBackToDashboard}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Хяналтын самбар руу буцах
          </Button>
        </div>

        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {test.title}
          </h1>
          <p className="text-gray-600">{formattedDate || "\u00A0"}</p>
        </div>

        {/* Results Summary */}
        <div className="mb-8">
          <MockTestResults
            totalScore={attempt.total_score!}
            totalQuestions={attempt.total_questions!}
            percentage={attempt.percentage!}
            xpAwarded={attempt.xp_awarded}
          />
        </div>

        {/* Retake Button */}
        <div className="mb-8 flex justify-center">
          <Button onClick={handleRetake} size="lg" className="gap-2">
            <RotateCcw className="w-5 h-5" />
            Дахин турших
          </Button>
        </div>

        {/* Detailed Results (Always Shown) */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Дэлгэрэнгүй үр дүн
          </h2>
          <MockTestDetailedResults problems={allProblems} answers={answers} />
        </div>
      </div>
    </div>
  );
};
