export type Category =
  | "fuel"
  | "service"
  | "insurance"
  | "tuning"
  | "travel"
  | "event";

export type Currency = "USD" | "EUR" | "GBP" | "CAD" | "AUD" | "JPY" | "CHF" | "CNY" | "INR" | "MXN" | "BRL" | "KRW" | "RUB";
export type DistanceUnit = "km" | "mi";
export type VolumeUnit = "l" | "gal";
export type DateFormat = "MM/DD/YYYY" | "DD/MM/YYYY" | "YYYY-MM-DD";

export interface UserSettings {
  country: string;
  currency: Currency;
  distance_unit: DistanceUnit;
  volume_unit: VolumeUnit;
  date_format: DateFormat;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
  country: string | null;
  currency: Currency | null;
  distance_unit: DistanceUnit | null;
  volume_unit: VolumeUnit | null;
  date_format: DateFormat | null;
}

export interface Vehicle {
  id: string;
  user_id: string;
  make: string;
  model: string;
  year: number;
  plate_number: string;
  current_mileage: number;
  created_at: string;
  country: string | null;
  currency: Currency | null;
  distance_unit: DistanceUnit | null;
  volume_unit: VolumeUnit | null;
  is_default: boolean;
}

export interface Record {
  id: string;
  vehicle_id: string;
  date: string;
  mileage_at_record: number;
  category: Category;
  title: string;
  cost: number;
  description: string;
  is_event: boolean;
  created_at: string;
}

export interface VehicleWithRecords extends Vehicle {
  records?: Record[];
}

export const DEFAULT_SETTINGS: UserSettings = {
  country: "US",
  currency: "USD",
  distance_unit: "mi",
  volume_unit: "gal",
  date_format: "MM/DD/YYYY",
};

export const COUNTRIES = [
  { code: "US", name: "United States", currency: "USD" as Currency, distance: "mi" as DistanceUnit, volume: "gal" as VolumeUnit, dateFormat: "MM/DD/YYYY" as DateFormat },
  { code: "CA", name: "Canada", currency: "CAD" as Currency, distance: "km" as DistanceUnit, volume: "l" as VolumeUnit, dateFormat: "MM/DD/YYYY" as DateFormat },
  { code: "GB", name: "United Kingdom", currency: "GBP" as Currency, distance: "mi" as DistanceUnit, volume: "gal" as VolumeUnit, dateFormat: "DD/MM/YYYY" as DateFormat },
  { code: "DE", name: "Germany", currency: "EUR" as Currency, distance: "km" as DistanceUnit, volume: "l" as VolumeUnit, dateFormat: "DD/MM/YYYY" as DateFormat },
  { code: "FR", name: "France", currency: "EUR" as Currency, distance: "km" as DistanceUnit, volume: "l" as VolumeUnit, dateFormat: "DD/MM/YYYY" as DateFormat },
  { code: "AU", name: "Australia", currency: "AUD" as Currency, distance: "km" as DistanceUnit, volume: "l" as VolumeUnit, dateFormat: "DD/MM/YYYY" as DateFormat },
  { code: "JP", name: "Japan", currency: "JPY" as Currency, distance: "km" as DistanceUnit, volume: "l" as VolumeUnit, dateFormat: "YYYY-MM-DD" as DateFormat },
  { code: "IN", name: "India", currency: "INR" as Currency, distance: "km" as DistanceUnit, volume: "l" as VolumeUnit, dateFormat: "DD/MM/YYYY" as DateFormat },
  { code: "MX", name: "Mexico", currency: "MXN" as Currency, distance: "km" as DistanceUnit, volume: "l" as VolumeUnit, dateFormat: "DD/MM/YYYY" as DateFormat },
  { code: "BR", name: "Brazil", currency: "BRL" as Currency, distance: "km" as DistanceUnit, volume: "l" as VolumeUnit, dateFormat: "DD/MM/YYYY" as DateFormat },
  { code: "KR", name: "South Korea", currency: "KRW" as Currency, distance: "km" as DistanceUnit, volume: "l" as VolumeUnit, dateFormat: "YYYY-MM-DD" as DateFormat },
  { code: "RU", name: "Russia", currency: "RUB" as Currency, distance: "km" as DistanceUnit, volume: "l" as VolumeUnit, dateFormat: "DD/MM/YYYY" as DateFormat },
  { code: "CH", name: "Switzerland", currency: "CHF" as Currency, distance: "km" as DistanceUnit, volume: "l" as VolumeUnit, dateFormat: "DD/MM/YYYY" as DateFormat },
  { code: "CN", name: "China", currency: "CNY" as Currency, distance: "km" as DistanceUnit, volume: "l" as VolumeUnit, dateFormat: "YYYY-MM-DD" as DateFormat },
  { code: "OTHER", name: "Other", currency: "USD" as Currency, distance: "km" as DistanceUnit, volume: "l" as VolumeUnit, dateFormat: "MM/DD/YYYY" as DateFormat },
];

export const CURRENCIES: { value: Currency; label: string; symbol: string }[] = [
  { value: "USD", label: "US Dollar", symbol: "$" },
  { value: "EUR", label: "Euro", symbol: "€" },
  { value: "GBP", label: "British Pound", symbol: "£" },
  { value: "CAD", label: "Canadian Dollar", symbol: "C$" },
  { value: "AUD", label: "Australian Dollar", symbol: "A$" },
  { value: "JPY", label: "Japanese Yen", symbol: "¥" },
  { value: "CHF", label: "Swiss Franc", symbol: "Fr" },
  { value: "CNY", label: "Chinese Yuan", symbol: "¥" },
  { value: "INR", label: "Indian Rupee", symbol: "₹" },
  { value: "MXN", label: "Mexican Peso", symbol: "$" },
  { value: "BRL", label: "Brazilian Real", symbol: "R$" },
  { value: "KRW", label: "South Korean Won", symbol: "₩" },
  { value: "RUB", label: "Russian Ruble", symbol: "₽" },
];

export const DATE_FORMATS: { value: DateFormat; label: string; example: string }[] = [
  { value: "MM/DD/YYYY", label: "MM/DD/YYYY", example: "12/31/2024" },
  { value: "DD/MM/YYYY", label: "DD/MM/YYYY", example: "31/12/2024" },
  { value: "YYYY-MM-DD", label: "YYYY-MM-DD", example: "2024-12-31" },
];
