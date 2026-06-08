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
import { Separator } from "@/shared/components/ui/separator";

export default function CartSummary() {
  const { data, isLoading, error } = useCartTotals();
  const cartItems = useAppStore((state) => state.cartItems);
  const navigate = useNavigate();

  if (isLoading) return <p>Loading totals...</p>;
  if (error) return <p>Could not load totals.</p>;
  if (!data) return null;

  const isEmpty = cartItems.length === 0;

  return (
    <Card className="self-start">
      <CardHeader>
        <CardTitle>Cart Summary</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Items({cartItems.length})</span>
          <span>{formatPrice(data.total_cents)}</span>
          {/*TODO: update this part to look less amateur */}
        </div>
        <Separator />
        <div className="flex justify-between font-semibold">
          <span>Total: </span>
          <span>{formatPrice(data.total_cents)}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full cursor-pointer"
          disabled={isEmpty}
          onClick={() => navigate("/checkout")}
        >
          Proceed to Checkout
        </Button>
      </CardFooter>
    </Card>
  );
}
