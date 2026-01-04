# Shipping Address Fix

## Problem
Shipping addresses are not appearing in the order history page (`/shop/orders`) because the `create_shop_order` database function was not including the shipping address in the `product_snapshot` JSONB field.

## Solution
A new migration file has been created: `supabase/migrations/042_fix_shipping_address_in_snapshot.sql`

This migration updates the `create_shop_order` function to include the shipping address in the product snapshot when creating an order.

## How to Apply

### Option 1: Using Supabase Dashboard (Recommended if Docker is not running)
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy the contents of `supabase/migrations/042_fix_shipping_address_in_snapshot.sql`
4. Paste and run the SQL

### Option 2: Using Supabase CLI (If Docker is running)
```bash
# Start Docker Desktop first, then:
npx supabase db reset
# Or if you have the project linked:
npx supabase db push
```

### Option 3: Using Supabase Migration Command
```bash
# If you have Supabase linked to a remote project:
npx supabase db push
```

## Changes Made

The key change in the `create_shop_order` function is on lines 62-64:

```sql
-- Add shipping address to snapshot if provided
IF p_shipping_address IS NOT NULL THEN
  v_product_snapshot := v_product_snapshot || jsonb_build_object('shipping_address', p_shipping_address);
END IF;
```

This ensures that when a user provides a shipping address during checkout, it gets stored in the `product_snapshot` field and will be displayed in the order history.

## Testing

After applying the migration:
1. Go to `/shop`
2. Purchase a physical product (like "LMS Футболк")
3. Fill in the shipping address form
4. Complete the purchase
5. Go to `/shop/orders`
6. The shipping address should now be visible in the order details

## Note
This fix only applies to **new orders** created after the migration is applied. Existing orders in the database will not have shipping addresses because they were created before this fix.
