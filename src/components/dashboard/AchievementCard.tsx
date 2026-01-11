import type { BadgeWithProgress } from "@/lib/actions/badges";
import { BadgeCard } from "@/components/badges";

type AchievementCardSize = "default" | "large";

type AchievementCardProps = {
  achievement: BadgeWithProgress;
  index?: number;
  size?: AchievementCardSize;
  showBorder?: boolean;
  alwaysShowProgress?: boolean;
};

const sizeConfig = {
  default: {
    padding: "p-4",
    gap: "gap-3",
    badgeSize: "small" as const,
    titleSize: 16,
    descriptionSize: 13,
    progressHeight: "h-1.5",
    progressBg: "bg-gray-100",
  },
  large: {
    padding: "p-5",
    gap: "gap-4",
    badgeSize: "medium" as const,
    titleSize: 18,
    descriptionSize: 14,
    progressHeight: "h-2",
    progressBg: "bg-gray-200",
  },
} as const;

export const AchievementCard = ({
  achievement,
  size = "default",
  showBorder = true,
  alwaysShowProgress = false,
}: AchievementCardProps) => {
  const config = sizeConfig[size];
  const hasProgress =
    !achievement.is_unlocked && achievement.progress_percentage > 0;

  const showProgressBar = alwaysShowProgress || hasProgress;

  return (
    <div
      className={`${config.padding} flex items-center ${config.gap} ${showBorder ? "border-b border-gray-100 last:border-b-0" : ""} transition-colors hover:bg-gray-50/50`}
    >
      {/* Badge */}
      <BadgeCard badge={achievement} size={config.badgeSize} />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4
          className={`font-semibold text-gray-900 leading-tight ${!achievement.is_unlocked ? "text-gray-500" : ""}`}
          style={{ fontSize: config.titleSize }}
        >
          {achievement.name_mn}
        </h4>
        <p
          className={`text-gray-500 line-clamp-2 leading-snug mt-0.5 ${showProgressBar ? "mb-2" : ""}`}
          style={{ fontSize: config.descriptionSize }}
        >
          {achievement.description_mn}
        </p>

        {/* Progress Bar */}
        {showProgressBar && (
          <div
            className={`${config.progressHeight} ${config.progressBg} rounded-full overflow-hidden`}
          >
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${achievement.progress_percentage}%`,
                background:
                  "linear-gradient(90deg, #FFB800 0%, #FF9500 100%)",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
