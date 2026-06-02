import { Button } from "@/shared/components/ui/button";
import { useAppStore } from "@/shared/store/appStore";

type props = {
  btnLabel?: string;
  productId: string;
};

const AddToCart = ({ btnLabel = "Add", productId }: props) => {
  const handleAddToCart = useAppStore((state) => state.handleAddToCart);
  return (
    <Button onClick={() => handleAddToCart?.(productId)}>{btnLabel}</Button>
  );
};

export default AddToCart;
