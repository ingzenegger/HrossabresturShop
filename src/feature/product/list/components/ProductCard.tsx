import {
  Card,
  CardAction,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import AddToCart from "./AddToCart";
import type { Product } from "@/types";

const ProductCard = (product: Product) => {
  return (
    <Card>
      <div className="absolute inset-0 z-30 aspect-video max-h-100px" />
      <img
        src={product.product_assets[0].asset_url}
        alt={product.product_assets[0].alt_text}
        className="relative z-20 aspect-video w-full object-cover brightness-60 dark:brightness-40"
      />
      <CardHeader>
        <CardAction>
          <AddToCart />
        </CardAction>
        <CardTitle>{product.name}</CardTitle>
      </CardHeader>
    </Card>
  );
};

export default ProductCard;
