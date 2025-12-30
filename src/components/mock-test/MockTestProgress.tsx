"use client";

import { Progress } from "@/components/ui/progress";

type MockTestProgressProps = {
  answeredCount: number;
  totalQuestions: number;
};

export const MockTestProgress = ({
  answeredCount,
  totalQuestions,
}: MockTestProgressProps) => {
  const percentage = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-gray-700">Хариулсан асуулт</span>
        <span className="font-bold text-gray-900">
          {answeredCount} / {totalQuestions}
        </span>
      </div>
      <Progress value={percentage} className="h-2" />
      <div className="text-xs text-gray-500 text-right">
        {Math.round(percentage)}% дууссан
      </div>
    </div>
  );
};
