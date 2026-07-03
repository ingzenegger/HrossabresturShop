import { createClient } from "@/shared/lib/client";
import { ProductSchema } from "@/shared/types/product";

export async function getProducts() {
  const supabase = createClient();
  const { data } = await supabase
    .from("products")
    .select(
      "id, slug, price, currency, stock_quantity, is_active, created_at, updated_at, " +
        "name:name_i18n, description:description_i18n, " +
        "product_assets(*), product_variants(id, product_id, name:name_i18n, price, stock_quantity, created_at), product_attributes(id, product_id, key, created_at, value:value_i18n)",
    );

  const parsed = ProductSchema.array().safeParse(data ?? []);
  if (!parsed.success) {
    console.error("Validation error", parsed.error);
    return;
  }
  return parsed.data;
}
