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

export const NewAssetSchema = z.object({
  product_id: z.uuid(),
  variant_id: z.uuid().nullable(),
  asset_url: z.url(),
  asset_type: z.literal("image"),
  alt_text: z.string(),
  sort_order: z.number().int().nonnegative(),
});

export const VariantSchema = z.object({
  id: z.uuid(),
  product_id: z.uuid(),
  name: TranslatedTextSchema,
  price: z.number().int().nonnegative(),
  stock_quantity: z.number(),
  created_at: z.string(), //date
});

export const NewVariantSchema = z.object({
  product_id: z.uuid(),
  name: TranslatedTextSchema,
  price: z.number().int().nonnegative(),
  stock_quantity: z.number(),
});

export const AttributeSchema = z.object({
  id: z.uuid(),
  product_id: z.uuid(),
  key: z.enum(["category"]),
  value: TranslatedTextSchema,
  created_at: z.string(), //date
});

export const NewAttributeSchema = z.object({
  product_id: z.uuid(),
  key: z.enum(["category"]),
  value: TranslatedTextSchema,
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
  product_type: z.enum(["handmade", "pattern"]),
  product_assets: z.array(AssetSchema),
  product_variants: z.array(VariantSchema).default([]),
  product_attributes: z.array(AttributeSchema).default([]),
});

export const NewProductSchema = z.object({
  name: TranslatedTextSchema,
  slug: z.string().min(1),
  description: TranslatedTextSchema,
  price: z.number().positive(),
  currency: z.literal("ISK"),
  product_type: z.enum(["handmade", "pattern"]),
  is_active: z.boolean(),
});

export type NewProduct = z.infer<typeof NewProductSchema>;

export type Product = z.infer<typeof ProductSchema>;

export type ProductAsset = z.infer<typeof AssetSchema>;

export type NewAsset = z.infer<typeof NewAssetSchema>;

export type ProductVariant = z.infer<typeof VariantSchema>;

export type NewVariant = z.infer<typeof NewVariantSchema>;

export type ProductAttribute = z.infer<typeof AttributeSchema>;

export type NewAttribute = z.infer<typeof NewAttributeSchema>;
