import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Auth callback error:", error);
      return NextResponse.redirect(`${origin}/signin?error=auth_failed`);
    }

    if (data.user) {
      // Check if user profile exists, create if not
      const { data: existingProfile } = await supabase
        .from("user_profiles")
        .select("id, has_completed_onboarding")
        .eq("id", data.user.id)
        .single();

      if (!existingProfile) {
        const fullName =
          data.user.user_metadata?.full_name ||
          data.user.user_metadata?.name ||
          data.user.email?.split("@")[0] ||
          "User";

        await supabase.from("user_profiles").insert({
          id: data.user.id,
          email: data.user.email!,
          full_name: fullName,
          role: "student",
        });

        // New user, redirect to onboarding
        revalidatePath("/", "layout");
        const forwardedHost = request.headers.get("x-forwarded-host");
        const isLocalEnv = process.env.NODE_ENV === "development";

        if (isLocalEnv) {
          return NextResponse.redirect(`${origin}/onboarding`);
        } else if (forwardedHost) {
          return NextResponse.redirect(`https://${forwardedHost}/onboarding`);
        } else {
          return NextResponse.redirect(`${origin}/onboarding`);
        }
      }

      // Existing user - check if onboarding is complete
      // Password reset flow should always go to /reset-password
      let redirectPath = next;
      if (next !== "/reset-password" && !existingProfile.has_completed_onboarding) {
        redirectPath = "/onboarding";
      }

      // Revalidate layout to update Header component
      revalidatePath("/", "layout");

      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${redirectPath}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${redirectPath}`);
      } else {
        return NextResponse.redirect(`${origin}${redirectPath}`);
      }
    }
  }

  return NextResponse.redirect(`${origin}/signin?error=auth_failed`);
}
