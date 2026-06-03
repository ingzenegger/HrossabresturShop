import { useEffect } from "react";
import { createClient } from "@/shared/lib/client";
import { useAppStore } from "../../../shared/store/appStore";
import { CartItemSchema } from "../../../shared/types/cart";
import { getCart } from "@/feature/cart/api/cartApi";

export function useCart() {
  const supabase = createClient();
  const customerId = useAppStore((state) => state.customerId);
  const cartId = useAppStore((state) => state.cartId);
  const setCartId = useAppStore((state) => state.setCartId);
  const setCartItems = useAppStore((state) => state.setCartItems);
  const addToCart = useAppStore((state) => state.addToCart);
  const updateQuantity = useAppStore((state) => state.updateQuantity);
  const removeItem = useAppStore((state) => state.removeItem);
  const setCartHandlers = useAppStore((state) => state.setCartHandlers);

  useEffect(() => {
    if (!customerId) {
      setCartId(null);
      setCartItems([]);
      return;
    }

    getCart({ customerId, setCartId, setCartItems });
  }, [customerId]);

  useEffect(() => {
    setCartHandlers(handleAddToCart, handleUpdateQuantity, handleRemoveItem);
  }, [cartId]);

  async function handleAddToCart(productId: string) {
    const { data: existingItem, error } = await supabase
      .from("cart_items")
      .select()
      .eq("cart_id", cartId)
      .eq("product_id", productId);
    //   .single();

    if (error && error.code !== "PGRST116") {
      console.error(error);
      return;
    }

    if (existingItem && existingItem.length > 0) {
      handleUpdateQuantity(existingItem[0].id, existingItem[0].quantity + 1);
    } else {
      const { data: item, error } = await supabase
        .from("cart_items")
        .insert({
          cart_id: cartId,
          product_id: productId,
          quantity: 1,
        })
        .select()
        .single();

      if (error) {
        console.error(error);
        return;
      }

      const parsed = CartItemSchema.safeParse(item);
      if (!parsed.success) {
        console.error("Validation error", parsed.error);
        return;
      }

      addToCart(parsed.data);
    }
  }

  async function handleUpdateQuantity(itemId: string, quantity: number) {
    const { data: updatedRow, error } = await supabase
      .from("cart_items")
      .update({ quantity: quantity })
      .eq("id", itemId)
      .select()
      .single();
    if (error) {
      console.error(error);
      return;
    }
    const parsed = CartItemSchema.safeParse(updatedRow);
    if (!parsed.success) {
      console.error("Validation error", parsed.error);
      return;
    }
    updateQuantity(parsed.data.id, parsed.data.quantity);
  }

  async function handleRemoveItem(itemId: string) {
    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("id", itemId);
    if (error) {
      console.error(error);
      return;
    }
    removeItem(itemId);
  }

  return { handleAddToCart, handleUpdateQuantity, handleRemoveItem };
}
