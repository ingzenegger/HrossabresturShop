import SimilarItems from "@/feature/product/detail/components/SimilarItems";
import Variants from "@/feature/product/detail/components/Variants";
import WarnBanner from "@/feature/product/detail/components/WarnBanner";
import AddToCart from "@/feature/product/list/components/AddToCart";
import { useAppStore } from "@/shared/store/appStore";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

//TODO: add carousel with all images relating to product, with a function that matches product variant with image selected.

const ProductDetailPage = () => {
  let params = useParams();
  let productId = params.productId;

  const products = useAppStore((state) => state.products);

  const product = products.find((product) => product.id === productId);
  const [selectedVariant, setSelectedVariant] = useState(
    product?.product_variants[0].name,
  );

  useEffect(() => {
    setSelectedVariant(product?.product_variants[0].name);
  }, [productId]);

  if (!product) return <div>product not found</div>;

  const currentVariant = product.product_variants.find(
    (variant) => variant.name === selectedVariant,
  );
  const asset = product.product_assets.find(
    (asset) => asset.variant_id === currentVariant?.id,
  );
  const attributeCategory = product.product_attributes.find(
    (attribute) => attribute.key === "category",
  );

  return (
    <div>
      <WarnBanner />
      <div className="flex gap-5">
        <div className="max-w-150 m-5 p-3 flex">
          <img src={asset?.asset_url} alt="" className="max-h-fit rounded-md" />
        </div>
        <div className="flex flex-col m-5 p-3 gap-3">
          <h1>Product: {product.name}</h1>
          <p>Description: {product.description}</p>
          <p>
            Price: {product.price_cents} {product.currency}
          </p>
          {/* TODO: Here we need a fallback setup for a product that doesn't have variants */}
          <p>
            Selected product: {selectedVariant} {product.name}
          </p>
          <p>In stock: {currentVariant?.stock_quantity}</p>
          <Variants
            productVariants={product.product_variants}
            setSelectedVariant={setSelectedVariant}
            selectedVariant={selectedVariant}
          />
          <AddToCart productId={product.id} btnLabel="Add to cart" />
          <SimilarItems
            category={attributeCategory?.value}
            currentProduct={product.id}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
