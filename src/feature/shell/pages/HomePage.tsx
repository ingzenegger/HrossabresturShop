import ProductCard from "@/feature/product/list/components/ProductCard";
import Loader from "@/shared/components/Loader";

import { useProducts } from "@/shared/hooks/useProducts";
import { useAppStore } from "@/shared/store/appStore";

const HomePage = () => {
  const products = useAppStore((state) => state.products);
  const isLoading = useProducts();

  if (products.length === 0 && isLoading) {
    return (
      <div className="flex items-center w-full justify-center">
        <Loader message="Loading..." />
      </div>
    );
  }

  return (
    <div>
      <h1>HomePage</h1>

      <h2>Toys</h2>
      <div className="flex gap-2 ml-3 mr-3">
        {products
          .filter((product) =>
            product.product_attributes?.some((attr) => attr.value === "toys"),
          )
          .map((product) => (
            <ProductCard {...product} key={product.id} />
          ))}
      </div>
      <h2>Decor</h2>
      <div className="flex gap-2 ml-3 mr-3">
        {products
          .filter((product) =>
            product.product_attributes?.some((attr) => attr.value === "decor"),
          )
          .map((product) => (
            <ProductCard {...product} key={product.id} />
          ))}
      </div>
    </div>
  );
};

export default HomePage;
