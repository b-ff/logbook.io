"use client";

import { Vehicle, Currency, DistanceUnit, VolumeUnit } from "@/types/database";
import { VehicleCard } from "../vehicle-card";
import { VehicleDialog } from "../vehicle-dialog";
import { deleteVehicle } from "@/lib/supabase/vehicle-actions";
import { useState, useTransition, useCallback } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useVehicles } from "@/hooks/useVehicles";
import { getUserSettings } from "@/lib/supabase/settings-actions";
import { useEffect } from "react";

export function VehicleList() {
  const { vehicles, isLoading, refetch } = useVehicles();
  const [isPending, startTransition] = useTransition();
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [userDefaults, setUserDefaults] = useState<{
    country: string | null;
    currency: Currency | null;
    distance_unit: DistanceUnit | null;
    volume_unit: VolumeUnit | null;
  } | null>(null);

  useEffect(() => {
    getUserSettings().then((settings) => {
      if (settings) {
        setUserDefaults({
          country: settings.country || null,
          currency: settings.currency || null,
          distance_unit: settings.distance_unit || null,
          volume_unit: settings.volume_unit || null,
        });
      }
    });
  }, []);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this vehicle?")) {
      startTransition(async () => {
        await deleteVehicle(id);
        handleRefresh();
      });
    }
  };

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setIsEditDialogOpen(true);
  };

  const handleEditDialogClose = (open: boolean) => {
    setIsEditDialogOpen(open);
    if (!open) {
      setEditingVehicle(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (vehicles.length === 0) {
    return (
      <div className="text-center py-12 space-y-4">
        <p className="text-muted-foreground">No vehicles yet</p>
        <VehicleDialog userDefaults={userDefaults} onSuccess={handleRefresh} />
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        {vehicles.map((vehicle) => (
          <VehicleCard
            key={vehicle.id}
            vehicle={vehicle}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      <VehicleDialog
        vehicle={editingVehicle || undefined}
        userDefaults={userDefaults}
        open={isEditDialogOpen}
        onOpenChange={handleEditDialogClose}
        onSuccess={() => {
          handleEditDialogClose(false);
          handleRefresh();
        }}
      />
    </>
  );
}
