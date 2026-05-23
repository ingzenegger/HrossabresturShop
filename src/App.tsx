import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import type { Product } from "./types";
import ProductCard from "./feature/product/list/components/ProductCard";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
);
console.log(import.meta.env.VITE_SUPABASE_URL);

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const myshopId = "17d6fc42-5daf-4e25-98d9-47716cf8850b";

  useEffect(() => {
    getProducts();
  }, []);

  async function getProducts() {
    const { data, error } = await supabase
      .from("products")
      .select(
        "*, product_assets(*), product_variants(*), product_attributes(*)",
      )
      .eq("shop_id", myshopId);

    if (error) {
      console.error(error);
      return;
    }
    console.log("raw product[0]", data?.[0]);
    console.log("raw product[1]", data?.[1]);
    setProducts(data);
  }

  return (
    <div>
      <h2>Toys</h2>
      <div className="flex gap-2 ml-3 mr-3">
        {products
          .filter((product) => product.genre === "toys")
          .map((product) => (
            <ProductCard {...product} key={product.id} />
          ))}
      </div>
      <h2>Decor</h2>
      <div className="flex gap-2 ml-3 mr-3">
        {products
          .filter((product) => product.genre === "decor")
          .map((product) => (
            <ProductCard {...product} key={product.id} />
          ))}
      </div>
    </div>
  );
}

export default App;
