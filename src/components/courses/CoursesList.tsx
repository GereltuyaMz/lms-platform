import { CourseCard } from "@/components/courses/CourseCard";
import type { CourseWithCategories } from "@/types/database";

type CoursesListProps = {
  courses: CourseWithCategories[];
  userCoupons?: Record<string, { discount_percentage: number }>;
};

const formatDuration = (seconds: number | null | undefined): string => {
  if (!seconds || seconds === 0) return "0 мин";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.ceil((seconds % 3600) / 60);
  if (hours > 0) {
    return minutes > 0 ? `${hours} цаг ${minutes} мин` : `${hours} цаг`;
  }
  return `${minutes} мин`;
};

export const CoursesList = ({ courses, userCoupons }: CoursesListProps) => {
  if (courses.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          Таны шүүлтүүрт тохирох сургалт олдсонгүй.
        </p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
      {courses.map((course) => {
        const courseProps = {
          slug: course.slug,
          title: course.title,
          description: course.description || "",
          duration: formatDuration(course.total_duration_seconds),
          lessons: course.lesson_count || 0,
          level: course.level,
          thumbnail: course.thumbnail_url || undefined,
          xpReward: course.total_xp || 0,
        };

        return <CourseCard key={course.id} {...courseProps} />;
      })}
    </div>
  );
};
