"use server";

import { getAuthenticatedUser } from "./helpers";
import type { RecommendedCourse } from "@/types/database/queries";

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

    // Get user's learning goals from profile
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("learning_goals")
      .eq("id", user.id)
      .single();

    const learningGoals = profile?.learning_goals;
    const hasLearningGoals =
      learningGoals && Array.isArray(learningGoals) && learningGoals.length > 0;

    // If user has learning goals, search for relevant courses
    if (hasLearningGoals) {
      // Build search query from learning goals
      // Join all goals into a single search string
      const searchTerms = learningGoals.join(" ");

      // Search courses by title and description matching learning goals
      const { data: courses, error } = await supabase
        .from("courses")
        .select("id, title, slug, description, thumbnail_url, level")
        .or(
          `title.ilike.%${searchTerms}%,description.ilike.%${searchTerms}%`
        )
        .eq("is_published", true)
        .limit(4);

      if (error) {
        // Fallback to random courses if search fails
        const { data: randomCourses } = await supabase
          .from("courses")
          .select("id, title, slug, description, thumbnail_url, level")
          .eq("is_published", true)
          .limit(4);

        return {
          success: true,
          courses: randomCourses || [],
          isPersonalized: false,
        };
      }

      // If we found matching courses, return them
      if (courses && courses.length > 0) {
        return {
          success: true,
          courses,
          isPersonalized: true,
        };
      }
    }

    // Fallback: Get random popular courses
    const { data: randomCourses, error: randomError } = await supabase
      .from("courses")
      .select("id, title, slug, description, thumbnail_url, level")
      .eq("is_published", true)
      .limit(4);

    if (randomError) {
      return {
        success: false,
        courses: [],
        isPersonalized: false,
      };
    }

    return {
      success: true,
      courses: randomCourses || [],
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
