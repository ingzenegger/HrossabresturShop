import { formatPrice } from "@/shared/lib/formatPrice";
import { useCartTotals } from "../hooks/useCartTotals";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

export default function CartSummary() {
  const { data, isLoading, error } = useCartTotals();

  if (isLoading) return <p>Loading totals...</p>;
  if (error) return <p>Could not load totals.</p>;
  if (!data) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          <p>Total: {formatPrice(data.total_cents)}</p>
          <p>Status: {data.status}</p>
        </div>
      </CardContent>
    </Card>
  );
}
