import { createClient } from "@/shared/lib/client";
import type { NewAttribute } from "@/shared/types/product";

export async function addAttribute(attribute: NewAttribute) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("product_attributes")
    .insert({
      product_id: attribute.product_id,
      key: attribute.key,
      value: attribute.value,
    })
    .select()
    .single();

  if (error) {
    console.error("Insert error", error);
    throw error;
  }

  return data;
}
