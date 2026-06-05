import { useAppStore } from "@/shared/store/appStore";
import CartRow from "./CartRow";
import { ItemGroup } from "@/shared/components/ui/item";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

export default function Cart() {
  const cartItems = useAppStore((state) => state.cartItems);

  return (
    <>
      <Card className="flex max-w-2/3">
        <CardHeader>
          <CardTitle>Cart</CardTitle>
        </CardHeader>
        <CardContent>
          {cartItems.length > 0 ? (
            <ItemGroup className="gap-1">
              {cartItems.map((item) => (
                <CartRow {...item} key={item.id} />
              ))}
            </ItemGroup>
          ) : (
            <div>no items in cart</div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
