import { XPCard } from "./XPCard";
import { Video, Trophy, Target, Flame, BookOpen } from "lucide-react";

const xpMethods = [
  {
    icon: Video,
    title: "Контент үзэх",
    description:
      "Хичээлийн контент (онол, жишээ видео) бүрийг үзэж дуусгахад 10 XP авна",
    xpAmount: "10",
    iconColor: "bg-blue-500",
  },
  {
    icon: Trophy,
    title: "Quiz давах",
    description:
      "Хичээл болон бүлгийн quiz-ийг давахад 15-22 XP авах боломжтой. 100% зөв хариулбал 22 XP!",
    xpAmount: "15-22",
    iconColor: "bg-purple-500",
    badge: "ЭХНИЙ ОРОЛДЛОГО",
  },
  {
    icon: BookOpen,
    title: "Бүлэг дуусгах",
    description: "Бүлгийн бүх хичээлийг дуусгахад 50 XP урамшуулал авна",
    xpAmount: "50",
    iconColor: "bg-indigo-500",
  },
  {
    icon: Target,
    title: "Хичээлийн түвшинд хүрэх",
    description:
      "25%, 50%, 75%, 100% хичээл дууссан үед урамшуулал + 100% дуусгахад нэмэлт 150 XP",
    xpAmount: "30-250",
    iconColor: "bg-green-500",
    badge: "MILESTONE",
  },
  {
    icon: Flame,
    title: "Өдрийн стрик",
    description: "Тогтмол суралцаж 3, 7, 30 өдрийн түвшинд урамшууллын XP авах",
    xpAmount: "100-1,000",
    iconColor: "bg-orange-500",
  },
] as const;

const xpBreakdown = [
  {
    emoji: "🎥",
    title: "Контент",
    items: [
      "Контент бүрт: 10 XP",
      "Онол видео: 10 XP",
      "Жишээ видео: 10 XP",
      "Жишээ: 2 контенттой хичээл = 20 XP",
    ],
  },
  {
    emoji: "📝",
    title: "Quiz",
    items: [
      "80-89% зөв: 15 XP",
      "90-94% зөв: 18 XP",
      "95-99% зөв: 20 XP",
      "100% зөв (Төгс!): 22 XP",
    ],
    warning: "⚠️ Зөвхөн эхний оролдлого. Дахин оролдход XP байхгүй",
  },
  {
    emoji: "📚",
    title: "Бүлэг & Хичээл дуусгах",
    items: [
      "Бүлэг дуусгах: 50 XP",
      "25% дууссан: 30 XP",
      "50% дууссан: 50 XP",
      "75% дууссан: 70 XP",
      "100% дууссан: 100 XP",
    ],
    highlight: "🎉 Хичээл 100% дуусгах: +150 XP нэмэлт урамшуулал",
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
