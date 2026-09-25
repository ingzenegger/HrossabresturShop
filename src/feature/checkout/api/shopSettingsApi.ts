// read shop-wide settings (currently just the flat shipping price)

import { createClient } from "@/shared/lib/client";
import { z } from "zod";

const ShippingPriceSchema = z.object({
  shipping_price: z.number().int().nonnegative(),
});

export async function getShippingPrice(): Promise<number> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("shop_settings")
    .select("shipping_price")
    .eq("id", 1)
    .single();

  if (error) throw error;

  return ShippingPriceSchema.parse(data).shipping_price;
}
