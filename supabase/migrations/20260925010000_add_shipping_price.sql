-- shop-wide settings, starting with the flat shipping price for posted orders

create table public.shop_settings (
  id integer primary key default 1 check (id = 1),
  shipping_price integer not null check (shipping_price >= 0)
);

insert into public.shop_settings (shipping_price) values (1500);

alter table public.shop_settings enable row level security;

create policy "Anyone can read shop settings"
  on public.shop_settings
  for select
  using (true);

-- what shipping cost on each order, kept even if the price changes later
alter table public.orders
  add column shipping_cost integer not null default 0
    check (shipping_cost >= 0);