"use server";

import { createClient } from "@/lib/supabase/server";
import type { Vehicle, Currency, DistanceUnit, VolumeUnit } from "@/types/database";

export async function getVehicles(): Promise<Vehicle[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("vehicles")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching vehicles:", error);
    return [];
  }

  return data;
}

export async function getVehicleById(id: string): Promise<Vehicle | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("vehicles")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error) return null;

  return data;
}

export async function createVehicle(formData: FormData): Promise<{
  error?: string;
  success?: boolean;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const make = formData.get("make") as string;
  const model = formData.get("model") as string;
  const year = parseInt(formData.get("year") as string);
  const plate_number = formData.get("plate_number") as string;
  const current_mileage = parseInt(formData.get("current_mileage") as string);
  const country = (formData.get("country") as string) || null;
  const currency = (formData.get("currency") as Currency) || null;
  const distance_unit = (formData.get("distance_unit") as DistanceUnit) || null;
  const volume_unit = (formData.get("volume_unit") as VolumeUnit) || null;
  const is_default = formData.get("is_default") === "on";

  // Validation
  if (!make || !model || !year || !plate_number || !current_mileage) {
    return { error: "All fields are required" };
  }

  if (year < 1900 || year > new Date().getFullYear() + 1) {
    return { error: "Invalid year" };
  }

  if (current_mileage < 0) {
    return { error: "Mileage cannot be negative" };
  }

  const { error } = await supabase.from("vehicles").insert({
    user_id: user.id,
    make,
    model,
    year,
    plate_number,
    current_mileage,
    country,
    currency,
    distance_unit,
    volume_unit,
    is_default,
    created_at: new Date().toISOString(),
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function updateVehicle(
  id: string,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const make = formData.get("make") as string;
  const model = formData.get("model") as string;
  const year = parseInt(formData.get("year") as string);
  const plate_number = formData.get("plate_number") as string;
  const current_mileage = parseInt(formData.get("current_mileage") as string);
  const country = (formData.get("country") as string) || null;
  const currency = (formData.get("currency") as Currency) || null;
  const distance_unit = (formData.get("distance_unit") as DistanceUnit) || null;
  const volume_unit = (formData.get("volume_unit") as VolumeUnit) || null;
  const is_default = formData.get("is_default") === "on";

  // Validation
  if (!make || !model || !year || !plate_number || !current_mileage) {
    return { error: "All fields are required" };
  }

  if (year < 1900 || year > new Date().getFullYear() + 1) {
    return { error: "Invalid year" };
  }

  if (current_mileage < 0) {
    return { error: "Mileage cannot be negative" };
  }

  const { error } = await supabase
    .from("vehicles")
    .update({
      make,
      model,
      year,
      plate_number,
      current_mileage,
      country,
      currency,
      distance_unit,
      volume_unit,
      is_default,
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function deleteVehicle(id: string): Promise<{
  error?: string;
  success?: boolean;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const { error } = await supabase
    .from("vehicles")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
