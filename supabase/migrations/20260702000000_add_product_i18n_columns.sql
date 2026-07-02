-- Expand step: add bilingual jsonb columns alongside the existing text columns.
-- The live site keeps reading the old columns and is unaffected.

alter table products
  add column name_i18n jsonb,
  add column description_i18n jsonb;

-- Backfill: wrap the existing English text into the jsonb shape,
-- with an empty Icelandic string to be filled in manually later.

update products
set
  name_i18n = jsonb_build_object('en', name, 'is', ''),
  description_i18n = jsonb_build_object('en', description, 'is', '')
where name_i18n is null;