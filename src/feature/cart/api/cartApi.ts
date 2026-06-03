import { myshopId } from "@/shared/constants";
import { createClient } from "@/shared/lib/client";
import { CartSchema, type CartItem } from "@/shared/types/cart";

type GetCartProps = {
    customerId: string,
    setCartId: (id:string|null) => void,
    setCartItems: (items: CartItem[]) => void;
}

export async function getCart({customerId, setCartId, setCartItems} :GetCartProps ){

  const supabase = createClient();
  
  const { data: cart, error } = await supabase
    .from("carts")
    .select("*, cart_items(*)")
    .eq("shop_id", myshopId)
    .eq("customer_id", customerId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      //error - row not found
      const { data, error } = await supabase
        .from("carts")
        .insert({
          shop_id: myshopId,
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
    } else {
      console.error(error);
      return;
    }
  }
  const parsed = CartSchema.safeParse(cart);
  if (!parsed.success) {
    console.error("Validation error", parsed.error);
    return;
  }

  setCartId(parsed.data.id);
  setCartItems(parsed.data.cart_items);
}
