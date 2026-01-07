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
import { fetchUnitsWithQuiz } from "@/lib/lesson-utils";
import { findNextUncompletedLesson } from "@/lib/utils";

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
      .order("order_in_unit"),
  ]);

  const courseStats = stats?.[0] || {
    lesson_count: 0,
    total_duration_seconds: 0,
    exercise_count: 0,
    total_xp: 0,
  };

  // Legacy section-based grouping removed - all courses now use units
  const lessonsBySection = undefined;

  // Get first lesson ID for enrollment link
  const firstLessonId = hasUnits
    ? units[0]?.lessons?.[0]?.id || null
    : lessons?.[0]?.id || null;

  // Check if user is enrolled and has purchased
  const [enrollmentStatus, hasPurchased] = await Promise.all([
    checkEnrollment(course.id),
    hasCourseAccess(course.id),
  ]);

  // Fetch completion data for enrolled users
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch applicable coupon for this course
  let applicableCoupon = null;

  if (user) {
    const { data: coupon } = await supabase
      .from("course_discount_coupons")
      .select("id, discount_percentage, expires_at")
      .eq("user_id", user.id)
      .eq("course_id", course.id)
      .eq("is_used", false)
      .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
      .order("discount_percentage", { ascending: false })
      .limit(1)
      .maybeSingle();

    applicableCoupon = coupon;
  }

  let completedLessonIds: string[] = [];
  let completedUnitQuizIds: string[] = [];
  let unitQuizMap = new Map<string, boolean>();

  if (enrollmentStatus.isEnrolled && user) {
    // Fetch enrollment ID
    const { data: enrollment } = await supabase
      .from("enrollments")
      .select("id")
      .eq("user_id", user.id)
      .eq("course_id", course.id)
      .single();

    if (enrollment) {
      // Parallel fetches for completion data
      const [{ data: lessonProgressData }, { data: unitQuizAttemptsData }] =
        await Promise.all([
          // Get completed lessons
          supabase
            .from("lesson_progress")
            .select("lesson_id")
            .eq("enrollment_id", enrollment.id)
            .eq("is_completed", true),

          // Get passed unit quizzes
          supabase
            .from("quiz_attempts")
            .select("unit_id")
            .eq("enrollment_id", enrollment.id)
            .eq("passed", true)
            .not("unit_id", "is", null),
        ]);

      completedLessonIds = lessonProgressData?.map((p) => p.lesson_id) || [];
      completedUnitQuizIds = unitQuizAttemptsData?.map((q) => q.unit_id!) || [];
    }
  }

  // Get units that have quizzes
  if (hasUnits) {
    unitQuizMap = await fetchUnitsWithQuiz(
      supabase,
      units.map((u) => u.id)
    );
  }

  // Calculate next uncompleted lesson for continue button
  let nextLessonData: { type: "lesson" | "unit-quiz"; id: string } | null =
    null;

  if (enrollmentStatus.isEnrolled && hasUnits) {
    nextLessonData = findNextUncompletedLesson(
      units,
      completedLessonIds,
      completedUnitQuizIds,
      unitQuizMap
    );
  }

  // Build continue button URL
  const continueButtonUrl = nextLessonData
    ? nextLessonData.type === "lesson"
      ? `/courses/${slug}/learn/lesson/${nextLessonData.id}/theory`
      : `/courses/${slug}/learn/lesson/${nextLessonData.id}/unit-quiz`
    : firstLessonId
    ? `/courses/${slug}/learn/lesson/${firstLessonId}/theory`
    : null;

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
      <div className="container mx-auto py-14 max-w-[1510px] px-8 lg:px-[120px]">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-14 mt-10">
          {/* Left Content - Course Content & Instructor */}
          <div className="lg:col-span-2 space-y-20">
            <CourseContent
              units={hasUnits ? units : undefined}
              lessonsBySection={lessonsBySection}
              courseSlug={course.slug}
              completedLessonIds={completedLessonIds}
              completedUnitQuizIds={completedUnitQuizIds}
              unitQuizMap={unitQuizMap}
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
              continueButtonUrl={continueButtonUrl}
              isEnrolled={enrollmentStatus.isEnrolled}
              hasPurchased={hasPurchased}
              applicableCoupon={applicableCoupon}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
