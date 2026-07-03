import { useQuery } from "@tanstack/react-query";
import { formatPrice } from "@/shared/lib/formatPrice";
import { useAppStore } from "@/shared/store/appStore";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import { getOrders } from "../api/ordersApi";

export default function OrderHistory() {
  const customerId = useAppStore((state) => state.customerId);
  const language = useAppStore((state) => state.language);
  const { data: orders, isLoading } = useQuery({
    queryKey: ["orders", customerId],
    queryFn: () => getOrders(customerId!),
    enabled: !!customerId,
  });

  if (isLoading)
    return <p className="text-sm text-muted-foreground">Loading orders...</p>;
  if (!orders || orders.length === 0) {
    return <p className="text-sm text-muted-foreground">No orders yet.</p>;
  }

  return (
    <div className="flex flex-col gap-4 mb-4">
      {orders.map((order) => (
        <Card key={order.id}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">
                {new Date(order.submitted_at).toLocaleDateString("is-IS", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </CardTitle>
              <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-800 capitalize">
                {order.status}
              </span>
            </div>
            <p className="text-xs text-muted-foreground break-all">
              #{order.id}
            </p>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {order.order_items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>
                  {item.product_name}
                  {item.variant_name ? ` — ${item.variant_name}` : ""} x
                  {item.quantity}
                </span>
                <span>{formatPrice(item.line_total, language)}</span>
              </div>
            ))}
            <Separator className="my-1" />
            <div className="flex justify-between font-semibold text-sm">
              <span>Total</span>
              <span>{formatPrice(order.total, language)}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
