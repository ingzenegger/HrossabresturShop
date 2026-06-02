import { useAppStore } from "@/shared/store/appStore";
import ProductCard from "../../list/components/ProductCard";
import { Card, CardContent } from "@/shared/components/ui/card";

type props = {
  category: string | undefined;
  currentProduct: string | undefined;
};

const SimilarItems = ({ category, currentProduct }: props) => {
  const products = useAppStore((state) => state.products);

  if (!category) return;

  return (
    <Card className="flex gap-3 m-3">
      <CardContent>
        You might also like
        {products
          .filter((product) =>
            product.product_attributes?.some((attr) => attr.value === category),
          )
          .filter((product) => product.id !== currentProduct)
          .map((product) => (
            <ProductCard {...product} key={product.id} />
          ))}
      </CardContent>
    </Card>
  );
};

export default SimilarItems;
