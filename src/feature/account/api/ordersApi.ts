import { createClient } from "@/shared/lib/client";

//TODO: these should probably be zod schemas?
type Order = {
  id: string;
  status: string;
  total_cents: number;
  submitted_at: string;
  order_items: OrderItem[];
};

type OrderItem = {
  id: string;
  product_name: string;
  variant_name: string | null;
  quantity: number;
  line_total_cents: number;
};

export async function getOrders(customerId: string): Promise<Order[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("orders")
    .select("id, status, total_cents, submitted_at, order_items(*)")
    .eq("customer_id", customerId)
    .order("submitted_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch orders:", error);
    return [];
  }

  return data ?? [];
}
