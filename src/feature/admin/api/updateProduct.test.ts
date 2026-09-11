import type { NewProduct } from "@/shared/types/product";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { updateProduct } from "./updateProduct";

vi.mock("@/shared/lib/client", () => ({
  createClient: () => mockSupabase,
}));

const mockSingle = vi.fn();
const mockSelect = vi.fn(() => ({ single: mockSingle }));
const mockEq = vi.fn(() => ({ select: mockSelect }));
const mockUpdate = vi.fn(() => ({ eq: mockEq }));
const mockFrom = vi.fn(() => ({ update: mockUpdate }));

const mockSupabase = { from: mockFrom };

const productUpdates: NewProduct = {
  name: { en: "Blue mittens", is: "Bláir vettlingar" },
  slug: "blue-mittens",
  description: { en: "Warm", is: "Hlýtt" },
  price: 5000,
  currency: "ISK",
  product_type: "handmade",
  is_active: true,
};

describe("updateProduct", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Re-wire the chain after clearing.
    mockUpdate.mockReturnValue({ eq: mockEq });
    mockEq.mockReturnValue({ select: mockSelect });
    mockSelect.mockReturnValue({ single: mockSingle });
    mockFrom.mockReturnValue({ update: mockUpdate });
  });

  it("updates the product and returns the updated row on success", async () => {
    mockSingle.mockResolvedValueOnce({
      data: { id: "product-1", ...productUpdates },
      error: null,
    });

    const result = await updateProduct("product-1", productUpdates);

    expect(mockFrom).toHaveBeenCalledWith("products");
    expect(mockUpdate).toHaveBeenCalledWith({
      name: productUpdates.name,
      description: productUpdates.description,
      slug: productUpdates.slug,
      price: productUpdates.price,
      currency: productUpdates.currency,
      product_type: productUpdates.product_type,
      is_active: productUpdates.is_active,
    });
    expect(mockEq).toHaveBeenCalledWith("id", "product-1");
    expect(result).toEqual({ id: "product-1", ...productUpdates });
  });

  it("throws when the update fails", async () => {
    const dbError = { message: "DB error" };
    mockSingle.mockResolvedValueOnce({ data: null, error: dbError });

    await expect(updateProduct("product-1", productUpdates)).rejects.toEqual(
      dbError,
    );
  });
});
