"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export const signUpAction = async (formData: FormData) => {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

  if (!email || !password || !name) {
    return { error: "All fields are required" };
  }

  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
      },
      emailRedirectTo: `${(await headers()).get("origin")}/api/auth/callback`,
    },
  });

  if (signUpData.user && signUpData.user.identities?.length === 0) {
    return {
      error:
        "An account with this email already exists. Please log in instead.",
    };
  }

  if (signUpError) {
    return { error: signUpError.message };
  }

  if (signUpData.user) {
    const { error: profileError } = await supabase
      .from("user_profiles")
      .insert({
        id: signUpData.user.id,
        email: email,
        full_name: name,
        role: "student",
      });

    if (profileError) {
      console.error("Failed to create user profile:", profileError);
    }
  }

  if (signUpData.user && !signUpData.session) {
    return {
      success: true,
      message: "Check your email to confirm your account",
    };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
};

export const signInWithGoogleAction = async () => {
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/api/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.url) {
    redirect(data.url);
  }
};

export const signInAction = async (formData: FormData) => {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("email")
    .eq("email", email)
    .single();

  if (!profile) {
    return {
      error: "No account found with this email. Please sign up first.",
    };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    if (error.message.includes("Invalid login credentials")) {
      return { error: "Incorrect password. Please try again." };
    }
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/");
};
