import { XPCard } from "./XPCard";
import { Video, Trophy, Target, Flame, User } from "lucide-react";
import { LucideIcon } from "lucide-react";

const xpMethods = [
  {
    icon: Video,
    title: "Complete Video Lessons",
    description: "Watch lessons to completion and earn base XP plus duration bonus (5 XP per 5 minutes)",
    xpAmount: "50-95",
    gradient: "bg-gradient-to-br from-blue-50 to-cyan-50",
    badge: "POPULAR",
  },
  {
    icon: Trophy,
    title: "Ace Quizzes",
    description: "Score 80% or higher on your first attempt to earn XP based on your performance",
    xpAmount: "100-200",
    gradient: "bg-gradient-to-br from-purple-50 to-pink-50",
  },
  {
    icon: Target,
    title: "Hit Course Milestones",
    description: "Automatic bonuses at 25%, 50%, 75%, and 100% course completion. First course completion awards 1,000 XP!",
    xpAmount: "200-1,500",
    gradient: "bg-gradient-to-br from-green-50 to-emerald-50",
    badge: "BIG BONUS",
  },
  {
    icon: Flame,
    title: "Daily Streaks",
    description: "Learn consistently and earn milestone bonuses at 3, 7, and 30-day streaks",
    xpAmount: "100-1,000",
    gradient: "bg-gradient-to-br from-orange-50 to-amber-50",
  },
  {
    icon: User,
    title: "Complete Your Profile",
    description: "One-time bonus for adding avatar, date of birth, and learning goals",
    xpAmount: "150",
    gradient: "bg-gradient-to-br from-yellow-50 to-orange-50",
  },
] as const;

const xpBreakdown = [
  {
    emoji: "🎥",
    title: "Video Lessons",
    items: [
      "Base: 50 XP",
      "Duration Bonus: +5 XP per 5 minutes",
      "First Lesson Bonus: +25 XP",
      "Example: 20-min video = 70 XP",
    ],
  },
  {
    emoji: "📝",
    title: "Quizzes",
    items: [
      "80-89%: 100 XP",
      "90-94%: 125 XP",
      "95-99%: 150 XP",
      "100% (Perfect!): 200 XP",
    ],
    warning: "⚠️ First attempt only",
  },
  {
    emoji: "🎯",
    title: "Course Milestones",
    items: [
      "25% Complete: 200 XP",
      "50% Complete: 300 XP",
      "75% Complete: 400 XP",
      "100% Complete: 500 XP",
    ],
    highlight: "🎉 First Course: +1,000 XP bonus",
  },
  {
    emoji: "🔥",
    title: "Streak Rewards",
    items: [
      "3-Day Streak: 100 XP",
      "7-Day Streak: 250 XP",
      "30-Day Streak: 1,000 XP",
    ],
    highlight: "💡 Learn daily to maintain your streak",
  },
];

export const HowXPWorks = () => {
  return (
    <section className="py-12 md:py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          How to Earn XP 🎓
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Complete activities to earn Experience Points and level up your profile
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {xpMethods.map((method, index) => (
          <XPCard key={index} {...method} />
        ))}
      </div>

      {/* Detailed Breakdown */}
      <div className="mt-12 bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl p-8 border border-gray-200">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          XP Breakdown 📊
        </h3>

        <div className="grid md:grid-cols-2 gap-6">
          {xpBreakdown.map((section, index) => (
            <div key={index} className="flex items-start gap-3">
              <span className="text-2xl">{section.emoji}</span>
              <div>
                <h4 className="font-semibold text-gray-900">{section.title}</h4>
                <ul className="text-sm text-gray-600 mt-1 space-y-1">
                  {section.items.map((item, idx) => (
                    <li key={idx}>• {item}</li>
                  ))}
                  {section.warning && (
                    <li className="text-amber-600 font-medium">
                      {section.warning}
                    </li>
                  )}
                  {section.highlight && (
                    <li className="text-green-600 font-medium">
                      {section.highlight}
                    </li>
                  )}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
