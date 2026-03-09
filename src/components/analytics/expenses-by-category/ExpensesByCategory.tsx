"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { formatCurrency } from "@/lib/utils";

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

const CATEGORY_LABELS: Record<string, string> = {
  fuel: "⛽ Fuel",
  service: "🔧 Service",
  insurance: "📄 Insurance",
  tuning: "🏎️ Tuning",
  travel: "✈️ Travel",
  event: "📝 Event",
};

interface ExpensesByCategoryProps {
  expensesByCategory: Record<string, number>;
}

export function ExpensesByCategory({ expensesByCategory }: ExpensesByCategoryProps) {
  const data = Object.entries(expensesByCategory)
    .filter(([_, value]) => value > 0)
    .map(([name, value]) => ({
      name: CATEGORY_LABELS[name] || name,
      value,
    }))
    .sort((a, b) => b.value - a.value);

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Expenses by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">No expense data yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expenses by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${((percent || 0) * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => formatCurrency(Number(value) || 0)}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
