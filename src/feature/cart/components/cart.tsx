import { useAppStore } from "@/shared/store/appStore";

export default function Cart() {
  const cartItems = useAppStore((state) => state.cartItems);

  return (
    <>
      {cartItems.length > 0 ? (
        <div>
          {cartItems.map((item, i) => (
            <li key={item.id}>
              product {i + 1}: {item.product_id} quantity: {item.quantity}
            </li>
          ))}
        </div>
      ) : (
        <div>no items in cart</div>
      )}
    </>
  );
}
