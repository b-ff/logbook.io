"use client";

import { Record as RecordType } from "@/types/database";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatDate, formatMileage } from "@/lib/utils";

interface TimelineProps {
  records: RecordType[];
}

const CATEGORY_ICONS: { [key: string]: string } = {
  fuel: "⛽",
  service: "🔧",
  insurance: "📄",
  tuning: "🏎️",
  travel: "✈️",
  event: "📝",
};

export function HistoryTimeline({ records }: TimelineProps) {
  if (records.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No history yet</p>
      </div>
    );
  }

  // Group records by month and year
  const groupedRecords = records.reduce((acc, record) => {
    const date = new Date(record.date);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(record);
    return acc;
  }, {} as { [key: string]: RecordType[] });

  const sortedKeys = Object.keys(groupedRecords).sort((a, b) => b.localeCompare(a));

  return (
    <div className="space-y-6">
      {sortedKeys.map((key) => {
        const monthRecords = groupedRecords[key];
        const date = new Date(key + "-01");
        const monthYear = date.toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        });

        return (
          <div key={key} className="space-y-3">
            <h3 className="text-lg font-semibold sticky top-14 bg-background/95 backdrop-blur py-2">
              {monthYear}
            </h3>
            <div className="space-y-2">
              {monthRecords.map((record, index) => {
                const icon = CATEGORY_ICONS[record.category] || "📋";
                return (
                  <Card key={record.id} className="relative overflow-hidden">
                    {index !== monthRecords.length - 1 && (
                      <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-border" />
                    )}
                    <CardContent className="flex gap-4 py-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <span className="text-xl">{icon}</span>
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold">{record.title}</p>
                          {!record.is_event && (
                            <p className="font-semibold text-primary">
                              {formatCurrency(record.cost)}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{formatDate(record.date)}</span>
                          <span>{formatMileage(record.mileage_at_record)} mi</span>
                          <span className="capitalize">{record.category}</span>
                        </div>
                        {record.description && (
                          <p className="text-sm text-muted-foreground">
                            {record.description}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
