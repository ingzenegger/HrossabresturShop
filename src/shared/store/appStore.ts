import type { User } from "@supabase/supabase-js";
import { create } from "zustand";
import type { CartItem } from "../types/cart";
import type { Language } from "../types/language";

interface AppStore {
  //state of user/customer
  user: User | null;
  setUser: (user: User | null) => void;
  customerId: string | null;
  setCustomerId: (id: string | null) => void;
  customerName: string | null;
  setCustomerName: (name: string | null) => void;
  //state of cart
  cartId: string | null;
  setCartId: (id: string | null) => void;
  cartItems: CartItem[];
  setCartItems: (items: CartItem[]) => void;
  addToCart: (item: CartItem) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  handleAddToCart:
    | ((productId: string, variantId: string) => Promise<void>)
    | null;
  handleUpdateQuantity:
    | ((itemId: string, quantity: number) => Promise<void>)
    | null;
  handleRemoveItem: ((itemId: string) => Promise<void>) | null;
  setCartHandlers: (
    add: (productId: string, variantId: string) => Promise<void>,
    update: (itemId: string, quantity: number) => Promise<void>,
    remove: (itemId: string) => Promise<void>,
  ) => void;
  //i18n
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  user: null,
  setUser: (currentUser: User | null) => set({ user: currentUser }),

  customerId: null,
  setCustomerId: (id: string | null) => set({ customerId: id }),

  customerName: null,
  setCustomerName: (name: string | null) => set({ customerName: name }),

  cartId: null,
  setCartId: (id: string | null) => set({ cartId: id }),

  cartItems: [],
  setCartItems: (newItems: CartItem[]) => set({ cartItems: newItems }),
  addToCart: (item) =>
    set((state) => ({
      cartItems: [...state.cartItems, item],
    })),

  updateQuantity: (itemId, quantity) =>
    set((state) => ({
      cartItems: state.cartItems.map((i) =>
        i.id === itemId ? { ...i, quantity } : i,
      ),
    })),
  removeItem: (itemId) =>
    set((state) => ({
      cartItems: state.cartItems.filter((i) => i.id !== itemId),
    })),
  handleAddToCart: null,
  handleUpdateQuantity: null,
  handleRemoveItem: null,
  setCartHandlers: (add, update, remove) =>
    set({
      handleAddToCart: add,
      handleUpdateQuantity: update,
      handleRemoveItem: remove,
    }),

  language: "is",
  setLanguage: (lang) => set({ language: lang }),
}));
