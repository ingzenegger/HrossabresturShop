import { useParams } from "react-router";
import { useAdminProducts } from "../hooks/useAdminProducts";
import type { ProductFormValues } from "../components/ProductForm";
import ProductForm from "../components/ProductForm";
import { NewProductSchema } from "@/shared/types/product";
import { updateProduct } from "../api/updateProduct";
import { toast } from "sonner";

export default function EditProduct() {
  const { id } = useParams();
  const { data: products, isLoading, error } = useAdminProducts();

  if (!id) {
    return <p>Product not found</p>;
  }

  const productId = id;

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    console.error(error);
    return <p>Something went wrong loading the product.</p>;
  }

  const product = products?.find((p) => p.id === id);

  if (!product) {
    return <p>Product not found</p>;
  }

  const initialValues: ProductFormValues = {
    nameIs: product.name.is,
    nameEn: product.name.en,
    slug: product.slug,
    descriptionIs: product.description.is,
    descriptionEn: product.description.en,
    price: String(product.price),
    productType: product.product_type,
    isActive: product.is_active,
  };

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

    await updateProduct(productId, result.data);
    toast.success(`Product updated: ${result.data.name.en}`);
  }

  return (
    <>
      <h2 className="text-lg font-semibold">Edit Product: {product.name.en}</h2>
      {product.product_variants.length > 0 && (
        <p className="text-sm text-amber-900 bg-amber-50 border border-amber-200 rounded-md p-3 mb-4">
          This product has variants with their own prices. The price field below
          only changes the base product.
        </p>
      )}
      <ProductForm
        initialValues={initialValues}
        submitLabel="Save changes"
        onSubmit={handleSubmit}
      />
    </>
  );
}
