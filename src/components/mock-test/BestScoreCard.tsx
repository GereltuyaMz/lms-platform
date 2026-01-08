import { Trophy } from "lucide-react";
import type { BestAttemptData } from "@/types/mock-test";

type BestScoreCardProps = {
  bestAttempt: BestAttemptData;
};

export const BestScoreCard = ({ bestAttempt }: BestScoreCardProps) => {
  if (!bestAttempt) return null;

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
      <div className="flex items-start gap-3">
        <Trophy className="w-6 h-6 text-green-600 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-bold text-green-900 mb-2">
            Таны хамгийн сайн үр дүн
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-green-700">Авсан оноо</p>
              <p className="text-2xl font-bold text-green-900">
                {bestAttempt?.total_score}/100
              </p>
            </div>
            <div>
              <p className="text-sm text-green-700">XP</p>
              <p className="text-2xl font-bold text-green-900">
                {bestAttempt?.xp_awarded}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
