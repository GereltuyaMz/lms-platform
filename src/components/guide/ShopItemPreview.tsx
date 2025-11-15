type ShopItemPreviewProps = {
  icon: string;
  title: string;
  description: string;
  xpCost: number;
  category: "digital" | "physical" | "exclusive";
};

const categoryColors = {
  digital: "from-blue-50 to-cyan-50 border-blue-200",
  physical: "from-green-50 to-emerald-50 border-green-200",
  exclusive: "from-purple-50 to-pink-50 border-purple-200",
};

export const ShopItemPreview = ({
  icon,
  title,
  description,
  xpCost,
  category,
}: ShopItemPreviewProps) => {
  return (
    <div
      className={`relative bg-gradient-to-br ${categoryColors[category]} rounded-xl p-5 shadow-sm border-2 opacity-60`}
    >
      {/* Coming Soon Badge */}
      <div className="absolute -top-2 -right-2 z-10">
        <span className="inline-block bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
          🔜 Coming Soon
        </span>
      </div>

      <div className="flex flex-col items-center text-center">
        {/* Item Icon */}
        <div className="w-20 h-20 rounded-xl bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm mb-3">
          <span className="text-4xl">{icon}</span>
        </div>

        {/* Item Title */}
        <h4 className="text-base font-bold text-gray-900 mb-2">{title}</h4>

        {/* Description */}
        <p className="text-xs text-gray-600 mb-4">{description}</p>

        {/* XP Cost */}
        <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border-2 border-primary/20">
          <span className="text-lg font-bold text-primary">
            {xpCost.toLocaleString()}
          </span>
          <span className="text-xs font-semibold text-gray-600">XP</span>
        </div>
      </div>
    </div>
  );
};
