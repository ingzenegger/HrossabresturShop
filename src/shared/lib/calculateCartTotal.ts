import type { CartItem } from "../types/cart";

export function calculateCartTotal(cartItems: CartItem[]) {
  const total = cartItems.reduce((sum, item) => {
    const price = item.variant?.price ?? item.product.price;
    return sum + price * item.quantity;
  }, 0);
  return total;
}
