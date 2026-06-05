import Cart from "./components/cart";
import CartSummary from "./components/CartSummary";

export function CartPage() {
  return (
    <div className="flex gap-6 mt-3 ml-3">
      <Cart />
      <CartSummary />
    </div>
  );
}
