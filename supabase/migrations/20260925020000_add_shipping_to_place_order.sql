-- place_order: now also adds the flat shipping price (from shop_settings)
-- to posted orders. Everything else works as before.

create or replace function public.place_order(
  p_cart_id uuid,
  p_language text,
  p_payment_method text,
  p_delivery_method text,
  p_shipping_name text default null,
  p_shipping_street text default null,
  p_shipping_postcode text default null,
  p_shipping_city text default null
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_customer_id uuid := auth.uid();
  v_order_id uuid;
  v_subtotal integer;
  v_shipping_cost integer;
  v_total integer;
  v_currency text;
  v_item record;
begin
  -- 1. only logged-in customers can order
  if v_customer_id is null then
    raise exception 'not_authenticated';
  end if;

  -- 2. the cart must be the caller's own active cart.
  --    FOR UPDATE locks it, so the same cart can't be checked out twice at once
  perform 1
  from public.carts
  where id = p_cart_id
    and customer_id = v_customer_id
    and status = 'active'
  for update;

  if not found then
    raise exception 'cart_not_found';
  end if;

  -- 3. work out the total from the database's prices, not the browser's
  select
    sum(coalesce(v.price, p.price) * ci.quantity),
    min(p.currency)
  into v_subtotal, v_currency
  from public.cart_items ci
  join public.products p on p.id = ci.product_id
  left join public.product_variants v on v.id = ci.variant_id
  where ci.cart_id = p_cart_id;

  if v_subtotal is null then
    raise exception 'cart_empty';
  end if;

  -- 3b. posted orders pay the shop's flat shipping price; pickup is free
  if p_delivery_method = 'post' then
    select shipping_price into v_shipping_cost
    from public.shop_settings
    where id = 1;
  else
    v_shipping_cost := 0;
  end if;

  v_total := v_subtotal + v_shipping_cost;

  -- 4. create the order (the table's CHECK constraints validate the methods and address)
  insert into public.orders (
    customer_id, status, subtotal, shipping_cost, total, currency, submitted_at,
    payment_method, delivery_method,
    shipping_name, shipping_street, shipping_postcode, shipping_city
  )
  values (
    v_customer_id, 'pending', v_subtotal, v_shipping_cost, v_total, v_currency, now(),
    p_payment_method, p_delivery_method,
    case when p_delivery_method = 'post' then p_shipping_name end,
    case when p_delivery_method = 'post' then p_shipping_street end,
    case when p_delivery_method = 'post' then p_shipping_postcode end,
    case when p_delivery_method = 'post' then p_shipping_city end
  )
  returning id into v_order_id;

  -- 5. one order_item per cart item, decreasing stock as we go
  for v_item in
    select
      ci.product_id,
      ci.variant_id,
      ci.quantity,
      p.is_active,
      p.name ->> p_language as product_name,
      v.name ->> p_language as variant_name,
      coalesce(v.price, p.price) as unit_price
    from public.cart_items ci
    join public.products p on p.id = ci.product_id
    left join public.product_variants v on v.id = ci.variant_id
    where ci.cart_id = p_cart_id
  loop
    if not v_item.is_active then
      raise exception 'product_inactive';
    end if;

    -- decrease stock only if there is enough; the variant holds the stock if there is one
    if v_item.variant_id is not null then
      update public.product_variants
      set stock_quantity = stock_quantity - v_item.quantity
      where id = v_item.variant_id
        and stock_quantity >= v_item.quantity;
    else
      update public.products
      set stock_quantity = stock_quantity - v_item.quantity
      where id = v_item.product_id
        and stock_quantity >= v_item.quantity;
    end if;

    if not found then
      raise exception 'out_of_stock';
    end if;

    insert into public.order_items (
      order_id, product_id, variant_id, product_name, variant_name,
      unit_price, quantity, line_total
    )
    values (
      v_order_id, v_item.product_id, v_item.variant_id,
      v_item.product_name, v_item.variant_name,
      v_item.unit_price, v_item.quantity, v_item.unit_price * v_item.quantity
    );
  end loop;

  -- 6. the cart is used up; getCart() will create a fresh active cart next time
  update public.carts
  set status = 'checked_out', updated_at = now()
  where id = p_cart_id;

  return v_order_id;
end;
$$;

-- only logged-in users may call it
revoke execute on function public.place_order(uuid, text, text, text, text, text, text, text) from public, anon;
grant execute on function public.place_order(uuid, text, text, text, text, text, text, text) to authenticated;
