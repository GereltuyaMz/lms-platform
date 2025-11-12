"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

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
    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        message: "You must be logged in to enroll in a course",
      };
    }

    // Check if user_profile exists, if not create it
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("id")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      // Create user profile if it doesn't exist
      const { error: createProfileError } = await supabase
        .from("user_profiles")
        .insert({
          id: user.id,
          email: user.email!,
          full_name: user.user_metadata?.full_name || "Student",
          avatar_url: user.user_metadata?.avatar_url || null,
        });

      if (createProfileError) {
        console.error("Error creating user profile:", createProfileError);
        return {
          success: false,
          message: "Error creating user profile",
        };
      }
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

      console.error("Error creating enrollment:", enrollmentError);
      return {
        success: false,
        message: "Error enrolling in course",
      };
    }

    // Revalidate relevant pages
    revalidatePath("/dashboard");
    revalidatePath(`/courses`);

    return {
      success: true,
      message: "Successfully enrolled in course!",
      enrollmentId: enrollment.id,
    };
  } catch (error) {
    console.error("Unexpected error in createEnrollment:", error);
    return {
      success: false,
      message: "An unexpected error occurred",
    };
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
    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

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
  } catch (error) {
    console.error("Error checking enrollment:", error);
    return { isEnrolled: false };
  }
}

/**
 * Get all enrollments for the authenticated user with course details
 * @returns Array of enrollments with course information
 */
export async function getUserEnrollments() {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { data: null, error: "Not authenticated" };
    }

    // Get enrollments with course details
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
          level
        )
      `
      )
      .eq("user_id", user.id)
      .order("enrolled_at", { ascending: false });

    if (enrollmentError) {
      console.error("Error fetching enrollments:", enrollmentError);
      return { data: null, error: "Error fetching enrollments" };
    }

    return { data: enrollments, error: null };
  } catch (error) {
    console.error("Unexpected error in getUserEnrollments:", error);
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
    const supabase = await createClient();

    const { data: enrollment, error } = await supabase
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

    if (error) {
      console.error("Error fetching enrollment details:", error);
      return { data: null, error: "Error fetching enrollment details" };
    }

    return { data: enrollment, error: null };
  } catch (error) {
    console.error("Unexpected error in getEnrollmentDetails:", error);
    return { data: null, error: "An unexpected error occurred" };
  }
}

/**
 * Get the last accessed lesson for a course
 * Returns the most recently updated lesson from lesson_progress, or the first lesson if no progress
 * @param courseId - UUID of the course
 * @param courseSlug - Slug of the course
 * @returns Lesson ID or null
 */
export async function getLastAccessedLesson(
  courseId: string,
  courseSlug: string
): Promise<string | null> {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

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
  } catch (error) {
    console.error("Error getting last accessed lesson:", error);
    return null;
  }
}
