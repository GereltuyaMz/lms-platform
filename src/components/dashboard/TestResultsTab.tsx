"use client";

import Link from "next/link";
import { FileBarChart, Trophy, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormattedDate } from "./FormattedDate";

type TestAttempt = {
  id: string;
  mock_test_id: string;
  test_title: string;
  test_category: string | null;
  total_score: number | null;
  total_questions: number | null;
  percentage: number | null;
  xp_awarded: number;
  completed_at: string;
  eysh_converted_score: number | null;
};

type TestResultsTabProps = {
  attempts: TestAttempt[];
};

export const TestResultsTab = ({ attempts }: TestResultsTabProps) => {
  if (attempts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <FileBarChart className="w-16 h-16 text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Танд одоогоор тестийн үр дүн байхгүй байна
        </h3>
        <p className="text-gray-600 mb-6">
          ЭЕШ-ийн сорилго өгч эхэлбэл үр дүн энд харагдана.
        </p>
        <Button asChild>
          <Link href="/mock-test">Сорилго өгөх</Link>
        </Button>
      </div>
    );
  }

  // Group attempts by test
  const groupedAttempts = attempts.reduce(
    (acc, attempt) => {
      if (!acc[attempt.mock_test_id]) {
        acc[attempt.mock_test_id] = {
          test_title: attempt.test_title,
          test_category: attempt.test_category || "Бусад",
          mock_test_id: attempt.mock_test_id,
          attempts: [],
        };
      }
      acc[attempt.mock_test_id].attempts.push(attempt);
      return acc;
    },
    {} as Record<
      string,
      {
        test_title: string;
        test_category: string;
        mock_test_id: string;
        attempts: TestAttempt[];
      }
    >
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl md:text-3xl font-bold mb-6">Тестийн үр дүн</h2>

      {Object.values(groupedAttempts).map((group) => {
        const bestAttempt = group.attempts.reduce((best, current) =>
          (current.percentage ?? 0) > (best.percentage ?? 0) ? current : best
        );

        return (
          <Card key={group.mock_test_id} className="overflow-hidden">
            <CardContent className="p-6">
              {/* Test Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {group.test_title}
                  </h3>
                  <p className="text-sm text-gray-600 capitalize">
                    {group.test_category}
                  </p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-green-100 rounded-full">
                  <Trophy className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-bold text-green-700">
                    {Math.round(bestAttempt.percentage ?? 0)}%
                  </span>
                </div>
              </div>

              {/* Attempts List */}
              <div className="space-y-3">
                <p className="text-sm font-semibold text-gray-700">
                  Оролдлогууд ({group.attempts.length}):
                </p>
                {group.attempts.map((attempt) => (
                  <Link
                    key={attempt.id}
                    href={`/mock-test/results/${attempt.id}`}
                    className="block"
                  >
                    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            <FormattedDate date={attempt.completed_at} />
                          </p>
                          <p className="text-xs text-gray-600">
                            {attempt.total_score}/100 оноо
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`text-sm font-bold ${
                            (attempt.percentage ?? 0) >= 80
                              ? "text-green-600"
                              : (attempt.percentage ?? 0) >= 60
                                ? "text-yellow-600"
                                : "text-red-600"
                          }`}
                        >
                          {Math.round(attempt.percentage ?? 0)}%
                        </span>
                        <span className="text-gray-400">→</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
