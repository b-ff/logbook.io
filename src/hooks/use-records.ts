"use client";

import { useState, useEffect, useCallback } from "react";
import { getRecords } from "@/lib/supabase/record-actions";
import type { Record } from "@/types/database";

export function useRecords(vehicleId?: string) {
  const [records, setRecords] = useState<Record[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecords = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getRecords(vehicleId);
      setRecords(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch records");
    } finally {
      setIsLoading(false);
    }
  }, [vehicleId]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  return { records, isLoading, error, refetch: fetchRecords };
}
