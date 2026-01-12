"use client";

import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { getInitials } from "@/lib/utils";
import type { UserStats } from "@/lib/actions";
import type {
  DashboardEnrollment,
  RecommendedCourse,
} from "@/types/database/queries";
import { CourseCard } from "./CourseCard";
import { EmptyCoursesState } from "./EmptyCoursesState";
import { PencilSimpleIcon } from "@phosphor-icons/react";

type ProfileOverviewProps = {
  userStats: UserStats;
  enrollments: DashboardEnrollment[];
  recommendedCourses: RecommendedCourse[];
  joinedDate?: string;
};

export const ProfileOverview = ({
  userStats,
  enrollments,
  recommendedCourses,
  joinedDate,
}: ProfileOverviewProps) => {
  const router = useRouter();
  const { username, avatarUrl, xp, streak, league } = userStats;

  // League icon mapping
  const leagueIcons: Record<typeof league, string> = {
    Bronze: "🥉",
    Silver: "🥈",
    Gold: "🥇",
    Platinum: "💎",
    Diamond: "💠",
  };

  // League name mapping to Mongolian
  const leagueNames: Record<typeof league, string> = {
    Bronze: "Хүрэл",
    Silver: "Мөнгө",
    Gold: "Алт",
    Platinum: "Платин",
    Diamond: "Алмаз",
  };

  // Format joined date in Mongolian
  const formatJoinedDate = (dateStr?: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const monthNames = [
      "1-р сар",
      "2-р сар",
      "3-р сар",
      "4-р сар",
      "5-р сар",
      "6-р сар",
      "7-р сар",
      "8-р сар",
      "9-р сар",
      "10-р сар",
      "11-р сар",
      "12-р сар",
    ];
    const month = monthNames[date.getMonth()];
    return `${year} оны ${month}-д нэгдсэн`;
  };

  return (
    <div className="space-y-8">
      {/* Profile Card */}
      <Card className="overflow-hidden bg-[var(--dashboard-tab-active)] border-0">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <Avatar className="w-16 h-16 md:w-20 md:h-20">
              {avatarUrl ? (
                <AvatarImage src={avatarUrl} alt={username} />
              ) : (
                <AvatarFallback className="bg-emerald-500 text-white text-xl">
                  {getInitials(username)}
                </AvatarFallback>
              )}
            </Avatar>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <h1 className="text-base font-bold truncate">{username}</h1>
              {joinedDate && (
                <p className="text-sm text-[var(--dashboard-text-primary)]">
                  {formatJoinedDate(joinedDate)}
                </p>
              )}
            </div>

            {/* Edit Button */}
            <button
              className="w-10 h-10 rounded-lg bg-[var(--dashboard-text-active)] flex items-center justify-center flex-shrink-0 hover:opacity-90 transition-opacity self-start"
              aria-label="Edit profile"
              onClick={() => router.push("/dashboard?tab=settings")}
            >
              <PencilSimpleIcon size={20} className="text-white" />
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Статистик</h2>
        <div className="grid grid-cols-2 gap-4">
          {/* Streak Card */}
          <Card className="rounded-2xl">
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <span className="text-2xl">🔥</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xl font-semibold">{streak}</p>
                  <p className="text-sm text-muted-foreground">Өдрийн стрик</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* XP Card */}
          <Card className="rounded-2xl">
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <span className="text-2xl ">⚡</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xl font-semibold">{xp}</p>
                  <p className="text-sm text-muted-foreground">Нийт XP</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Finisher Card */}
          {/* <Card className="rounded-2xl">
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <span className="text-2xl ">🏅</span>
                <div className="flex-1 min-w-0">
                  <p className="text-2xl font-bold">4</p>
                  <p className="text-sm text-muted-foreground">Top 3 finisher</p>
                </div>
              </div>
            </CardContent>
          </Card> */}

          {/* League Card */}
          <Card className="rounded-2xl">
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <span className="text-2xl">{leagueIcons[league]}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xl font-semibold">{leagueNames[league]}</p>
                  <p className="text-sm text-muted-foreground">Одоогийн лиг</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Courses Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          {enrollments.length === 0 ? "Онцлох хичээлүүд" : "Үзэж буй хичээлүүд"}
        </h2>
        {enrollments.length === 0 ? (
          recommendedCourses.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {recommendedCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={{
                    title: course.title,
                    slug: course.slug,
                    description: course.description,
                    thumbnail_url: course.thumbnail_url,
                    level: course.level,
                    total_duration_seconds: course.total_duration_seconds,
                    lessons: course.lessons,
                  }}
                />
              ))}
            </div>
          ) : (
            <EmptyCoursesState />
          )
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {enrollments.map((enrollment) => {
              const course = enrollment.courses;
              if (!course) return null;

              return (
                <CourseCard
                  key={enrollment.id}
                  course={course}
                  enrollment={{
                    id: enrollment.id,
                    enrolled_at: enrollment.enrolled_at,
                    progress_percentage: enrollment.progress_percentage,
                    lastLessonId: enrollment.lastLessonId,
                  }}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
