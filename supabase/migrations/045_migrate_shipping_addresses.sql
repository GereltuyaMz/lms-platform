-- Migration 045: Migrate Existing Shipping Addresses
-- Extracts shipping addresses from shop_order_items.product_snapshot
-- Creates entries in shop_shipping_addresses table for users with orders
-- Selects most recent address per user as default

-- ============================================
-- 1. Migrate Shipping Addresses from Order History
-- ============================================

INSERT INTO shop_shipping_addresses (
  user_id,
  full_name,
  phone,
  city,
  district,
  khoroo,
  address_line,
  is_default,
  created_at
)
SELECT DISTINCT ON (so.user_id)
  so.user_id,
  (soi.product_snapshot->'shipping_address'->>'fullName')::TEXT,
  (soi.product_snapshot->'shipping_address'->>'phone')::TEXT,
  (soi.product_snapshot->'shipping_address'->>'city')::TEXT,
  (soi.product_snapshot->'shipping_address'->>'district')::TEXT,
  (soi.product_snapshot->'shipping_address'->>'khoroo')::TEXT,
  (soi.product_snapshot->'shipping_address'->>'addressLine')::TEXT,
  true,  -- Set as default
  soi.created_at
FROM shop_order_items soi
JOIN shop_orders so ON so.id = soi.order_id
WHERE
  soi.product_snapshot ? 'shipping_address'
  AND (soi.product_snapshot->'shipping_address'->>'fullName') IS NOT NULL
  AND (soi.product_snapshot->'shipping_address'->>'phone') IS NOT NULL
  AND (soi.product_snapshot->'shipping_address'->>'addressLine') IS NOT NULL
ORDER BY so.user_id, soi.created_at DESC
ON CONFLICT (user_id) WHERE is_default = true
DO NOTHING;  -- Skip if user already has a default address

COMMENT ON TABLE shop_shipping_addresses IS 'User shipping addresses for physical product delivery. Migrated from order history.';
