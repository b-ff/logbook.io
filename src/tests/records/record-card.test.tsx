import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RecordCard } from "@/components/records/record-card";
import type { Record } from "@/types/database";

const mockRecord: Record = {
  id: "test-record-id",
  vehicle_id: "test-vehicle-id",
  date: "2024-01-15",
  mileage_at_record: 50000,
  category: "fuel",
  title: "Gas Station Fill-up",
  cost: 50.0,
  description: "Full tank premium",
  is_event: false,
  created_at: "2024-01-15T10:00:00Z",
};

describe("RecordCard", () => {
  it("renders record information correctly", () => {
    render(<RecordCard record={mockRecord} />);

    expect(screen.getByText("Gas Station Fill-up")).toBeInTheDocument();
    expect(screen.getByText("fuel")).toBeInTheDocument();
    expect(screen.getByText("$50.00")).toBeInTheDocument();
    expect(screen.getByText("50,000")).toBeInTheDocument();
  });

  it("displays category icon for fuel", () => {
    render(<RecordCard record={mockRecord} />);

    expect(screen.getByText("⛽")).toBeInTheDocument();
  });

  it("displays event indicator for non-expense records", () => {
    const eventRecord: Record = {
      ...mockRecord,
      is_event: true,
      cost: 0,
    };

    render(<RecordCard record={eventRecord} />);

    expect(screen.getByText("—")).toBeInTheDocument();
  });

  it("shows description when provided", () => {
    render(<RecordCard record={mockRecord} />);

    expect(screen.getByText("Full tank premium")).toBeInTheDocument();
  });

  it("displays edit and delete options when callbacks provided", async () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(
      <RecordCard
        record={mockRecord}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );

    const menuButton = screen.getByRole("button", { name: /record options/i });
    await userEvent.click(menuButton);

    expect(await screen.findByText("Edit")).toBeInTheDocument();
    expect(await screen.findByText("Delete")).toBeInTheDocument();
  });

  it("calls onEdit when edit option is clicked", async () => {
    const onEdit = vi.fn();

    render(<RecordCard record={mockRecord} onEdit={onEdit} />);

    const menuButton = screen.getByRole("button", { name: /record options/i });
    await userEvent.click(menuButton);

    const editButton = await screen.findByText("Edit");
    await userEvent.click(editButton);

    expect(onEdit).toHaveBeenCalledWith(mockRecord);
  });
});
