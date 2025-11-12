import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { getInitials } from "@/lib/utils";
import type { UserStats } from "@/lib/actions/user-profile";

type ProfileHeaderProps = {
  userStats: UserStats;
};

export const ProfileHeader = ({ userStats }: ProfileHeaderProps) => {
  const { username, avatarUrl, xp, streak, league } = userStats;

  // League icon mapping
  const leagueIcons: Record<typeof league, string> = {
    Bronze: "🥉",
    Silver: "🥈",
    Gold: "🥇",
    Platinum: "💎",
    Diamond: "💠",
  };

  return (
    <div className="bg-gradient-to-r from-gray-50 to-white border-b pb-6">
      <div className="container mx-auto px-4 py-8 max-w-[1400px]">
        {/* User Info Section */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <Avatar className="w-24 h-24 md:w-28 md:h-28 bg-emerald-500">
              {avatarUrl ? (
                <AvatarImage src={avatarUrl} alt={username} />
              ) : (
                <AvatarFallback className="bg-emerald-500 text-white text-3xl">
                  {getInitials(username)}
                </AvatarFallback>
              )}
            </Avatar>
          </div>

          {/* Username */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{username}</h1>
            <p className="text-muted-foreground">Keep learning, keep growing!</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          {/* Streak Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🔥</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-3xl font-bold">{streak}</p>
                  <p className="text-sm text-muted-foreground">Day streak</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* XP Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">⚡</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-3xl font-bold">{xp}</p>
                  <p className="text-sm text-muted-foreground">Total XP</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* League Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">{leagueIcons[league]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-3xl font-bold">{league}</p>
                  <p className="text-sm text-muted-foreground">Current league</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
