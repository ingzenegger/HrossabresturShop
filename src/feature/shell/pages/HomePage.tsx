import ProductCard from "@/feature/product/list/components/ProductCard";
import Loader from "@/shared/components/Loader";
import { useProducts } from "@/feature/product/hooks/useProducts";
import { useState } from "react";
import SearchBar from "@/feature/product/list/components/SearchBar";

const HomePage = () => {
  const { data: products, isLoading, error } = useProducts();
  const [searchQuery, setSearchQuery] = useState("");

  if (isLoading) {
    return (
      <div className="flex items-center w-full justify-center">
        <Loader message="Loading..." />
      </div>
    );
  }

  if (error || !products) {
    console.error(error);
    return <div>Something went wrong. Please refresh or come back later.</div>;
  }

  const categories = [
    ...new Set(
      products
        ?.flatMap((product) => product.product_attributes)
        .flatMap((attribute) => attribute.value),
    ),
  ];

  return (
    <div className="pt-4 pb-4">
      <div className="flex justify-center">
        <h1>Welcome to Hrossabrestur Craft Shop</h1>
      </div>

      <SearchBar
        products={products}
        query={searchQuery}
        onQueryChange={setSearchQuery}
      />

      {!searchQuery &&
        categories.map((category) => (
          <div key={category}>
            <span className="inline-block capitalize bg-amber-200 text-amber-900 font-semibold px-3 py-1 rounded-full text-base ml-3 mb-2 mt-5 ring-1 ring-amber-300">
              {category}
            </span>
            <div className="flex flex-wrap gap-2 ml-3 mr-3 justify-center">
              {products
                .filter((product) =>
                  product.product_attributes?.some(
                    (attr) => attr.value === category,
                  ),
                )
                .map((product) => (
                  <ProductCard {...product} key={product.id} />
                ))}
            </div>
          </div>
        ))}
    </div>
  );
};

export default HomePage;
