"use client";

import { CheckCircleIcon, XCircleIcon, TrophyIcon, LightbulbIcon, ChartBarIcon, InfoIcon } from "@phosphor-icons/react";

type QuizResultsProps = {
  score: number;
  totalQuestions: number;
  xpAwarded: number;
  passed: boolean;
};

export const QuizResults = ({
  score,
  totalQuestions,
  xpAwarded,
  passed,
}: QuizResultsProps) => {
  const scorePercentage = Math.round((score / totalQuestions) * 100);

  return (
    <div className="p-8 md:p-12 bg-white">
      <div className="text-center max-w-xl mx-auto">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full mb-6" style={{ backgroundColor: passed ? '#E8F5E9' : '#FFF3E0' }}>
          {passed ? (
            <CheckCircleIcon size={48} weight="fill" className="text-green-600 md:w-14 md:h-14" />
          ) : (
            <XCircleIcon size={48} weight="fill" className="text-orange-600 md:w-14 md:h-14" />
          )}
        </div>

        {/* Title */}
        <h3 className={`text-2xl md:text-3xl font-bold mb-2 ${passed ? 'text-green-700' : 'text-orange-700'}`}>
          {passed ? "Амжилттай давлаа!" : "Дахин оролдоорой"}
        </h3>

        {/* Score Display */}
        <div className="inline-flex items-center gap-3 mb-6 px-6 py-3 rounded-xl bg-gray-50 border">
          <ChartBarIcon size={24} className="text-gray-600" />
          <div className="text-left">
            <p className="text-xs font-medium text-gray-600">Таны үр дүн</p>
            <p className="text-2xl font-bold text-gray-900">
              {score}<span className="text-gray-400 text-lg">/{totalQuestions}</span>
              <span className={`ml-2 text-xl ${passed ? 'text-green-600' : 'text-orange-600'}`}>
                ({scorePercentage}%)
              </span>
            </p>
          </div>
        </div>

        {/* XP Award */}
        {xpAwarded > 0 && (
          <div className="mb-6">
            <div className="inline-flex items-center gap-3 px-6 py-4 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 shadow-lg">
              <TrophyIcon size={32} weight="fill" className="text-white" />
              <div className="text-left">
                <p className="text-xs font-semibold text-amber-900">XP шагнал</p>
                <p className="text-3xl font-black text-white">+{xpAwarded}</p>
              </div>
            </div>
          </div>
        )}

        {/* Info Messages */}
        <div className="space-y-3 max-w-md mx-auto">
          {/* No XP message for passed but repeated attempt */}
          {passed && xpAwarded === 0 && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 border border-blue-200 text-left">
              <InfoIcon size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="font-semibold mb-1">Тестийг давсан!</p>
                <p>
                  Энэ нь давтан оролдлого тул XP олгогдохгүй. XP зөвхөн анхны амжилттай оролдлогод олгогдоно.
                </p>
              </div>
            </div>
          )}

          {/* Failed message */}
          {!passed && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-orange-50 border border-orange-200 text-left">
              <LightbulbIcon size={20} className="text-orange-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-orange-900">
                <p className="font-semibold mb-1">Бага зэрэг дутуу байна</p>
                <p>
                  Тестийг давахын тулд 80%-иас дээш үнэлгээ шаардлагатай. Дахин оролдож, XP цуглуулаарай!
                </p>
              </div>
            </div>
          )}

          {/* General info */}
          <div className="pt-2 space-y-2 text-sm text-gray-600">
            <div className="flex items-center justify-center gap-2">
              <ChartBarIcon size={16} />
              <span>Давах босго: 80%</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <TrophyIcon size={16} />
              <span>XP зөвхөн анхны амжилттай оролдлогод олгогдоно</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
