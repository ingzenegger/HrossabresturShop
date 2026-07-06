import { formatPrice } from "@/shared/lib/formatPrice";
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
import { calculateCartTotal } from "@/shared/lib/calculateCartTotal";
import { useTranslation } from "react-i18next";

export default function CartSummary() {
  const cartItems = useAppStore((state) => state.cartItems);
  const navigate = useNavigate();
  const total = calculateCartTotal(cartItems);
  const language = useAppStore((state) => state.language);
  const isEmpty = cartItems.length === 0;
  const { t } = useTranslation();

  return (
    <Card className="self-start">
      <CardHeader>
        <CardTitle>{t("cart.summaryTitle")}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{t("cart.itemCount", { count: cartItems.length })}</span>
          <span>{formatPrice(total, language)}</span>
        </div>
        <Separator />
        <div className="flex justify-between font-semibold">
          <span>{t("common.total")}: </span>
          <span>{formatPrice(total, language)}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full cursor-pointer"
          disabled={isEmpty}
          onClick={() => navigate("/checkout")}
        >
          {t("cart.proceedToCheckout")}
        </Button>
      </CardFooter>
    </Card>
  );
}
