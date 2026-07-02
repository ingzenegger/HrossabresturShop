//test what happens when inserting order fails (should return null)
//test what happens when inserting order items fails (should return null as well)
//test whta happens when this shit works (returns the order Id)

import { describe, it, expect, vi, beforeEach } from "vitest";
import { checkout } from "./checkoutApi";

//mockidy mock
vi.mock("@/shared/lib/client", () => ({
  createClient: () => mockSupabase,
}));
//mocking the chaaining stuff for supabase
const mockSingle = vi.fn();
const mockSelect = vi.fn(() => ({ single: mockSingle }));
const mockInsert: ReturnType<typeof vi.fn> = vi.fn(() => ({
  select: mockSelect,
  then: undefined,
}));
const mockUpdate = vi.fn(() => ({ eq: mockEq }));
const mockDelete = vi.fn(() => ({ eq: mockEq }));
const mockEq = vi.fn();
const mockFrom = vi.fn(() => ({
  insert: mockInsert,
  update: mockUpdate,
  delete: mockDelete,
}));

const mockSupabase = { from: mockFrom };

//test data
const cartItems = [
  {
    id: "item-1",
    cart_id: "cart-1",
    product_id: "prod-1",
    quantity: 2,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    variant_id: "var-1",
    product: {
      id: "prod-1",
      name: "Handmade Thingy",
      price: 25000,
      currency: "ISK",
      stock_quantity: 10,
      is_active: true,
    },
    variant: {
      name: "Blue",
      price: 25000,
      stock_quantity: 10,
    },
  },
];

const checkoutArgs = {
  cartId: "cart-1",
  customerId: "customer-1",
  cartItems,
  totalCents: 50000,
};

describe("checkout", () => {
  beforeEach(() => {
    // Reset all mocks between tests.
    vi.clearAllMocks();

    // Re-wire the chain after clearing.
    mockInsert.mockReturnValue({ select: mockSelect, then: undefined });
    mockSelect.mockReturnValue({ single: mockSingle });
    mockUpdate.mockReturnValue({ eq: mockEq });
    mockFrom.mockReturnValue({
      insert: mockInsert,
      update: mockUpdate,
      delete: mockDelete,
    });
  });

  it("returns null when the order insert fails", async () => {
    mockSingle.mockResolvedValueOnce({
      data: null,
      error: { message: "DB error" },
    });

    const result = await checkout(checkoutArgs);

    expect(result).toBeNull();
  });

  it("returns null when order_items insert fails", async () => {
    // First call: order insert succeeds, gives back a fake order
    mockSingle.mockResolvedValueOnce({
      data: { id: "order-123" },
      error: null,
    });

    // Second call: order_items insert fails.

    mockInsert.mockReturnValueOnce({ select: mockSelect, then: undefined }); // first call (orders)
    mockInsert.mockResolvedValueOnce({
      data: null,
      error: { message: "Insert failed" },
    }); // second call (order_items)

    const result = await checkout(checkoutArgs);

    expect(result).toBeNull();
  });

  it("returns the order id on success", async () => {
    // Order insert succeeds
    mockSingle.mockResolvedValueOnce({
      data: { id: "order-123" },
      error: null,
    });

    // order_items insert succeeds
    mockInsert.mockReturnValueOnce({ select: mockSelect }); // first call (orders)
    mockInsert.mockResolvedValueOnce({ data: null, error: null }); // second call (order_items)

    // cart update succeeds
    mockEq.mockResolvedValueOnce({ error: null });

    const result = await checkout(checkoutArgs);

    expect(result).toBe("order-123");
  });
});
