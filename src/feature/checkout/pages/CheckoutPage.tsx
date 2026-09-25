import { useState } from "react";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { useAppStore } from "@/shared/store/appStore";
import { checkout } from "@/feature/checkout/api/checkoutApi";
import { getShippingPrice } from "@/feature/checkout/api/shopSettingsApi";
import { formatPrice } from "@/shared/lib/formatPrice";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import { Label } from "@/shared/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";
import { calculateCartTotal } from "@/shared/lib/calculateCartTotal";
import { useTranslation } from "react-i18next";
import {
  ShippingAddressSchema,
  type DeliveryMethod,
  type PaymentMethod,
  type ShippingAddress,
} from "@/shared/types/order";
import ShippingAddressFields, {
  type AddressField,
} from "@/feature/checkout/components/ShippingAddressFields";

type CheckoutErrorKey =
  | "checkout.errorEmptyCart"
  | "checkout.errorOrderFailed"
  | "checkout.errorAddress";

const EMPTY_ADDRESS: ShippingAddress = {
  name: "",
  street: "",
  postcode: "",
  city: "",
};

const DELIVERY_OPTIONS = [
  {
    value: "pickup",
    label: "checkout.delivery.pickup",
    hint: "checkout.delivery.pickupHint",
  },
  {
    value: "post",
    label: "checkout.delivery.post",
    hint: "checkout.delivery.postHint",
  },
] as const;

const PAYMENT_OPTIONS = [
  {
    value: "bank_transfer",
    label: "checkout.payment.bankTransfer",
    hint: "checkout.payment.bankTransferHint",
  },
  {
    value: "pay_on_pickup",
    label: "checkout.payment.payOnPickup",
    hint: "checkout.payment.payOnPickupHint",
  },
] as const;

export default function CheckoutPage() {
  const navigate = useNavigate();
  const cartId = useAppStore((state) => state.cartId);
  const customerId = useAppStore((state) => state.customerId);
  const cartItems = useAppStore((state) => state.cartItems);
  const setCartItems = useAppStore((state) => state.setCartItems);
  const setCartId = useAppStore((state) => state.setCartId);
  const subtotal = calculateCartTotal(cartItems);
  const language = useAppStore((state) => state.language);
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<CheckoutErrorKey | null>(null);

  const [deliveryMethod, setDeliveryMethod] =
    useState<DeliveryMethod>("pickup");
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("bank_transfer");
  const { data: shippingPrice } = useQuery({
    queryKey: ["shippingPrice"],
    queryFn: getShippingPrice,
  });
  // undefined while the price is still loading
  const shippingCost = deliveryMethod === "post" ? shippingPrice : 0;
  const total =
    shippingCost === undefined ? undefined : subtotal + shippingCost;

  const [address, setAddress] = useState<ShippingAddress>(EMPTY_ADDRESS);
  const [invalidFields, setInvalidFields] = useState<AddressField[]>([]);

  function handleAddressChange(field: AddressField, value: string) {
    setAddress({ ...address, [field]: value });
    // the customer is fixing this field, so stop marking it as invalid
    setInvalidFields(invalidFields.filter((f) => f !== field));
  }

  function handleDeliveryChange(method: DeliveryMethod) {
    setDeliveryMethod(method);
    // paying on pickup is impossible if the item is posted
    if (method === "post" && paymentMethod === "pay_on_pickup") {
      setPaymentMethod("bank_transfer");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    //just in case, shouldn't be seeing any checkout page if you are not logged in
    if (!cartId || !customerId || cartItems.length === 0 || !subtotal) {
      setError("checkout.errorEmptyCart");
      return;
    }

    // only posted orders need an address
    let shippingAddress: ShippingAddress | null = null;
    if (deliveryMethod === "post") {
      const result = ShippingAddressSchema.safeParse(address);
      if (!result.success) {
        setInvalidFields(
          result.error.issues.map((issue) => issue.path[0] as AddressField),
        );
        setError("checkout.errorAddress");
        return;
      }
      shippingAddress = result.data;
    }

    setLoading(true);

    const orderId = await checkout({
      cartId,
      language: language,
      paymentMethod,
      deliveryMethod,
      shippingAddress,
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
                    <div className="flex justify-between text-sm">
            <span>{t("common.subtotal")}</span>
            <span>{formatPrice(subtotal, language)}</span>
          </div>
          {deliveryMethod === "post" && (
            <div className="flex justify-between text-sm">
              <span>{t("common.shipping")}</span>
              <span>
                {shippingPrice !== undefined
                  ? formatPrice(shippingPrice, language)
                  : "—"}
              </span>
            </div>
          )}
          <div className="flex justify-between font-semibold">
            <span>{t("common.total")}</span>
            <span>{total ? formatPrice(total, language) : "—"}</span>
          </div>
        </CardContent>
      </Card>

      {/* Delivery and payment choices */}
      <Card className="mb-3">
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h3 id="delivery-heading" className="font-semibold">
                {t("checkout.delivery.title")}
              </h3>
              <RadioGroup
                aria-labelledby="delivery-heading"
                value={deliveryMethod}
                onValueChange={(value) =>
                  handleDeliveryChange(value as DeliveryMethod)
                }
              >
                {DELIVERY_OPTIONS.map((option) => (
                  <Label
                    key={option.value}
                    htmlFor={`delivery-${option.value}`}
                    className="items-start gap-3 rounded-md border p-3 cursor-pointer has-data-[state=checked]:border-primary"
                  >
                    <RadioGroupItem
                      value={option.value}
                      id={`delivery-${option.value}`}
                    />
                    <span className="flex flex-col gap-1">
                      <span>{t(option.label)}</span>
                      <span className="text-sm font-normal text-muted-foreground">
                        {t(option.hint, {
                          price:
                            shippingPrice !== undefined
                              ? formatPrice(shippingPrice, language)
                              : "…",
                        })}
                      </span>
                    </span>
                  </Label>
                ))}
              </RadioGroup>
              {deliveryMethod === "post" && (
                <ShippingAddressFields
                  value={address}
                  onChange={handleAddressChange}
                  invalidFields={invalidFields}
                />
              )}
            </div>

            <div className="flex flex-col gap-2">
              <h3 id="payment-heading" className="font-semibold">
                {t("checkout.paymentDetails")}
              </h3>
              <RadioGroup
                aria-labelledby="payment-heading"
                value={paymentMethod}
                onValueChange={(value) =>
                  setPaymentMethod(value as PaymentMethod)
                }
              >
                {PAYMENT_OPTIONS.map((option) => (
                  <Label
                    key={option.value}
                    htmlFor={`payment-${option.value}`}
                    className="items-start gap-3 rounded-md border p-3 cursor-pointer has-data-[state=checked]:border-primary has-data-disabled:opacity-50 has-data-disabled:cursor-not-allowed"
                  >
                    <RadioGroupItem
                      value={option.value}
                      id={`payment-${option.value}`}
                      disabled={
                        option.value === "pay_on_pickup" &&
                        deliveryMethod === "post"
                      }
                    />
                    <span className="flex flex-col gap-1">
                      <span>{t(option.label)}</span>
                      <span className="text-sm font-normal text-muted-foreground">
                        {t(option.hint)}
                      </span>
                    </span>
                  </Label>
                ))}
              </RadioGroup>
            </div>

            {error && <p className="text-red-600 text-sm">{t(error)}</p>}

            <Button type="submit" disabled={loading} className="w-full">
              {loading
                ? t("checkout.placingOrder")
                : t("checkout.placeOrder", {
                    amount: total ? formatPrice(total, language) : "",
                  })}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
