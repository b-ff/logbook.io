"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { DollarSign, TrendingUp } from "lucide-react";

interface TotalExpensesCardProps {
  total: number;
  label?: string;
}

export function TotalExpensesCard({ total, label = "Total Expenses" }: TotalExpensesCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{label}</CardTitle>
        <DollarSign className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatCurrency(total)}</div>
        <p className="text-xs text-muted-foreground">All time spending</p>
      </CardContent>
    </Card>
  );
}
