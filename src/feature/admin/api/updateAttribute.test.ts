import { describe, it, expect, vi, beforeEach } from "vitest";
import { updateAttribute } from "./updateAttribute";
import type { NewAttribute } from "@/shared/types/product";

vi.mock("@/shared/lib/client", () => ({
  createClient: () => mockSupabase,
}));

const mockSingle = vi.fn();
const mockSelect = vi.fn(() => ({ single: mockSingle }));
const mockEq = vi.fn(() => ({ select: mockSelect }));
const mockUpdate = vi.fn(() => ({ eq: mockEq }));
const mockFrom = vi.fn(() => ({ update: mockUpdate }));

const mockSupabase = { from: mockFrom };

const attributeUpdates: NewAttribute = {
  product_id: "product-1",
  key: "category",
  value: { en: "Blanket", is: "Teppi" },
};

describe("updateAttribute", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Re-wire the chain after clearing.
    mockUpdate.mockReturnValue({ eq: mockEq });
    mockEq.mockReturnValue({ select: mockSelect });
    mockSelect.mockReturnValue({ single: mockSingle });
    mockFrom.mockReturnValue({ update: mockUpdate });
  });

  it("updates the attribute and returns the updated row on success", async () => {
    mockSingle.mockResolvedValueOnce({
      data: { id: "attr-1", ...attributeUpdates },
      error: null,
    });

    const result = await updateAttribute("attr-1", attributeUpdates);

    expect(mockFrom).toHaveBeenCalledWith("product_attributes");
    expect(mockUpdate).toHaveBeenCalledWith({
      key: attributeUpdates.key,
      value: attributeUpdates.value,
    });
    expect(mockEq).toHaveBeenCalledWith("id", "attr-1");
    expect(result).toEqual({ id: "attr-1", ...attributeUpdates });
  });

  it("throws when the update fails", async () => {
    const dbError = { message: "DB error" };
    mockSingle.mockResolvedValueOnce({ data: null, error: dbError });

    await expect(updateAttribute("attr-1", attributeUpdates)).rejects.toEqual(
      dbError,
    );
  });
});
