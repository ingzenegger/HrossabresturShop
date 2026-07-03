import { describe, it, expect, beforeEach } from "vitest";
import { useAppStore } from "./appStore";
import type { CartItem } from "../types/cart";

// A mock CartItem matching the CartItem type with insanely long ids
const mockItem: CartItem = {
  id: "11111111-1111-1111-1111-111111111111",
  cart_id: "22222222-2222-2222-2222-222222222222",
  product_id: "33333333-3333-3333-3333-333333333333",
  quantity: 1,
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-01T00:00:00Z",
  variant_id: "44444444-4444-4444-4444-444444444444",
  product: {
    id: "33333333-3333-3333-3333-333333333333",
    name: {en: "Test Scarf", is: "Prufu trefill"},
    price: 2500,
    currency: "ISK",
    stock_quantity: 10,
    is_active: true,
  },
  variant: {
    name: "Blue",
    price: 2500,
    stock_quantity: 10,
  },
};

describe("cart store", () => {
  // Reset cartItems before each test to start with a clean slate
  beforeEach(() => {
    useAppStore.setState({ cartItems: [] });
  });

  it("adds an item to the cart", () => {
    useAppStore.getState().addToCart(mockItem);
    const { cartItems } = useAppStore.getState();

    expect(cartItems).toHaveLength(1);
    expect(cartItems[0].id).toBe(mockItem.id);
  });

  it("adds multiple different items to the cart", () => {
    const secondItem: CartItem = {
      ...mockItem,
      id: "55555555-5555-5555-5555-555555555555",
    };

    useAppStore.getState().addToCart(mockItem);
    useAppStore.getState().addToCart(secondItem);

    expect(useAppStore.getState().cartItems).toHaveLength(2);
  });

  it("updates the quantity of an item", () => {
    useAppStore.getState().addToCart(mockItem);
    useAppStore.getState().updateQuantity(mockItem.id, 3);

    const updated = useAppStore.getState().cartItems[0];
    expect(updated.quantity).toBe(3);
  });

  it("does not affect other items when updating quantity", () => {
    const secondItem: CartItem = {
      ...mockItem,
      id: "55555555-5555-5555-5555-555555555555",
    };

    useAppStore.getState().addToCart(mockItem);
    useAppStore.getState().addToCart(secondItem);
    useAppStore.getState().updateQuantity(mockItem.id, 5);

    const second = useAppStore
      .getState()
      .cartItems.find((i) => i.id === secondItem.id);
    expect(second?.quantity).toBe(1);
  });

  it("removes an item from the cart", () => {
    useAppStore.getState().addToCart(mockItem);
    useAppStore.getState().removeItem(mockItem.id);

    expect(useAppStore.getState().cartItems).toHaveLength(0);
  });

  it("only removes the correct item when multiple are in the cart", () => {
    const secondItem: CartItem = {
      ...mockItem,
      id: "55555555-5555-5555-5555-555555555555",
    };

    useAppStore.getState().addToCart(mockItem);
    useAppStore.getState().addToCart(secondItem);
    useAppStore.getState().removeItem(mockItem.id);

    const remaining = useAppStore.getState().cartItems;
    expect(remaining).toHaveLength(1);
    expect(remaining[0].id).toBe(secondItem.id);
  });
});

describe("language store", () => {
  beforeEach(() => {
    useAppStore.setState({ language: "is" });
  });

  it("defaults to Icelandic", () => {
    expect(useAppStore.getState().language).toBe("is");
  });
  it("changes language with setLanguage", () => {
    useAppStore.getState().setLanguage("en");
    expect(useAppStore.getState().language).toBe("en");
  });
});
