import {
  Card,
  CardAction,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { formatPrice } from "@/shared/lib/formatPrice";
import type { Product } from "@/shared/types/product";
import { useNavigate } from "react-router";

type Props = Product & { compact?: boolean };

const ProductCard = ({ compact, ...product }: Props) => {
  const navigate = useNavigate();

  return (
    <Card
      size={compact ? "sm" : "default"}
      onClick={() => navigate(`/product/${product.id}`)}
      className="bg-gray-200 cursor-pointer w-80 hover:scale-102 transition-transform"
    >
      <img
        src={product.product_assets[0].asset_url}
        alt={product.product_assets[0].alt_text}
        className="relative z-20 aspect-video w-full object-cover brightness-60 dark:brightness-40 "
      />
      <CardHeader>
        <CardAction> {formatPrice(product.price_cents)} </CardAction>
        <CardTitle>{product.name}</CardTitle>
      </CardHeader>
    </Card>
  );
};

export default ProductCard;
