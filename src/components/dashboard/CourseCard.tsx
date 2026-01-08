import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock } from "lucide-react";
import { PlaceholderImage } from "@/icons";
import { formatCourseLevel } from "@/lib/utils/formatters";
import type { CourseLevel } from "@/types/database/enums";

type CourseCardProps = {
  course: {
    title: string;
    slug: string;
    description: string | null;
    thumbnail_url: string | null;
    level: CourseLevel;
  };
  enrollment?: {
    id: string;
    enrolled_at: string;
    progress_percentage: number;
    lastLessonId: string | null;
  };
};

export const CourseCard = ({ course, enrollment }: CourseCardProps) => {
  const formatEnrolledDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Өнөөдөр элссэн";
    if (diffInDays === 1) return "Өчигдөр элссэн";
    if (diffInDays < 7) return `${diffInDays} өдрийн өмнө элссэн`;
    return `${date.toLocaleDateString("mn-MN")} элссэн`;
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-0">
        {/* Course Thumbnail */}
        <div className="relative w-full h-48 bg-gray-200">
          {course.thumbnail_url ? (
            <Image
              src={course.thumbnail_url}
              alt={course.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
                <PlaceholderImage className="w-10 h-10 text-gray-400" />
              </div>
            </div>
          )}

          {/* Progress indicator on thumbnail for enrolled courses */}
          {enrollment && enrollment.progress_percentage > 0 && (
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-300">
              <div
                className="h-full bg-emerald-500"
                style={{ width: `${enrollment.progress_percentage}%` }}
              />
            </div>
          )}

          {/* Level Badge for non-enrolled courses */}
          {!enrollment && (
            <div className="absolute top-3 right-3">
              <span className="inline-block bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-700">
                {formatCourseLevel(course.level)}
              </span>
            </div>
          )}
        </div>

        {/* Course Info */}
        <div className="p-6">
          <h3 className="text-xl font-bold mb-2">{course.title}</h3>

          {/* Enrolled course: Progress */}
          {enrollment ? (
            <>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Явц</span>
                  <span className="font-semibold">
                    {enrollment.progress_percentage}%
                  </span>
                </div>
                <Progress
                  value={enrollment.progress_percentage}
                  className="h-2"
                />
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <Clock className="w-4 h-4" />
                <span>{formatEnrolledDate(enrollment.enrolled_at)}</span>
              </div>
            </>
          ) : (
            /* Recommended course: Description */
            course.description && (
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {course.description}
              </p>
            )
          )}

          {/* Action Button */}
          <Link
            href={
              enrollment && enrollment.lastLessonId
                ? `/courses/${course.slug}/learn/lesson/${enrollment.lastLessonId}`
                : `/courses/${course.slug}`
            }
          >
            <Button
              className="w-full cursor-pointer hover:text-white"
              variant={
                enrollment && enrollment.progress_percentage > 0
                  ? "default"
                  : "outline"
              }
            >
              {enrollment
                ? enrollment.progress_percentage > 0
                  ? "Үргэлжлүүлэх"
                  : "Эхлүүлэх"
                : "Хичээл үзэх"}
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
