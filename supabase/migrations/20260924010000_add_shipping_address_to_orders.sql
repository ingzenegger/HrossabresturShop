-- orders: shipping address, only needed when delivery_method = 'post'

ALTER TABLE orders
  ADD COLUMN shipping_name text,
  ADD COLUMN shipping_street text,
  ADD COLUMN shipping_postcode text,
  ADD COLUMN shipping_city text;

-- a posted order must have a complete address
ALTER TABLE orders
  ADD CONSTRAINT post_requires_address
    CHECK (
      delivery_method <> 'post'
      OR (
        coalesce(shipping_name, '') <> ''
        AND coalesce(shipping_street, '') <> ''
        AND coalesce(shipping_postcode, '') <> ''
        AND coalesce(shipping_city, '') <> ''
      )
    );

-- Icelandic postcodes are three digits
ALTER TABLE orders
  ADD CONSTRAINT shipping_postcode_format
    CHECK (shipping_postcode IS NULL OR shipping_postcode ~ '^[0-9]{3}$');