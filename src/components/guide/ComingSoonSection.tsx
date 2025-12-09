import { BadgePreview } from "./BadgePreview";
import { ShopItemPreview } from "./ShopItemPreview";

const featuredBadges = [
  {
    icon: "🏆",
    title: "Эхний алхам",
    description: "Анхны хичээлээ дуусга",
    xpReward: 1000,
    rarity: "Bronze" as const,
  },
  {
    icon: "⭐",
    title: "Төгс оноо",
    description: "Тестээс 100% авах",
    xpReward: 200,
    rarity: "Bronze" as const,
  },
  {
    icon: "🔥",
    title: "7 хоногийн дайчин",
    description: "7 өдрийн цуваа хадгалах",
    xpReward: 250,
    rarity: "Silver" as const,
  },
  {
    icon: "💎",
    title: "XP мастер",
    description: "Нийт 25,000 XP олох",
    xpReward: 1000,
    rarity: "Gold" as const,
  },
];

const featuredShopItems = [
  {
    icon: "🎓",
    title: "Хичээлийн сертификат",
    description: "Албан ёсны PDF сертификат",
    xpCost: 500,
    category: "digital" as const,
  },
  {
    icon: "👕",
    title: "Платформын цамц",
    description: "Онцгой брэнд бүхий цамц",
    xpCost: 5000,
    category: "physical" as const,
  },
  {
    icon: "🎒",
    title: "Брэнд бүхий худи",
    description: "Өндөр чанартай худи",
    xpCost: 10000,
    category: "physical" as const,
  },
  {
    icon: "🎯",
    title: "1-1 зөвлөгөө",
    description: "Мэргэжилтэнтэй 1 цагийн уулзалт",
    xpCost: 25000,
    category: "exclusive" as const,
  },
];

export const ComingSoonSection = () => {
  return (
    <section className="py-12 md:py-16 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 rounded-3xl">
      <div className="text-center mb-12">
        <div className="inline-block bg-purple-500 text-white px-4 py-2 rounded-full text-sm font-bold mb-4">
          🔜 УДАХГҮЙ
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Сонирхолтой функцууд удахгүй нэмэгдэнэ! 🚀
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Бид танд тэмдэг, онцгой дэлгүүрийн бараа болон XP ашиглах олон аргыг бэлтгэж байна
        </p>
      </div>

      {/* Badges Preview */}
      <div className="mb-16">
        <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">
          Цуглуулах тэмдгүүд 🏅
        </h3>
        <p className="text-center text-gray-600 mb-8">
          6 ангиллын 38+ өвөрмөц тэмдэг
        </p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {featuredBadges.map((badge, index) => (
            <BadgePreview key={index} {...badge} />
          ))}
        </div>
        <p className="text-center text-sm text-gray-600 mt-6">
          Ангилал: Хичээл дуусгалт • Тестийн гүйцэтгэл • Цуваа • Идэвхи • Түвшин • Нийгэм
        </p>
      </div>

      {/* Shop Preview */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">
          Онцгой дэлгүүр 🛍️
        </h3>
        <p className="text-center text-gray-600 mb-8">
          XP-ээ ашиглан дижитал шагнал, бие махбодийн бараа, онцгой туршлагууд авах
        </p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {featuredShopItems.map((item, index) => (
            <ShopItemPreview key={index} {...item} />
          ))}
        </div>
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 mb-2">
            💡 XP-ээ хуримтлуулж эхлээрэй!
          </p>
          <p className="text-xs text-gray-500">
            Үнэ 500 XP-ээс (сертификат) 50,000 XP (хичээл үүсгэх кредит) хүртэл
          </p>
        </div>
      </div>

      {/* Additional Features */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border-2 border-purple-200">
          <span className="text-3xl mb-3 block">📊</span>
          <h4 className="text-lg font-bold text-gray-900 mb-2">Тэргүүлэгчдийн самбар</h4>
          <p className="text-sm text-gray-600">
            Бусад суралцагчидтай өрсөлдөж дэлхий эсвэл ангиллаар эрэмбэ харах
          </p>
        </div>
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border-2 border-purple-200">
          <span className="text-3xl mb-3 block">⚡</span>
          <h4 className="text-lg font-bold text-gray-900 mb-2">
            Цувааны үржүүлэгч
          </h4>
          <p className="text-sm text-gray-600">
            Урт хугацааны цуваа хадгалснаар 1.5 дахин XP үржүүлэгч авах
          </p>
        </div>
      </div>
    </section>
  );
};
