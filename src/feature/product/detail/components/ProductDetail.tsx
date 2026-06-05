import type {
  Product,
  ProductAttribute,
  ProductVariant,
} from "@/shared/types/product";
import { useState } from "react";
import VariantSelect from "./VariantSelect";
import AddToCart from "../../list/components/AddToCart";
import SimilarItems from "./SimilarItems";
import { formatPrice } from "@/shared/lib/formatPrice";

type props = {
  product: Product;
  category: ProductAttribute | undefined;
};

const ProductDetail = ({ product, category }: props) => {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    product.product_variants[0],
  );

  const variantImg = product.product_assets.find(
    (asset) => asset.variant_id === selectedVariant?.id,
  ); //TODO: this is a possible bug waiting to happen if more assets are added to same variantId

  return (
    <div className="flex gap-5">
      {/* TODO: make seperate component for productimages */}
      <div className="max-w-150 m-5 p-3 flex">
        <img
          src={variantImg?.asset_url}
          alt=""
          className="max-h-fit rounded-md"
        />
      </div>
      {/*  */}
      <div className="flex flex-col m-5 p-3 gap-3">
        <h1>Product: {product.name}</h1>
        <p>Description: {product.description}</p>
        <p>Price: {formatPrice(selectedVariant.price_cents)}</p>
        {/* TODO: Do we need a fallback setup for a product that doesn't have variants? or just make sure with schema that all my products have variants? */}
        <p>
          Selected product: {selectedVariant?.name} {product.name}
        </p>
        <p>In stock: {selectedVariant?.stock_quantity}</p>
        <VariantSelect
          productVariants={product.product_variants}
          setSelectedVariant={setSelectedVariant}
          selectedVariant={selectedVariant}
        />
        <AddToCart
          productId={product.id}
          variantId={selectedVariant.id}
          btnLabel="Add to cart"
        />
        <SimilarItems category={category?.value} currentProduct={product.id} />
      </div>
    </div>
  );
};

export default ProductDetail;
