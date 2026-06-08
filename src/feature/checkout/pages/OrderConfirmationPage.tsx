//order placed!
//  -> /order-confirmation/:orderId
//TODO: add a zod schema for the order_items type check!


import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/shared/lib/client";
import { formatPrice } from "@/shared/lib/formatPrice";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";

async function getOrder(orderId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", orderId)
    .single();

  if (error) {
    console.error("Failed to fetch order:", error);
    return null;
  }

  return data;
}

export default function OrderConfirmationPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const { data: order, isLoading } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => getOrder(orderId!),
    enabled: !!orderId,
  });

  if (isLoading)
    return <p className="mt-8 text-center">Loading your order...</p>;
  if (!order) return <p className="mt-8 text-center">Order not found.</p>;

  return (
    <div className="max-w-lg mx-auto mt-8 px-4 flex flex-col gap-6">
      {/* Success banner */}
      <div className="bg-green-100 border border-green-400 text-green-900 rounded-md p-4 text-sm">
        <p className="font-semibold mb-1">✓ Order placed successfully</p>
        <p>
          Thank you for your fake purchase! Your order is being
          pretend-processed and we will take our sweet time.
        </p>
      </div>

      {/* Order details */}
      <Card>
        <CardHeader>
          <CardTitle>Order Details</CardTitle>
          <p className="text-xs text-muted-foreground break-all">#{order.id}</p>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {order.order_items.map(
            (item: {
              id: string;
              product_name: string;
              variant_name: string | null;
              quantity: number;
              line_total_cents: number;
            }) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>
                  {item.product_name}
                  {item.variant_name ? ` — ${item.variant_name}` : ""} ×{" "}
                  {item.quantity}
                </span>
                <span>{formatPrice(item.line_total_cents)}</span>
              </div>
            ),
          )}
          <Separator className="my-2" />
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>{formatPrice(order.total_cents)}</span>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => navigate("/account")}
        >
          View my orders
        </Button>
        <Button className="flex-1" onClick={() => navigate("/")}>
          Continue shopping
        </Button>
      </div>
    </div>
  );
}
