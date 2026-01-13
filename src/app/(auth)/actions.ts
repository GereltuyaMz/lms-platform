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
    return { error: "Бүх талбарыг бөглөнө үү" };
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
        "Энэ имэйл хаягаар бүртгэл аль хэдийн үүссэн байна. Нэвтэрнэ үү.",
    };
  }

  if (signUpError) {
    return { error: signUpError.message };
  }

  if (signUpData.user) {
    await supabase.from("user_profiles").insert({
      id: signUpData.user.id,
      email: email,
      full_name: name,
      role: "student",
    });
  }

  if (signUpData.user && !signUpData.session) {
    return {
      success: true,
      message: "Бүртгэлээ баталгаажуулахын тулд имэйлээ шалгана уу",
    };
  }

  revalidatePath("/", "layout");
  return { success: true };
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
    return { error: "Имэйл болон нууц үг шаардлагатай" };
  }

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("email")
    .eq("email", email)
    .single();

  if (!profile) {
    return {
      error: "Энэ имэйл хаягаар бүртгэл олдсонгүй. Эхлээд бүртгүүлнэ үү.",
    };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    if (error.message.includes("Invalid login credentials")) {
      return { error: "Нууц үг буруу байна. Дахин оролдоно уу." };
    }
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  return { success: true };
};

export const signOutAction = async () => {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  return { success: true };
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();
  const email = formData.get("email") as string;

  if (!email) {
    return { error: "И-мэйл хаяг оруулна уу" };
  }

  const origin = (await headers()).get("origin");

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/api/auth/callback?next=/reset-password`,
  });

  if (error) {
    return { error: error.message };
  }

  return {
    success: true,
    message: "Нууц үг сэргээх холбоосыг имэйл хаяг руу илгээлээ",
  };
};

export const updatePasswordAction = async (formData: FormData) => {
  const supabase = await createClient();
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    return { error: "Бүх талбарыг бөглөнө үү" };
  }

  if (password !== confirmPassword) {
    return { error: "Нууц үг таарахгүй байна" };
  }

  if (password.length < 6) {
    return { error: "Нууц үг хамгийн багадаа 6 тэмдэгт байх ёстой" };
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  return { success: true };
};
