"use client";

import { Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { RecordDialog } from "./record-dialog";
import { cn } from "@/lib/utils";
import { useVehicles } from "@/hooks/use-vehicles";
import { getUserSettings } from "@/lib/supabase/settings-actions";

export function QuickAddFAB() {
  const { vehicles } = useVehicles();
  const [isOpen, setIsOpen] = useState(false);
  const [userDateFormat, setUserDateFormat] = useState<string | null>(null);

  useEffect(() => {
    getUserSettings().then((settings) => {
      if (settings) {
        setUserDateFormat(settings.date_format || null);
      }
    });
  }, []);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-20 right-4 z-50",
          "h-14 w-14 rounded-full",
          "bg-primary text-primary-foreground",
          "shadow-lg shadow-primary/30",
          "flex items-center justify-center",
          "touch-manipulation min-h-[44px] min-w-[44px]",
          "transition-transform hover:scale-105 active:scale-95",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        )}
        aria-label="Quick add record"
      >
        <Plus className="h-6 w-6" />
      </button>

      <RecordDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        vehicles={vehicles}
        userDateFormat={userDateFormat}
        onSuccess={() => setIsOpen(false)}
      />
    </>
  );
}
