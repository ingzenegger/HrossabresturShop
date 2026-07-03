-- Expand step: add bilingual jsonb column for attribute values
-- (e.g. category names shown as pills on the homepage).
-- The attribute key stays English-only for now; it is not customer-facing.
-- The live site keeps reading the old value column and is unaffected.

alter table product_attributes
  add column value_i18n jsonb;

-- Backfill: existing values are English; Icelandic starts empty,
-- to be filled in manually via the dashboard.

update product_attributes
set value_i18n = jsonb_build_object('en', value, 'is', '')
where value_i18n is null;