// turn the active cart into an order via the place_order database function,
// which checks stock, creates the order and closes the cart in one transaction

import { createClient } from "@/shared/lib/client";
import type { Language } from "@/shared/types/language";
import type {
  DeliveryMethod,
  PaymentMethod,
  ShippingAddress,
} from "@/shared/types/order";

type CheckoutProps = {
  cartId: string;
  language: Language;
  paymentMethod: PaymentMethod;
  deliveryMethod: DeliveryMethod;
  shippingAddress: ShippingAddress | null;
};

export async function checkout({
  cartId,  
  language,
  paymentMethod,
  deliveryMethod,
  shippingAddress,
}: CheckoutProps): Promise<string | null> {
  const supabase = createClient();

  const { data: orderId, error } = await supabase.rpc("place_order", {
    p_cart_id: cartId,
    p_language: language,
    p_payment_method: paymentMethod,
    p_delivery_method: deliveryMethod,
    p_shipping_name: shippingAddress?.name ?? null,
    p_shipping_street: shippingAddress?.street ?? null,
    p_shipping_postcode: shippingAddress?.postcode ?? null,
    p_shipping_city: shippingAddress?.city ?? null,
  });

  if (error || !orderId) {
    console.error("Failed to place order:", error);
    return null;
  }

  return orderId;
}

