"use client";

import { Progress } from "@/components/ui/progress";

type LevelsAndLeaguesProps = {
  currentXP?: number;
  currentLevel?: number;
};

const leagues = [
  { name: "Хүрэл", levels: "1-4", bgColor: "bg-orange-500", emoji: "🥉" },
  { name: "Мөнгө", levels: "5-9", bgColor: "bg-gray-400", emoji: "🥈" },
  { name: "Алт", levels: "10-14", bgColor: "bg-yellow-500", emoji: "🥇" },
  { name: "Платин", levels: "15-19", bgColor: "bg-blue-500", emoji: "💎" },
  { name: "Алмаз", levels: "20+", bgColor: "bg-purple-500", emoji: "💠" },
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
          Түвшин ба лигийн систем 🏆
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          XP цуглуулж түвшинээ өсгөөрэй. 500 XP бүрд 1 түвшин өсөх бөгөөд түвшин өссөн бүрт өндөр лигт шилжинэ.
        </p>
      </div>

      {/* Current Progress */}
      {currentXP > 0 && (
        <div className="mb-12 bg-white rounded-xl p-8 border-2 border-gray-200">
          <div className="text-center mb-6">
            <p className="text-sm text-gray-500 mb-3">Таны одоогийн байдал</p>
            <div className="flex items-center justify-center gap-4">
              <span className="text-5xl">{currentLeague.emoji}</span>
              <div className="text-left">
                <p className="text-3xl font-bold text-gray-900">
                  Түвшин {currentLevel}
                </p>
                <p className="text-base text-gray-600">{currentLeague.name} лиг</p>
              </div>
            </div>
          </div>

          <div className="max-w-md mx-auto">
            <div className="flex justify-between text-sm font-medium text-gray-700 mb-2">
              <span>{xpInCurrentLevel} XP</span>
              <span>500 XP</span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
            <p className="text-center text-sm text-gray-600 mt-3">
              Дараагийн түвшинд хүрэхэд <span className="font-bold text-primary">{500 - xpInCurrentLevel} XP</span> хэрэгтэй
            </p>
          </div>
        </div>
      )}

      {/* How Levels Work */}
      <div className="mb-16 max-w-3xl mx-auto">
        <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
          Түвшин хэрхэн ажилладаг вэ 📈
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
            <div className="w-14 h-14 rounded-full bg-blue-50 border-2 border-blue-500 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">1️⃣</span>
            </div>
            <p className="font-bold text-gray-900 mb-2">500 XP = 1 Түвшин</p>
            <p className="text-sm text-gray-600 leading-relaxed">
              Хичээл бүрээс XP цуглуулж түвшин өсгөнө
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
            <div className="w-14 h-14 rounded-full bg-purple-50 border-2 border-purple-500 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">2️⃣</span>
            </div>
            <p className="font-bold text-gray-900 mb-2">Автомат шинэчлэгдэнэ</p>
            <p className="text-sm text-gray-600 leading-relaxed">
              XP олсноор таны түвшин шууд өснө
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
            <div className="w-14 h-14 rounded-full bg-green-50 border-2 border-green-500 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">3️⃣</span>
            </div>
            <p className="font-bold text-gray-900 mb-2">Хязгааргүй</p>
            <p className="text-sm text-gray-600 leading-relaxed">
              Хичнээн ч түвшинд хүрч болно
            </p>
          </div>
        </div>
      </div>

      {/* League Tiers */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
          Лигийн шатлал 🎖️
        </h3>
        <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
          Түвшин өсөх тусам өндөр лигт шилжинэ. Лиг бүр өөр амжилтыг илэрхийлнэ.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {leagues.map((league) => (
            <div
              key={league.name}
              className={`bg-white rounded-xl p-6 border-2 text-center transition-all duration-200 ${
                currentLeague.name === league.name
                  ? "border-primary shadow-lg scale-105"
                  : "border-gray-200 hover:border-gray-300 hover:shadow-md"
              }`}
            >
              <div
                className={`w-16 h-16 rounded-full ${league.bgColor} flex items-center justify-center mx-auto mb-3`}
              >
                <span className="text-3xl">{league.emoji}</span>
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-1">
                {league.name}
              </h4>
              <p className="text-sm text-gray-600">Түвшин {league.levels}</p>
              {currentLeague.name === league.name && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <span className="text-xs font-bold text-primary">
                    Одоогийн лиг
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
