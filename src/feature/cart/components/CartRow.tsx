import {
  Item,
  ItemActions,
  ItemContent,
  ItemTitle,
} from "@/shared/components/ui/item";
import { formatPrice } from "@/shared/lib/formatPrice";
import { useAppStore } from "@/shared/store/appStore";
import type { CartItem } from "@/shared/types/cart";
import { Minus, Plus, Trash2 } from "lucide-react";

const CartRow = (item: CartItem) => {
  const handleRemoveItem = useAppStore((state) => state.handleRemoveItem);
  const handleUpdateQuantity = useAppStore(
    (state) => state.handleUpdateQuantity,
  );

  return (
    <Item>
      <ItemContent>
        <ItemTitle>
          {item.product.name} - {item.variant?.name}
        </ItemTitle>
      </ItemContent>
      <ItemActions>
        <div className="flex items-center gap-2 mr-4">
          <div className="w-4">
            {item.quantity > 1 && (
              <Minus
                className="cursor-pointer"
                onClick={() =>
                  handleUpdateQuantity?.(item.id, item.quantity - 1)
                }
              />
            )}
          </div>
          <span>Qty: {item.quantity} </span>
          <div className="w-4">
            {item.quantity < 3 && (
              <Plus
                className="cursor-pointer"
                onClick={() =>
                  handleUpdateQuantity?.(item.id, item.quantity + 1)
                }
              />
            )}
          </div>
        </div>
      </ItemActions>
      <div className="w-24 text-right">
        {formatPrice(item.product.price_cents * item.quantity)}
      </div>
      <ItemActions>
        <Trash2
          className="size-4 cursor-pointer"
          onClick={() => handleRemoveItem?.(item.id)}
        />
      </ItemActions>
    </Item>
  );
};

export default CartRow;
