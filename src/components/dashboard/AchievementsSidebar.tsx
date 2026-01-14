"use client";

import type { BadgeWithProgress } from "@/lib/actions/badges";
import { AchievementCard } from "./AchievementCard";

type AchievementsSidebarProps = {
  achievements: BadgeWithProgress[];
  onViewAll: () => void;
};

export const AchievementsSidebar = ({
  achievements,
  onViewAll,
}: AchievementsSidebarProps) => {
  if (achievements.length === 0) {
    return (
      <div style={{ width: 362 }}>
        {/* Header - Outside border */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold" style={{ fontSize: 20 }}>
            Амжилтууд
          </h3>
        </div>

        {/* Cards Container */}
        <div className="rounded-2xl border overflow-hidden">
          <p className="text-sm text-muted-foreground text-center py-8">
            Одоогоор амжилт байхгүй байна
          </p>
        </div>
      </div>
    );
  }

  // Show first 5 achievements in sidebar
  const displayedAchievements = achievements.slice(0, 5);

  return (
    <div style={{ width: 362 }}>
      {/* Header - Outside border */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold" style={{ fontSize: 20 }}>
          Амжилтууд
        </h3>
        <button
          onClick={onViewAll}
          className="text-sm text-[#415FF4] hover:text-[#3349D4] font-medium cursor-pointer"
        >
          Бүгд
        </button>
      </div>

      {/* Cards Container - With border */}
      <div className="rounded-2xl border overflow-hidden">
        {displayedAchievements.map((achievement, index) => (
          <AchievementCard
            key={achievement.id}
            achievement={achievement}
            index={index}
            size="default"
          />
        ))}
      </div>
    </div>
  );
};
