import { Card, CardHeader, CardTitle } from "@/shared/components/ui/card";
import type { Product } from "@/shared/types/product";
import { useNavigate } from "react-router";

const ProductCard = (product: Product) => {
  const navigate = useNavigate();

  return (
    <Card
      onClick={() => navigate(`/product/${product.id}`)}
      className="bg-gray-200"
    >
      <img
        src={product.product_assets[0].asset_url}
        alt={product.product_assets[0].alt_text}
        className="relative z-20 aspect-video w-full object-cover brightness-60 dark:brightness-40 "
      />
      <CardHeader>
        {/*<CardAction> <AddToCart productId={product.id} /> </CardAction>  TODO: rather than an add button that bypasses variant a hover menu of variants might offer a shorter path to cart for end user*/}
        <CardTitle>{product.name}</CardTitle>
      </CardHeader>
    </Card>
  );
};

export default ProductCard;
