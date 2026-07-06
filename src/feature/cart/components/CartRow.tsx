import Tooltip from "@/shared/components/Tooltip";
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
import { useTranslation } from "react-i18next";

const CartRow = (item: CartItem) => {
  const handleRemoveItem = useAppStore((state) => state.handleRemoveItem);
  const handleUpdateQuantity = useAppStore(
    (state) => state.handleUpdateQuantity,
  );
  const language = useAppStore((state) => state.language);
  const { t } = useTranslation();

  return (
    <Item>
      <ItemContent>
        <ItemTitle>
          {item.product.name[language]} - {item.variant?.name[language]}
        </ItemTitle>
      </ItemContent>
      <ItemActions>
        <div className="flex items-center gap-2 mr-4">
          <div className="w-4">
            {item.quantity > 1 && (
              <Tooltip label={t("cart.removeOne")}>
                <Minus
                  className="cursor-pointer hover:scale-105 transition-transform"
                  onClick={() =>
                    handleUpdateQuantity?.(item.id, item.quantity - 1)
                  }
                />
              </Tooltip>
            )}
          </div>
          <span>{t("cart.quantity", { count: item.quantity })}</span>
          <div className="w-4">
            {item.quantity < 3 && (
              <Tooltip label={t("cart.addOne")}>
                <Plus
                  className="cursor-pointer hover:scale-105 transition-transform"
                  onClick={() =>
                    handleUpdateQuantity?.(item.id, item.quantity + 1)
                  }
                />
              </Tooltip>
            )}
          </div>
        </div>
      </ItemActions>
      <div className="w-24 text-right">
        {formatPrice(item.product.price * item.quantity, language)}
      </div>
      <ItemActions>
        <Tooltip label={t("cart.deleteItem")}>
          <Trash2
            className="size-4 cursor-pointer hover:scale-105 transition-transform"
            onClick={() => handleRemoveItem?.(item.id)}
          />
        </Tooltip>
      </ItemActions>
    </Item>
  );
};

export default CartRow;
