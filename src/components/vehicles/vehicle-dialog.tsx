"use client";

import { useState, useTransition, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createVehicle, updateVehicle } from "@/lib/supabase/vehicle-actions";
import type { Vehicle, Currency, DistanceUnit, VolumeUnit } from "@/types/database";
import { COUNTRIES, CURRENCIES, DEFAULT_SETTINGS } from "@/types/database";
import { Plus, Pencil } from "lucide-react";

interface VehicleDialogProps {
  vehicle?: Vehicle | null;
  userDefaults?: {
    country: string | null;
    currency: Currency | null;
    distance_unit: DistanceUnit | null;
    volume_unit: VolumeUnit | null;
  } | null;
  onSuccess?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function VehicleDialog({ 
  vehicle, 
  userDefaults, 
  onSuccess,
  open: controlledOpen,
  onOpenChange 
}: VehicleDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Use controlled open if provided, otherwise use internal state
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setIsOpen = onOpenChange || setInternalOpen;

  // Auto-open dialog when vehicle prop is provided (edit mode)
  useEffect(() => {
    if (vehicle) {
      setIsOpen(true);
    }
  }, [vehicle, setIsOpen]);

  // Default values from user settings or app defaults
  const defaultCountry = vehicle?.country || userDefaults?.country || DEFAULT_SETTINGS.country;
  const defaultCurrency = vehicle?.currency || userDefaults?.currency || DEFAULT_SETTINGS.currency;
  const defaultDistance = vehicle?.distance_unit || userDefaults?.distance_unit || DEFAULT_SETTINGS.distance_unit;
  const defaultVolume = vehicle?.volume_unit || userDefaults?.volume_unit || DEFAULT_SETTINGS.volume_unit;

  const handleSubmit = async (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      const result = vehicle
        ? await updateVehicle(vehicle.id, formData)
        : await createVehicle(formData);

      if (result.error) {
        setError(result.error);
      } else if (result.success) {
        setIsOpen(false);
        onSuccess?.();
      }
    });
  };

  const handleOpenChange = (newOpen: boolean) => {
    setIsOpen(newOpen);
    // Clear vehicle when dialog closes (for edit mode)
    if (!newOpen && vehicle) {
      // Parent will handle clearing the edit state
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {!vehicle && (
        <DialogTrigger asChild>
          <Button className="gap-2" size="default">
            <Plus className="h-4 w-4" />
            Add Vehicle
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {vehicle ? "Edit Vehicle" : "Add New Vehicle"}
          </DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="make">Make</Label>
              <Input
                id="make"
                name="make"
                placeholder="e.g., BMW"
                defaultValue={vehicle?.make}
                required
                disabled={isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                name="model"
                placeholder="e.g., X5"
                defaultValue={vehicle?.model}
                required
                disabled={isPending}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                name="year"
                type="number"
                min="1900"
                max={new Date().getFullYear() + 1}
                placeholder="2024"
                defaultValue={vehicle?.year}
                required
                disabled={isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="plate_number">Plate Number</Label>
              <Input
                id="plate_number"
                name="plate_number"
                placeholder="ABC-123"
                defaultValue={vehicle?.plate_number}
                required
                disabled={isPending}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="current_mileage">Current Mileage</Label>
            <Input
              id="current_mileage"
              name="current_mileage"
              type="number"
              min="0"
              placeholder="50000"
              defaultValue={vehicle?.current_mileage}
              required
              disabled={isPending}
            />
          </div>

          {/* Vehicle-specific settings */}
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium mb-3">Vehicle Settings</h4>
            <p className="text-xs text-muted-foreground mb-4">
              Override account defaults for this vehicle
            </p>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Select name="country" defaultValue={defaultCountry} disabled={isPending}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select name="currency" defaultValue={defaultCurrency} disabled={isPending}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CURRENCIES.map((curr) => (
                        <SelectItem key={curr.value} value={curr.value}>
                          {curr.symbol} {curr.value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="distance_unit">Distance</Label>
                  <Select name="distance_unit" defaultValue={defaultDistance} disabled={isPending}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mi">Miles</SelectItem>
                      <SelectItem value="km">Kilometers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="volume_unit">Volume</Label>
                <Select name="volume_unit" defaultValue={defaultVolume} disabled={isPending}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gal">Gallons</SelectItem>
                    <SelectItem value="l">Liters</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_default"
                  name="is_default"
                  defaultChecked={vehicle?.is_default}
                  className="h-4 w-4 rounded border-gray-300"
                  disabled={isPending}
                />
                <Label htmlFor="is_default" className="text-sm font-normal">
                  Set as default vehicle (pre-selected for new records)
                </Label>
              </div>
            </div>
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : vehicle ? "Save Changes" : "Add Vehicle"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
