//hook for fetching logic and setProjects to Zustand.

import { supabase } from "../lib/supabaseClient";
import { useAppStore } from "../store/appStore";
import { useEffect } from "react";



export function useProducts() {
  const setProducts = useAppStore((state) => state.setProducts);
  const myshopId = "17d6fc42-5daf-4e25-98d9-47716cf8850b";

  useEffect(() => {
    getProducts();
  }, []);

  async function getProducts() {
    const { data, error } = await supabase
      .from("products")
      .select(
        "*, product_assets(*), product_variants(*), product_attributes(*)",
      )
      .eq("shop_id", myshopId);

    if (error) {
      console.error(error);
      return;
    }
    console.log("raw product[0]", data?.[0]);
    console.log("raw product[1]", data?.[1]);
    setProducts(data || []);
  }
}
