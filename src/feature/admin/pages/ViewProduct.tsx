import { Link, useParams } from "react-router";
import { useAdminProducts } from "../hooks/useAdminProducts";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { NewAssetSchema } from "@/shared/types/product";

import { toast } from "sonner";

import { Button } from "@/shared/components/ui/button";

import type { AssetFormValues } from "../components/AssetForm";
import { uploadAsset } from "../api/uploadAsset";
import { addAsset } from "../api/addAsset";
import AssetForm from "../components/AssetForm";
import AttributeManager from "../components/AttributeManager";
import VariantManager from "../components/VariantManager";

export default function ViewProduct() {
  const { id } = useParams();
  const { data: products, isLoading, error } = useAdminProducts();
  const queryClient = useQueryClient();

  const [addingAsset, setAddingAsset] = useState(false);

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
  const productId = product.id;

  async function handleAddAsset(values: AssetFormValues) {
    const variantId = values.variantId === "none" ? null : values.variantId;

    const sortOrder = product?.product_assets.filter(
      (asset) => asset.variant_id === variantId,
    ).length;

    const assetUrl = await uploadAsset(values.file, productId);

    const payload = {
      product_id: productId,
      variant_id: variantId,
      asset_url: assetUrl,
      asset_type: "image" as const,
      alt_text: values.altText,
      sort_order: sortOrder,
    };

    const result = NewAssetSchema.safeParse(payload);
    if (!result.success) {
      throw new Error(
        "Please check the form - something isn't filled in correctly.",
      );
    }

    await addAsset(result.data);
    await queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
    toast.success("Image added");
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

      <div>
        <h3 className="text-base font-semibold mb-2">Images</h3>

        {product.product_assets.length === 0 && !addingAsset && (
          <p className="text-sm text-muted-foreground mb-2">No Images yet</p>
        )}
        <div className="flex flex-wrap gap-3">
          {product.product_assets.map((asset) => {
            const variant = product.product_variants.find(
              (v) => v.id === asset.variant_id,
            );
            return (
              <div
                key={asset.id}
                className="flex flex-col items-center gap-1 w-24"
              >
                <img
                  src={asset.asset_url}
                  alt={asset.alt_text}
                  className="w-24 h-24 object-cover rounded-md border"
                />
                <span className="text-xs text-muted-foreground text-center">
                  {variant ? variant.name.en : "Product-level"}
                </span>
              </div>
            );
          })}
        </div>

        {addingAsset ? (
          <div className="border rounded-md p-3 mt-3">
            <AssetForm
              variants={product.product_variants}
              submitLabel="Upload image"
              onSubmit={handleAddAsset}
            />
            <Button
              type="button"
              variant="ghost"
              className="mt-2"
              onClick={() => setAddingAsset(false)}
            >
              Done
            </Button>
          </div>
        ) : (
          <Button
            type="button"
            className="mt-3"
            onClick={() => setAddingAsset(true)}
          >
            + Add Image
          </Button>
        )}
      </div>
    </div>
  );
}
