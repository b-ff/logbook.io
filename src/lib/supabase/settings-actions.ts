"use server";

import { createClient } from "@/lib/supabase/server";
import type { Currency, DistanceUnit, VolumeUnit, DateFormat } from "@/types/database";

export async function getUserSettings() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("country, currency, distance_unit, volume_unit, date_format")
    .eq("id", user.id)
    .single();

  return profile;
}

export async function updateUserSettings(settings: {
  country: string;
  currency: Currency;
  distance_unit: DistanceUnit;
  volume_unit: VolumeUnit;
  date_format: DateFormat;
}): Promise<{ error?: string; success?: boolean }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      country: settings.country,
      currency: settings.currency,
      distance_unit: settings.distance_unit,
      volume_unit: settings.volume_unit,
      date_format: settings.date_format,
    })
    .eq("id", user.id);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
