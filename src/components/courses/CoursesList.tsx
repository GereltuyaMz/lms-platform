import { CourseCard } from "@/components/courses/CourseCard";
import type { CourseWithCategories } from "@/types/database";

type CoursesListProps = {
  courses: CourseWithCategories[];
};

export const CoursesList = ({ courses }: CoursesListProps) => {
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
    <div className="flex flex-col gap-6">
      {courses.map((course) => {
        const courseProps = {
          slug: course.slug,
          title: course.title,
          description: course.description || "",
          instructor: {
            name:
              course.teacher?.full_name_mn ||
              course.teacher?.full_name ||
              "Багш",
            avatar: course.teacher?.avatar_url || undefined,
          },
          duration: `${course.duration_hours || 0} цаг`,
          lessons: course.lesson_count || 0,
          level: course.level,
          price: course.price,
          originalPrice: course.original_price || undefined,
          thumbnail: course.thumbnail_url || undefined,
        };

        return <CourseCard key={course.id} {...courseProps} />;
      })}
    </div>
  );
};
