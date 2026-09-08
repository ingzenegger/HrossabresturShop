import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { useState } from "react";
import type { ProductVariant } from "@/shared/types/product";

export type AssetFormValues = {
  file: File;
  variantId: string; // "none" for product-level, otherwise a variant id
  altText: string;
};

type AssetFormProps = {
  variants: ProductVariant[];
  initialVariantId?: string;
  submitLabel: string;
  onSubmit: (values: AssetFormValues) => Promise<void>;
};

export default function AssetForm({
  variants,
  initialVariantId = "none",
  submitLabel,
  onSubmit,
}: AssetFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [variantId, setVariantId] = useState(initialVariantId);
  const [altText, setAltText] = useState("");
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setError(null);

        if (!file) {
          setError("Please choose an image to upload.");
          return;
        }

        try {
          await onSubmit({ file, variantId, altText });
          setFile(null);
          setAltText("");
          setFileInputKey((key) => key + 1);
        } catch (err) {
          setError(err instanceof Error ? err.message : "something went wrong. Try again.");
        }
      }}
    >
      <div className="grid gap-2">
        <Label htmlFor="assetFile">Image</Label>
        <Input
          key={fileInputKey}
          id="assetFile"
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="assetVariant">Variant</Label>
        <Select value={variantId} onValueChange={setVariantId}>
          <SelectTrigger id="assetVariant">
            <SelectValue placeholder="Select variant" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No variant (product-level)</SelectItem>
            {variants.map((variant) => (
              <SelectItem key={variant.id} value={variant.id}>
                {variant.name.en}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="assetAltText">Alt text</Label>
        <Input
          id="assetAltText"
          value={altText}
          onChange={(e) => setAltText(e.target.value)}
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit">{submitLabel}</Button>
    </form>
  );
}