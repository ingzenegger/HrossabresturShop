import { createClient } from "@/shared/lib/client";
import { ProductSchema } from "@/shared/types/product";

export async function getProducts() {
  const supabase = createClient();
  const { data } = await supabase
    .from("products")
    .select(
      "id, slug, price, currency, stock_quantity, is_active, created_at, updated_at, " +
        "name:name_i18n, description:description_i18n, " +
        "product_assets(*), product_variants(*), product_attributes(*)",
    );

  const parsed = ProductSchema.array().safeParse(data ?? []);
  if (!parsed.success) {
    console.error("Validation error", parsed.error);
    return;
  }
  return parsed.data;
}
