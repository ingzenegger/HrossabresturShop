-- Expand step: add bilingual jsonb column for variant names
-- The live site keeps reading the old name column and is unaffected.

alter table product_variants
  add column name_i18n jsonb;

-- Backfill: existing values are English; Icelandic starts empty,
-- to be filled in manually via the dashboard.

update product_variants
set name_i18n = jsonb_build_object('en', name, 'is', '')
where name_i18n is null;