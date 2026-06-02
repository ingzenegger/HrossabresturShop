import { useEffect } from "react";
import { createClient } from "@/shared/lib/client";
import { useAppStore } from "../store/appStore";
import { myshopId } from "../constants";

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

    getCart();
  }, [customerId]);

  useEffect(() => {
    setCartHandlers(handleAddToCart, handleUpdateQuantity, handleRemoveItem);
  }, [cartId]);

  async function getCart() {
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

    setCartId(cart.id);
    setCartItems(cart.cart_items);
  }

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

      addToCart(item);
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
    updateQuantity(updatedRow.id, updatedRow.quantity);
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
