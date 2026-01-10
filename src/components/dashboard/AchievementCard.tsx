import type { BadgeWithProgress } from "@/lib/actions/badges";

type AchievementCardSize = "default" | "large";

type AchievementCardProps = {
  achievement: BadgeWithProgress;
  index: number;
  size?: AchievementCardSize;
  showBorder?: boolean;
  alwaysShowProgress?: boolean;
};

// Alternating background colors for badge icons
const badgeColors = ["#FFD93D", "#C4A7E7"] as const;

const sizeConfig = {
  default: {
    padding: "p-4",
    gap: "gap-3",
    badgeSize: "w-14 h-14",
    iconSize: "text-2xl",
    titleSize: 18,
    descriptionSize: 14,
    progressHeight: "h-1.5",
    progressBg: "bg-gray-100",
  },
  large: {
    padding: "p-5",
    gap: "gap-4",
    badgeSize: "w-16 h-16",
    iconSize: "text-3xl",
    titleSize: 18,
    descriptionSize: 14,
    progressHeight: "h-2",
    progressBg: "bg-gray-200",
  },
} as const;

export const AchievementCard = ({
  achievement,
  index,
  size = "default",
  showBorder = true,
  alwaysShowProgress = false,
}: AchievementCardProps) => {
  const badgeColor = badgeColors[index % 2];
  const config = sizeConfig[size];
  const hasProgress =
    !achievement.is_unlocked && achievement.progress_percentage > 0;

  // Show progress bar based on prop or if achievement has progress
  const showProgressBar = alwaysShowProgress || hasProgress;

  return (
    <div
      className={`${config.padding} flex items-start ${config.gap} ${showBorder ? "border-b last:border-b-0" : ""}`}
    >
      {/* Badge Icon */}
      <div
        className={`${config.badgeSize} flex-shrink-0 rounded-xl flex items-center justify-center shadow-sm`}
        style={{ backgroundColor: badgeColor }}
      >
        <span className={config.iconSize}>{achievement.icon}</span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4
          className="font-semibold text-gray-900"
          style={{ fontSize: config.titleSize }}
        >
          {achievement.name_mn}
        </h4>
        <p
          className={`text-gray-600 line-clamp-2 ${showProgressBar ? "mb-2" : ""}`}
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
};
