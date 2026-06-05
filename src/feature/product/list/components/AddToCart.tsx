import { Button } from "@/shared/components/ui/button";
import { useAppStore } from "@/shared/store/appStore";

type props = {
  btnLabel?: string;
  productId: string;
  variantId: string;
};

//TODO: disable if item not available in shop (stock_quantity <= 0)

const AddToCart = ({ btnLabel = "Add", productId, variantId }: props) => {
  const handleAddToCart = useAppStore((state) => state.handleAddToCart);
  return (
    <Button
      onClick={() => handleAddToCart?.(productId, variantId)}
      className="cursor-pointer"
    >
      {btnLabel}
    </Button>
  );
};

export default AddToCart;
