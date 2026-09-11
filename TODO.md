# Future potential improvements

- [ ] add name to the initial signup
- [ ] for Layout.tsx make a seperate navBtn component? would take url and children components and handle styling
- [ ] for ProductCard, could have addtocart button as popover (shadcn), in popover a select for variants, that way user can skip the detail page and get directly to cart.
- [ ] for cartRow - add images in like avatar size at the front.
- [ ] for productDetailPage - bring back the WarnBanner and update it when I have products that are patterns, rather than just fully made items.
- [ ] create the custom order component that can take product info when user clicks "custom order" on a product page of an out of stock item.
- [ ] break the checkout page into smaller components
- [ ] for MY future backend, make sure orders hold on to cartID so the same cart cant be checked out twice if delete fails and cartItems come back from the dead on refresh (checkoutApi.ts step 3)
- [ ] For signup/ update password/ etc auth components from Supabase: checkout the email stuff after project has been graded.
- [ ] add admin components to add things to the shop
- [ ] TODO on checkoutApi - currently doesn't update stock on the backend. Not need for it for fake purchases, but will be for real ones. so:
  - decrement stock_quantity on checkout (variant if variant_id exists, else product).
  - Also needs a stock guard to prevent checkout if item is already out of stock when multiple users have the same item in cart.
  - For solution checkout Supabase RPC/database function to check and decrement atomically.
- [x] SETJA ALLT HELVÍTIS DRASLIÐ Á ÍSLENSKU? HVÍ GERÐI ÉG ÞAÐ EKKI STRAX???
- [ ] Bæta við about síðu - af hverju "Hrossabrestur" - af því þannig hljóma úlnliðirnir á mér eftir of mikla handavinnu
- [ ] á mobile view (mögulega md og up líka) þarf að fá hlekki efst fyrir flokkana
- [x] rename name_i18n/description_i18n columns (products, attributes, variants) back to name/description in DB — drop the `name:name_i18n` aliasing in queries once done

- [ ] products: getProducts() selects unused created_at/updated_at - trim them out, but needs ProductSchema split first (storefront vs admin) since both fields are currently required

## admin page todos

- [x] Access control - restrict /admin routes only to owner (role-check with supabase)
- [x] Admin layout and nav - simple shell page with links to product list, add products etc
- [x] Product list view - table/list of existing products (name, stock, active status) with edit links.
- [x] Add product form - create new product, name in both languages, price, description, stock etc
- [x] Edit product form - update existing product fields
- [x] variant management - add/edit/(remov postponed) variants (color, price, stock) for a product
- [ ] image upload/management - add/replace/delete product photos(supabase storage) with limit to size
- [ ] Deactivate product - soft delete via is_active on product table.
- [ ] simplify getProducts/ProductSchema (storefront) now that getAdminProducts is separate — drop fields only admin needs

- [ ] admin: ProductDetail assumes every product has ≥1 variant (`product_variants[0]`) - fine for now since assets need a variant_id anyway, but revisit if patterns end up not using variants the same way
- [ ] admin: variant delete not implemented - complicated by product_assets referencing variant_id, figure out asset handling first

- [ ] AssetManager: if addAsset fails/validation fails after uploadAsset succeeds, the file is orphaned in storage with no distinct error message - either clean up the upload on failure or tell the admin the image needs re-adding.
