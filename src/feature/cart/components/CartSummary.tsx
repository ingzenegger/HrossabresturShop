import { formatPrice } from "@/shared/lib/formatPrice";
import { useCartTotals } from "../hooks/useCartTotals";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { useAppStore } from "@/shared/store/appStore";
import { useNavigate } from "react-router";

export default function CartSummary() {
  const { data, isLoading, error } = useCartTotals();
  const cartItems = useAppStore((state) => state.cartItems);
  const navigate = useNavigate();

  if (isLoading) return <p>Loading totals...</p>;
  if (error) return <p>Could not load totals.</p>;
  if (!data) return null;

  const isEmpty = cartItems.length === 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          {/*TODO: update this part to look less amateur */}
          <p>Total: {formatPrice(data.total_cents)}</p>
          <p>Status: {data.status}</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          disabled={isEmpty}
          onClick={() => navigate("/checkout")}
        >
          Proceed to Checkout
        </Button>
      </CardFooter>
    </Card>
  );
}
