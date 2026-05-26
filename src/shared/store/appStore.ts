import type { Product } from '@/types'
import { create } from 'zustand'

//Zustand store for products with their assets and variants 
//itemsInCart
//functions addToCart, updateQuantity, removeItem,
//current user and login-state?

interface AppStore {
    products: Product[];
    setProducts: (products: Product[]) => void;
     
}

export const useAppStore = create<AppStore>((set) => ({
products: [],

setProducts: (newProducts: Product[]) => set({products: newProducts})
}))