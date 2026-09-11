import { useState } from "react";
import type { AttributeFormValues } from "./AttributeForm";
import {
  NewAttributeSchema,
  type ProductAttribute,
} from "@/shared/types/product";
import { addAttribute } from "../api/addAttribute";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateAttribute } from "../api/updateAttribute";
import AttributeForm from "./AttributeForm";
import { Button } from "@/shared/components/ui/button";

type AttributeManagerProps = {
  productId: string;
  attributes: ProductAttribute[];
};

export default function AttributeManager({
  productId,
  attributes,
}: AttributeManagerProps) {
  const queryClient = useQueryClient();

  const [editingAttributeId, setEditingAttributeId] = useState<string | null>(
    null,
  );
  const [addingAttribute, setAddingAttribute] = useState(false);

  async function handleAddAttribute(values: AttributeFormValues) {
    const payload = {
      product_id: productId,
      key: values.key,
      value: { en: values.valueEn, is: values.valueIs },
    };

    const result = NewAttributeSchema.safeParse(payload);
    if (!result.success) {
      throw new Error(
        "Please check the form - something isn't filled in correctly.",
      );
    }

    await addAttribute(result.data);
    await queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
    toast.success(`Attribute added: ${result.data.key}`);
    setAddingAttribute(false);
  }

  function handleEditAttribute(attributeId: string) {
    return async (values: AttributeFormValues) => {
      const payload = {
        product_id: productId,
        key: values.key,
        value: { en: values.valueEn, is: values.valueIs },
      };

      const result = NewAttributeSchema.safeParse(payload);
      if (!result.success) {
        throw new Error(
          "Please check the form - something isn't filled in correctly.",
        );
      }

      await updateAttribute(attributeId, result.data);
      await queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
      toast.success(`Attribute updated: ${result.data.key}`);
      setEditingAttributeId(null);
    };
  }

  return (
    <div>
      <h3 className="text-base font-semibold mb-2">Attributes</h3>

      {attributes.length === 0 && !addingAttribute && (
        <p className="text-sm text-muted-foreground mb-2">No attributes yet.</p>
      )}

      <ul className="flex flex-col gap-2">
        {attributes.map((attribute) =>
          editingAttributeId === attribute.id ? (
            <li key={attribute.id} className="border rounded-md p-3">
              <AttributeForm
                initialValues={{
                  valueIs: attribute.value.is,
                  valueEn: attribute.value.en,
                  key: attribute.key,
                }}
                submitLabel="Save"
                onSubmit={handleEditAttribute(attribute.id)}
              />
              <Button
                type="button"
                variant="ghost"
                className="mt-2"
                onClick={() => setEditingAttributeId(null)}
              >
                Cancel
              </Button>
            </li>
          ) : (
            <li
              key={attribute.id}
              className="border rounded-md p-3 text-sm flex justify-between items-center"
            >
              <span>{attribute.key}:</span>
              <span>
                EN: {attribute.value.en} / IS: {attribute.value.is}
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setEditingAttributeId(attribute.id)}
              >
                Edit
              </Button>
            </li>
          ),
        )}
      </ul>

      {addingAttribute ? (
        <div className="border rounded-md p-3 mt-3">
          <AttributeForm
            initialValues={{
              key: "",
              valueIs: "",
              valueEn: "",
            }}
            submitLabel="Add attribute"
            onSubmit={handleAddAttribute}
          />
          <Button
            type="button"
            variant="ghost"
            className="mt-2"
            onClick={() => setAddingAttribute(false)}
          >
            Cancel
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          className="mt-3"
          onClick={() => setAddingAttribute(true)}
        >
          + Add attribute
        </Button>
      )}
    </div>
  );
}
