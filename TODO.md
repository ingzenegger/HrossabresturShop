# Future potential improvements

## Testing & docs
- [ ] Update README's "Running tests" list — it only covers the original suites (cart, checkout, i18n, SearchBar, formatting) and doesn't mention any of the admin section tests yet (forms, managers, pages, admin API functions, layout, sidebar)

## Order & payment flow (replacing the fake checkout)
- [ ] Replace the fake card form with real payment choices at checkout: pay by bank transfer, or pay on pickup — no online charging
- [ ] On checkout, decrement stock_quantity immediately (variant if variant_id exists, else product) — this reserves the item, since stock will usually only be 1-2 units
- [ ] Stock guard to prevent checkout if an item is already out of stock (race condition when two people have the same item in cart at once) — needs a Supabase RPC/database function to check-and-decrement atomically
- [ ] Make sure orders hold onto cartID so the same cart can't be checked out twice if delete fails and cartItems come back after refresh (checkoutApi.ts step 3)
- [ ] Admin order management: view incoming orders, see chosen payment method, mark payment received / ready for pickup
- [ ] Admin cancel order flow (customer cancels, transfer never arrives, or no-show at pickup) — restores the stock quantity that was decremented at checkout
- [ ] Iceland-only for now — no international shipping/payment support needed

## Admin section
- [x] Access control - restrict /admin routes to owner (role-check with supabase)
- [x] Admin layout and nav - simple shell page with links to product list, add product, etc.
- [x] Product list view - table/list of existing products (name, stock, active status) with edit links
- [x] Add product form - create new product (name in both languages, price, description, stock, etc.), redirects to ViewProduct on success
- [x] Edit product form - update existing product fields, redirects to ViewProduct on success
- [x] Variant management - add/edit variants (name, price, stock) for a product
- [x] Attribute management - add/edit attributes for a product
- [x] Image upload - add product photos (Supabase storage) with a 1MB size limit
- [ ] Image management - replace/delete existing photos (only adding new ones is implemented so far)
- [ ] Variant delete - complicated by product_assets referencing variant_id, figure out asset handling first
- [ ] Attribute delete - not implemented yet either
- [ ] AssetManager: if addAsset fails/validation fails after uploadAsset succeeds, the file is orphaned in storage with no distinct error message - either clean up the upload on failure or tell the admin the image needs re-adding
- [ ] Confirm whether "deactivate product" is already covered by the Active toggle in the edit form, or whether a quicker one-click toggle (without opening the full edit form) is still wanted
- [ ] Admin-only link in the account layout/nav (visible only to admins) so /admin doesn't have to be typed manually
- [ ] Order management page (see Order & payment flow section above)
- [ ] admin: ProductDetail (storefront) assumes every product has ≥1 variant (`product_variants[0]`) - fine for now since assets need a variant_id anyway, but revisit if patterns end up not using variants the same way

## Data & schema cleanup
- [ ] Now that getAdminProducts is separate from the storefront's getProducts, simplify ProductSchema/getProducts for the storefront - drop fields only admin needs (created_at/updated_at, etc.)

## Storefront / customer-facing
- [ ] add name to the initial signup
- [ ] for ProductCard, could have an add-to-cart button as a popover (shadcn) with a variant select inside it, so the user can skip the detail page and add to cart directly
- [ ] for cartRow - add images (avatar size) at the front
- [ ] for productDetailPage - bring back the WarnBanner and update it for when there are products that are patterns, rather than just fully made items
- [ ] custom order component — this is the CustomOrders.tsx placeholder already in the account section; wire it up to accept requests for specific items or restocks (also triggerable from an out-of-stock product page)

## Site content
- [ ] Add social media links (Instagram, TikTok) somewhere visible — footer? about page?

## Code organization
- [ ] for Layout.tsx, make a separate navBtn component - would take a url and children and handle styling
- [ ] break the checkout page into smaller components

## Auth
- [ ] for signup/update-password/etc. Supabase auth components: check the email stuff after the project has been graded

## Personal notes (is)
- [x] SETJA ALLT HELVÍTIS DRASLIÐ Á ÍSLENSKU? HVÍ GERÐI ÉG ÞAÐ EKKI STRAX???
- [x] rename name_i18n/description_i18n columns (products, attributes, variants) back to name/description in DB - drop the `name:name_i18n` aliasing in queries once done
- [ ] Bæta við about síðu - af hverju "Hrossabrestur" - af því þannig hljóma úlnliðirnir á mér eftir of mikla handavinnu
- [ ] á mobile view (mögulega md og up líka) þarf að fá hlekki efst fyrir flokkana