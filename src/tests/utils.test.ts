import { describe, it, expect } from "vitest";
import { formatCurrency, formatDate, formatMileage, cn } from "@/lib/utils";

describe("Utils", () => {
  describe("formatCurrency", () => {
    it("formats number as USD currency", () => {
      expect(formatCurrency(100)).toBe("$100.00");
      expect(formatCurrency(50.5)).toBe("$50.50");
      expect(formatCurrency(0)).toBe("$0.00");
    });

    it("handles negative values", () => {
      expect(formatCurrency(-50)).toBe("-$50.00");
    });

    it("handles large numbers", () => {
      expect(formatCurrency(1000000)).toBe("$1,000,000.00");
    });
  });

  describe("formatDate", () => {
    it("formats ISO date string", () => {
      expect(formatDate("2024-01-15")).toMatch(/Jan 15, 2024|January 15, 2024/);
    });

    it("formats date with time", () => {
      expect(formatDate("2024-01-15T10:00:00Z")).toMatch(/Jan 15, 2024|January 15, 2024/);
    });
  });

  describe("formatMileage", () => {
    it("formats mileage with commas", () => {
      expect(formatMileage(50000)).toBe("50,000");
      expect(formatMileage(1000000)).toBe("1,000,000");
    });

    it("handles small numbers", () => {
      expect(formatMileage(100)).toBe("100");
    });
  });

  describe("cn", () => {
    it("merges class names", () => {
      expect(cn("foo", "bar")).toBe("foo bar");
    });

    it("handles conditional classes", () => {
      expect(cn("foo", true && "bar", false && "baz")).toBe("foo bar");
    });

    it("handles tailwind class merging", () => {
      expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
    });

    it("handles empty and falsy values", () => {
      expect(cn("", null, undefined, false, "foo")).toBe("foo");
    });
  });
});
