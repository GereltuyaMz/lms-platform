import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
  ClockIcon,
  BookOpenIcon,
  SealCheckIcon,
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
    duration_hours?: number | null;
    lessons?: { count: number }[];
  };
  enrollment?: {
    id: string;
    enrolled_at: string;
    progress_percentage: number;
    lastLessonId: string | null;
  };
};

export const CourseCard = ({ course, enrollment }: CourseCardProps) => {
  // Get lesson count from the nested array
  const lessonCount = course.lessons?.[0]?.count ?? 0;

  // Format duration
  const formatDuration = (hours: number | null | undefined) => {
    if (!hours) return null;
    if (hours < 1) {
      return `${Math.round(hours * 60)} мин`;
    }
    return `${hours} цаг`;
  };

  const duration = formatDuration(course.duration_hours);

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
          <div className="flex">
            {/* Course Thumbnail */}
            <div
              className="relative flex-shrink-0 overflow-hidden rounded-3xl"
              style={{ width: 200, height: 200 }}
            >
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

              {/* XP Badge */}
              {enrollment && (
                <div className="absolute top-3 left-3">
                  <span className="inline-flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2.5 py-1.5 rounded-full text-xs font-semibold text-gray-700">
                    <SealCheckIcon size={14} />
                    1500 XP
                  </span>
                </div>
              )}
            </div>

            {/* Course Info */}
            <div className="flex-1 p-5 flex flex-col justify-around">
              {/* Labels */}
              <div className="flex items-center gap-2">
                {duration && (
                  <span className="inline-flex items-center gap-1.5 text-xs  bg-white px-3 py-1 rounded-full border border-[#D4D4D4]">
                    <ClockIcon size={14} />
                    {duration}
                  </span>
                )}
                {lessonCount > 0 && (
                  <span className="inline-flex items-center gap-1.5 text-xs  bg-white px-3 py-1 rounded-full border border-[#D4D4D4]">
                    <BookOpenIcon size={14} />
                    {lessonCount} хичээл
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

              {/* Progress */}
              {enrollment && (
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
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
