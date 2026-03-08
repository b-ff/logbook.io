import { VehicleList } from "@/components/vehicles/vehicle-list";
import { VehicleDialog } from "@/components/vehicles/vehicle-dialog";
import { QuickAddFAB } from "@/components/records/quick-add-fab";
import { BottomNav } from "@/components/layout/bottom-nav";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

function VehiclesSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-32 w-full rounded-lg" />
      ))}
    </div>
  );
}

export default async function CarsPage() {
  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between px-4">
          <h1 className="text-xl font-semibold">My Vehicles</h1>
          <div className="flex items-center gap-2">
            <VehicleDialog />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 py-6">
        <Suspense fallback={<VehiclesSkeleton />}>
          <VehicleList />
        </Suspense>
      </main>

      {/* Quick Add FAB */}
      <QuickAddFAB />

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
