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
  //created_at:
  //updated_at:
  product_assets: ProductAsset[];
  product_variants: ProductVariant[];
  product_attributes: ProductAttribute[];
};

export type ProductAsset = {
  id: string;
  product_id: string;
  asset_url: string;
  asset_type: string;
  alt_text: string;
  sort_order: number;
  //created at:
  variant_id: string;
};

export type ProductVariant = {
  id: string;
  product_id: string;
  name: string;
  price_cents: number;
  stock_quantity: number;
  //created_at:
};

export type ProductAttribute = {
  id: string;
  product_id: string;
  key: string;
  value: string;
  //create_at:
};


export type Customer = {
  //shop_customer or user
  id: string;
  shop_id: string;
  name: string;
  email: string;
  pin_code: string | null;
  //created_at
}