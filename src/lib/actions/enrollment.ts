"use server";

import {
  getAuthenticatedUser,
  ensureUserProfile,
  revalidateUserPages,
  handleActionError,
} from "./helpers";

type EnrollmentResult = {
  success: boolean;
  message: string;
  enrollmentId?: string;
};

type EnrollmentCheckResult = {
  isEnrolled: boolean;
  enrollmentId?: string;
  progress?: number;
};

/**
 * Create a new enrollment for the authenticated user
 * @param courseId - UUID of the course to enroll in
 * @returns Result object with success status and message
 */
export async function createEnrollment(
  courseId: string
): Promise<EnrollmentResult> {
  try {
    const { user, supabase, error: authError } = await getAuthenticatedUser();

    if (authError || !user) {
      return {
        success: false,
        message: "You must be logged in to enroll in a course",
      };
    }

    // Ensure user profile exists
    const { error: profileError } = await ensureUserProfile(user);
    if (profileError) {
      return {
        success: false,
        message: profileError,
      };
    }

    // Create enrollment
    const { data: enrollment, error: enrollmentError } = await supabase
      .from("enrollments")
      .insert({
        user_id: user.id,
        course_id: courseId,
      })
      .select("id")
      .single();

    if (enrollmentError) {
      // Check if already enrolled (unique constraint violation)
      if (enrollmentError.code === "23505") {
        return {
          success: false,
          message: "You are already enrolled in this course",
        };
      }

      return {
        success: false,
        message: "Error enrolling in course",
      };
    }

    // Revalidate relevant pages
    revalidateUserPages(["/courses"]);

    return {
      success: true,
      message: "Successfully enrolled in course!",
      enrollmentId: enrollment.id,
    };
  } catch (error) {
    return handleActionError(error) as EnrollmentResult;
  }
}

/**
 * Check if the authenticated user is enrolled in a course
 * @param courseId - UUID of the course to check
 * @returns Object indicating enrollment status
 */
export async function checkEnrollment(
  courseId: string
): Promise<EnrollmentCheckResult> {
  try {
    const { user, supabase, error: authError } = await getAuthenticatedUser();

    if (authError || !user) {
      return { isEnrolled: false };
    }

    // Check enrollment
    const { data: enrollment, error: enrollmentError } = await supabase
      .from("enrollments")
      .select("id, progress_percentage")
      .eq("user_id", user.id)
      .eq("course_id", courseId)
      .single();

    if (enrollmentError || !enrollment) {
      return { isEnrolled: false };
    }

    return {
      isEnrolled: true,
      enrollmentId: enrollment.id,
      progress: enrollment.progress_percentage,
    };
  } catch {
    return { isEnrolled: false };
  }
}

/**
 * Get all enrollments for the authenticated user with course details
 * @returns Array of enrollments with course information
 */
export async function getUserEnrollments() {
  try {
    const { user, supabase, error: authError } = await getAuthenticatedUser();

    if (authError || !user) {
      return { data: null, error: authError };
    }

    // Get enrollments with course details including duration and lesson count
    const { data: enrollments, error: enrollmentError } = await supabase
      .from("enrollments")
      .select(
        `
        id,
        enrolled_at,
        progress_percentage,
        completed_at,
        courses (
          id,
          title,
          slug,
          description,
          thumbnail_url,
          level,
          duration_hours,
          lessons (count)
        )
      `
      )
      .eq("user_id", user.id)
      .order("enrolled_at", { ascending: false });

    if (enrollmentError) {
      return { data: null, error: "Error fetching enrollments" };
    }

    return { data: enrollments, error: null };
  } catch {
    return { data: null, error: "An unexpected error occurred" };
  }
}

/**
 * Get enrollment details including lesson progress
 * @param enrollmentId - UUID of the enrollment
 * @returns Enrollment with lesson progress
 */
export async function getEnrollmentDetails(enrollmentId: string) {
  try {
    const { supabase } = await getAuthenticatedUser();

    const { data: enrollment } = await supabase
      .from("enrollments")
      .select(
        `
        id,
        enrolled_at,
        progress_percentage,
        completed_at,
        courses (
          id,
          title,
          slug
        ),
        lesson_progress (
          lesson_id,
          is_completed,
          last_position_seconds
        )
      `
      )
      .eq("id", enrollmentId)
      .single();

    if (!enrollment) {
      return { data: null, error: "Error fetching enrollment details" };
    }

    return { data: enrollment, error: null };
  } catch {
    return { data: null, error: "An unexpected error occurred" };
  }
}

/**
 * Get the last accessed lesson for a course
 * Returns the most recently updated lesson from lesson_progress, or the first lesson if no progress
 * @param courseId - UUID of the course
 * @returns Lesson ID or null
 */
export async function getLastAccessedLesson(
  courseId: string
): Promise<string | null> {
  try {
    const { user, supabase, error: authError } = await getAuthenticatedUser();

    if (authError || !user) {
      return null;
    }

    // Get enrollment for this course
    const { data: enrollment, error: enrollmentError } = await supabase
      .from("enrollments")
      .select("id")
      .eq("user_id", user.id)
      .eq("course_id", courseId)
      .single();

    if (enrollmentError || !enrollment) {
      return null;
    }

    // Get the most recently updated lesson progress
    const { data: lastProgress, error: progressError } = await supabase
      .from("lesson_progress")
      .select("lesson_id")
      .eq("enrollment_id", enrollment.id)
      .order("updated_at", { ascending: false })
      .limit(1)
      .single();

    if (progressError || !lastProgress) {
      // No progress yet, return first lesson of the course
      const { data: firstLesson, error: lessonError } = await supabase
        .from("lessons")
        .select("id")
        .eq("course_id", courseId)
        .order("order_index", { ascending: true })
        .limit(1)
        .single();

      if (lessonError || !firstLesson) {
        return null;
      }

      return firstLesson.id;
    }

    return lastProgress.lesson_id;
  } catch {
    return null;
  }
}
