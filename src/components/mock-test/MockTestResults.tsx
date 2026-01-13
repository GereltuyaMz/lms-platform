"use client";

import { useState } from "react";
import { CheckCircle, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DetailedResultsData } from "@/types/mock-test";
import { MockTestDetailedResults } from "./MockTestDetailedResults";

type MockTestResultsProps = {
  totalScore: number;
  totalQuestions: number;
  percentage: number;
  xpAwarded: number;
  detailedResults?: DetailedResultsData;
  onRetry?: () => void;
};

export const MockTestResults = ({
  totalScore,
  totalQuestions,
  percentage,
  xpAwarded,
  detailedResults,
  onRetry,
}: MockTestResultsProps) => {
  const isPassed = percentage >= 60;
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="bg-white rounded-lg border overflow-hidden">
      {/* Header */}
      <div
        className={`p-6 text-center ${
          isPassed
            ? "bg-gradient-to-r from-green-500 to-emerald-600"
            : "bg-gradient-to-r from-gray-400 to-gray-500"
        } text-white`}
      >
        <div className="flex justify-center mb-3">
          {isPassed ? (
            <CheckCircle className="w-16 h-16" />
          ) : (
            <Trophy className="w-16 h-16 opacity-50" />
          )}
        </div>
        <h2 className="text-2xl md:text-3xl font-bold mb-2">
          {isPassed ? "Баяр хүргэе!" : "Дахин оролдоорой"}
        </h2>
        <p className="text-lg opacity-90">
          {isPassed
            ? "Та тестээ амжилттай давлаа!"
            : "Та 60%-иас доогуур үнэлгээ авлаа"}
        </p>
      </div>

      {/* Score Details */}
      <div className="p-6 space-y-6">
        {/* Total Score */}
        <div className="text-center flex flex-col gap-4">
          <p className="text-sm text-gray-600 mb-2">Нийт оноо</p>
          <div className="text-5xl md:text-6xl font-bold text-gray-900 mb-2">
            {totalScore}/100
          </div>

          {/* XP Badge */}
          {xpAwarded > 0 && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full text-white font-bold">
              <Trophy className="w-5 h-5" />
              <span>+{xpAwarded} XP</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          {onRetry && (
            <Button
              onClick={onRetry}
              variant="landingOutline"
              size="lg"
              className="flex-1"
            >
              Дахин турших
            </Button>
          )}
          {detailedResults && (
            <Button
              variant="landing"
              onClick={() => setShowDetails(!showDetails)}
              size="lg"
              className="flex-1"
            >
              {showDetails ? "Хураангуй харах" : "Дэлгэрэнгүй харах"}
            </Button>
          )}
        </div>
      </div>

      {/* Detailed Results View */}
      {showDetails && detailedResults && (
        <div className="px-6 pb-6">
          <MockTestDetailedResults
            problems={detailedResults.problems}
            answers={detailedResults.answers}
          />
        </div>
      )}
    </div>
  );
};
