import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
  ClockIcon,
  BookOpenIcon,
  SealCheckIcon,
  CheckCircleIcon,
} from "@phosphor-icons/react/dist/ssr";
import { PlaceholderImage } from "@/icons";
import type { CourseLevel } from "@/types/database/enums";

type CourseCardProps = {
  course: {
    title: string;
    slug: string;
    description: string | null;
    thumbnail_url: string | null;
    level: CourseLevel;
    total_duration_seconds?: number | null;
    lessons?: { count: number }[];
  };
  enrollment?: {
    id: string;
    enrolled_at: string;
    progress_percentage: number;
    lastLessonId: string | null;
    completed_at?: string | null;
  };
};

export const CourseCard = ({ course, enrollment }: CourseCardProps) => {
  // Get lesson count from the nested array
  const lessonCount = course.lessons?.[0]?.count ?? 0;

  // Format duration from seconds
  const formatDuration = (seconds: number | null | undefined): string | null => {
    if (!seconds || seconds === 0) return null;
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.ceil((seconds % 3600) / 60);
    if (hours > 0) {
      return minutes > 0 ? `${hours} цаг ${minutes} мин` : `${hours} цаг`;
    }
    return `${minutes} мин`;
  };

  // Prefer calculated total_duration_seconds over manually set duration_hours
  const duration = formatDuration(course.total_duration_seconds);

  // Determine if course is completed
  const isCompleted =
    enrollment?.progress_percentage === 100 || !!enrollment?.completed_at;

  return (
    <Link
      href={
        enrollment && enrollment.lastLessonId
          ? `/courses/${course.slug}/learn/lesson/${enrollment.lastLessonId}`
          : `/courses/${course.slug}`
      }
    >
      <Card className="overflow-hidden hover:shadow-lg transition-shadow rounded-3xl border-0 bg-[#F8F1F6]">
        <CardContent className="p-0">
          <div className="flex flex-col sm:flex-row">
            {/* Course Thumbnail */}
            <div className="relative flex-shrink-0 overflow-hidden rounded-3xl w-full h-48 sm:w-[200px] sm:h-[200px]">
              {course.thumbnail_url ? (
                <Image
                  src={course.thumbnail_url}
                  alt={course.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
                    <PlaceholderImage className="w-10 h-10 text-gray-400" />
                  </div>
                </div>
              )}

              {/* Badge - XP or Completed */}
              <div className="absolute top-3 left-3">
                {enrollment && isCompleted ? (
                  <span className="inline-flex items-center gap-1 bg-[#22C55E] px-2.5 py-1.5 rounded-full text-xs font-semibold text-white">
                    <CheckCircleIcon size={14} weight="fill" />
                    Дууссан
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2.5 py-1.5 rounded-full text-xs font-semibold text-gray-700">
                    <SealCheckIcon size={14} />
                    1500 XP
                  </span>
                )}
              </div>
            </div>

            {/* Course Info */}
            <div className="flex-1 p-4 sm:p-5 flex flex-col justify-around gap-3 sm:gap-0">
              {/* Labels */}
              <div className="flex flex-wrap items-center gap-2">
                {duration && (
                  <span className="inline-flex items-center gap-1.5 text-xs bg-white px-3 py-1 rounded-full border border-[#D4D4D4]">
                    <ClockIcon size={14} />
                    {duration}
                  </span>
                )}
                {lessonCount > 0 && (
                  <span className="inline-flex items-center gap-1.5 text-xs bg-white px-3 py-1 rounded-full border border-[#D4D4D4]">
                    <BookOpenIcon size={14} />
                    {lessonCount} хичээл
                  </span>
                )}
                {/* XP label - only show when completed */}
                {isCompleted && (
                  <span className="inline-flex items-center gap-1.5 text-xs bg-white px-3 py-1 rounded-full border border-[#D4D4D4]">
                    <SealCheckIcon size={14} />
                    1500 XP
                  </span>
                )}
              </div>

              {/* Title & Description */}
              <div className="mb-1">
                <h3 className="text-lg font-bold mb-1">{course.title}</h3>
                {course.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {course.description}
                  </p>
                )}
              </div>

              {/* Progress or Action Button */}
              {enrollment ? (
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-muted-foreground">Хичээлийн явц</span>
                    <span className="font-semibold">
                      {enrollment.progress_percentage}%
                    </span>
                  </div>
                  <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${enrollment.progress_percentage}%`,
                        background:
                          "linear-gradient(180deg, #FFC500 0%, #FFEBA7 50.55%, #FFC500 100%)",
                      }}
                    />
                  </div>
                </div>
              ) : (
                <button
                  className="w-fit px-6 py-2.5 rounded-xl bg-[#22C55E] hover:bg-[#1EA34A] text-white text-sm font-semibold transition-all active:translate-y-0.5 active:shadow-none"
                  style={{
                    boxShadow: "0 4px 0 0 #16A34A",
                  }}
                >
                  Хичээл үзэх
                </button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
