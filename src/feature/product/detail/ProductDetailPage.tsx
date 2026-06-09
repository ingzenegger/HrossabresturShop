// import WarnBanner from "@/feature/product/detail/components/WarnBanner";
import Loader from "@/shared/components/Loader";
import { useProducts } from "@/feature/product/hooks/useProducts";
import { useEffect } from "react";
import { useParams } from "react-router";
import ProductDetail from "./components/ProductDetail";

const ProductDetailPage = () => {
  const params = useParams();
  const productId = params.productId;

  const { data: products, isLoading, error } = useProducts();
  const product = products?.find((product) => product.id === productId);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [productId]);

  if (isLoading) {
    return (
      <div className="flex items-center w-full justify-center">
        <Loader message="Loading..." />
      </div>
    );
  }

  if (error || !products) {
    return (
      <div className="flex items-center w-full justify-center">
        Something went wrong. Please refresh or come back later.
      </div>
    );
  }
  if (!product)
    return (
      <div className="flex items-center w-full justify-center">
        Product not found
      </div>
    );

  const category = product.product_attributes.find(
    (attribute) => attribute.key === "category",
  );

  return (
    <div>
      {/* <WarnBanner />*/}
      <ProductDetail product={product} category={category} key={product.id} />
    </div>
  );
};

export default ProductDetailPage;
