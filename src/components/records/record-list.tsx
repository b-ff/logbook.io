"use client";

import { Record, Vehicle } from "@/types/database";
import { RecordCard } from "./record-card";
import { deleteRecord } from "@/lib/supabase/record-actions";
import { useState, useTransition } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface RecordListProps {
  records: Record[];
  vehicles?: Vehicle[];
  isLoading?: boolean;
  onRefresh?: () => void;
  onEditRecord?: (record: Record) => void;
}

export function RecordList({
  records,
  vehicles,
  isLoading,
  onRefresh,
  onEditRecord,
}: RecordListProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this record?")) {
      startTransition(async () => {
        await deleteRecord(id);
        onRefresh?.();
      });
    }
  };

  const getVehicleForRecord = (vehicleId: string) => {
    return vehicles?.find((v) => v.id === vehicleId);
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

  if (records.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No records yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {records.map((record) => (
        <RecordCard
          key={record.id}
          record={record}
          vehicle={getVehicleForRecord(record.vehicle_id)}
          onEdit={onEditRecord}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}
