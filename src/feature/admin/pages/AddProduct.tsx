import { toast } from "sonner";
import { NewProductSchema } from "@/shared/types/product";
import { addProduct } from "../api/addProduct";
import ProductForm, { type ProductFormValues } from "../components/ProductForm";

const emptyValues: ProductFormValues = {
  nameIs: "",
  nameEn: "",
  slug: "",
  descriptionIs: "",
  descriptionEn: "",
  price: "",
  productType: "",
  isActive: false,
};

export default function AddProduct() {
  async function handleSubmit(values: ProductFormValues) {
    const payload = {
      name: { en: values.nameEn, is: values.nameIs },
      slug: values.slug,
      description: { en: values.descriptionEn, is: values.descriptionIs },
      price: Number(values.price),
      currency: "ISK",
      product_type: values.productType,
      is_active: values.isActive,
    };

    const result = NewProductSchema.safeParse(payload);
    if (!result.success) {
      throw new Error(
        "Please check the form - something isn't filled in correctly.",
      );
    }

    await addProduct(result.data);
    toast.success(`Product added: ${result.data.name.en}`);
  }

  return (
    <>
      <h2 className="text-lg font-semibold">Add product</h2>
      <ProductForm
        initialValues={emptyValues}
        submitLabel="Add product"
        onSubmit={handleSubmit}
      />
    </>
  );
}
