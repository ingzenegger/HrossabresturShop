
import { myshopId } from "@/shared/constants";
import { createClient } from "@/shared/lib/client";
import { ProductSchema } from "@/shared/types/product";

export async function getProducts() {
    const supabase = createClient();
    const { data } = await supabase
      .from("products")
      .select(
        "*, product_assets(*), product_variants(*), product_attributes(*)",
      )
      .eq("shop_id", myshopId);

    const parsed = ProductSchema.array().safeParse(data ?? []);
    if (!parsed.success) {
      console.error("Validation error", parsed.error);
      return;
    }
    return parsed.data;
  }