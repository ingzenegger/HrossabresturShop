import { useAppStore } from "@/shared/store/appStore";
import { useAdminProducts } from "../hooks/useAdminProducts";
import Loader from "@/shared/components/Loader";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/shared/components/ui/item";
import { Button } from "@/shared/components/ui/button";
import { Link } from "react-router";

export default function ProductsList() {
  const { data: products, isLoading, error } = useAdminProducts();
  const language = useAppStore((state) => state.language);

  if (isLoading) return <Loader message="Loading products..." />;
  if (error || !products)
    return <div>Something went wrong loading products.</div>;

  if (products.length === 0) return <div>No products yet.</div>;

  return (
    <ItemGroup>
      {products.map((product) => (
        <Item key={product.id} variant="outline">
          <ItemContent>
            <ItemTitle>
              {" "}
              <Link to={`/admin/products/${product.id}`}>
                {product.name[language]}
              </Link>{" "}
            </ItemTitle>
            <ItemDescription>
              {product.product_variants.length > 0
                ? `${product.product_variants.length} variants`
                : `Stock: ${product.stock_quantity}`}{" "}
              · {product.is_active ? "Active" : "Inactive"}
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button asChild variant="outline" size="sm">
              <Link to={`/admin/products/${product.id}/edit`}>Edit</Link>
            </Button>
          </ItemActions>
        </Item>
      ))}
    </ItemGroup>
  );
}
