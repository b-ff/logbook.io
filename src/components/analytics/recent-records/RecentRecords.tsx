"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface RecentRecordsProps {
  records: Array<{
    id: string;
    title: string;
    cost: number;
    date: string;
    category: string;
    vehicleMake: string;
    vehicleModel: string;
  }>;
}

const CATEGORY_ICONS: Record<string, string> = {
  fuel: "⛽",
  service: "🔧",
  insurance: "📄",
  tuning: "🏎️",
  travel: "✈️",
  event: "📝",
};

export function RecentRecords({ records }: RecentRecordsProps) {
  if (records.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Records</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">No records yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Records</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {records.map((record) => {
              const icon = CATEGORY_ICONS[record.category] || "📋";
              return (
                <div
                  key={record.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{icon}</span>
                    <div>
                      <p className="font-medium">{record.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {record.vehicleMake} {record.vehicleModel} • {formatDate(record.date)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary">
                      {formatCurrency(record.cost)}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {record.category}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
