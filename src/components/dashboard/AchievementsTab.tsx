import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { MockAchievement } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type AchievementsTabProps = {
  achievements: MockAchievement[];
};

const colorClasses: Record<
  MockAchievement["color"],
  { bg: string; text: string; progressBg: string }
> = {
  red: {
    bg: "bg-red-100",
    text: "text-red-700",
    progressBg: "bg-red-500",
  },
  green: {
    bg: "bg-green-100",
    text: "text-green-700",
    progressBg: "bg-green-500",
  },
  blue: {
    bg: "bg-blue-100",
    text: "text-blue-700",
    progressBg: "bg-blue-500",
  },
  purple: {
    bg: "bg-purple-100",
    text: "text-purple-700",
    progressBg: "bg-purple-500",
  },
  amber: {
    bg: "bg-amber-100",
    text: "text-amber-700",
    progressBg: "bg-amber-500",
  },
  pink: {
    bg: "bg-pink-100",
    text: "text-pink-700",
    progressBg: "bg-pink-500",
  },
};

export const AchievementsTab = ({ achievements }: AchievementsTabProps) => {
  if (achievements.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No achievements yet</p>
        <p className="text-sm text-muted-foreground mt-2">
          Complete lessons and quizzes to unlock achievements
        </p>
      </div>
    );
  }

  // Separate unlocked and locked achievements
  const unlockedAchievements = achievements.filter((a) => a.isUnlocked);
  const lockedAchievements = achievements.filter((a) => !a.isUnlocked);

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold mb-6">My Achievements</h2>

      {/* Unlocked Achievements */}
      {unlockedAchievements.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Unlocked</h3>
          <div className="grid grid-cols-1 gap-4">
            {unlockedAchievements.map((achievement) => (
              <Card
                key={achievement.id}
                className="border-2 border-emerald-200 bg-emerald-50/30"
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div
                      className={cn(
                        "w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0",
                        colorClasses[achievement.color].bg
                      )}
                    >
                      <span className="text-3xl">{achievement.icon}</span>
                      <div
                        className={cn(
                          "absolute -top-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold",
                          colorClasses[achievement.color].bg,
                          colorClasses[achievement.color].text
                        )}
                      >
                        {achievement.level}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-lg font-bold mb-1">
                        {achievement.title}
                      </h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        {achievement.description}
                      </p>

                      {/* Progress Bar - Full */}
                      <div className="relative">
                        <Progress value={100} className="h-2" />
                        <p className="text-xs text-emerald-600 font-semibold mt-1">
                          ✓ Completed{" "}
                          {achievement.unlockedAt &&
                            `on ${achievement.unlockedAt.toLocaleDateString()}`}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Locked Achievements */}
      {lockedAchievements.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Locked</h3>
          <div className="grid grid-cols-1 gap-4">
            {lockedAchievements.map((achievement) => (
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
                          achievement.progress > 0
                            ? colorClasses[achievement.color].bg
                            : "bg-gray-200"
                        )}
                      >
                        <span
                          className={cn(
                            "text-3xl",
                            achievement.progress === 0 && "grayscale opacity-50"
                          )}
                        >
                          {achievement.icon}
                        </span>
                      </div>
                      <div
                        className={cn(
                          "absolute -top-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold",
                          achievement.progress > 0
                            ? `${colorClasses[achievement.color].bg} ${colorClasses[achievement.color].text}`
                            : "bg-gray-300 text-gray-600"
                        )}
                      >
                        {achievement.level}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-lg font-bold mb-1">
                        {achievement.title}
                      </h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        {achievement.description}
                      </p>

                      {/* Progress Bar */}
                      <div className="relative">
                        <Progress value={achievement.progress} className="h-2" />
                        <p className="text-xs text-muted-foreground mt-1">
                          {achievement.currentValue} / {achievement.targetValue}{" "}
                          ({achievement.progress}%)
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
