import WarnBanner from "@/feature/product/detail/components/WarnBanner";
import Loader from "@/shared/components/Loader";
import { useProducts } from "@/feature/product/hooks/useProducts";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import type { Product } from "@/shared/types/product";
import ProductDetail from "./components/ProductDetail";

const ProductDetailPage = () => {
  let params = useParams();
  let productId = params.productId;

  const { data: products, isLoading, error } = useProducts();
  const [product, setProduct] = useState<Product | undefined>(undefined);

  useEffect(() => {
    setProduct(products?.find((product) => product.id === productId));
  }, [productId, products]);

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
  //TODO: add more detailed error handling
  if (!products) return;
  if (!product) return;

  const category = product.product_attributes.find(
    (attribute) => attribute.key === "category",
  );

  return (
    <div>
      <WarnBanner />
      <ProductDetail product={product} category={category} key={product.id} />
    </div>
  );
};

export default ProductDetailPage;
