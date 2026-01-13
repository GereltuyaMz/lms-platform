import { createClient } from "@/lib/supabase/server";
import { getCourseUnits } from "@/lib/actions/unit-actions";
import { fetchUnitsWithQuiz } from "@/lib/lesson-utils";
import { findNextUncompletedLesson } from "@/lib/utils";

type CourseStats = {
  lesson_count: number;
  total_duration_seconds: number;
  exercise_count: number;
  total_xp: number;
};

export const fetchCourseWithRelations = async (slug: string) => {
  const supabase = await createClient();

  const { data: course, error } = await supabase
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

  return { course, error };
};

export const fetchCourseStats = async (
  courseId: string
): Promise<CourseStats> => {
  const supabase = await createClient();

  const { data: stats } = await supabase.rpc("calculate_course_stats", {
    course_uuid: courseId,
  });

  return (
    stats?.[0] || {
      lesson_count: 0,
      total_duration_seconds: 0,
      exercise_count: 0,
      total_xp: 0,
    }
  );
};

export const fetchApplicableCoupon = async (
  userId: string,
  courseId: string
) => {
  const supabase = await createClient();

  const { data: coupon } = await supabase
    .from("course_discount_coupons")
    .select("id, discount_percentage, expires_at")
    .eq("user_id", userId)
    .eq("course_id", courseId)
    .eq("is_used", false)
    .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
    .order("discount_percentage", { ascending: false })
    .limit(1)
    .maybeSingle();

  return coupon;
};

export const fetchUserProgress = async (
  userId: string,
  courseId: string
): Promise<{
  completedLessonIds: string[];
  completedUnitQuizIds: string[];
  claimedUnitIds: string[];
  claimedUnitContentGroups: string[];
}> => {
  const supabase = await createClient();

  const { data: enrollment } = await supabase
    .from("enrollments")
    .select("id, units_completed, unit_content_completed")
    .eq("user_id", userId)
    .eq("course_id", courseId)
    .single();

  if (!enrollment) {
    return {
      completedLessonIds: [],
      completedUnitQuizIds: [],
      claimedUnitIds: [],
      claimedUnitContentGroups: [],
    };
  }

  const [{ data: lessonProgressData }, { data: unitQuizAttemptsData }] =
    await Promise.all([
      supabase
        .from("lesson_progress")
        .select("lesson_id")
        .eq("enrollment_id", enrollment.id)
        .eq("is_completed", true),

      supabase
        .from("quiz_attempts")
        .select("unit_id")
        .eq("enrollment_id", enrollment.id)
        .eq("passed", true)
        .not("unit_id", "is", null),
    ]);

  return {
    completedLessonIds: lessonProgressData?.map((p) => p.lesson_id) || [],
    completedUnitQuizIds: unitQuizAttemptsData?.map((q) => q.unit_id!) || [],
    claimedUnitIds: (enrollment.units_completed as string[]) || [],
    claimedUnitContentGroups: (enrollment.unit_content_completed as string[]) || [],
  };
};

export const buildContinueUrl = async (
  courseId: string,
  slug: string,
  isEnrolled: boolean
) => {
  const units = await getCourseUnits(courseId);
  const hasUnits = units.length > 0;

  if (!hasUnits || !isEnrolled) {
    const firstLessonId = units[0]?.lessons?.[0]?.id || null;
    return firstLessonId
      ? `/courses/${slug}/learn/lesson/${firstLessonId}/theory`
      : null;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const firstLessonId = units[0]?.lessons?.[0]?.id || null;
    return firstLessonId
      ? `/courses/${slug}/learn/lesson/${firstLessonId}/theory`
      : null;
  }

  const { completedLessonIds, completedUnitQuizIds } = await fetchUserProgress(
    user.id,
    courseId
  );

  const unitQuizMap = await fetchUnitsWithQuiz(
    supabase,
    units.map((u) => u.id)
  );

  const nextLessonData = findNextUncompletedLesson(
    units,
    completedLessonIds,
    completedUnitQuizIds,
    unitQuizMap
  );

  if (nextLessonData) {
    return nextLessonData.type === "lesson"
      ? `/courses/${slug}/learn/lesson/${nextLessonData.id}/theory`
      : `/courses/${slug}/learn/lesson/${nextLessonData.id}/unit-quiz`;
  }

  const firstLessonId = units[0]?.lessons?.[0]?.id || null;
  return firstLessonId
    ? `/courses/${slug}/learn/lesson/${firstLessonId}/theory`
    : null;
};
