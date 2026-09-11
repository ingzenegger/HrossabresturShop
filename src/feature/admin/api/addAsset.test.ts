import { describe, it, expect, vi, beforeEach } from "vitest";
import { addAsset } from "./addAsset";
import type { NewAsset } from "@/shared/types/product";

vi.mock("@/shared/lib/client", () => ({
  createClient: () => mockSupabase,
}));

const mockSingle = vi.fn();
const mockSelect = vi.fn(() => ({ single: mockSingle }));
const mockInsert = vi.fn(() => ({ select: mockSelect }));
const mockFrom = vi.fn(() => ({ insert: mockInsert }));

const mockSupabase = { from: mockFrom };

const newAsset: NewAsset = {
  product_id: "product-1",
  variant_id: null,
  asset_url: "https://example.com/photo.png",
  asset_type: "image",
  alt_text: "A cozy mitten",
  sort_order: 0,
};

describe("addAsset", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Re-wire the chain after clearing.
    mockInsert.mockReturnValue({ select: mockSelect });
    mockSelect.mockReturnValue({ single: mockSingle });
    mockFrom.mockReturnValue({ insert: mockInsert });
  });

  it("inserts the asset and returns the created row on success", async () => {
    mockSingle.mockResolvedValueOnce({
      data: { id: "asset-1", ...newAsset },
      error: null,
    });

    const result = await addAsset(newAsset);

    expect(mockFrom).toHaveBeenCalledWith("product_assets");
    expect(mockInsert).toHaveBeenCalledWith({
      product_id: newAsset.product_id,
      variant_id: newAsset.variant_id,
      asset_url: newAsset.asset_url,
      asset_type: newAsset.asset_type,
      alt_text: newAsset.alt_text,
      sort_order: newAsset.sort_order,
    });
    expect(result).toEqual({ id: "asset-1", ...newAsset });
  });

  it("throws when the insert fails", async () => {
    const dbError = { message: "DB error" };
    mockSingle.mockResolvedValueOnce({ data: null, error: dbError });

    await expect(addAsset(newAsset)).rejects.toEqual(dbError);
  });
});
