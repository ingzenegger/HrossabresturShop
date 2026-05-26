import SimilarItems from "@/feature/product/detail/components/SimilarItems";
import Variants from "@/feature/product/detail/components/Variants";
import WarnBanner from "@/feature/product/detail/components/WarnBanner";
import AddToCart from "@/feature/product/list/components/AddToCart";
import { useAppStore } from "@/shared/store/appStore";
import { useParams } from "react-router";

const ProductDetailPage = () => {
  let params = useParams();
  let productId = params.productId;
  const products = useAppStore((state) => state.products);
  const product = products.find((product) => product.id === productId);

  if (!product) return <div>product not found</div>;

  return (
    <div>
      <WarnBanner />
      <div className="flex gap-5">
        <div className="max-w-150 m-5 p-3 flex">
          <img
            src={product.product_assets[0].asset_url}
            alt=""
            className="max-h-fit rounded-md"
          />
        </div>
        <div className="m-5 p-3">
          <h1>Product: {product.name}</h1>
          <p>Description: {product.description}</p>
          <Variants />
          <AddToCart />
          <SimilarItems />
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
