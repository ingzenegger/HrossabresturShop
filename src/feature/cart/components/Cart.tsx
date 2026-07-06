import { useAppStore } from "@/shared/store/appStore";
import CartRow from "./CartRow";
import { ItemGroup } from "@/shared/components/ui/item";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { useTranslation } from "react-i18next";

export default function Cart() {
  const cartItems = useAppStore((state) => state.cartItems);
  const { t } = useTranslation();

  return (
    <>
      <Card className="flex w-fit md:max-w-2/3">
        <CardHeader>
          <CardTitle>{t("cart.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          {cartItems.length > 0 ? (
            <ItemGroup className="gap-1">
              {cartItems.map((item) => (
                <CartRow {...item} key={item.id} />
              ))}
            </ItemGroup>
          ) : (
            <div>{t("cart.empty")}</div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
