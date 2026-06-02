import { z } from "zod";

export const cartItemSchema = z.object({
  id: z.uuid(),
  cart_id: z.uuid(),
  product_id: z.uuid(),
  quantity: z.number().int().positive(),
  created_at: z.string(), //date,
  updated_at: z.string(), //date
});

export type CartItem = z.infer<typeof cartItemSchema>;

export const cartStatusEnum = z.enum(["active", "checked_out"]);

export const cartSchema = z.object({
  id: z.uuid(),
  shop_id: z.uuid(),
  customer_id: z.uuid(),
  status: cartStatusEnum.default("active"),
  created_at: z.string(), //date,,
  updated_at: z.string(), //date,,
});

export type CartStatus = z.infer<typeof cartStatusEnum>;
export type Cart = z.infer<typeof cartSchema>;
