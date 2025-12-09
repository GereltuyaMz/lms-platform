"use client";

import { Flame } from "lucide-react";

type StreakSystemProps = {
  currentStreak?: number;
};

const streakMilestones = [
  { days: 3, xp: 100, emoji: "🔥", color: "from-orange-100 to-red-100" },
  { days: 7, xp: 250, emoji: "⚡", color: "from-yellow-100 to-orange-100" },
  { days: 30, xp: 1000, emoji: "🌟", color: "from-purple-100 to-pink-100" },
];

const streakTips = [
  {
    emoji: "📅",
    title: "Өдөр бүр суралц",
    description: "Цувааг хадгалахын тулд өдөр бүр дор хаяж нэг үйл ажиллагаа хий",
  },
  {
    emoji: "⏰",
    title: "Сануулга тавь",
    description: "Өдөр бүр тогтмол цагт суралцах цагаа сонго",
  },
  {
    emoji: "🎯",
    title: "Жижгээр эхэл",
    description: "10 минут ч гэсэн хангалттай! Богино хичээл алгасахаас дээр",
  },
];

export const StreakSystem = ({ currentStreak = 0 }: StreakSystemProps) => {
  return (
    <section className="py-12 md:py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Өдрийн цувааны систем 🔥
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Тогтмол суралцаж өдрийн цувааг хадгалснаар урамшууллын XP авна уу
        </p>
      </div>

      {/* Current Streak */}
      {currentStreak > 0 && (
        <div className="mb-12 bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-8 border border-orange-200">
          <div className="flex flex-col items-center">
            <Flame className="h-16 w-16 text-orange-500 mb-4" />
            <p className="text-sm text-gray-600 mb-2">Таны одоогийн цуваа</p>
            <p className="text-5xl font-bold text-orange-600 mb-2">
              {currentStreak}
            </p>
            <p className="text-lg text-gray-700">
              {currentStreak === 1 ? "Өдөр" : "Өдөр"}
            </p>
          </div>
        </div>
      )}

      {/* Streak Milestones */}
      <div className="mb-12">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Цувааны түвшин 🎯
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {streakMilestones.map((milestone) => (
            <div
              key={milestone.days}
              className={`bg-gradient-to-br ${milestone.color} rounded-2xl p-6 shadow-md border-2 ${
                currentStreak >= milestone.days
                  ? "border-green-500"
                  : "border-transparent"
              }`}
            >
              <div className="text-center">
                <span className="text-5xl mb-4 block">{milestone.emoji}</span>
                <h4 className="text-2xl font-bold text-gray-900 mb-2">
                  {milestone.days} өдөр
                </h4>
                <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full">
                  <span className="text-xl font-bold text-primary">
                    +{milestone.xp}
                  </span>
                  <span className="text-sm font-semibold text-gray-600">XP</span>
                </div>
                {currentStreak >= milestone.days && (
                  <p className="mt-3 text-sm font-semibold text-green-600">
                    ✓ Амжилттай!
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How Streaks Work */}
      <div className="mb-12 bg-white rounded-2xl p-8 shadow-md border border-gray-200">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Цуваа хэрхэн ажилладаг вэ 📚
        </h3>
        <div className="space-y-4 max-w-2xl mx-auto">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-sm font-bold text-blue-600">1</span>
            </div>
            <div>
              <p className="font-semibold text-gray-900">Ямар ч үйл ажиллагаа хий</p>
              <p className="text-sm text-gray-600">
                Видео үзэх, тест бөглөх эсвэл хичээл дуусгах
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-sm font-bold text-purple-600">2</span>
            </div>
            <div>
              <p className="font-semibold text-gray-900">Өдөр бүр хий</p>
              <p className="text-sm text-gray-600">
                Дараалсан өдөр бүр цуваа 1-ээр нэмэгдэнэ
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-sm font-bold text-orange-600">3</span>
            </div>
            <div>
              <p className="font-semibold text-gray-900">Урамшууллын XP авах</p>
              <p className="text-sm text-gray-600">
                3, 7, 30 өдөрт хүрэхэд автомат урамшуулал авна
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-sm font-bold text-red-600">⚠️</span>
            </div>
            <div>
              <p className="font-semibold text-gray-900">Тасалж болохгүй!</p>
              <p className="text-sm text-gray-600">
                Нэг өдөр алгасвал цуваа 0 болно. Тогтвортой бай!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tips for Maintaining Streaks */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Цувааг хадгалах зөвлөмж 💡
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {streakTips.map((tip, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-6 border border-gray-200"
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl">{tip.emoji}</span>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">{tip.title}</h4>
                  <p className="text-sm text-gray-600">{tip.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
