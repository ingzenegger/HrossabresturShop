import { Input } from "@/shared/components/ui/input";
import ProductCard from "./ProductCard";
import type { Product } from "@/shared/types/product";

type SearchBarProps = {
  products: Product[];
  query: string;
  onQueryChange: (value: string) => void;
};

const SearchBar = ({ products, query, onQueryChange }: SearchBarProps) => {
  const isSearching = query.length >= 2;

  const results = isSearching
    ? products.filter((product) =>
        product.name.toLowerCase().includes(query.toLowerCase()),
      )
    : [];

  return (
    <div className="flex flex-col px-3 pt-4 items-center">
      <Input
        type="text"
        placeholder="Search products..."
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        className="max-w-sm"
      />

      {isSearching && (
        <div className="mt-4">
          {results.length > 0 ? (
            <div className="flex flex-wrap gap-2 justify-center">
              {results.map((product) => (
                <ProductCard {...product} key={product.id} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No products found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
