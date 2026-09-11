import { Link, useParams } from "react-router";
import { useAdminProducts } from "../hooks/useAdminProducts";
import AttributeManager from "../components/AttributeManager";
import VariantManager from "../components/VariantManager";
import AssetManager from "../components/AssetManager";

export default function ViewProduct() {
  const { id } = useParams();
  const { data: products, isLoading, error } = useAdminProducts();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    console.error(error);
    return <p>Something went wrong loading the product.</p>;
  }

  const product = products?.find((p) => p.id === id);

  if (!product) {
    return <p>Product not found.</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{product.name.is}</h2>
        <Link
          to={`/admin/products/${product.id}/edit`}
          className="text-sm text-amber-800 underline underline-offset-4"
        >
          Edit product
        </Link>
      </div>

      <div className="grid gap-1 text-sm">
        <p>
          <span className="font-medium">Name EN:</span> {product.name.en}
        </p>
        <p>
          <span className="font-medium">Slug:</span> {product.slug}
        </p>
        <p>
          <span className="font-medium">Type:</span> {product.product_type}
        </p>
        <p>
          <span className="font-medium">Price:</span> {product.price}{" "}
          {product.currency}
        </p>
        <p>
          <span className="font-medium">Active:</span>{" "}
          {product.is_active ? "Yes" : "No"}
        </p>
        <p>
          <span className="font-medium">Description (IS):</span>{" "}
          {product.description.is}
        </p>
        <p>
          <span className="font-medium">Description (EN):</span>{" "}
          {product.description.en}
        </p>
      </div>

      <AttributeManager
        productId={product.id}
        attributes={product.product_attributes}
      />

      <VariantManager
        productId={product.id}
        variants={product.product_variants}
        currency={product.currency}
      />

      <AssetManager
        productId={product.id}
        variants={product.product_variants}
        assets={product.product_assets}
      />
    </div>
  );
}
