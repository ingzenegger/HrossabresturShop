# Adjustments needed for my future online shop (NOT the assignment!)

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
- [ ] SETJA ALLT HELVÍTIS DRASLIÐ Á ÍSLENSKU? HVÍ GERÐI ÉG ÞAÐ EKKI STRAX???
- [ ] Bæta við about síðu - af hverju "Hrossabrestur" - af því þannig hljóma úlnliðirnir á mér eftir of mikla handavinnu
- [ ] á mobile view (mögulega md og up líka) þarf að fá hlekki efst fyrir flokkana,
