import type { Product } from "@/types";
import type { User } from "@supabase/supabase-js";
import { create } from "zustand";

//Zustand store for products with their assets and variants
//itemsInCart
//functions addToCart, updateQuantity, removeItem,
//current user and login-state?

interface AppStore {
  products: Product[];
  setProducts: (products: Product[]) => void;
  user: User | null;
  setUser: (user: User | null) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  products: [],

  setProducts: (newProducts: Product[]) => set({ products: newProducts }),

  user: null,

  setUser: (currentUser: User | null) => set({ user: currentUser }),
}));
