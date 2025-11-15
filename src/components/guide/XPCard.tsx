import { LucideIcon } from "lucide-react";

type XPCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  xpAmount: string;
  gradient: string;
  badge?: string;
};

export const XPCard = ({
  icon: Icon,
  title,
  description,
  xpAmount,
  gradient,
  badge,
}: XPCardProps) => {
  return (
    <div
      className={`relative ${gradient} rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-white/20`}
    >
      {badge && (
        <div className="absolute -top-3 -right-3">
          <span className="inline-block bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold shadow-md">
            {badge}
          </span>
        </div>
      )}

      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-14 h-14 rounded-xl bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm">
            <Icon className="h-7 w-7 text-primary" />
          </div>
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-600 mb-3">{description}</p>
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full">
            <span className="text-2xl font-bold text-primary">{xpAmount}</span>
            <span className="text-xs font-semibold text-gray-600">XP</span>
          </div>
        </div>
      </div>
    </div>
  );
};
