"use client";

import * as React from "react";
import { Car, BarChart3, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/cars",
      label: "Cars",
      icon: Car,
    },
    {
      href: "/analytics",
      label: "Analytics",
      icon: BarChart3,
    },
    {
      href: "/profile",
      label: "Profile",
      icon: User,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t bg-background pb-safe">
      <div className="grid h-16 grid-cols-3 items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 text-muted-foreground transition-colors",
                "h-full touch-manipulation min-h-[44px]",
                isActive && "text-primary"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
