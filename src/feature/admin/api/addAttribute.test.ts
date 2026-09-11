import { describe, it, expect, vi, beforeEach } from "vitest";
import { addAttribute } from "./addAttribute";
import type { NewAttribute } from "@/shared/types/product";

vi.mock("@/shared/lib/client", () => ({
  createClient: () => mockSupabase,
}));

const mockSingle = vi.fn();
const mockSelect = vi.fn(() => ({ single: mockSingle }));
const mockInsert = vi.fn(() => ({ select: mockSelect }));
const mockFrom = vi.fn(() => ({ insert: mockInsert }));

const mockSupabase = { from: mockFrom };

const newAttribute: NewAttribute = {
  product_id: "product-1",
  key: "category",
  value: { en: "Blanket", is: "Teppi" },
};

describe("addAttribute", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Re-wire the chain after clearing.
    mockInsert.mockReturnValue({ select: mockSelect });
    mockSelect.mockReturnValue({ single: mockSingle });
    mockFrom.mockReturnValue({ insert: mockInsert });
  });

  it("inserts the attribute and returns the created row on success", async () => {
    mockSingle.mockResolvedValueOnce({
      data: { id: "attr-1", ...newAttribute },
      error: null,
    });

    const result = await addAttribute(newAttribute);

    expect(mockFrom).toHaveBeenCalledWith("product_attributes");
    expect(mockInsert).toHaveBeenCalledWith({
      product_id: newAttribute.product_id,
      key: newAttribute.key,
      value: newAttribute.value,
    });
    expect(result).toEqual({ id: "attr-1", ...newAttribute });
  });

  it("throws when the insert fails", async () => {
    const dbError = { message: "DB error" };
    mockSingle.mockResolvedValueOnce({ data: null, error: dbError });

    await expect(addAttribute(newAttribute)).rejects.toEqual(dbError);
  });
});
