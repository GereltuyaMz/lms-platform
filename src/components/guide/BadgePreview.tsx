type BadgePreviewProps = {
  icon: string;
  title: string;
  description: string;
  xpReward: number;
  rarity: "Bronze" | "Silver" | "Gold" | "Platinum";
};

const rarityColors = {
  Bronze: "from-orange-100 to-amber-100 border-orange-200",
  Silver: "from-gray-100 to-slate-100 border-gray-300",
  Gold: "from-yellow-100 to-amber-100 border-yellow-300",
  Platinum: "from-cyan-100 to-blue-100 border-cyan-300",
};

export const BadgePreview = ({
  icon,
  title,
  description,
  xpReward,
  rarity,
}: BadgePreviewProps) => {
  return (
    <div
      className={`relative bg-gradient-to-br ${rarityColors[rarity]} rounded-xl p-5 shadow-sm border-2 opacity-60`}
    >
      {/* Coming Soon Badge */}
      <div className="absolute -top-2 -right-2 z-10">
        <span className="inline-block bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
          🔜 Coming Soon
        </span>
      </div>

      <div className="flex flex-col items-center text-center">
        {/* Badge Icon */}
        <div className="w-16 h-16 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm mb-3">
          <span className="text-3xl">{icon}</span>
        </div>

        {/* Badge Title */}
        <h4 className="text-base font-bold text-gray-900 mb-1">{title}</h4>

        {/* Rarity */}
        <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-white/70 text-gray-700 mb-2">
          {rarity}
        </span>

        {/* Description */}
        <p className="text-xs text-gray-600 mb-3">{description}</p>

        {/* XP Reward */}
        <div className="inline-flex items-center gap-1 bg-white/70 px-3 py-1 rounded-full">
          <span className="text-sm font-bold text-primary">+{xpReward}</span>
          <span className="text-xs text-gray-600">XP</span>
        </div>
      </div>
    </div>
  );
};
