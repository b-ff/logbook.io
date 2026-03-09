import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { VehicleDialog } from "@/components/vehicles/vehicle-dialog";
import type { Vehicle } from "@/types/database";

const mockVehicle: Vehicle = {
  id: "test-vehicle-id",
  user_id: "test-user-id",
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
  is_default: false,
};

// Mock the server actions
vi.mock("@/lib/supabase/vehicle-actions", () => ({
  createVehicle: vi.fn(() => Promise.resolve({ success: true })),
  updateVehicle: vi.fn(() => Promise.resolve({ success: true })),
}));

describe("VehicleDialog", () => {
  it("opens dialog when Add Vehicle button is clicked", async () => {
    render(<VehicleDialog />);

    const addButton = screen.getByText("Add Vehicle");
    await userEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText("Add New Vehicle")).toBeInTheDocument();
    });
  });

  it("renders all required form fields", async () => {
    render(<VehicleDialog />);

    const addButton = screen.getByText("Add Vehicle");
    await userEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByLabelText(/make/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/model/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/year/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/plate number/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/current mileage/i)).toBeInTheDocument();
    });
  });

  it("validates year range", async () => {
    const { createVehicle } = await import("@/lib/supabase/vehicle-actions");

    render(<VehicleDialog />);

    const addButton = screen.getByText("Add Vehicle");
    await userEvent.click(addButton);

    const yearInput = screen.getByLabelText(/year/i);
    await userEvent.clear(yearInput);
    await userEvent.type(yearInput, "1800");

    const saveButton = screen.getByRole("button", { name: "Add Vehicle" });
    await userEvent.click(saveButton);

    await waitFor(() => {
      expect(createVehicle).not.toHaveBeenCalled();
    });
  });

  it("submits form with valid data", async () => {
    const { createVehicle } = await import("@/lib/supabase/vehicle-actions");
    const onSuccess = vi.fn();

    render(<VehicleDialog onSuccess={onSuccess} />);

    const addButton = screen.getByText("Add Vehicle");
    await userEvent.click(addButton);

    const makeInput = screen.getByLabelText(/make/i);
    const modelInput = screen.getByLabelText(/model/i);
    const yearInput = screen.getByLabelText(/year/i);
    const plateInput = screen.getByLabelText(/plate number/i);
    const mileageInput = screen.getByLabelText(/current mileage/i);

    await userEvent.type(makeInput, "BMW");
    await userEvent.type(modelInput, "X5");
    await userEvent.clear(yearInput);
    await userEvent.type(yearInput, "2024");
    await userEvent.type(plateInput, "ABC-123");
    await userEvent.clear(mileageInput);
    await userEvent.type(mileageInput, "50000");

    const saveButton = screen.getByRole("button", { name: "Add Vehicle" });
    await userEvent.click(saveButton);

    await waitFor(() => {
      expect(createVehicle).toHaveBeenCalled();
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it("displays error message on submission failure", async () => {
    const { createVehicle } = await import("@/lib/supabase/vehicle-actions");
    vi.mocked(createVehicle).mockResolvedValueOnce({ error: "Failed to create" });

    const onSuccess = vi.fn();
    render(<VehicleDialog onSuccess={onSuccess} />);

    const addButton = screen.getByText("Add Vehicle");
    await userEvent.click(addButton);

    // Fill in all required fields
    const makeInput = screen.getByLabelText(/make/i);
    const modelInput = screen.getByLabelText(/model/i);
    const yearInput = screen.getByLabelText(/year/i);
    const plateInput = screen.getByLabelText(/plate number/i);
    const mileageInput = screen.getByLabelText(/current mileage/i);

    await userEvent.type(makeInput, "BMW");
    await userEvent.type(modelInput, "X5");
    await userEvent.clear(yearInput);
    await userEvent.type(yearInput, "2024");
    await userEvent.type(plateInput, "ABC-123");
    await userEvent.clear(mileageInput);
    await userEvent.type(mileageInput, "50000");

    const saveButton = screen.getByRole("button", { name: "Add Vehicle" });
    await userEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText("Failed to create")).toBeInTheDocument();
    }, { timeout: 3000 });
  });
});
