"use client";

import { useState, useEffect, useCallback } from "react";
import { getVehicles } from "@/lib/supabase/vehicle-actions";
import type { Vehicle } from "@/types/database";

export function useVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVehicles = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getVehicles();
      setVehicles(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch vehicles");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  return { vehicles, isLoading, error, refetch: fetchVehicles };
}
