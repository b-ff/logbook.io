"use client";

import type { Record as RecordType, Vehicle } from "@/types/database";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatCurrency, formatDate, formatMileage } from "@/lib/utils";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const CATEGORY_ICONS: { [key: string]: string } = {
  fuel: "⛽",
  service: "🔧",
  insurance: "📄",
  tuning: "🏎️",
  travel: "✈️",
  event: "📝",
};

interface RecordCardProps {
  record: RecordType;
  vehicle?: Vehicle;
  onEdit?: (record: RecordType) => void;
  onDelete?: (id: string) => void;
}

export function RecordCard({ record, vehicle, onEdit, onDelete }: RecordCardProps) {
  const categoryIcon = CATEGORY_ICONS[record.category] || "📋";
  const currency = vehicle?.currency || "USD";
  const distanceUnit = vehicle?.distance_unit || "mi";

  return (
    <Card className="relative touch-manipulation">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{categoryIcon}</span>
            <div>
              <h3 className="font-semibold">{record.title}</h3>
              <p className="text-sm text-muted-foreground capitalize">
                {record.category}
                {vehicle && ` • ${vehicle.make} ${vehicle.model}`}
              </p>
            </div>
          </div>
          {(onEdit || onDelete) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">Record options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onEdit && (
                  <DropdownMenuItem onClick={() => onEdit(record)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <DropdownMenuItem
                    onClick={() => onDelete(record.id)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Date</p>
            <p className="font-medium">{formatDate(record.date)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Mileage</p>
            <p className="font-medium">{formatMileage(record.mileage_at_record, distanceUnit)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Cost</p>
            <p className="font-semibold text-primary">
              {record.is_event ? "—" : formatCurrency(record.cost, currency)}
            </p>
          </div>
        </div>
        {record.description && (
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
            {record.description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
