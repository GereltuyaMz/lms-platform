"use client";

import type { BadgeWithProgress } from "@/lib/actions/badges";

type AchievementsSidebarProps = {
  achievements: BadgeWithProgress[];
  onViewAll: () => void;
};

// Alternating background colors for badge icons
const badgeColors = ["#FFD93D", "#C4A7E7"] as const;

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
        <div className="bg-white rounded-2xl border overflow-hidden">
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
          className="text-sm text-[#415FF4] hover:text-[#3349D4] font-medium"
        >
          Бүгд
        </button>
      </div>

      {/* Cards Container - With border */}
      <div className="bg-white rounded-2xl border overflow-hidden">
        {displayedAchievements.map((achievement, index) => {
          const badgeColor = badgeColors[index % 2];
          const hasProgress =
            !achievement.is_unlocked && achievement.progress_percentage > 0;
          const isLast = index === displayedAchievements.length - 1;

          return (
            <div
              key={achievement.id}
              className={`p-4 flex items-start gap-3 bg-white ${
                !isLast ? "border-b" : ""
              }`}
            >
              {/* Badge Icon with colored background */}
              <div
                className="w-14 h-14 flex-shrink-0 rounded-xl flex items-center justify-center shadow-sm"
                style={{ backgroundColor: badgeColor }}
              >
                <span className="text-2xl">{achievement.icon}</span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h4
                  className="font-semibold text-gray-900"
                  style={{ fontSize: 18 }}
                >
                  {achievement.name_mn}
                </h4>
                <p
                  className="text-gray-600 line-clamp-2"
                  style={{ fontSize: 14 }}
                >
                  {achievement.description_mn}
                </p>

                {/* Progress Bar - only for in-progress achievements */}
                {hasProgress && (
                  <div className=" h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${achievement.progress_percentage}%`,
                        background:
                          "linear-gradient(180deg, #FFC500 0%, #FFEBA7 50.55%, #FFC500 100%)",
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
