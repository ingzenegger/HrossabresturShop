import { createClient } from "@/shared/lib/client";
import type { NewAsset } from "@/shared/types/product";

export async function addAsset(asset: NewAsset) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("product_assets")
    .insert({
      product_id: asset.product_id,
      variant_id: asset.variant_id,
      asset_url: asset.asset_url,
      asset_type: asset.asset_type,
      alt_text: asset.alt_text,
      sort_order: asset.sort_order,
    })
    .select()
    .single();

  if (error) {
    console.error("Insert error", error);
    throw error;
  }
  return data;
}
