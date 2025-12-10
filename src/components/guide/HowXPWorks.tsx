import { XPCard } from "./XPCard";
import { Video, Trophy, Target, Flame, User } from "lucide-react";

const xpMethods = [
  {
    icon: Video,
    title: "Видео хичээл үзэх",
    description:
      "Хичээлийг бүрэн үзэж үндсэн XP болон үргэлжлэх хугацааны урамшуулал авах (5 минут тутамд 5 XP)",
    xpAmount: "50-95",
    iconColor: "bg-blue-500",
  },
  {
    icon: Trophy,
    title: "Quiz давах",
    description:
      "Зөв хариулт бүрт 10 XP. Өндөр үнэлгээнд урамшуулал: 80%+ хүрвэл нэмэлт 25-100 XP!",
    xpAmount: "10-200",
    iconColor: "bg-purple-500",
    badge: "ЭХНИЙ ОРОЛДЛОГО",
  },
  {
    icon: Target,
    title: "Хичээлийн түвшинд хүрэх",
    description:
      "25%, 50%, 75%, 100% хичээл дууссан үед автомат урамшуулал. Анхны хичээл дуусгахад 1,000 XP!",
    xpAmount: "200-1,500",
    iconColor: "bg-green-500",
    badge: "ТОМ УРАМШУУЛАЛ",
  },
  {
    icon: Flame,
    title: "Өдрийн стрик",
    description: "Тогтмол суралцаж 3, 7, 30 өдрийн түвшинд урамшууллын XP авах",
    xpAmount: "100-1,000",
    iconColor: "bg-orange-500",
  },
  {
    icon: User,
    title: "Профайлаа бөглөх",
    description:
      "Профайл зураг, төрсөн огноо, суралцах зорилго нэмсэн тохиолдолд нэг удаагийн урамшуулал",
    xpAmount: "150",
    iconColor: "bg-amber-500",
  },
] as const;

const xpBreakdown = [
  {
    emoji: "🎥",
    title: "Видео хичээл",
    items: [
      "Үндсэн: 50 XP",
      "Үргэлжлэх хугацааны урамшуулал: 5 минут тутамд +5 XP",
      "Эхний хичээлийн урамшуулал: +25 XP",
      "Жишээ: 20 минутын видео = 70 XP",
    ],
  },
  {
    emoji: "📝",
    title: "Quiz",
    items: [
      "Үндсэн: Зөв хариулт бүрт 10 XP",
      "Мастер урамшуулал:",
      "  • 80-89%: +25 XP урамшуулал",
      "  • 90-94%: +50 XP урамшуулал",
      "  • 95-99%: +75 XP урамшуулал",
      "  • 100% (Төгс!): +100 XP урамшуулал",
      "Жишээ: 8/10 зөв (80%) = 80 + 25 = 105 XP",
    ],
    warning: "⚠️ Зөвхөн эхний оролдлого. Дахин оролдход XP байхгүй",
  },
  {
    emoji: "🎯",
    title: "Хичээлийн түвшин",
    items: [
      "25% дууссан: 200 XP",
      "50% дууссан: 300 XP",
      "75% дууссан: 400 XP",
      "100% дууссан: 500 XP",
    ],
    highlight: "🎉 Анхны хичээл: +1,000 XP урамшуулал",
  },
  {
    emoji: "🔥",
    title: "Cтрик шагнал",
    items: [
      "3 өдрийн стрик: 100 XP",
      "7 өдрийн стрик: 250 XP",
      "30 өдрийн стрик: 1,000 XP",
    ],
    highlight: "💡 Cтрик хадгалахын тулд өдөр бүр суралц",
  },
];

export const HowXPWorks = () => {
  return (
    <section className="py-12 md:py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          XP хэрхэн олох вэ 🎓
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {xpMethods.map((method, index) => (
          <XPCard key={index} {...method} />
        ))}
      </div>

      {/* Detailed Breakdown */}
      <div className="mt-16">
        <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
          XP-ийн задаргаа 📊
        </h3>

        <div className="grid md:grid-cols-2 gap-6">
          {xpBreakdown.map((section, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 border border-gray-200"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{section.emoji}</span>
                <h4 className="text-lg font-bold text-gray-900">
                  {section.title}
                </h4>
              </div>

              <div className="space-y-2">
                {section.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-gray-400">•</span>
                    <span className="text-sm text-gray-700">{item}</span>
                  </div>
                ))}
              </div>

              {section.warning && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm text-amber-600 font-medium">
                    {section.warning}
                  </p>
                </div>
              )}

              {section.highlight && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm text-green-600 font-medium">
                    {section.highlight}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
