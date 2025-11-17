"use client";

import { Progress } from "@/components/ui/progress";

type LevelsAndLeaguesProps = {
  currentXP?: number;
  currentLevel?: number;
};

const leagues = [
  { name: "Bronze", levels: "1-4", color: "from-orange-400 to-amber-500", emoji: "🥉" },
  { name: "Silver", levels: "5-9", color: "from-gray-300 to-slate-400", emoji: "🥈" },
  { name: "Gold", levels: "10-14", color: "from-yellow-400 to-amber-400", emoji: "🥇" },
  { name: "Platinum", levels: "15-19", color: "from-cyan-400 to-blue-500", emoji: "💎" },
  { name: "Diamond", levels: "20+", color: "from-purple-500 to-pink-500", emoji: "💠" },
];

export const LevelsAndLeagues = ({
  currentXP = 0,
  currentLevel = 1,
}: LevelsAndLeaguesProps) => {
  const xpInCurrentLevel = currentXP % 500;
  const progressPercentage = (xpInCurrentLevel / 500) * 100;

  const getCurrentLeague = (level: number) => {
    if (level >= 20) return leagues[4];
    if (level >= 15) return leagues[3];
    if (level >= 10) return leagues[2];
    if (level >= 5) return leagues[1];
    return leagues[0];
  };

  const currentLeague = getCurrentLeague(currentLevel);

  return (
    <section className="py-12 md:py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Levels & Leagues System 🏆
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Every 500 XP earns you a new level. Reach higher levels to unlock prestigious leagues
        </p>
      </div>

      {/* Current Progress */}
      {currentXP > 0 && (
        <div className="mb-12 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100">
          <div className="text-center mb-6">
            <p className="text-sm text-gray-600 mb-2">You are currently</p>
            <div className="flex items-center justify-center gap-3">
              <span className="text-4xl">{currentLeague.emoji}</span>
              <div className="text-left">
                <p className="text-2xl font-bold text-gray-900">
                  Level {currentLevel}
                </p>
                <p className="text-sm text-gray-600">{currentLeague.name} League</p>
              </div>
            </div>
          </div>

          <div className="max-w-md mx-auto">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>{xpInCurrentLevel} XP</span>
              <span>500 XP</span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
            <p className="text-center text-sm text-gray-600 mt-2">
              {500 - xpInCurrentLevel} XP until Level {currentLevel + 1}
            </p>
          </div>
        </div>
      )}

      {/* How Levels Work */}
      <div className="mb-12 bg-white rounded-2xl p-8 shadow-md border border-gray-200">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          How Levels Work 📈
        </h3>
        <div className="space-y-4 max-w-2xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <span className="text-xl">1️⃣</span>
            </div>
            <div>
              <p className="font-semibold text-gray-900">Earn 500 XP per Level</p>
              <p className="text-sm text-gray-600">
                Level = (Total XP ÷ 500) + 1
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
              <span className="text-xl">2️⃣</span>
            </div>
            <div>
              <p className="font-semibold text-gray-900">Automatic Progression</p>
              <p className="text-sm text-gray-600">
                Levels update instantly as you earn XP
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <span className="text-xl">3️⃣</span>
            </div>
            <div>
              <p className="font-semibold text-gray-900">No Level Cap</p>
              <p className="text-sm text-gray-600">
                Keep leveling up indefinitely!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* League Tiers */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          League Tiers 🎖️
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {leagues.map((league) => (
            <div
              key={league.name}
              className={`bg-gradient-to-br ${league.color} rounded-xl p-6 text-center shadow-lg ${
                currentLeague.name === league.name ? "ring-4 ring-white scale-105" : ""
              }`}
            >
              <span className="text-4xl mb-3 block">{league.emoji}</span>
              <h4 className="text-lg font-bold text-white mb-1">{league.name}</h4>
              <p className="text-sm text-white/90">Levels {league.levels}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
