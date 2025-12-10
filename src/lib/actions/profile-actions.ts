"use server";

import {
  getAuthenticatedUser,
  revalidateUserPages,
  handleActionError,
} from "./helpers";

type ProfileCompletionResult = {
  success: boolean;
  message: string;
  xpAwarded?: number;
  isComplete?: boolean;
};

type ProfileUpdateData = {
  fullName?: string;
  avatarUrl?: string;
  dateOfBirth?: string;
  phoneNumber?: string;
  learningGoals?: string | string[];
};

/**
 * Check if user's profile is complete
 * @returns Profile completion status
 */
export async function checkProfileCompletion(): Promise<ProfileCompletionResult> {
  try {
    const { user, supabase, error: authError } = await getAuthenticatedUser();

    if (authError || !user) {
      return {
        success: false,
        message: "You must be logged in",
      };
    }

    // Call database function to check completion
    const { data, error } = await supabase.rpc("check_profile_completion", {
      user_id: user.id,
    });

    if (error) {
      return {
        success: false,
        message: `Error checking profile status: ${error.message}`,
      };
    }

    return {
      success: true,
      message: data ? "Profile is complete" : "Profile is incomplete",
      isComplete: data as boolean,
    };
  } catch (error) {
    return handleActionError(error) as ProfileCompletionResult;
  }
}

/**
 * Update user profile data
 * @param profileData - Profile fields to update
 * @returns Update result
 */
export async function updateUserProfile(
  profileData: ProfileUpdateData
): Promise<ProfileCompletionResult> {
  try {
    const { user, supabase, error: authError } = await getAuthenticatedUser();

    if (authError || !user) {
      return {
        success: false,
        message: "You must be logged in",
      };
    }

    // Prepare update object with snake_case
    const updateData: Record<string, unknown> = {};
    if (profileData.fullName) updateData.full_name = profileData.fullName;
    if (profileData.avatarUrl) updateData.avatar_url = profileData.avatarUrl;
    if (profileData.dateOfBirth)
      updateData.date_of_birth = profileData.dateOfBirth;
    if (profileData.phoneNumber !== undefined)
      updateData.phone_number = profileData.phoneNumber || null;
    if (profileData.learningGoals !== undefined) {
      // Handle both string and array inputs
      let goalsArray: string[] = [];

      if (typeof profileData.learningGoals === 'string') {
        // Convert comma-separated string to array for database
        // Split by comma, newline, or semicolon, then trim and filter empty strings
        goalsArray = profileData.learningGoals
          .split(/[,\n;]+/)
          .map((goal) => goal.trim())
          .filter((goal) => goal.length > 0);
      } else if (Array.isArray(profileData.learningGoals)) {
        // Already an array, just filter and trim
        goalsArray = profileData.learningGoals
          .map((goal) => String(goal).trim())
          .filter((goal) => goal.length > 0);
      }

      updateData.learning_goals = goalsArray.length > 0 ? goalsArray : null;
    }

    // Update profile
    const { error: updateError } = await supabase
      .from("user_profiles")
      .update(updateData)
      .eq("id", user.id);

    if (updateError) {
      return {
        success: false,
        message: "Error updating profile",
      };
    }

    // Check if profile is now complete and award XP
    const completionResult = await checkAndAwardProfileCompletionXP();

    revalidateUserPages();

    return {
      success: true,
      message: "Profile updated successfully",
      xpAwarded: completionResult.xpAwarded,
    };
  } catch (error) {
    console.log("error", error);
    return handleActionError(error) as ProfileCompletionResult;
  }
}

/**
 * Check profile completion and award XP if newly completed
 * @returns XP award result
 */
export async function checkAndAwardProfileCompletionXP(): Promise<ProfileCompletionResult> {
  try {
    const { user, supabase, error: authError } = await getAuthenticatedUser();

    if (authError || !user) {
      return {
        success: false,
        message: "You must be logged in",
      };
    }

    // Call database function to award XP
    const { data, error } = await supabase.rpc("award_profile_completion_xp", {
      user_id: user.id,
    });

    if (error) {
      return {
        success: false,
        message: "Error processing XP",
      };
    }

    // Parse result from database function
    const result = Array.isArray(data) && data.length > 0 ? data[0] : data;

    if (result && result.success) {
      revalidateUserPages();
      return {
        success: true,
        message: result.message,
        xpAwarded: result.xp_awarded,
      };
    }

    return {
      success: false,
      message: result?.message || "XP not awarded",
    };
  } catch (error) {
    return handleActionError(error) as ProfileCompletionResult;
  }
}
