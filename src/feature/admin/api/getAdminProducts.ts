import { createClient } from "@/shared/lib/client";
import { ProductSchema } from "@/shared/types/product";

export async function getAdminProducts() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select(
      "id, slug, price, currency, stock_quantity, is_active, created_at, updated_at, product_type, name, description, " +
        "product_assets(*), product_variants(id, product_id, name, price, stock_quantity, created_at), product_attributes(id, product_id, key, created_at, value)",
    );

  if (error) {
    console.error("Fetch error", error);
    throw error;
  }

  const parsed = ProductSchema.array().safeParse(data ?? []);
  if (!parsed.success) {
    console.error("Validation error", parsed.error);
    return;
  }
  return parsed.data;
}
