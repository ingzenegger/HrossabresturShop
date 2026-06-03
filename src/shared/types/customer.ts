import { z } from 'zod';

export const shopCustomerSchema = z.object({
  id: z.uuid(),
  shop_id: z.uuid(),
  name: z.string(),
  email: z.email(),
//   pin_code: z.string().nullable().default(null),
  created_at: z.string(), //date().default(() => new Date()),
});


export type ShopCustomer = z.infer<typeof shopCustomerSchema>;