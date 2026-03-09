import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useVehicles } from "@/hooks/useVehicles";
import type { Vehicle } from "@/types/database";

const mockVehicles: Vehicle[] = [
  {
    id: "vehicle-1",
    user_id: "test-user",
    make: "BMW",
    model: "X5",
    year: 2024,
    plate_number: "ABC-123",
    current_mileage: 50000,
    created_at: "2024-01-01T00:00:00Z",
    country: "US",
    currency: "USD",
    distance_unit: "mi",
    volume_unit: "gal",
    is_default: true,
  },
];

vi.mock("@/lib/supabase/vehicle-actions", () => ({
  getVehicles: vi.fn(() => Promise.resolve(mockVehicles)),
}));

describe("useVehicles", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("initializes with loading state", () => {
    const { result } = renderHook(() => useVehicles());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.vehicles).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it("fetches vehicles successfully", async () => {
    const { result } = renderHook(() => useVehicles());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.vehicles).toEqual(mockVehicles);
    expect(result.current.error).toBeNull();
  });

  it("provides refetch function", async () => {
    const { result } = renderHook(() => useVehicles());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(typeof result.current.refetch).toBe("function");
  });

  it("handles fetch error", async () => {
    const { getVehicles } = await import("@/lib/supabase/vehicle-actions");
    vi.mocked(getVehicles).mockRejectedValueOnce(new Error("Failed to fetch"));

    const { result } = renderHook(() => useVehicles());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe("Failed to fetch");
    expect(result.current.vehicles).toEqual([]);
  });
});
