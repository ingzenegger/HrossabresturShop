import { useTranslation } from "react-i18next";
import Cart from "./components/Cart";
import CartSummary from "./components/CartSummary";

export function CartPage() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col md:flex-row gap-6 m-3">
      <title>{`${t("nav.cart")} – Hrossabrestur`}</title>
      <Cart />
      <CartSummary />
    </div>
  );
}
