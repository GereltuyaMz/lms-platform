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
  eyshConvertedScore?: number | null;
};

export const MockTestResults = ({
  totalScore,
  totalQuestions,
  percentage,
  xpAwarded,
  detailedResults,
  onRetry,
  eyshConvertedScore,
}: MockTestResultsProps) => {
  const isPassed = percentage >= 60;
  const [showDetails, setShowDetails] = useState(false);

  // Helper function to get EYSH badge color based on score
  const getEyshBadgeColor = (score: number) => {
    if (score === 800) return "from-purple-500 to-indigo-600";
    if (score === 700) return "from-blue-500 to-cyan-600";
    if (score === 600) return "from-green-500 to-emerald-600";
    if (score === 500) return "from-yellow-500 to-orange-500";
    return "from-gray-400 to-gray-500";
  };

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
        {/* EYSH Converted Score */}
        {eyshConvertedScore && (
          <div className="text-center pb-6 border-b">
            <p className="text-sm text-gray-600 mb-3">ЭЕШ стандарт оноо</p>
            <div
              className={`inline-flex items-center gap-3 px-8 py-4 bg-linear-to-r ${getEyshBadgeColor(
                eyshConvertedScore
              )} rounded-2xl shadow-lg`}
            >
              <Trophy className="w-8 h-8 text-white" />
              <span className="text-5xl font-bold text-white">
                {eyshConvertedScore}+
              </span>
            </div>
          </div>
        )}

        {/* Total Score (Raw) */}
        <div className="text-center flex flex-col gap-4">
          <p className="text-sm text-gray-600 mb-2">
            {eyshConvertedScore ? "Суурь оноо" : "Нийт оноо"}
          </p>
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
              variant="outline"
              size="lg"
              className="flex-1"
            >
              Дахин турших
            </Button>
          )}
          {detailedResults && (
            <Button
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
