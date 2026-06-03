import { z } from "zod";

export const CartItemSchema = z.object({
  id: z.uuid(),
  cart_id: z.uuid(),
  product_id: z.uuid(),
  quantity: z.number().int().positive(),
  created_at: z.string(), //date,
  updated_at: z.string(), //date
});

export const CartStatusEnum = z.enum(["active", "checked_out"]);

export const CartSchema = z.object({
  id: z.uuid(),
  shop_id: z.uuid(),
  customer_id: z.uuid(),
  status: CartStatusEnum.default("active"),
  created_at: z.string(), //date,,
  updated_at: z.string(), //date,,
  cart_items: z.array(CartItemSchema).default([]),
});

export type CartItem = z.infer<typeof CartItemSchema>;
export type CartStatus = z.infer<typeof CartStatusEnum>;
export type Cart = z.infer<typeof CartSchema>;
