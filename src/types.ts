export type Product = {
  id: string; //uuid
  shop_id: string; //uuid
  name: string;
  slug: string;
  description: string;
  price_cents: number;
  currency: string;
  stock_quantity: number;
  is_active: boolean;
  genre: string;
  product_assets: ProductAsset[];
  product_variants: ProductVariant[];
};

export type ProductAsset = {
  id: string;
  product_id: string;
  asset_url: string;
  asset_type: string;
  alt_text: string;
  sort_order: number;
  variant_id: string;
};

export type ProductVariant = {
  id: string;
  product_id: string;
  name: string;
  price_cents: number;
  stock_quantity: number;
};
