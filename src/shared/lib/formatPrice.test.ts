import { describe, it, expect } from "vitest";
import { formatPrice } from "./formatPrice";

describe("formatPrice", () => {
  describe("ISK", () => {
    it("formats Icelandic style with dot separators and kr. suffix", () => {
      expect(formatPrice(9500, "is")).toBe("9.500 kr.");
    });

    it("formats English style with comma separators and ISK prefix", () => {
      expect(formatPrice(9500, "en")).toBe("ISK 9,500");
    });

    it("groups large amounts correctly in both languages", () => {
      expect(formatPrice(1250000, "is")).toBe("1.250.000 kr.");
      expect(formatPrice(1250000, "en")).toBe("ISK 1,250,000");
    });

    it("handles amounts below one thousand without separators", () => {
      expect(formatPrice(500, "is")).toBe("500 kr.");
      expect(formatPrice(500, "en")).toBe("ISK 500");
    });

    it("handles zero", () => {
      expect(formatPrice(0, "is")).toBe("0 kr.");
    });

    it("defaults to ISK when no currency is given", () => {
      expect(formatPrice(9500, "is")).toBe(formatPrice(9500, "is", "ISK"));
    });
  });

  describe("other currencies", () => {
    it("falls back to Intl formatting for non-ISK currencies", () => {
      expect(formatPrice(9500, "en", "EUR")).toContain("€");
    });
  });
});