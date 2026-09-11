import { describe, it, expect, vi, beforeEach } from "vitest";
import { addVariant } from "./addVariant";
import type { NewVariant } from "@/shared/types/product";

vi.mock("@/shared/lib/client", () => ({
  createClient: () => mockSupabase,
}));

const mockSingle = vi.fn();
const mockSelect = vi.fn(() => ({ single: mockSingle }));
const mockInsert = vi.fn(() => ({ select: mockSelect }));
const mockFrom = vi.fn(() => ({ insert: mockInsert }));

const mockSupabase = { from: mockFrom };

const newVariant: NewVariant = {
  product_id: "product-1",
  name: { en: "Blue", is: "Blár" },
  price: 2500,
  stock_quantity: 10,
};

describe("addVariant", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Re-wire the chain after clearing.
    mockInsert.mockReturnValue({ select: mockSelect });
    mockSelect.mockReturnValue({ single: mockSingle });
    mockFrom.mockReturnValue({ insert: mockInsert });
  });

  it("inserts the variant and returns the created row on success", async () => {
    mockSingle.mockResolvedValueOnce({
      data: { id: "variant-1", ...newVariant },
      error: null,
    });

    const result = await addVariant(newVariant);

    expect(mockFrom).toHaveBeenCalledWith("product_variants");
    expect(mockInsert).toHaveBeenCalledWith({
      product_id: newVariant.product_id,
      name: newVariant.name,
      price: newVariant.price,
      stock_quantity: newVariant.stock_quantity,
    });
    expect(result).toEqual({ id: "variant-1", ...newVariant });
  });

  it("throws when the insert fails", async () => {
    const dbError = { message: "DB error" };
    mockSingle.mockResolvedValueOnce({ data: null, error: dbError });

    await expect(addVariant(newVariant)).rejects.toEqual(dbError);
  });
});
