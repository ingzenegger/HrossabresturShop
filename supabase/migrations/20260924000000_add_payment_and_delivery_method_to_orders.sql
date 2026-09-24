-- orders: how the customer pays and how they receive the order

ALTER TABLE orders
  ADD COLUMN payment_method text NOT NULL DEFAULT 'bank_transfer'
    CHECK (payment_method IN ('bank_transfer', 'pay_on_pickup')),
  ADD COLUMN delivery_method text NOT NULL DEFAULT 'pickup'
    CHECK (delivery_method IN ('pickup', 'post'));

-- existing orders got the defaults above; new orders must say explicitly
ALTER TABLE orders ALTER COLUMN payment_method DROP DEFAULT;
ALTER TABLE orders ALTER COLUMN delivery_method DROP DEFAULT;

-- you can't pay on pickup if the item is posted
ALTER TABLE orders
  ADD CONSTRAINT pay_on_pickup_requires_pickup
    CHECK (payment_method <> 'pay_on_pickup' OR delivery_method = 'pickup');