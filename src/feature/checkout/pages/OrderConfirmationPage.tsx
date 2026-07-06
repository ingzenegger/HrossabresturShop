//order placed!
//  -> /order-confirmation/:orderId

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
import { OrderSchema, type Order } from "@/shared/types/order";
import { useAppStore } from "@/shared/store/appStore";
import { useTranslation } from "react-i18next";

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

  const parsed = OrderSchema.safeParse(data);
  if (!parsed.success) {
    console.error("Validation error", parsed.error);
    return null;
  }
  return parsed.data;
}

export default function OrderConfirmationPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const language = useAppStore((state) => state.language);
  const { t } = useTranslation();

  const { data: order, isLoading } = useQuery<Order | null>({
    queryKey: ["order", orderId],
    queryFn: () => getOrder(orderId!),
    enabled: !!orderId,
  });

  if (isLoading)
    return <p className="mt-8 text-center">{t("orderConfirmation.loading")}</p>;
  if (!order)
    return (
      <p className="mt-8 text-center">{t("orderConfirmation.notFound")}</p>
    );

  return (
    <div className="max-w-lg mx-auto mt-8 px-4 flex flex-col gap-6">
      {/* Success banner */}
      <div className="bg-green-100 border border-green-400 text-green-900 rounded-md p-4 text-sm">
        <p className="font-semibold mb-1">
          {t("orderConfirmation.successTitle")}
        </p>
        <p>{t("orderConfirmation.successBody")}</p>
      </div>

      {/* Order details */}
      <Card>
        <CardHeader>
          <CardTitle>{t("orderConfirmation.orderDetails")}</CardTitle>
          <p className="text-xs text-muted-foreground break-all">#{order.id}</p>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {order.order_items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span>
                {item.product_name}
                {item.variant_name ? ` — ${item.variant_name}` : ""} ×{" "}
                {item.quantity}
              </span>
              <span>{formatPrice(item.line_total, language)}</span>
            </div>
          ))}
          <Separator className="my-2" />
          <div className="flex justify-between font-semibold">
            <span>{t("common.total")}</span>
            <span>{formatPrice(order.total, language)}</span>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button
          variant="outline"
          className="flex-1 cursor-pointer"
          onClick={() => navigate("/account")}
        >
          {t("orderConfirmation.viewMyOrders")}
        </Button>
        <Button className="flex-1 cursor-pointer" onClick={() => navigate("/")}>
          {t("orderConfirmation.continueShopping")}
        </Button>
      </div>
    </div>
  );
}
