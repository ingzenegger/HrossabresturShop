-- orders: new status stages for real order handling, plus a separate "paid" mark

-- 1. turn status from the old order_status enum into text with a CHECK,
--    like payment_method and delivery_method
alter table orders alter column status drop default;
alter table orders alter column status type text using status::text;
alter table orders alter column status set default 'pending';

-- 2. old stages that are no longer used move to their new equivalents
update orders set status = 'pending' where status = 'submitted';
update orders set status = 'completed' where status = 'fulfilled';

alter table orders
  add constraint orders_status_check
    check (status in ('pending', 'ready_for_pickup', 'shipped', 'completed', 'cancelled'));

-- 3. the old enum type isn't used anymore
drop type order_status;

-- 4. when the payment arrived (null = not paid yet)
alter table orders add column paid_at timestamptz;