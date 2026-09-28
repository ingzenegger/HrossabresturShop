-- orders are now only created through place_order(), which checks prices and stock.
-- remove the old policies that let customers insert orders directly.

drop policy "Users can create own orders" on public.orders;
drop policy "Users can insert own order items" on public.order_items;