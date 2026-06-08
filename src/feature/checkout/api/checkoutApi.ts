//insert new row into orders, take cart_items and insert the into order_items

import { myshopId } from "@/shared/constants";
import { createClient } from "@/shared/lib/client";
import type { CartItem } from "@/shared/types/cart";

type CheckoutProps = {
  cartId: string;
  customerId: string;
  cartItems: CartItem[];
  totalCents: number;
};

export async function checkout({
  cartId,
  customerId,
  cartItems,
  totalCents,
}: CheckoutProps): Promise<string | null> {
  const supabase = createClient();

  // Step 1: Create the order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      shop_id: myshopId,
      customer_id: customerId,
      status: "pending",
      subtotal_cents: totalCents,
      total_cents: totalCents,
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
    const unitPrice = item.variant?.price_cents ?? item.product.price_cents;
    return {
      order_id: order.id,
      product_id: item.product_id,
      variant_id: item.variant_id,
      product_name: item.product.name,
      variant_name: item.variant?.name ?? null,
      unit_price_cents: unitPrice,
      quantity: item.quantity,
      line_total_cents: unitPrice * item.quantity,
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
  // TODO: for my store (not the assignment), make sure orders hold on to the cartId so the same cart cant be checked out twice if delete fails and cartItems come back from the dead on refresh.

  return order.id;
}
