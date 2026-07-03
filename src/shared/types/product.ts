import * as z from "zod";
import { TranslatedTextSchema } from "./language";

export const AssetSchema = z.object({
  id: z.uuid(),
  product_id: z.uuid(),
  asset_url: z.url(),
  asset_type: z.literal("image"), //if other asset types added later just list them in []
  alt_text: z.string(),
  sort_order: z.number(),
  created_at: z.string(), // could be set as z.coerce.date() if I ever wanna use it,
  variant_id: z.uuid().nullable(),
});

export const VariantSchema = z.object({
  id: z.uuid(),
  product_id: z.uuid(),
  name: z.string(),
  price: z.number().int().nonnegative(),
  stock_quantity: z.number(),
  created_at: z.string(), //date
});

export const AttributeSchema = z.object({
  id: z.uuid(),
  product_id: z.uuid(),
  key: z.string(),
  value: TranslatedTextSchema,
  created_at: z.string(), //date
});

export const ProductSchema = z.object({
  id: z.uuid(),
  name: TranslatedTextSchema,
  slug: z.string(),
  description: TranslatedTextSchema,
  price: z.number().int().nonnegative(),
  currency: z.string(),
  stock_quantity: z.number(),
  is_active: z.boolean(),
  created_at: z.string(), //date
  updated_at: z.string(), //date
  product_assets: z.array(AssetSchema),
  product_variants: z.array(VariantSchema).default([]),
  product_attributes: z.array(AttributeSchema).default([]),
});

export type Product = z.infer<typeof ProductSchema>;

export type ProductAsset = z.infer<typeof AssetSchema>;

export type ProductVariant = z.infer<typeof VariantSchema>;

export type ProductAttribute = z.infer<typeof AttributeSchema>;
