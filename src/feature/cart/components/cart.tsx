import { useAppStore } from "@/shared/store/appStore";

export default function Cart() {
  const cartItems = useAppStore((state) => state.cartItems);

  return (
    <>
      {cartItems.length > 0 ? (
        <div>
          {cartItems.map((item, i) => (
            <li key={item.id}>
              product {i + 1}: {item.product_id}
              product name: {item.product.name} - {item.variant?.name}
              quantity: {item.quantity} variant: {item.variant_id}
            </li>
          ))}
        </div>
      ) : (
        <div>no items in cart</div>
      )}
    </>
  );
}
