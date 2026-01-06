"use server";

import { createClient } from "@/lib/supabase/server";

export type AdminUser = {
  id: string;
  email: string;
  fullName: string | null;
  role: string;
};

export async function getAdminUser(): Promise<AdminUser | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") return null;

  return {
    id: user.id,
    email: user.email || "",
    fullName: profile.full_name,
    role: profile.role,
  };
}

export async function verifyAdminAccess(): Promise<boolean> {
  const adminUser = await getAdminUser();
  return adminUser !== null;
}

export async function signOutAdmin(): Promise<{ success: boolean }> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return { success: true };
}
