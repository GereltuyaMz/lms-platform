import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { BadgeWithProgress } from "@/lib/actions/badges";
import { cn } from "@/lib/utils";

type AchievementsTabProps = {
  achievements: BadgeWithProgress[];
};

const rarityColorMap: Record<
  "bronze" | "silver" | "gold" | "platinum",
  "amber" | "gray" | "yellow" | "purple"
> = {
  bronze: "amber",
  silver: "gray",
  gold: "yellow",
  platinum: "purple",
};

const colorClasses: Record<
  "amber" | "gray" | "yellow" | "purple",
  { bg: string; text: string; progressBg: string }
> = {
  amber: {
    bg: "bg-amber-100",
    text: "text-amber-700",
    progressBg: "bg-amber-500",
  },
  gray: {
    bg: "bg-gray-100",
    text: "text-gray-700",
    progressBg: "bg-gray-500",
  },
  yellow: {
    bg: "bg-yellow-100",
    text: "text-yellow-700",
    progressBg: "bg-yellow-500",
  },
  purple: {
    bg: "bg-purple-100",
    text: "text-purple-700",
    progressBg: "bg-purple-500",
  },
};

export const AchievementsTab = ({ achievements }: AchievementsTabProps) => {
  if (achievements.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Одоогоор амжилт байхгүй байна</p>
        <p className="text-sm text-muted-foreground mt-2">
          Хичээл ба тест бөглөж амжилт нээцгээнэ үү
        </p>
      </div>
    );
  }

  // Separate unlocked and locked achievements
  const unlockedAchievements = achievements.filter((a) => a.is_unlocked);
  const lockedAchievements = achievements.filter((a) => !a.is_unlocked);

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold mb-6">Миний амжилтууд</h2>

      {/* Unlocked Achievements */}
      {unlockedAchievements.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Нээгдсэн</h3>
          <div className="grid grid-cols-1 gap-4">
            {unlockedAchievements.map((achievement) => {
              const color = rarityColorMap[achievement.rarity];
              return (
                <Card
                  key={achievement.id}
                  className="border-2 border-emerald-200 bg-emerald-50/30"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className="relative">
                        <div
                          className={cn(
                            "w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0",
                            colorClasses[color].bg
                          )}
                        >
                          <span className="text-3xl">{achievement.icon}</span>
                        </div>
                        {/* <div
                          className={cn(
                            "absolute -top-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold uppercase",
                            colorClasses[color].bg,
                            colorClasses[color].text
                          )}
                        >
                          {achievement.rarity.substring(0, 1)}
                        </div> */}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-lg font-bold mb-1">
                          {achievement.name_mn}
                        </h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          {achievement.description_mn}
                        </p>

                        {/* Progress Bar - Full */}
                        <div className="relative">
                          <Progress value={100} className="h-2" />
                          <p className="text-xs text-emerald-600 font-semibold mt-1">
                            ✓ Дууссан{" "}
                            {achievement.unlocked_at &&
                              `- ${new Date(
                                achievement.unlocked_at
                              ).toLocaleDateString("mn-MN")}`}
                          </p>
                        </div>
                      </div>

                      {/* XP Badge */}
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-xs text-muted-foreground">
                          XP шагнал
                        </span>
                        <span className="font-bold text-amber-600">
                          +{achievement.xp_bonus}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Locked Achievements */}
      {lockedAchievements.length > 0 && (
        <div>
          <div className="grid grid-cols-1 gap-4">
            {lockedAchievements.map((achievement) => {
              const color = rarityColorMap[achievement.rarity];
              const hasProgress = achievement.progress_percentage > 0;

              return (
                <Card
                  key={achievement.id}
                  className="opacity-75 hover:opacity-100 transition-opacity"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Icon - Grayscale when locked */}
                      <div className="relative">
                        <div
                          className={cn(
                            "w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0",
                            hasProgress ? colorClasses[color].bg : "bg-gray-200"
                          )}
                        >
                          <span
                            className={cn(
                              "text-3xl",
                              !hasProgress && "grayscale opacity-50"
                            )}
                          >
                            {achievement.icon}
                          </span>
                        </div>
                        {/* <div
                          className={cn(
                            "absolute -top-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold uppercase",
                            hasProgress
                              ? `${colorClasses[color].bg} ${colorClasses[color].text}`
                              : "bg-gray-300 text-gray-600"
                          )}
                        >
                          {achievement.rarity.substring(0, 1)}
                        </div> */}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-lg font-bold mb-1">
                          {achievement.name_mn}
                        </h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          {achievement.description_mn}
                        </p>

                        {/* Progress Bar */}
                        <div className="relative">
                          <Progress
                            value={achievement.progress_percentage}
                            className="h-2"
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            {achievement.progress_current} /{" "}
                            {achievement.progress_target} (
                            {achievement.progress_percentage}%)
                          </p>
                        </div>
                      </div>

                      {/* XP Badge */}
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-xs text-muted-foreground">
                          XP шагнал
                        </span>
                        <span className="font-bold text-gray-500">
                          +{achievement.xp_bonus}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
