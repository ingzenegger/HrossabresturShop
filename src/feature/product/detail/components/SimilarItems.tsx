import Loader from "@/shared/components/Loader";
import ProductCard from "../../list/components/ProductCard";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { useProducts } from "@/feature/product/hooks/useProducts";

type props = {
  category: string | undefined;
  currentProduct: string | undefined;
};

const SimilarItems = ({ category, currentProduct }: props) => {
  const { data: products, isLoading, error } = useProducts();

  if (!category) return;

  if (isLoading) {
    return <Loader message="loading" />;
  }
  if (error) {
    console.error(error);
    return;
  }
  if (!products) return;

  return (
    <Card className="flex gap-3 ring-0">
      <CardHeader>
        <CardTitle>You might also like</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col md:flex-row gap-3 ">
        {products
          .filter((product) =>
            product.product_attributes?.some((attr) => attr.value === category),
          )
          .filter((product) => product.id !== currentProduct)
          .map((product) => (
            <ProductCard {...product} key={product.id} compact />
          ))}
      </CardContent>
    </Card>
  );
};

export default SimilarItems;
