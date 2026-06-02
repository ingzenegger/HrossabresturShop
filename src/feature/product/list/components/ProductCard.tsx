import {
  Card,
  CardAction,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import AddToCart from "./AddToCart";
import type { Product } from "@/shared/types/product";
import { useNavigate } from "react-router";

//TODO: create a smaller variant to use in SimilarItems that only shows image? or a seperate Card component?

const ProductCard = (product: Product) => {
  const navigate = useNavigate();

  return (
    <Card>
      <div />
      <img
        src={product.product_assets[0].asset_url}
        alt={product.product_assets[0].alt_text}
        className="relative z-20 aspect-video w-full object-cover brightness-60 dark:brightness-40"
      />
      <CardHeader>
        <CardAction>
          <AddToCart productId={product.id} />
        </CardAction>
        <CardTitle onClick={() => navigate(`/product/${product.id}`)}>
          {product.name}
        </CardTitle>
      </CardHeader>
    </Card>
  );
};

export default ProductCard;
