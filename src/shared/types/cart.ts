import { z } from "zod";
import { TranslatedTextSchema } from "./language";


export const CartItemSchema = z.object({
  id: z.uuid(),
  cart_id: z.uuid(),
  product_id: z.uuid(),
  quantity: z.number().int().positive(),
  created_at: z.string(), //date,
  updated_at: z.string(), //date
  variant_id: z.uuid().nullable(),
  product: z.object({
    id: z.uuid(),
    name: TranslatedTextSchema,
    price: z.number().int().nonnegative(),
    currency: z.string(),
    stock_quantity: z.number(),
    is_active: z.boolean(),
  }),
  variant: z
    .object({
      name: TranslatedTextSchema,
      price: z.number().int().nonnegative(),
      stock_quantity: z.number(),
    })
    .nullable(),
});

export const CartStatusEnum = z.enum(["active", "checked_out"]);

export const CartSchema = z.object({
  id: z.uuid(),
  // customer_id: z.uuid(), //auth uid?
  status: CartStatusEnum.default("active"),
  created_at: z.string(), //date,,
  updated_at: z.string(), //date,,
  cart_items: z.array(CartItemSchema).default([]),
});

export type CartItem = z.infer<typeof CartItemSchema>;
export type CartStatus = z.infer<typeof CartStatusEnum>;
export type Cart = z.infer<typeof CartSchema>;
