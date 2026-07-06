// -< /checkout
//warning banner with that says its a fake payment
//Fake card form

import { useState } from "react";
import { useNavigate } from "react-router";
import { useAppStore } from "@/shared/store/appStore";
// import { useCartTotals } from "@/feature/cart/hooks/useCartTotals";
import { checkout } from "@/feature/checkout/api/checkoutApi";
import { formatPrice } from "@/shared/lib/formatPrice";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Separator } from "@/shared/components/ui/separator";
import { calculateCartTotal } from "@/shared/lib/calculateCartTotal";
import { useTranslation } from "react-i18next";

type CheckoutErrorKey =
  | "checkout.errorEmptyFields"
  | "checkout.errorEmptyCart"
  | "checkout.errorOrderFailed";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const cartId = useAppStore((state) => state.cartId);
  const customerId = useAppStore((state) => state.customerId);
  const cartItems = useAppStore((state) => state.cartItems);
  const setCartItems = useAppStore((state) => state.setCartItems);
  const setCartId = useAppStore((state) => state.setCartId);
  const total = calculateCartTotal(cartItems);
  const language = useAppStore((state) => state.language);
  const { t } = useTranslation();
  // const { data: totals } = useCartTotals();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<CheckoutErrorKey | null>(null);

  //fake card info only stored in state
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    //check for there beying any entry, no actual requirements for them
    if (!cardNumber || !cardName || !expiry || !cvv) {
      setError("checkout.errorEmptyFields");
      return;
    }
    //just in case, shouldn't be seeing any checkout page if you are not logged in
    if (!cartId || !customerId || cartItems.length === 0 || !total) {
      setError("checkout.errorEmptyCart");
      return;
    }

    setLoading(true);

    const orderId = await checkout({
      cartId,
      customerId,
      cartItems,
      totalAmount: total,
      language: language,
    });

    if (!orderId) {
      setError("checkout.errorOrderFailed");
      setLoading(false);
      return;
    }

    // Clear cart from local state — the cart in Supabase is now checked_out
    setCartItems([]);
    setCartId(null);

    navigate(`/order-confirmation/${orderId}`);
  }

  return (
    <div className="max-w-lg mx-auto mt-8 px-4 flex flex-col gap-6">
      <div className="bg-amber-100 border border-amber-400 text-amber-900 rounded-md p-4 text-sm">
        <p className="font-semibold mb-1">{t("checkout.fakePaymentTitle")}</p>
        <p>{t("checkout.fakePaymentBody")}</p>
      </div>

      {/* Order summary */}
      <Card>
        <CardHeader>
          <CardTitle>{t("checkout.orderSummary")}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {cartItems.map((item) => {
            const unitPrice = item.variant?.price ?? item.product.price;
            return (
              <div key={item.id} className="flex justify-between text-sm">
                <span>
                  {item.product.name[language]}
                  {item.variant ? ` — ${item.variant.name[language]}` : ""} x
                  {item.quantity}
                </span>
                <span>{formatPrice(unitPrice * item.quantity, language)}</span>
              </div>
            );
          })}
          <Separator className="my-2" />
          <div className="flex justify-between font-semibold">
            <span>{t("common.total")}</span>
            <span>{total ? formatPrice(total, language) : "—"}</span>
          </div>
        </CardContent>
      </Card>

      {/* Fake card form */}
      <Card className="mb-3">
        <CardHeader>
          <CardTitle>{t("checkout.paymentDetails")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <Label htmlFor="cardName">{t("checkout.nameOnCard")}</Label>
              <Input
                id="cardName"
                placeholder="Jabberwocky"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label htmlFor="cardNumber">{t("checkout.cardNumber")}</Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
              />
            </div>

            <div className="flex gap-4">
              <div className="flex flex-col gap-1 flex-1">
                <Label htmlFor="expiry">{t("checkout.expiry")}</Label>
                <Input
                  id="expiry"
                  placeholder={t("checkout.expiryPlaceholder")}
                  maxLength={5}
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1 w-24">
                <Label htmlFor="cvv">{t("checkout.cvv")}</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  maxLength={3}
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                />
              </div>
            </div>

            {error && <p className="text-red-600 text-sm">{t(error)}</p>}

            <Button type="submit" disabled={loading} className="w-full mt-2">
              {loading
                ? t("checkout.placingOrder")
                : t("checkout.pay", {
                    amount: ` ${total ? formatPrice(total, language) : ""}`,
                  })}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
