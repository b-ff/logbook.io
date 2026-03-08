import { getAnalytics } from "@/lib/supabase/analytics-actions";
import { TotalExpensesCard } from "@/components/analytics/total-expenses-card";
import { ExpensesByCategory } from "@/components/analytics/expenses-by-category";
import { RecentRecords } from "@/components/analytics/recent-records";
import { BottomNav } from "@/components/layout/bottom-nav";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

async function AnalyticsContent() {
  const analytics = await getAnalytics();

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        <TotalExpensesCard total={analytics.totalExpenses} />
      </div>
      <ExpensesByCategory expensesByCategory={analytics.expensesByCategory} />
      <RecentRecords records={analytics.recentRecords} />
    </>
  );
}

function AnalyticsSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-[400px] w-full" />
      <Skeleton className="h-[400px] w-full" />
    </div>
  );
}

export default async function AnalyticsPage() {
  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between px-4">
          <h1 className="text-xl font-semibold">Analytics</h1>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 py-6 space-y-6">
        <Suspense fallback={<AnalyticsSkeleton />}>
          <AnalyticsContent />
        </Suspense>
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
