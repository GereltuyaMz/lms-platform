import { BadgePreview } from "./BadgePreview";
import { ShopItemPreview } from "./ShopItemPreview";

const featuredBadges = [
  {
    icon: "🏆",
    title: "First Steps",
    description: "Complete your first course",
    xpReward: 1000,
    rarity: "Bronze" as const,
  },
  {
    icon: "⭐",
    title: "Perfect Score",
    description: "Get 100% on a quiz",
    xpReward: 200,
    rarity: "Bronze" as const,
  },
  {
    icon: "🔥",
    title: "Week Warrior",
    description: "Maintain a 7-day streak",
    xpReward: 250,
    rarity: "Silver" as const,
  },
  {
    icon: "💎",
    title: "XP Master",
    description: "Earn 25,000 total XP",
    xpReward: 1000,
    rarity: "Gold" as const,
  },
];

const featuredShopItems = [
  {
    icon: "🎓",
    title: "Course Certificate",
    description: "Official PDF certificate",
    xpCost: 500,
    category: "digital" as const,
  },
  {
    icon: "👕",
    title: "Platform T-Shirt",
    description: "Exclusive branded tee",
    xpCost: 5000,
    category: "physical" as const,
  },
  {
    icon: "🎒",
    title: "Branded Hoodie",
    description: "Premium quality hoodie",
    xpCost: 10000,
    category: "physical" as const,
  },
  {
    icon: "🎯",
    title: "1-on-1 Mentorship",
    description: "1 hour with an expert",
    xpCost: 25000,
    category: "exclusive" as const,
  },
];

export const ComingSoonSection = () => {
  return (
    <section className="py-12 md:py-16 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 rounded-3xl">
      <div className="text-center mb-12">
        <div className="inline-block bg-purple-500 text-white px-4 py-2 rounded-full text-sm font-bold mb-4">
          🔜 COMING SOON
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Exciting Features on the Way! 🚀
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          We&apos;re working hard to bring you badges, exclusive shop items, and more ways to use your XP
        </p>
      </div>

      {/* Badges Preview */}
      <div className="mb-16">
        <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">
          Collectible Badges 🏅
        </h3>
        <p className="text-center text-gray-600 mb-8">
          38+ unique badges across 6 categories
        </p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {featuredBadges.map((badge, index) => (
            <BadgePreview key={index} {...badge} />
          ))}
        </div>
        <p className="text-center text-sm text-gray-600 mt-6">
          Categories: Course Completion • Quiz Performance • Streaks • Engagement • Milestones • Social
        </p>
      </div>

      {/* Shop Preview */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">
          Exclusive Shop 🛍️
        </h3>
        <p className="text-center text-gray-600 mb-8">
          Redeem your XP for digital rewards, physical merch, and exclusive experiences
        </p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {featuredShopItems.map((item, index) => (
            <ShopItemPreview key={index} {...item} />
          ))}
        </div>
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 mb-2">
            💡 Start saving your XP now!
          </p>
          <p className="text-xs text-gray-500">
            Prices range from 500 XP (certificates) to 50,000 XP (course creation credits)
          </p>
        </div>
      </div>

      {/* Additional Features */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border-2 border-purple-200">
          <span className="text-3xl mb-3 block">📊</span>
          <h4 className="text-lg font-bold text-gray-900 mb-2">Leaderboards</h4>
          <p className="text-sm text-gray-600">
            Compete with other learners and see how you rank globally or by category
          </p>
        </div>
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border-2 border-purple-200">
          <span className="text-3xl mb-3 block">⚡</span>
          <h4 className="text-lg font-bold text-gray-900 mb-2">
            Streak Multipliers
          </h4>
          <p className="text-sm text-gray-600">
            Earn up to 1.5x XP multiplier for maintaining long learning streaks
          </p>
        </div>
      </div>
    </section>
  );
};
