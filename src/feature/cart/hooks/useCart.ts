import { useEffect } from "react";
import { createClient } from "@/shared/lib/client";
import { useAppStore } from "../../../shared/store/appStore";
import { getCart } from "@/feature/cart/api/cartApi";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router";

export function useCart() {
  const supabase = createClient();
  const customerId = useAppStore((state) => state.customerId);
  const cartId = useAppStore((state) => state.cartId);
  const setCartId = useAppStore((state) => state.setCartId);
  const setCartItems = useAppStore((state) => state.setCartItems);
  const updateQuantity = useAppStore((state) => state.updateQuantity);
  const removeItem = useAppStore((state) => state.removeItem);
  const setCartHandlers = useAppStore((state) => state.setCartHandlers);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

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

  async function handleAddToCart(productId: string, variantId: string) {
    const { data: existingItem, error } = await supabase
      .from("cart_items")
      .select()
      .eq("cart_id", cartId)
      .eq("product_id", productId)
      .eq("variant_id", variantId);
    //   .single();

    if (error && error.code !== "PGRST116") {
      console.error(error);
      return;
    }

    if (existingItem && existingItem.length > 0) {
      handleUpdateQuantity(existingItem[0].id, existingItem[0].quantity + 1);
      toast("Product has been added to cart", {
        action: { label: "Go to Cart", onClick: () => navigate("/cart") },
      });
    } else {
      const { error } = await supabase
        .from("cart_items")
        .insert({
          cart_id: cartId,
          product_id: productId,
          quantity: 1,
          variant_id: variantId,
        })
        .select()
        .single();

      if (error) {
        console.error(error);
        return;
      }
      if (!customerId) return;
      await getCart({ customerId, setCartId, setCartItems });
      toast("Product has been added to cart", {
        action: { label: "Go to Cart", onClick: () => navigate("/cart") },
      });
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
    queryClient.invalidateQueries({ queryKey: ["cartTotals", customerId] });
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
    queryClient.invalidateQueries({ queryKey: ["cartTotals", customerId] });
  }

  return { handleAddToCart, handleUpdateQuantity, handleRemoveItem };
}
