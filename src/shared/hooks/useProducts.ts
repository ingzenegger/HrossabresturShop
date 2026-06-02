//hook for fetching logic and setProjects to Zustand.
import { createClient } from "@/shared/lib/client";
import { useAppStore } from "../store/appStore";
import { useEffect, useState } from "react";
import { ProductSchema } from "../types/product";
import { myshopId } from "../constants";

export function useProducts() {
  const supabase = createClient();
  const setProducts = useAppStore((state) => state.setProducts);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getProducts();
  }, []);

  async function getProducts() {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select(
        "*, product_assets(*), product_variants(*), product_attributes(*)",
      )
      .eq("shop_id", myshopId);

    if (error) {
      console.error(error);
      setIsLoading(false);
      return;
    }
    const parsed = ProductSchema.array().safeParse(data ?? []);
    if (!parsed.success) {
      console.error("Validation error", parsed.error);
      setIsLoading(false);
      return;
    }

    setProducts(parsed.data);
    setIsLoading(false);
  }
  return isLoading;
}
