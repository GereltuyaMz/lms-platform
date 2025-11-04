import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CourseHero } from "@/components/courses/detail/CourseHero";
import { CourseContent } from "@/components/courses/detail/CourseContent";
import { CourseSidebar } from "@/components/courses/detail/CourseSidebar";
import { Instructor } from "@/components/courses/detail/Instructor";

type PageProps = {
  params: Promise<{ slug: string }>;
};

const CourseDetailPage = async ({ params }: PageProps) => {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: course, error: courseError } = await supabase
    .from("courses")
    .select(
      `
      *,
      course_categories (
        category_id,
        categories (
          id,
          name,
          slug
        )
      )
    `
    )
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (courseError || !course) {
    notFound();
  }

  const { data: stats } = await supabase.rpc("calculate_course_stats", {
    course_uuid: course.id,
  });

  const courseStats = stats?.[0] || {
    lesson_count: 0,
    total_duration_minutes: 0,
  };

  const { data: lessons } = await supabase
    .from("lessons")
    .select("*")
    .eq("course_id", course.id)
    .order("order_index");

  // Group lessons by section
  const lessonsBySection = (lessons || []).reduce((acc, lesson) => {
    const sectionTitle = lesson.section_title || "Uncategorized";
    if (!acc[sectionTitle]) {
      acc[sectionTitle] = [];
    }
    acc[sectionTitle].push(lesson);
    return acc;
  }, {} as Record<string, typeof lessons>);

  return (
    <div className="min-h-screen bg-white">
      {/* Course Hero Section */}
      <CourseHero
        course={course}
        lessonCount={courseStats.lesson_count}
        totalDurationMinutes={courseStats.total_duration_minutes}
      />

      {/* Main Content */}
      <div className="container mx-auto py-14 max-w-[1400px]">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-14">
          {/* Left Content - Course Content & Instructor */}
          <div className="lg:col-span-2 space-y-20">
            <CourseContent lessonsBySection={lessonsBySection} />
            <Instructor />
          </div>

          {/* Right Sidebar - Pricing & Actions */}
          <div className="lg:col-span-1">
            <CourseSidebar
              courseSlug={course.slug}
              price={course.price}
              originalPrice={course.original_price}
              thumbnailUrl={course.thumbnail_url}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
