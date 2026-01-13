import { createClient } from "@/lib/supabase/server";
import { hasXPBeenAwarded, getCourseTitle, getUnitTitle } from "./queries";
import { insertXPTransaction } from "./transactions";

/**
 * Check and award course completion bonus (150 XP)
 */
export async function checkAndAwardCourseCompletion(
  userId: string,
  courseId: string,
  enrollmentId: string
): Promise<{ awarded: boolean; xp: number }> {
  const supabase = await createClient();

  const { data: enrollment } = await supabase
    .from("enrollments")
    .select("progress_percentage")
    .eq("id", enrollmentId)
    .single();

  if (!enrollment || enrollment.progress_percentage < 100) {
    return { awarded: false, xp: 0 };
  }

  const alreadyAwarded = await hasXPBeenAwarded(userId, "course_complete", courseId);

  if (alreadyAwarded) {
    return { awarded: false, xp: 0 };
  }

  const courseTitle = await getCourseTitle(courseId);

  const success = await insertXPTransaction(
    userId,
    150,
    "course_complete",
    courseId,
    `Completed course "${courseTitle}"`,
    { course_id: courseId, enrollment_id: enrollmentId }
  );

  return success ? { awarded: true, xp: 150 } : { awarded: false, xp: 0 };
}

/**
 * Check and award unit completion bonus (50 XP)
 */
export async function checkAndAwardUnitCompletion(
  userId: string,
  lessonId: string,
  enrollmentId: string
): Promise<{ awarded: boolean; xp: number }> {
  const supabase = await createClient();

  const { data: lesson } = await supabase
    .from("lessons")
    .select("unit_id")
    .eq("id", lessonId)
    .single();

  if (!lesson?.unit_id) {
    return { awarded: false, xp: 0 };
  }

  const { data: isComplete } = await supabase.rpc("is_unit_complete", {
    p_enrollment_id: enrollmentId,
    p_unit_id: lesson.unit_id,
  });

  if (!isComplete) {
    return { awarded: false, xp: 0 };
  }

  const { data: enrollment } = await supabase
    .from("enrollments")
    .select("units_completed")
    .eq("id", enrollmentId)
    .single();

  const unitsCompleted = (enrollment?.units_completed as string[]) || [];

  if (unitsCompleted.includes(lesson.unit_id)) {
    return { awarded: false, xp: 0 };
  }

  const unitTitle = await getUnitTitle(lesson.unit_id);

  const success = await insertXPTransaction(
    userId,
    50,
    "unit_complete",
    lesson.unit_id,
    `Completed unit "${unitTitle}"`,
    { unit_id: lesson.unit_id }
  );

  if (success) {
    await supabase
      .from("enrollments")
      .update({ units_completed: [...unitsCompleted, lesson.unit_id] })
      .eq("id", enrollmentId);

    return { awarded: true, xp: 50 };
  }

  return { awarded: false, xp: 0 };
}
