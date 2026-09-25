//test that checkout calls place_order with the right arguments
//test what happens when place_order fails (should return null)
//test that it returns the order id on success

import { describe, it, expect, vi, beforeEach } from "vitest";
import { checkout } from "./checkoutApi";

// mock supabase.rpc call
const mockRpc = vi.fn();
vi.mock("@/shared/lib/client", () => ({
  createClient: () => ({ rpc: mockRpc }),
}));

const checkoutArgs = {
  cartId: "cart-1",
  language: "en" as const,
  paymentMethod: "bank_transfer" as const,
  deliveryMethod: "pickup" as const,
  shippingAddress: null,
};

describe("checkout", () => {
  beforeEach(() => {
    // Reset mocks between tests.
    vi.clearAllMocks();
  });

  it("returns the order id on success", async () => {
    mockRpc.mockResolvedValueOnce({ data: "order-123", error: null });

    const result = await checkout(checkoutArgs);

    expect(result).toBe("order-123");
  });

  it("returns null when place_order fails", async () => {
    mockRpc.mockResolvedValueOnce({
      data: null,
      error: { message: "out_of_stock" },
    });

    const result = await checkout(checkoutArgs);

    expect(result).toBeNull();
  });

  it("sends the cart, language and methods to place_order", async () => {
    mockRpc.mockResolvedValueOnce({ data: "order-123", error: null });

    await checkout({ ...checkoutArgs, language: "is" });

    expect(mockRpc).toHaveBeenCalledWith("place_order", {
      p_cart_id: "cart-1",
      p_language: "is",
      p_payment_method: "bank_transfer",
      p_delivery_method: "pickup",
      p_shipping_name: null,
      p_shipping_street: null,
      p_shipping_postcode: null,
      p_shipping_city: null,
    });
  });

  it("splits the shipping address into separate arguments", async () => {
    mockRpc.mockResolvedValueOnce({ data: "order-123", error: null });

    await checkout({
      ...checkoutArgs,
      deliveryMethod: "post",
      shippingAddress: {
        name: "Jón Jónsson",
        street: "Laugavegur 1",
        postcode: "101",
        city: "Reykjavík",
      },
    });

    expect(mockRpc).toHaveBeenCalledWith(
      "place_order",
      expect.objectContaining({
        p_delivery_method: "post",
        p_shipping_name: "Jón Jónsson",
        p_shipping_street: "Laugavegur 1",
        p_shipping_postcode: "101",
        p_shipping_city: "Reykjavík",
      }),
    );
  });
});
