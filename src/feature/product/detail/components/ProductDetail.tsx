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
import ProductImageCarousel from "./ProductImageCarousel";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import { useNavigate } from "react-router";
import { Button } from "@/shared/components/ui/button";

type props = {
  product: Product;
  category: ProductAttribute | undefined;
};

const ProductDetail = ({ product, category }: props) => {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    product.product_variants[0],
  );
  const navigate = useNavigate();

  const isLowStock = selectedVariant.stock_quantity <= 2;
  const isOutOfStock = selectedVariant.stock_quantity === 0;

  return (
    <div className="flex flex-col md:flex-row gap-5 items-center md:items-start justify-center">
      <ProductImageCarousel
        assets={product.product_assets}
        variants={product.product_variants}
        selectedVariant={selectedVariant}
        setSelectedVariant={setSelectedVariant}
      />

      <div className="flex flex-col gap-5 m-3 min-w-0">
        <Card className="ring-0 flex-1 max-w-md bg-amber-50">
          <CardHeader>
            <CardTitle className="text-2x1">{product.name}</CardTitle>
            <p className="text-xl font-semibold">
              {formatPrice(selectedVariant.price)}
            </p>
          </CardHeader>
          <Separator />
          <CardContent className="flex flex-col gap-4 pt-4">
            <p className="text-muted-foreground text-sm">
              {product.description}
            </p>

            <span
              className={`text-xs font-medium w-fit px-2 py-1 rounded-full ${
                isLowStock
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {isLowStock && isOutOfStock
                ? "Out of stock"
                : isLowStock
                  ? `Only ${selectedVariant.stock_quantity} left`
                  : `In stock: ${selectedVariant.stock_quantity}`}
            </span>

            <VariantSelect
              productVariants={product.product_variants}
              setSelectedVariant={setSelectedVariant}
              selectedVariant={selectedVariant}
            />
          </CardContent>
          <CardFooter className="border-t pt-4">
            {isOutOfStock ? (
              <Button
                className="cursor-pointer"
                onClick={() => navigate("/account/custom-orders")}
              >
                Custom order
              </Button>
            ) : (
              <AddToCart
                productId={product.id}
                variantId={selectedVariant.id}
                btnLabel="Add to cart"
              />
            )}
          </CardFooter>
        </Card>
        <SimilarItems category={category?.value} currentProduct={product.id} />
      </div>
    </div>
  );
};

export default ProductDetail;
