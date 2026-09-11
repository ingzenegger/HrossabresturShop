import { describe, it, expect, vi, beforeEach } from "vitest";
import { updateVariant } from "./updateVariant";
import type { NewVariant } from "@/shared/types/product";

vi.mock("@/shared/lib/client", () => ({
  createClient: () => mockSupabase,
}));

const mockSingle = vi.fn();
const mockSelect = vi.fn(() => ({ single: mockSingle }));
const mockEq = vi.fn(() => ({ select: mockSelect }));
const mockUpdate = vi.fn(() => ({ eq: mockEq }));
const mockFrom = vi.fn(() => ({ update: mockUpdate }));

const mockSupabase = { from: mockFrom };

const variantUpdates: NewVariant = {
  product_id: "product-1",
  name: { en: "Blue", is: "Blár" },
  price: 2700,
  stock_quantity: 8,
};

describe("updateVariant", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Re-wire the chain after clearing.
    mockUpdate.mockReturnValue({ eq: mockEq });
    mockEq.mockReturnValue({ select: mockSelect });
    mockSelect.mockReturnValue({ single: mockSingle });
    mockFrom.mockReturnValue({ update: mockUpdate });
  });

  it("updates the variant and returns the updated row on success", async () => {
    mockSingle.mockResolvedValueOnce({
      data: { id: "variant-1", ...variantUpdates },
      error: null,
    });

    const result = await updateVariant("variant-1", variantUpdates);

    expect(mockFrom).toHaveBeenCalledWith("product_variants");
    expect(mockUpdate).toHaveBeenCalledWith({
      name: variantUpdates.name,
      price: variantUpdates.price,
      stock_quantity: variantUpdates.stock_quantity,
    });
    expect(mockEq).toHaveBeenCalledWith("id", "variant-1");
    expect(result).toEqual({ id: "variant-1", ...variantUpdates });
  });

  it("throws when the update fails", async () => {
    const dbError = { message: "DB error" };
    mockSingle.mockResolvedValueOnce({ data: null, error: dbError });

    await expect(updateVariant("variant-1", variantUpdates)).rejects.toEqual(
      dbError,
    );
  });
});
