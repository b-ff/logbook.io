"use server";

import { createClient } from "@/lib/supabase/server";
import type { Record, Category } from "@/types/database";

export async function getRecords(vehicleId?: string): Promise<Record[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  let query = supabase
    .from("records")
    .select("*, vehicles(user_id)")
    .in(
      "vehicles.user_id",
      user.id ? [user.id] : [""]
    );

  if (vehicleId) {
    query = query.eq("vehicle_id", vehicleId);
  }

  const { data, error } = await query.order("date", { ascending: false });

  if (error) {
    console.error("Error fetching records:", error);
    return [];
  }

  return data.map((item) => ({
    id: item.id,
    vehicle_id: item.vehicle_id,
    date: item.date,
    mileage_at_record: item.mileage_at_record,
    category: item.category,
    title: item.title,
    cost: item.cost,
    description: item.description,
    is_event: item.is_event,
    created_at: item.created_at,
  }));
}

export async function createRecord(formData: FormData): Promise<{
  error?: string;
  success?: boolean;
  recordId?: string;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const vehicle_id = formData.get("vehicle_id") as string;
  const date = formData.get("date") as string;
  const mileage_at_record = parseInt(formData.get("mileage_at_record") as string);
  const category = formData.get("category") as Category;
  const title = formData.get("title") as string;
  const cost = parseFloat(formData.get("cost") as string);
  const description = formData.get("description") as string;
  const is_event = formData.get("is_event") === "on";

  // Validation
  if (!vehicle_id || !date || !mileage_at_record || !category || !title || cost === undefined) {
    return { error: "All required fields must be filled" };
  }

  if (mileage_at_record < 0) {
    return { error: "Mileage cannot be negative" };
  }

  if (cost < 0) {
    return { error: "Cost cannot be negative" };
  }

  // Get vehicle to check current mileage
  const { data: vehicle } = await supabase
    .from("vehicles")
    .select("current_mileage, user_id")
    .eq("id", vehicle_id)
    .eq("user_id", user.id)
    .single();

  if (!vehicle) {
    return { error: "Vehicle not found" };
  }

  // Create the record
  const { data: record, error } = await supabase
    .from("records")
    .insert({
      vehicle_id,
      date,
      mileage_at_record,
      category,
      title,
      cost,
      description: description || "",
      is_event,
      created_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  // Update vehicle mileage if new record mileage is higher
  if (mileage_at_record > vehicle.current_mileage) {
    await supabase
      .from("vehicles")
      .update({ current_mileage: mileage_at_record })
      .eq("id", vehicle_id)
      .eq("user_id", user.id);
  }

  return { success: true, recordId: record.id };
}

export async function updateRecord(
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

  const vehicle_id = formData.get("vehicle_id") as string;
  const date = formData.get("date") as string;
  const mileage_at_record = parseInt(formData.get("mileage_at_record") as string);
  const category = formData.get("category") as Category;
  const title = formData.get("title") as string;
  const cost = parseFloat(formData.get("cost") as string);
  const description = formData.get("description") as string;
  const is_event = formData.get("is_event") === "on";

  // Validation
  if (!vehicle_id || !date || !mileage_at_record || !category || !title) {
    return { error: "All required fields must be filled" };
  }

  // Get vehicle to check current mileage
  const { data: vehicle } = await supabase
    .from("vehicles")
    .select("current_mileage, user_id")
    .eq("id", vehicle_id)
    .eq("user_id", user.id)
    .single();

  if (!vehicle) {
    return { error: "Vehicle not found" };
  }

  const { error } = await supabase
    .from("records")
    .update({
      vehicle_id,
      date,
      mileage_at_record,
      category,
      title,
      cost,
      description: description || "",
      is_event,
    })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  // Update vehicle mileage if new record mileage is higher
  if (mileage_at_record > vehicle.current_mileage) {
    await supabase
      .from("vehicles")
      .update({ current_mileage: mileage_at_record })
      .eq("id", vehicle_id)
      .eq("user_id", user.id);
  }

  return { success: true };
}

export async function deleteRecord(id: string): Promise<{
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
    .from("records")
    .delete()
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
