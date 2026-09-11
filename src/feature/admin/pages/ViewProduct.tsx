import { Link, useParams } from "react-router";
import { useAdminProducts } from "../hooks/useAdminProducts";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import type { VariantFormValues } from "../components/VariantForm";
import { NewVariantSchema, NewAssetSchema } from "@/shared/types/product";
import { addVariant } from "../api/addVariant";
import { toast } from "sonner";
import { updateVariant } from "../api/updateVariant";
import VariantForm from "../components/VariantForm";
import { Button } from "@/shared/components/ui/button";

import type { AssetFormValues } from "../components/AssetForm";
import { uploadAsset } from "../api/uploadAsset";
import { addAsset } from "../api/addAsset";
import AssetForm from "../components/AssetForm";
import AttributeManager from "../components/AttributeManager";

export default function ViewProduct() {
  const { id } = useParams();
  const { data: products, isLoading, error } = useAdminProducts();
  const queryClient = useQueryClient();

  const [editingVariantId, setEditingVariantId] = useState<string | null>(null);
  const [addingVariant, setAddingVariant] = useState(false);

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

  async function handleAddVariant(values: VariantFormValues) {
    const payload = {
      product_id: productId,
      name: { en: values.nameEn, is: values.nameIs },
      price: Number(values.price),
      stock_quantity: Number(values.stockQuantity),
    };

    const result = NewVariantSchema.safeParse(payload);
    if (!result.success) {
      throw new Error(
        "Please check the form - something isn't filled in correctly.",
      );
    }

    await addVariant(result.data);
    await queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
    toast.success(`Variant added: ${result.data.name.en}`);
    setAddingVariant(false);
  }

  function handleEditVariant(variantId: string) {
    return async (values: VariantFormValues) => {
      const payload = {
        product_id: productId,
        name: { en: values.nameEn, is: values.nameIs },
        price: Number(values.price),
        stock_quantity: Number(values.stockQuantity),
      };

      const result = NewVariantSchema.safeParse(payload);
      if (!result.success) {
        throw new Error(
          "Please check the form - something isn't filled in correctly.",
        );
      }

      await updateVariant(variantId, result.data);
      await queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
      toast.success(`Variant updated: ${result.data.name.en}`);
      setEditingVariantId(null);
    };
  }

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

      <div>
        <h3 className="text-base font-semibold mb-2">Variants</h3>

        {product.product_variants.length === 0 && !addingVariant && (
          <p className="text-sm text-muted-foreground mb-2">No variants yet.</p>
        )}

        <ul className="flex flex-col gap-2">
          {product.product_variants.map((variant) =>
            editingVariantId === variant.id ? (
              <li key={variant.id} className="border rounded-md p-3">
                <VariantForm
                  initialValues={{
                    nameIs: variant.name.is,
                    nameEn: variant.name.en,
                    price: String(variant.price),
                    stockQuantity: String(variant.stock_quantity),
                  }}
                  submitLabel="Save"
                  onSubmit={handleEditVariant(variant.id)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  className="mt-2"
                  onClick={() => setEditingVariantId(null)}
                >
                  Cancel
                </Button>
              </li>
            ) : (
              <li
                key={variant.id}
                className="border rounded-md p-3 text-sm flex justify-between items-center"
              >
                <span>{variant.name.en}</span>
                <span>
                  {variant.price} {product.currency} — stock:{" "}
                  {variant.stock_quantity}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingVariantId(variant.id)}
                >
                  Edit
                </Button>
              </li>
            ),
          )}
        </ul>

        {addingVariant ? (
          <div className="border rounded-md p-3 mt-3">
            <VariantForm
              initialValues={{
                nameIs: "",
                nameEn: "",
                price: "",
                stockQuantity: "",
              }}
              submitLabel="Add variant"
              onSubmit={handleAddVariant}
            />
            <Button
              type="button"
              variant="ghost"
              className="mt-2"
              onClick={() => setAddingVariant(false)}
            >
              Cancel
            </Button>
          </div>
        ) : (
          <Button
            type="button"
            className="mt-3"
            onClick={() => setAddingVariant(true)}
          >
            + Add variant
          </Button>
        )}
      </div>
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
