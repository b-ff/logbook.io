"use client";

import { useState, useTransition, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createRecord, updateRecord } from "@/lib/supabase/record-actions";
import type { Record, Vehicle, Category } from "@/types/database";
import { Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCurrencySymbol, formatDate } from "@/lib/utils";
import { DATE_FORMATS } from "@/types/database";

const CATEGORIES: { value: Category; label: string }[] = [
  { value: "fuel", label: "⛽ Fuel" },
  { value: "service", label: "🔧 Service" },
  { value: "insurance", label: "📄 Insurance" },
  { value: "tuning", label: "🏎️ Tuning" },
  { value: "travel", label: "✈️ Travel" },
  { value: "event", label: "📝 Event" },
];

interface RecordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  record?: Record | null;
  vehicleId?: string;
  vehicles?: Vehicle[];
  userDateFormat?: string | null;
  onSuccess?: () => void;
}

export function RecordDialog({
  open,
  onOpenChange,
  record,
  vehicleId,
  vehicles,
  userDateFormat,
  onSuccess,
}: RecordDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Find default vehicle
  const defaultVehicle = vehicles?.find(v => v.is_default) || vehicles?.[0];
  const defaultVehicleId = vehicleId || record?.vehicle_id || defaultVehicle?.id || "";

  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(defaultVehicleId);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | undefined>(undefined);
  const [mileageValue, setMileageValue] = useState<number | undefined>(undefined);

  // Get date format info
  const dateFormatConfig = DATE_FORMATS.find(f => f.value === userDateFormat) || DATE_FORMATS[0];

  // Update selected vehicle when dialog opens or vehicles/vehicleId change
  useEffect(() => {
    if (open) {
      const initialVehicleId = vehicleId || record?.vehicle_id || defaultVehicle?.id || "";
      setSelectedVehicleId(initialVehicleId);

      // Get the vehicle's current mileage as default
      const vehicle = vehicles?.find(v => v.id === initialVehicleId);
      setSelectedVehicle(vehicle);
      if (vehicle) {
        setMileageValue(record?.mileage_at_record || vehicle.current_mileage);
      }
    }
  }, [open, vehicleId, record?.vehicle_id, defaultVehicle, vehicles, record?.mileage_at_record]);

  const handleSubmit = async (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      const result = record
        ? await updateRecord(record.id, formData)
        : await createRecord(formData);

      if (result.error) {
        setError(result.error);
      } else if (result.success) {
        onOpenChange(false);
        onSuccess?.();
      }
    });
  };

  const handleVehicleChange = (newVehicleId: string) => {
    setSelectedVehicleId(newVehicleId);
    const vehicle = vehicles?.find(v => v.id === newVehicleId);
    setSelectedVehicle(vehicle);
    if (vehicle && !record) {
      // Only update mileage for new records, not edits
      setMileageValue(vehicle.current_mileage);
    }
  };

  const currencySymbol = selectedVehicle?.currency ? getCurrencySymbol(selectedVehicle.currency) : "$";
  const distanceUnit = selectedVehicle?.distance_unit || "mi";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {record ? "Edit Record" : "Add New Record"}
          </DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="vehicle_id">Vehicle</Label>
            <Select
              name="vehicle_id"
              value={selectedVehicleId}
              onValueChange={handleVehicleChange}
              required
              disabled={isPending || !!vehicleId}
            >
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Select vehicle" />
              </SelectTrigger>
              <SelectContent>
                {vehicles?.map((v) => (
                  <SelectItem key={v.id} value={v.id}>
                    {v.year} {v.make} {v.model}{v.is_default ? " (Default)" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select name="category" defaultValue={record?.category} required disabled={isPending}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="e.g., Oil Change"
              defaultValue={record?.title}
              required
              disabled={isPending}
              className="h-12"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">
                Date
                <span className="text-xs text-muted-foreground ml-2">
                  ({dateFormatConfig.label})
                </span>
              </Label>
              <Input
                id="date"
                name="date"
                type="date"
                defaultValue={record?.date || new Date().toISOString().split("T")[0]}
                required
                disabled={isPending}
                className="h-12"
              />
              <p className="text-xs text-muted-foreground">
                Format: {dateFormatConfig.example}
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cost">Cost ({currencySymbol})</Label>
              <Input
                id="cost"
                name="cost"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                defaultValue={record?.cost}
                required
                disabled={isPending}
                className="h-12"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mileage_at_record">Mileage at Record ({distanceUnit})</Label>
            <Input
              id="mileage_at_record"
              name="mileage_at_record"
              type="number"
              min="0"
              placeholder="50000"
              value={mileageValue !== undefined ? mileageValue : ""}
              onChange={(e) => setMileageValue(e.target.value ? Number(e.target.value) : undefined)}
              required
              disabled={isPending}
              className="h-12"
            />
            {mileageValue !== undefined && !record && selectedVehicle && (
              <p className="text-xs text-muted-foreground">
                Current mileage: {selectedVehicle.current_mileage.toLocaleString()} {distanceUnit}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Input
              id="description"
              name="description"
              placeholder="Additional details"
              defaultValue={record?.description}
              disabled={isPending}
              className="h-12"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_event"
              name="is_event"
              defaultChecked={record?.is_event}
              className="h-4 w-4 rounded border-gray-300"
              disabled={isPending}
            />
            <Label htmlFor="is_event" className="text-sm font-normal">
              This is an event (non-expense)
            </Label>
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : record ? "Save Changes" : "Add Record"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
