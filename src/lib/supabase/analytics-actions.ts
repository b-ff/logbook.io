"use server";

import { createClient } from "@/lib/supabase/server";

export interface AnalyticsData {
  totalExpenses: number;
  expensesByCategory: Record<string, number>;
  expensesByVehicle: Record<string, { make: string; model: string; total: number }>;
  recentRecords: Array<{
    id: string;
    title: string;
    cost: number;
    date: string;
    category: string;
    vehicleMake: string;
    vehicleModel: string;
  }>;
}

export async function getAnalytics(vehicleId?: string): Promise<AnalyticsData> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      totalExpenses: 0,
      expensesByCategory: {},
      expensesByVehicle: {},
      recentRecords: [],
    };
  }

  // Get all user's vehicles
  const { data: vehicles } = await supabase
    .from("vehicles")
    .select("id, make, model")
    .eq("user_id", user.id);

  if (!vehicles || vehicles.length === 0) {
    return {
      totalExpenses: 0,
      expensesByCategory: {},
      expensesByVehicle: {},
      recentRecords: [],
    };
  }

  const vehicleIds = vehicles.map((v) => v.id);

  // Get records
  let recordsQuery = supabase
    .from("records")
    .select("*, vehicles(make, model)")
    .in("vehicle_id", vehicleIds)
    .eq("is_event", false)
    .order("date", { ascending: false });

  if (vehicleId) {
    recordsQuery = recordsQuery.eq("vehicle_id", vehicleId);
  }

  const { data: records } = await recordsQuery;

  if (!records) {
    return {
      totalExpenses: 0,
      expensesByCategory: {},
      expensesByVehicle: {},
      recentRecords: [],
    };
  }

  // Calculate total expenses
  const totalExpenses = records.reduce((sum, r) => sum + (r.cost || 0), 0);

  // Calculate expenses by category
  const expensesByCategory = records.reduce((acc, r) => {
    acc[r.category] = (acc[r.category] || 0) + (r.cost || 0);
    return acc;
  }, {} as Record<string, number>);

  // Calculate expenses by vehicle
  const expensesByVehicle = records.reduce((acc, r) => {
    const vehicle = r.vehicles as { make: string; model: string } | null;
    if (!vehicle) return acc;
    
    const key = r.vehicle_id;
    if (!acc[key]) {
      acc[key] = {
        make: vehicle.make,
        model: vehicle.model,
        total: 0,
      };
    }
    acc[key].total += (r.cost || 0);
    return acc;
  }, {} as Record<string, { make: string; model: string; total: number }>);

  // Get recent records (last 10)
  const recentRecords = records.slice(0, 10).map((r) => {
    const vehicle = r.vehicles as { make: string; model: string } | null;
    return {
      id: r.id,
      title: r.title,
      cost: r.cost || 0,
      date: r.date,
      category: r.category,
      vehicleMake: vehicle?.make || "Unknown",
      vehicleModel: vehicle?.model || "Unknown",
    };
  });

  return {
    totalExpenses,
    expensesByCategory,
    expensesByVehicle,
    recentRecords,
  };
}
