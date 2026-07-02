import { createClient } from "@/shared/lib/client";
import { OrderSchema, type Order } from "@/shared/types/order";

export async function getOrders(customerId: string): Promise<Order[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("orders")
    .select("id, status, total, submitted_at, order_items(*)")
    .eq("customer_id", customerId)
    .order("submitted_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch orders:", error);
    return [];
  }

  return (data ?? []).flatMap((item) => {
    const parsed = OrderSchema.safeParse(item);
    if (!parsed.success) {
      console.error("Validation error", parsed.error);
      return [];
    }
    return [parsed.data];
  });
}
