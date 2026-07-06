import { createClient } from "@/shared/lib/client";
import { CartSchema, type CartItem } from "@/shared/types/cart";

type GetCartProps = {
  customerId: string;
  setCartId: (id: string | null) => void;
  setCartItems: (items: CartItem[]) => void;
};
//get ACTIVE cart
export async function getCart({
  customerId,
  setCartId,
  setCartItems,
}: GetCartProps) {
  const supabase = createClient();

  const { data: cart, error } = await supabase
    .from("carts")
    .select(
      "*, cart_items(*, product:products(id, name:name_i18n, price, currency, stock_quantity, is_active),variant:product_variants(id, product_id, name:name_i18n, price, stock_quantity, created_at))",
    )
    .eq("customer_id", customerId)
    .eq("status", "active")
    .maybeSingle();

  if (error) {
    console.error(error);
    return;
  }
  if (!cart) {
    const { data, error } = await supabase
      .from("carts")
      .insert({
        customer_id: customerId,
        status: "active",
      })
      .select();
    if (error) {
      console.error(error);
      return;
    }
    setCartId(data?.[0].id);
    setCartItems([]);
    return;
  }

  const parsed = CartSchema.safeParse(cart);
  if (!parsed.success) {
    console.error("Validation error", parsed.error);
    return;
  }

  setCartId(parsed.data.id);
  setCartItems(parsed.data.cart_items);
}
