import { describe, it, expect, vi, beforeEach } from "vitest";
import { addProduct } from "./addProduct";
import type { NewProduct } from "@/shared/types/product";

vi.mock("@/shared/lib/client", () => ({
  createClient: () => mockSupabase,
}));

// The chain here is shorter than checkout's: from().insert().select().single()
const mockSingle = vi.fn();
const mockSelect = vi.fn(() => ({ single: mockSingle }));
const mockInsert = vi.fn(() => ({ select: mockSelect }));
const mockFrom = vi.fn(() => ({ insert: mockInsert }));

const mockSupabase = { from: mockFrom };

const newProduct: NewProduct = {
  name: { en: "Blue Mittens", is: "Bláir vettlingar" },
  slug: "blue-mittens",
  description: { en: "Warm", is: "Hlýtt" },
  price: 4500,
  currency: "ISK",
  product_type: "handmade",
  is_active: true,
};

describe("addProduct", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Re-wire the chain after clearing.
    mockInsert.mockReturnValue({ select: mockSelect });
    mockSelect.mockReturnValue({ single: mockSingle });
    mockFrom.mockReturnValue({ insert: mockInsert });
  });

  it("inserts the product and returns the created row on success", async () => {
    mockSingle.mockResolvedValueOnce({
      data: { id: "product-1", ...newProduct },
      error: null,
    });

    const result = await addProduct(newProduct);

    expect(mockFrom).toHaveBeenCalledWith("products");
    expect(mockInsert).toHaveBeenCalledWith({
      name: newProduct.name,
      description: newProduct.description,
      slug: newProduct.slug,
      price: newProduct.price,
      currency: newProduct.currency,
      product_type: newProduct.product_type,
      is_active: newProduct.is_active,
    });
    expect(result).toEqual({ id: "product-1", ...newProduct });
  });

  it("throws when the insert fails", async () => {
    const dbError = { message: "DB error" };
    mockSingle.mockResolvedValueOnce({ data: null, error: dbError });

    await expect(addProduct(newProduct)).rejects.toEqual(dbError);
  });
});
