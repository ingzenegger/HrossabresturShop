import Cart from "./components/Cart";
import CartSummary from "./components/CartSummary";

export function CartPage() {
  return (
    <div className="flex flex-col md:flex-row gap-6 m-3">
      <Cart />
      <CartSummary />
    </div>
  );
}
