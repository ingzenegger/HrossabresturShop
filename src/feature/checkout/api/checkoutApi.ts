//insert new row into orders, take cart_items and insert the into order_items

import { createClient } from "@/shared/lib/client";
import type { CartItem } from "@/shared/types/cart";
import type { Language } from "@/shared/types/language";

type CheckoutProps = {
  cartId: string;
  customerId: string;
  cartItems: CartItem[];
  totalAmount: number;
  language: Language;
};

export async function checkout({
  cartId,
  customerId,
  cartItems,
  totalAmount,
  language,
}: CheckoutProps): Promise<string | null> {
  const supabase = createClient();

  // Step 1: Create the order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      customer_id: customerId,
      status: "pending",
      subtotal: totalAmount,
      total: totalAmount,
      currency: cartItems[0].product.currency,
      submitted_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (orderError || !order) {
    console.error("Failed to create order:", orderError);
    return null;
  }

  // Step 2: Insert one order_item row per cart item
  const orderItems = cartItems.map((item) => {
    const unitPrice = item.variant?.price ?? item.product.price;
    return {
      order_id: order.id,
      product_id: item.product_id,
      variant_id: item.variant_id,
      product_name: item.product.name[language],
      variant_name: item.variant?.name[language] ?? null,
      unit_price: unitPrice,
      quantity: item.quantity,
      line_total: unitPrice * item.quantity,
    };
  });

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (itemsError) {
    console.error("Failed to insert order items:", itemsError);
    return null;
  }

  // Step 3: Delete the cart
  const { error: cartError } = await supabase
    .from("carts")
    .delete()
    .eq("id", cartId);

  if (cartError) {
    console.error("Failed to remove cart:", cartError);
    return order.id;
  }

  return order.id;
}
