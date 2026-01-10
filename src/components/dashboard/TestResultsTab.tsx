"use client";

import Link from "next/link";
import {
  TrophyIcon,
  CalendarBlankIcon,
  CaretRightIcon,
  ChartBarIcon,
} from "@phosphor-icons/react/dist/ssr";
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
};

type TestResultsTabProps = {
  attempts: TestAttempt[];
};

export const TestResultsTab = ({ attempts }: TestResultsTabProps) => {
  if (attempts.length === 0) {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-4">Тестийн үр дүн</h2>
        <div className="flex flex-col items-center justify-center py-12 text-center bg-white rounded-2xl border">
          <ChartBarIcon size={64} className="text-gray-400 mb-4" />
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
    <div>
      <h2 className="text-xl font-semibold mb-4">Тестийн үр дүн</h2>

      <div className="space-y-6">
        {Object.values(groupedAttempts).map((group) => {
          const bestAttempt = group.attempts.reduce((best, current) =>
            (current.percentage ?? 0) > (best.percentage ?? 0) ? current : best
          );

          return (
            <div
              key={group.mock_test_id}
              className="bg-white rounded-2xl border p-4 sm:p-6"
            >
              {/* Header: Category + Title + Trophy Badge */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">
                    {group.test_category}
                  </p>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {group.test_title}
                  </h3>
                </div>
                <div
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                  style={{ backgroundColor: "#E2E0F9" }}
                >
                  <TrophyIcon size={16} className="text-[#4F378B]" />
                  <span className="text-sm font-semibold text-[#4F378B]">
                    {Math.round(bestAttempt.percentage ?? 0)}%
                  </span>
                </div>
              </div>

              {/* Attempts Label with Count Badge */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-semibold text-gray-700">
                  Оролдлогууд
                </span>
                <span className="bg-gray-900 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                  {group.attempts.length}
                </span>
              </div>

              {/* Attempts List */}
              <div className="space-y-2">
                {group.attempts.map((attempt) => (
                  <Link
                    key={attempt.id}
                    href={`/mock-test/results/${attempt.id}`}
                    className="block"
                  >
                    <div className="flex items-center justify-between p-3 border rounded-xl hover:bg-gray-50 transition-colors gap-2">
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        <CalendarBlankIcon
                          size={18}
                          className="text-gray-400 flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            <FormattedDate date={attempt.completed_at} />
                          </p>
                          <p className="text-xs text-gray-500">
                            {attempt.total_score ?? 0}/100 оноо
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span
                          className={`text-sm font-semibold ${
                            (attempt.percentage ?? 0) >= 80
                              ? "text-green-600"
                              : (attempt.percentage ?? 0) >= 60
                              ? "text-yellow-600"
                              : "text-red-500"
                          }`}
                        >
                          {Math.round(attempt.percentage ?? 0)}%
                        </span>
                        <CaretRightIcon size={16} className="text-gray-400" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
