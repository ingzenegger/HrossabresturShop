import { describe, it, expect, vi, beforeEach } from "vitest";
import { getAdminProducts } from "./getAdminProducts";

vi.mock("@/shared/lib/client", () => ({
  createClient: () => mockSupabase,
}));

const mockSelect = vi.fn();
const mockFrom = vi.fn(() => ({ select: mockSelect }));

const mockSupabase = { from: mockFrom };

// A fully valid product, matching what ProductSchema expects — note the id
// has to be a real UUID here, since this test exercises the actual schema
// validation (unlike component tests, where useAdminProducts is mocked and
// never touches the real schema).
const validProduct = {
  id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  name: { is: "Bláir vettlingar", en: "Blue Mittens" },
  slug: "blue-mittens",
  description: { is: "Hlýtt", en: "Warm" },
  price: 4500,
  currency: "ISK",
  stock_quantity: 5,
  is_active: true,
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-01T00:00:00Z",
  product_type: "handmade",
  product_assets: [],
  product_variants: [],
  product_attributes: [],
};

describe("getAdminProducts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFrom.mockReturnValue({ select: mockSelect });
  });

  it("returns the parsed products when the data is valid", async () => {
    mockSelect.mockResolvedValueOnce({ data: [validProduct], error: null });

    const result = await getAdminProducts();

    expect(mockFrom).toHaveBeenCalledWith("products");
    expect(result).toEqual([validProduct]);
  });

  it("returns an empty array when there is no data", async () => {
    mockSelect.mockResolvedValueOnce({ data: null, error: null });

    const result = await getAdminProducts();

    expect(result).toEqual([]);
  });

  it("returns undefined when the data doesn't match the schema", async () => {
    const invalidProduct = { ...validProduct, id: "not-a-uuid" };
    mockSelect.mockResolvedValueOnce({ data: [invalidProduct], error: null });

    const result = await getAdminProducts();

    expect(result).toBeUndefined();
  });

  it("throws when the request fails", async () => {
    const dbError = { message: "DB error" };
    mockSelect.mockResolvedValueOnce({ data: null, error: dbError });

    await expect(getAdminProducts()).rejects.toEqual(dbError);
  });
});
