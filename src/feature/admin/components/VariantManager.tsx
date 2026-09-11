import { NewVariantSchema, type ProductVariant } from "@/shared/types/product";
import { useState } from "react";
import type { VariantFormValues } from "./VariantForm";
import { addVariant } from "../api/addVariant";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateVariant } from "../api/updateVariant";
import VariantForm from "./VariantForm";
import { Button } from "@/shared/components/ui/button";

type VariantManagerProps = {
  productId: string;
  variants: ProductVariant[];
  currency: string;
};

export default function VariantManager({
  productId,
  variants,
  currency,
}: VariantManagerProps) {
  const queryClient = useQueryClient();
  const [editingVariantId, setEditingVariantId] = useState<string | null>(null);
  const [addingVariant, setAddingVariant] = useState(false);

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

  return (
    <div>
      <h3 className="text-base font-semibold mb-2">Variants</h3>

      {variants.length === 0 && !addingVariant && (
        <p className="text-sm text-muted-foreground mb-2">No variants yet.</p>
      )}

      <ul className="flex flex-col gap-2">
        {variants.map((variant) =>
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
                {variant.price} {currency} — stock: {variant.stock_quantity}
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
  );
}
