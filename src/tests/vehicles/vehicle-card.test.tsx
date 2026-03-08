import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { VehicleCard } from "@/components/vehicles/vehicle-card";
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

describe("VehicleCard", () => {
  it("renders vehicle information correctly", () => {
    render(<VehicleCard vehicle={mockVehicle} />);

    expect(screen.getByText("2024 BMW X5")).toBeInTheDocument();
    expect(screen.getByText("ABC-123")).toBeInTheDocument();
    expect(screen.getByText("50,000")).toBeInTheDocument();
  });

  it("displays edit and delete options when callbacks provided", async () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(
      <VehicleCard
        vehicle={mockVehicle}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );

    const menuButton = screen.getByRole("button", { name: /vehicle options/i });
    await userEvent.click(menuButton);

    expect(await screen.findByText("Edit")).toBeInTheDocument();
    expect(await screen.findByText("Delete")).toBeInTheDocument();
  });

  it("calls onEdit when edit option is clicked", async () => {
    const onEdit = vi.fn();

    render(<VehicleCard vehicle={mockVehicle} onEdit={onEdit} />);

    const menuButton = screen.getByRole("button", { name: /vehicle options/i });
    await userEvent.click(menuButton);

    const editButton = await screen.findByText("Edit");
    await userEvent.click(editButton);

    expect(onEdit).toHaveBeenCalledWith(mockVehicle);
  });

  it("displays delete option in menu", async () => {
    const onDelete = vi.fn();

    render(<VehicleCard vehicle={mockVehicle} onDelete={onDelete} />);

    const menuButton = screen.getByRole("button", { name: /vehicle options/i });
    await userEvent.click(menuButton);

    const deleteButton = await screen.findByText("Delete");
    expect(deleteButton).toBeInTheDocument();
  });
});
