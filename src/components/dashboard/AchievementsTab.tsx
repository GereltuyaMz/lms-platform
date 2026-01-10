import type { BadgeWithProgress } from "@/lib/actions/badges";
import { AchievementCard } from "./AchievementCard";

type AchievementsTabProps = {
  achievements: BadgeWithProgress[];
};

export const AchievementsTab = ({ achievements }: AchievementsTabProps) => {
  if (achievements.length === 0) {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-4">Амжилтууд</h2>
        <div className="rounded-2xl border p-8 text-center">
          <p className="text-muted-foreground">Одоогоор амжилт байхгүй байна</p>
          <p className="text-sm text-muted-foreground mt-2">
            Хичээл ба тест бөглөж амжилт нээцгээнэ үү
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header - Outside container */}
      <h2 className="text-xl font-semibold mb-4">Амжилтууд</h2>

      {/* Cards Container */}
      <div className="rounded-2xl border overflow-hidden">
        {achievements.map((achievement, index) => (
          <AchievementCard
            key={achievement.id}
            achievement={achievement}
            index={index}
            size="large"
            alwaysShowProgress
          />
        ))}
      </div>
    </div>
  );
};
