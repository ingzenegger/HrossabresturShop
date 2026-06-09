// schema and inferred types for orders and order_items
import { z } from "zod";

export const OrderItemSchema = z.object({
  id: z.uuid(),
  product_name: z.string(),
  variant_name: z.string().nullable(),
  quantity: z.number().int().positive(),
  line_total_cents: z.number().int().nonnegative(),
});

export const OrderSchema = z.object({
  id: z.uuid(),
  status: z.string(),
  total_cents: z.number().int().nonnegative(),
  submitted_at: z.string(),
  order_items: z.array(OrderItemSchema).default([]),
});

export type OrderItem = z.infer<typeof OrderItemSchema>;
export type Order = z.infer<typeof OrderSchema>;