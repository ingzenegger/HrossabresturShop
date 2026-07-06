import { describe, it, expect } from "vitest";
import { formatDate } from "./formatDate";

describe("formatDate", () => {
  it("formats Icelandic style with period after day and lowercase month", () => {
    expect(formatDate(new Date(2026, 6, 6), "is")).toBe("6. júlí 2026");
  });

  it("formats English style without period and capitalized month", () => {
    expect(formatDate(new Date(2026, 6, 6), "en")).toBe("6 July 2026");
  });

  it("handles the first month of the year", () => {
    expect(formatDate(new Date(2026, 0, 1), "is")).toBe("1. janúar 2026");
    expect(formatDate(new Date(2026, 0, 1), "en")).toBe("1 January 2026");
  });

  it("handles the last month of the year", () => {
    expect(formatDate(new Date(2026, 11, 31), "is")).toBe("31. desember 2026");
    expect(formatDate(new Date(2026, 11, 31), "en")).toBe("31 December 2026");
  });

  it("accepts an ISO timestamp string like Supabase returns", () => {
    // Noon UTC: local time anywhere reasonable is still the same calendar day
    expect(formatDate("2026-07-06T12:00:00Z", "is")).toBe("6. júlí 2026");
  });
});