import {
  NewAssetSchema,
  type ProductAsset,
  type ProductVariant,
} from "@/shared/types/product";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { uploadAsset } from "../api/uploadAsset";
import { addAsset } from "../api/addAsset";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import AssetForm, { type AssetFormValues } from "./AssetForm";

type AssetManagerProps = {
  productId: string;
  assets: ProductAsset[];
  variants: ProductVariant[];
};

export default function AssetManager({
  productId,
  assets,
  variants,
}: AssetManagerProps) {
  const queryClient = useQueryClient();

  const [addingAsset, setAddingAsset] = useState(false);

  async function handleAddAsset(values: AssetFormValues) {
    const variantId = values.variantId === "none" ? null : values.variantId;

    const sortOrder = assets.filter(
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
    <div>
      <h3 className="text-base font-semibold mb-2">Images</h3>

      {assets.length === 0 && !addingAsset && (
        <p className="text-sm text-muted-foreground mb-2">No Images yet</p>
      )}
      <div className="flex flex-wrap gap-3">
        {assets.map((asset) => {
          const variant = variants.find((v) => v.id === asset.variant_id);
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
            variants={variants}
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
  );
}
