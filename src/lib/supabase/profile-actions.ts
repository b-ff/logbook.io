"use server";

import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types/database";

export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error || !profile) {
    // Create profile if it doesn't exist
    const { data: newProfile } = await supabase.from("profiles").upsert({
      id: user.id,
      email: user.email || "",
      full_name: user.user_metadata?.full_name || null,
      created_at: new Date().toISOString(),
    }).select().single();

    return newProfile;
  }

  return profile;
}
