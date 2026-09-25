// schema and inferred types for orders and order_items
import { z } from "zod";

export const PaymentMethodSchema = z.enum(["bank_transfer", "pay_on_pickup"]);
export const DeliveryMethodSchema = z.enum(["pickup", "post"]);

// only used when deliveryMethod is "post"; mirrors the orders table constraints
export const ShippingAddressSchema = z.object({
  name: z.string().trim().min(1),
  street: z.string().trim().min(1),
  postcode: z.string().regex(/^[0-9]{3}$/),
  city: z.string().trim().min(1),
});

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

// the confirmation page also needs how the order is paid and delivered;
// order history doesn't select these columns, so they get their own schema
export const OrderConfirmationSchema = OrderSchema.extend({
  payment_method: PaymentMethodSchema,
  delivery_method: DeliveryMethodSchema,
  shipping_cost: z.number().int().nonnegative(),
  shipping_name: z.string().nullable(),
  shipping_street: z.string().nullable(),
  shipping_postcode: z.string().nullable(),
  shipping_city: z.string().nullable(),
});

export type OrderItem = z.infer<typeof OrderItemSchema>;
export type Order = z.infer<typeof OrderSchema>;
export type PaymentMethod = z.infer<typeof PaymentMethodSchema>;
export type DeliveryMethod = z.infer<typeof DeliveryMethodSchema>;
export type ShippingAddress = z.infer<typeof ShippingAddressSchema>;
export type OrderConfirmation = z.infer<typeof OrderConfirmationSchema>;
