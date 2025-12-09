import { LucideIcon } from "lucide-react";

type XPCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  xpAmount: string;
  iconColor: string;
  badge?: string;
};

export const XPCard = ({
  icon: Icon,
  title,
  description,
  xpAmount,
  iconColor,
  badge,
}: XPCardProps) => {
  return (
    <div className="relative bg-white rounded-xl p-6 border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200">
      {badge && (
        <div className="absolute -top-2 -right-2">
          <span className="inline-block bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold">
            {badge}
          </span>
        </div>
      )}

      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className={`w-12 h-12 rounded-lg ${iconColor} flex items-center justify-center`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-600 leading-relaxed mb-3">{description}</p>
          <div className="inline-flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
            <span className="text-xl font-bold text-primary">{xpAmount}</span>
            <span className="text-xs font-semibold text-gray-500">XP</span>
          </div>
        </div>
      </div>
    </div>
  );
};
