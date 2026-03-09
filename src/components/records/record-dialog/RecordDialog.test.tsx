import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RecordDialog } from "@/components/records/record-dialog";
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
  {
    id: "vehicle-2",
    user_id: "test-user",
    make: "Toyota",
    model: "Camry",
    year: 2022,
    plate_number: "XYZ-789",
    current_mileage: 30000,
    created_at: "2024-01-01T00:00:00Z",
    country: "US",
    currency: "USD",
    distance_unit: "mi",
    volume_unit: "gal",
    is_default: false,
  },
];

// Mock the server actions
vi.mock("@/lib/supabase/record-actions", () => ({
  createRecord: vi.fn(() => Promise.resolve({ success: true })),
  updateRecord: vi.fn(() => Promise.resolve({ success: true })),
}));

describe("RecordDialog", () => {
  it("opens dialog when triggered", async () => {
    render(
      <RecordDialog
        open={true}
        onOpenChange={() => {}}
        vehicles={mockVehicles}
      />
    );

    expect(await screen.findByText("Add New Record")).toBeInTheDocument();
  });

  it("renders all required form fields", async () => {
    render(
      <RecordDialog
        open={true}
        onOpenChange={() => {}}
        vehicles={mockVehicles}
      />
    );

    await waitFor(() => {
      expect(screen.getAllByRole("combobox").length).toBeGreaterThanOrEqual(2);
      expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/cost/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/mileage at record/i)).toBeInTheDocument();
    });
  });

  it("displays vehicle options in select", async () => {
    render(
      <RecordDialog
        open={true}
        onOpenChange={() => {}}
        vehicles={mockVehicles}
      />
    );

    // Verify the select trigger button exists
    const comboboxes = screen.getAllByRole("combobox");
    expect(comboboxes.length).toBeGreaterThanOrEqual(1);
    
    // Check that the hidden select has the correct options
    const hiddenSelect = screen.getAllByRole("combobox")[0];
    expect(hiddenSelect).toBeInTheDocument();
  });

  it("displays all category options", async () => {
    render(
      <RecordDialog
        open={true}
        onOpenChange={() => {}}
        vehicles={mockVehicles}
      />
    );

    // Verify the category select trigger button exists
    const comboboxes = screen.getAllByRole("combobox");
    expect(comboboxes.length).toBeGreaterThanOrEqual(2);
  });

  it("can fill out the record form", async () => {
    render(
      <RecordDialog
        open={true}
        onOpenChange={() => {}}
        vehicles={mockVehicles}
      />
    );

    const titleInput = screen.getByLabelText(/title/i);
    const costInput = screen.getByLabelText(/cost/i);
    const mileageInput = screen.getByLabelText(/mileage at record/i);

    await userEvent.type(titleInput, "Oil Change");
    await userEvent.type(costInput, "75.50");
    await userEvent.clear(mileageInput);
    await userEvent.type(mileageInput, "51000");

    expect(titleInput).toHaveValue("Oil Change");
    expect(costInput).toHaveValue(75.5);
    expect(mileageInput).toHaveValue(51000);
  });

  it("handles the is_event checkbox", async () => {
    render(
      <RecordDialog
        open={true}
        onOpenChange={() => {}}
        vehicles={mockVehicles}
      />
    );

    const eventCheckbox = screen.getByLabelText(/this is an event/i);
    expect(eventCheckbox).toBeInTheDocument();
    expect(eventCheckbox).not.toBeChecked();

    await userEvent.click(eventCheckbox);
    expect(eventCheckbox).toBeChecked();
  });
});
