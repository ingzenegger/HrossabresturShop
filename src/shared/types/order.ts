// schema and inferred types for orders and order_items
import { z } from "zod";

export const PaymentMethodSchema = z.enum(["bank_transfer", "pay_on_pickup"]);
export const DeliveryMethodSchema = z.enum(["pickup", "post"]);

export const OrderItemSchema = z.object({
  id: z.uuid(),
  product_name: z.string(),
  variant_name: z.string().nullable(),
  quantity: z.number().int().positive(),
  line_total: z.number().int().nonnegative(),
  });

export const OrderSchema = z.object({
  id: z.uuid(),
  status: z.enum(["cancelled", "fulfilled", "pending", "submitted"]),
  total: z.number().int().nonnegative(),
  submitted_at: z.string(),
  order_items: z.array(OrderItemSchema).default([]),
});

export type OrderItem = z.infer<typeof OrderItemSchema>;
export type Order = z.infer<typeof OrderSchema>;
export type PaymentMethod = z.infer<typeof PaymentMethodSchema>;
export type DeliveryMethod = z.infer<typeof DeliveryMethodSchema>;
