import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Currency, DateFormat, DistanceUnit, VolumeUnit } from "@/types/database";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: Currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);
}

export function getCurrencySymbol(currency: Currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(0).replace(/0/g, "").trim();
}

export function formatDate(dateString: string, format: DateFormat = "MM/DD/YYYY"): string {
  const date = new Date(dateString);
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  
  switch (format) {
    case "MM/DD/YYYY":
      return `${month}/${day}/${year}`;
    case "DD/MM/YYYY":
      return `${day}/${month}/${year}`;
    case "YYYY-MM-DD":
      return `${year}-${month}-${day}`;
    default:
      return date.toLocaleDateString();
  }
}

export function formatMileage(mileage: number, unit: DistanceUnit = "mi"): string {
  return `${new Intl.NumberFormat("en-US").format(mileage)} ${unit}`;
}

export function formatVolume(volume: number, unit: VolumeUnit = "gal"): string {
  return `${new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  }).format(volume)} ${unit}`;
}
