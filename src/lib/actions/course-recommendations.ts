"use server";

import { SupabaseClient } from "@supabase/supabase-js";
import { getAuthenticatedUser } from "./helpers";
import type { RecommendedCourse } from "@/types/database/queries";

// Helper to fetch course stats (duration and XP) from the courses_with_stats view
async function getCourseStats(
  supabase: SupabaseClient,
  courseIds: string[]
): Promise<Record<string, { duration: number; xp: number }>> {
  if (courseIds.length === 0) return {};

  const { data } = await supabase
    .from("courses_with_stats")
    .select("id, total_duration_seconds, total_xp")
    .in("id", courseIds);

  const stats: Record<string, { duration: number; xp: number }> = {};
  data?.forEach((c) => {
    stats[c.id] = {
      duration: c.total_duration_seconds || 0,
      xp: c.total_xp || 0,
    };
  });
  return stats;
}

// Helper to merge stats (duration and XP) into courses
function mergeCourseStats<T extends { id: string }>(
  courses: T[],
  stats: Record<string, { duration: number; xp: number }>
): (T & { total_duration_seconds: number; total_xp: number })[] {
  return courses.map((course) => ({
    ...course,
    total_duration_seconds: stats[course.id]?.duration || 0,
    total_xp: stats[course.id]?.xp || 0,
  }));
}

/**
 * Get personalized course recommendations based on user's learning goals
 * @returns Recommended courses or random courses if no learning goals set
 */
export async function getRecommendedCourses(): Promise<{
  success: boolean;
  courses: RecommendedCourse[];
  isPersonalized: boolean;
}> {
  try {
    const { user, supabase } = await getAuthenticatedUser();

    if (!user) {
      return {
        success: false,
        courses: [],
        isPersonalized: false,
      };
    }

    // Get user's enrolled course IDs to exclude from recommendations
    const { data: enrollments } = await supabase
      .from("enrollments")
      .select("course_id")
      .eq("user_id", user.id);

    const enrolledCourseIds = enrollments?.map((e) => e.course_id) || [];

    // Get user's learning goals from profile
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("learning_goals")
      .eq("id", user.id)
      .single();

    const learningGoals = profile?.learning_goals;
    const hasLearningGoals =
      learningGoals && Array.isArray(learningGoals) && learningGoals.length > 0;

    // Query includes lesson count and duration
    const courseSelect = `
      id, title, slug, description, thumbnail_url, level,
      lessons (count)
    `;

    // If user has learning goals, search for relevant courses
    if (hasLearningGoals) {
      // Build search query from learning goals
      // Join all goals into a single search string
      const searchTerms = learningGoals.join(" ");

      // Search courses by title and description matching learning goals
      let query = supabase
        .from("courses")
        .select(courseSelect)
        .or(
          `title.ilike.%${searchTerms}%,description.ilike.%${searchTerms}%`
        )
        .eq("is_published", true);

      // Exclude enrolled courses
      if (enrolledCourseIds.length > 0) {
        query = query.not("id", "in", `(${enrolledCourseIds.join(",")})`);
      }

      const { data: courses, error } = await query.limit(4);

      if (error) {
        // Fallback to random courses if search fails
        let fallbackQuery = supabase
          .from("courses")
          .select(courseSelect)
          .eq("is_published", true);

        if (enrolledCourseIds.length > 0) {
          fallbackQuery = fallbackQuery.not("id", "in", `(${enrolledCourseIds.join(",")})`);
        }

        const { data: randomCourses } = await fallbackQuery.limit(4);

        // Fetch stats from courses_with_stats view
        const courseIds = randomCourses?.map((c) => c.id) || [];
        const courseStats = await getCourseStats(supabase, courseIds);

        return {
          success: true,
          courses: mergeCourseStats(randomCourses || [], courseStats),
          isPersonalized: false,
        };
      }

      // If we found matching courses, return them with stats
      if (courses && courses.length > 0) {
        const courseIds = courses.map((c) => c.id);
        const courseStats = await getCourseStats(supabase, courseIds);

        return {
          success: true,
          courses: mergeCourseStats(courses, courseStats),
          isPersonalized: true,
        };
      }
    }

    // Fallback: Get random popular courses
    let randomQuery = supabase
      .from("courses")
      .select(courseSelect)
      .eq("is_published", true);

    if (enrolledCourseIds.length > 0) {
      randomQuery = randomQuery.not("id", "in", `(${enrolledCourseIds.join(",")})`);
    }

    const { data: randomCourses, error: randomError } = await randomQuery.limit(4);

    if (randomError) {
      return {
        success: false,
        courses: [],
        isPersonalized: false,
      };
    }

    // Fetch stats for fallback courses
    const courseIds = randomCourses?.map((c) => c.id) || [];
    const courseStats = await getCourseStats(supabase, courseIds);

    return {
      success: true,
      courses: mergeCourseStats(randomCourses || [], courseStats),
      isPersonalized: false,
    };
  } catch {
    return {
      success: false,
      courses: [],
      isPersonalized: false,
    };
  }
}
