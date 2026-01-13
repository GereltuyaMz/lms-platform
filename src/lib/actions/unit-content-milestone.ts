"use server";

import { createClient } from "@/lib/supabase/server";
import { insertXPTransaction, hasXPBeenAwarded } from "./xp-helpers";

/**
 * Progressive XP rewards for unit content group completion
 * - 1st group: 30 XP
 * - 2nd group: 50 XP
 * - 3rd group: 70 XP
 * - 4th+ group: 100 XP
 */
const UNIT_CONTENT_XP_REWARDS = [30, 50, 70, 100];

type ClaimResult = {
  success: boolean;
  xpAwarded: number;
  message: string;
};

/**
 * Claim XP reward for completing all units within a unit_content group
 */
export async function claimUnitContentMilestoneXP(
  unitContent: string,
  courseId: string
): Promise<ClaimResult> {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, xpAwarded: 0, message: "Нэвтрээгүй байна" };
  }

  // Get enrollment for this course
  const { data: enrollment, error: enrollmentError } = await supabase
    .from("enrollments")
    .select("id, unit_content_completed")
    .eq("user_id", user.id)
    .eq("course_id", courseId)
    .single();

  if (enrollmentError) {
    console.error("Enrollment fetch error:", enrollmentError.message);
    return {
      success: false,
      xpAwarded: 0,
      message: `Бүртгэл олдсонгүй: ${enrollmentError.message}`,
    };
  }

  if (!enrollment) {
    return { success: false, xpAwarded: 0, message: "Бүртгэл олдсонгүй" };
  }

  // Check if this unit_content group already claimed
  const claimedGroups = (enrollment.unit_content_completed as string[]) || [];
  if (claimedGroups.includes(unitContent)) {
    return { success: false, xpAwarded: 0, message: "Аль хэдийн авсан" };
  }

  // Check if all units in this group are complete using RPC
  const { data: isComplete, error: rpcError } = await supabase.rpc(
    "is_unit_content_group_complete",
    {
      p_enrollment_id: enrollment.id,
      p_course_id: courseId,
      p_unit_content: unitContent,
    }
  );

  if (rpcError) {
    console.error("RPC Error (is_unit_content_group_complete):", rpcError);
    return {
      success: false,
      xpAwarded: 0,
      message: `Алдаа гарлаа: ${rpcError.message}`,
    };
  }

  if (!isComplete) {
    return {
      success: false,
      xpAwarded: 0,
      message: "Бүх хичээлүүдийг дуусгаагүй байна",
    };
  }

  // Calculate XP based on how many groups already completed
  const completedCount = claimedGroups.length;
  const xpAmount =
    UNIT_CONTENT_XP_REWARDS[
      Math.min(completedCount, UNIT_CONTENT_XP_REWARDS.length - 1)
    ];

  // Use composite source ID for idempotency: enrollmentId-unitContent
  const sourceId = `${enrollment.id}-${unitContent}`;

  // Check if XP already awarded (additional idempotency check)
  const alreadyAwarded = await hasXPBeenAwarded(
    user.id,
    "unit_content_milestone",
    sourceId
  );

  if (alreadyAwarded) {
    return { success: false, xpAwarded: 0, message: "Аль хэдийн авсан" };
  }

  // Award XP

  const xpSuccess = await insertXPTransaction(
    user.id,
    xpAmount,
    "unit_content_milestone",
    sourceId,
    `"${unitContent}" бүлгийг дууссан`,
    {
      course_id: courseId,
      unit_content: unitContent,
      enrollment_id: enrollment.id,
      group_number: completedCount + 1,
    }
  );

  if (!xpSuccess) {
    return {
      success: false,
      xpAwarded: 0,
      message: "XP олгоход алдаа гарлаа (insertXPTransaction failed)",
    };
  }

  // Update enrollment to track claimed group
  const { error: updateError } = await supabase
    .from("enrollments")
    .update({
      unit_content_completed: [...claimedGroups, unitContent],
    })
    .eq("id", enrollment.id);

  if (updateError) {
    console.error("Error updating enrollment:", updateError);
    // XP was awarded but tracking update failed - still return success
  }

  return {
    success: true,
    xpAwarded: xpAmount,
    message: `${xpAmount} XP авлаа!`,
  };
}
