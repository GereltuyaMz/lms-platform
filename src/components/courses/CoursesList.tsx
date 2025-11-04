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
          No courses found matching your filters.
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
          instructor: { name: "TBD", avatar: undefined as string | undefined },
          duration: `${course.duration_hours || 0} hours`,
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
