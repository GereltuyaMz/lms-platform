const tips = [
  {
    emoji: "🎯",
    title: "Complete Your Profile First",
    description: "Easy 150 XP to get started! Add your avatar, birth date, and learning goals.",
    category: "Quick Win",
  },
  {
    emoji: "📚",
    title: "Watch Longer Videos",
    description: "Duration bonus means longer lessons = more XP. A 20-minute video earns 70 XP vs 50 XP for a 5-minute one.",
    category: "Maximize XP",
  },
  {
    emoji: "🎯",
    title: "Aim for 100% on Quizzes",
    description: "Perfect scores earn 200 XP! Study the material before attempting, as only first attempts count.",
    category: "Maximize XP",
  },
  {
    emoji: "🔥",
    title: "Never Break Your Streak",
    description: "Streak bonuses are huge! Set a daily reminder and complete at least one short lesson every day.",
    category: "Consistency",
  },
  {
    emoji: "🏆",
    title: "Focus on Course Completion",
    description: "Finishing your first course awards 1,000 XP bonus! Plus milestone bonuses along the way.",
    category: "Big Bonus",
  },
  {
    emoji: "⏰",
    title: "Learn During the Same Time Daily",
    description: "Build a habit by studying at the same time each day. Consistency is key for streaks!",
    category: "Consistency",
  },
  {
    emoji: "📈",
    title: "Track Your Progress",
    description: "Check your dashboard regularly to see your XP growth and plan your path to the next level.",
    category: "Strategy",
  },
  {
    emoji: "🎓",
    title: "Quality Over Quantity",
    description: "Focus on understanding rather than rushing. Better quiz scores = more XP!",
    category: "Strategy",
  },
];

export const TipsAndTricks = () => {
  return (
    <section className="py-12 md:py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Tips & Tricks 💡
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Pro strategies to maximize your XP earnings and level up faster
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tips.map((tip, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                  <span className="text-2xl">{tip.emoji}</span>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-gray-900">{tip.title}</h3>
                  <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full whitespace-nowrap ml-2">
                    {tip.category}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{tip.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Summary */}
      <div className="mt-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white">
        <h3 className="text-2xl font-bold mb-4">Ready to Start Earning? 🚀</h3>
        <p className="text-lg mb-6 text-white/90">
          Remember: Consistency beats intensity. Learn a little every day, maintain your streak, and watch your XP grow!
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
            Complete Profile: 150 XP
          </div>
          <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
            Daily Streak: Up to 1,000 XP
          </div>
          <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
            First Course: 1,000 XP
          </div>
        </div>
      </div>
    </section>
  );
};
