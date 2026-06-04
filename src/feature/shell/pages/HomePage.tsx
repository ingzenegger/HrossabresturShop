import ProductCard from "@/feature/product/list/components/ProductCard";
import Loader from "@/shared/components/Loader";
import { useProducts } from "@/feature/product/hooks/useProducts";

const HomePage = () => {
  const { data: products, isLoading, error } = useProducts();

  if (isLoading) {
    return (
      <div className="flex items-center w-full justify-center">
        <Loader message="Loading..." />
      </div>
    );
  }
  //TODO: find a solution/text for error here
  if (error) {
    console.error(error);
    return <div>Some error message?</div>;
  }
  if (!products) return;
  const categories = [
    ...new Set(
      products
        ?.flatMap((product) => product.product_attributes)
        .flatMap((attribute) => attribute.value),
    ),
  ];

  return (
    <div>
      <div className="flex justify-center pt-2">
        <h1>Welcome to Craft Shop</h1>
      </div>

      {categories.map((category) => (
        <div>
          <h2>{category}</h2>
          <div className="flex gap-2 ml-3 mr-3" key={category}>
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
