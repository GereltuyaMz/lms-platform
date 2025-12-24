import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  CourseHero,
  CourseContent,
  CourseSidebar,
  Instructor,
} from "@/components/courses/detail";
import { checkEnrollment } from "@/lib/actions";
import { hasCourseAccess } from "@/lib/actions/purchase";
import { getCourseUnits } from "@/lib/actions/unit-actions";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 3600;

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
      ),
      teacher:instructor_id (
        id,
        full_name,
        full_name_mn,
        bio_mn,
        avatar_url,
        specialization,
        credentials_mn,
        years_experience
      )
    `
    )
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (courseError || !course) {
    notFound();
  }

  // Fetch units with lessons (new structure)
  const units = await getCourseUnits(course.id);
  const hasUnits = units.length > 0;

  // Parallel queries for stats and lessons
  const [{ data: stats }, { data: lessons }] = await Promise.all([
    supabase.rpc("calculate_course_stats", {
      course_uuid: course.id,
    }),
    supabase
      .from("lessons")
      .select("*")
      .eq("course_id", course.id)
      .order("order_index"),
  ]);

  const courseStats = stats?.[0] || {
    lesson_count: 0,
    total_duration_seconds: 0,
    exercise_count: 0,
    total_xp: 0,
  };

  // Group lessons by section (legacy fallback)
  const lessonsBySection = hasUnits
    ? undefined
    : (lessons || []).reduce(
        (acc, lesson) => {
          const sectionTitle = lesson.section_title || "Uncategorized";
          if (!acc[sectionTitle]) {
            acc[sectionTitle] = [];
          }
          acc[sectionTitle].push(lesson);
          return acc;
        },
        {} as Record<string, typeof lessons>
      );

  // Get first lesson ID for enrollment link
  const firstLessonId = hasUnits
    ? units[0]?.lessons?.[0]?.id || null
    : lessons?.[0]?.id || null;

  // Check if user is enrolled and has purchased
  const [enrollmentStatus, hasPurchased] = await Promise.all([
    checkEnrollment(course.id),
    hasCourseAccess(course.id),
  ]);

  return (
    <div className="min-h-screen bg-white">
      {/* Course Hero Section */}
      <CourseHero
        course={course}
        lessonCount={courseStats.lesson_count}
        totalDurationSeconds={courseStats.total_duration_seconds}
        exerciseCount={courseStats.exercise_count}
        totalXp={courseStats.total_xp}
      />

      {/* Main Content */}
      <div className="container mx-auto py-14 max-w-[1400px]">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-14">
          {/* Left Content - Course Content & Instructor */}
          <div className="lg:col-span-2 space-y-20">
            <CourseContent
              units={hasUnits ? units : undefined}
              lessonsBySection={lessonsBySection}
            />
            <Instructor teacher={course.teacher} />
          </div>

          {/* Right Sidebar - Pricing & Actions */}
          <div className="lg:col-span-1">
            <CourseSidebar
              courseId={course.id}
              courseSlug={course.slug}
              price={course.price}
              originalPrice={course.original_price}
              thumbnailUrl={course.thumbnail_url}
              firstLessonId={firstLessonId}
              isEnrolled={enrollmentStatus.isEnrolled}
              hasPurchased={hasPurchased}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
