# Shipping Address Refactor - Implementation Complete ✅

## Overview
The shipping address storage system has been successfully refactored from embedded JSONB snapshots to a dedicated `shop_shipping_addresses` table with reusable addresses.

## ✅ What Was Implemented

### 1. Database Layer
- **Migration 044** ([supabase/migrations/044_enable_shipping_address_rls.sql](supabase/migrations/044_enable_shipping_address_rls.sql)):
  - Enabled RLS on `shop_shipping_addresses` table
  - Created 4 RLS policies (SELECT, INSERT, UPDATE, DELETE)
  - Created `get_user_default_address(p_user_id)` function
  - Created `upsert_user_shipping_address(...)` function
  - **Updated** `create_shop_order()` to accept `p_address_id` instead of `p_shipping_address` JSONB
  - Address is still stored in `product_snapshot` for historical accuracy

- **Migration 045** ([supabase/migrations/045_migrate_shipping_addresses.sql](supabase/migrations/045_migrate_shipping_addresses.sql)):
  - Migrates existing addresses from order history
  - Selects most recent address per user as default
  - Handles incomplete data gracefully

### 2. Server Actions
- **shipping-address-actions.ts** (NEW):
  - `getUserShippingAddress()` - Fetches user's default address
  - `saveShippingAddress(address)` - Creates or updates default address
  - `deleteShippingAddress()` - Deletes user's address (optional)

- **shop-actions.ts** (UPDATED):
  - `purchaseProduct(productId, addressId?)` - Now accepts address ID instead of address object

### 3. Type Definitions
- **src/types/shop.ts**:
  - Added optional `id?: string` field to `ShippingAddress` type

- **src/types/database/tables.ts**:
  - Added `ShopShippingAddress` interface

### 4. Frontend Components
- **ShippingAddressForm.tsx** (UPDATED):
  - Now supports two modes: `"inline"` (checkout) and `"profile"` (dashboard)
  - Inline mode: Real-time validation via `onAddressChange` callback
  - Profile mode: Form submission with save button

- **ProductDialog.tsx** (MAJOR UPDATE):
  - Loads user's saved address on dialog open
  - Shows radio buttons if saved address exists:
    - "Use saved address" - Displays pre-filled address (read-only)
    - "Enter new address" - Shows inline form + checkbox to update saved address
  - If no saved address: Shows inline form + checkbox to save for future
  - Saves address before purchase, passes `addressId` to `purchaseProduct()`

- **ProfileTab.tsx** (UPDATED):
  - Added new "Хүргэлтийн хаяг" (Shipping Address) section
  - Loads address on component mount
  - Uses `ShippingAddressForm` in profile mode
  - Displays loading state while fetching

- **OrderHistory.tsx** (NO CHANGES):
  - Already reads from `product_snapshot.shipping_address`
  - Backward compatible with historical orders

## 🚀 Next Steps - Apply Migrations

### Option 1: Using Supabase CLI (Local Development)
```bash
# Make sure Docker Desktop is running, then:
npx supabase db reset
```

This will:
- Drop and recreate the local database
- Apply all migrations including 044 and 045
- Reseed the database with sample data

### Option 2: Using Supabase Dashboard (Production)
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `supabase/migrations/044_enable_shipping_address_rls.sql`
4. Paste and run the SQL
5. Copy the contents of `supabase/migrations/045_migrate_shipping_addresses.sql`
6. Paste and run the SQL

### Option 3: Push to Remote (If Linked)
```bash
npx supabase db push
```

## 🧪 Testing Checklist

### After Applying Migrations:

1. **Verify Migration Success**
   ```sql
   -- Check if addresses were migrated
   SELECT COUNT(*) FROM shop_shipping_addresses;

   -- Verify single default per user
   SELECT user_id, COUNT(*)
   FROM shop_shipping_addresses
   WHERE is_default = true
   GROUP BY user_id
   HAVING COUNT(*) > 1;
   ```

2. **Test Profile Address Management**
   - Go to `/dashboard` → Profile tab
   - See "Хүргэлтийн хаяг" section
   - Fill in shipping address form
   - Click "Хаяг хадгалах" button
   - ✅ Should show success toast
   - Refresh page
   - ✅ Address should persist

3. **Test Checkout with Saved Address**
   - Go to `/shop`
   - Click on a physical product (e.g., "LMS Футболк")
   - ✅ Should see radio buttons: "Хадгалсан хаяг ашиглах" and "Шинэ хаяг оруулах"
   - ✅ Saved address should be pre-filled and read-only
   - Select "Хадгалсан хаяг ашиглах"
   - Click purchase button
   - ✅ Confirmation dialog should show your saved address
   - Complete purchase
   - ✅ Should succeed

4. **Test Checkout with New Address (Update Saved)**
   - Go to `/shop`
   - Click on a physical product
   - Select "Шинэ хаяг оруулах" radio button
   - Fill in new address
   - ✅ Should see checkbox "Хадгалсан хаягаа шинэчлэх" (checked by default)
   - Complete purchase
   - Go to `/dashboard` → Profile tab
   - ✅ Saved address should be updated

5. **Test First-Time Purchase (No Saved Address)**
   - Use a new user account
   - Go to `/shop`
   - Click on a physical product
   - ✅ Should see inline form (no radio buttons)
   - ✅ Should see checkbox "Дараа ашиглахаар хаягаа хадгалах" (checked by default)
   - Fill in address and complete purchase
   - Go to `/dashboard` → Profile tab
   - ✅ Address should now be saved

6. **Test Order History**
   - Go to `/dashboard` → Shop tab
   - ✅ Past orders should display shipping addresses correctly
   - ✅ New orders should also display shipping addresses
   - ✅ Verify historical orders still show correct addresses (backward compatibility)

## 🎯 Key Features

✅ **Single default address per user** - Users can only have one saved address
✅ **Manage in two locations** - Dashboard profile tab + checkout flow
✅ **Auto-fill at checkout** - Saved address automatically loads
✅ **Migrated existing addresses** - Historical data preserved
✅ **Backward compatible** - Old orders still display correctly
✅ **Snapshot pattern maintained** - Addresses stored in `product_snapshot` for immutability

## 📋 Edge Cases Handled

1. **No saved address + checkout** → Shows inline form with save checkbox
2. **Saved address exists + checkout** → Radio buttons (use saved vs enter new)
3. **User deletes address after order** → Historical orders still show address from snapshot
4. **Migration with incomplete data** → Skips records with missing required fields
5. **Course checkout (non-physical)** → No changes, address system only for physical items

## 🔄 Rollback Strategy

If issues occur:
1. Revert `create_shop_order()` to accept JSONB parameter (run old migration)
2. Revert frontend to pass address objects instead of IDs
3. Keep migrated data in `shop_shipping_addresses` (no harm, can retry later)
4. Historical snapshots remain unchanged (backward compatible)

## 📝 Validation Queries

After implementation, verify with these SQL queries:

```sql
-- Check migrated addresses count
SELECT COUNT(*) FROM shop_shipping_addresses;

-- Verify single default per user
SELECT user_id, COUNT(*)
FROM shop_shipping_addresses
WHERE is_default = true
GROUP BY user_id
HAVING COUNT(*) > 1;

-- Check new orders have address_id in snapshot
SELECT
  soi.id,
  soi.product_snapshot->'shipping_address'->>'address_id' as has_address_id,
  soi.product_snapshot->'shipping_address'->>'fullName' as customer_name
FROM shop_order_items soi
WHERE soi.created_at > NOW() - INTERVAL '1 day'
  AND soi.product_snapshot ? 'shipping_address';
```

## ✨ Implementation Highlights

**Polymorphic Component Design** - ShippingAddressForm serves two use cases through mode prop
**Snapshot Pattern** - E-commerce best practice for preserving historical accuracy
**Database Normalization** - Moved from embedded JSONB to dedicated table
**Progressive Enhancement** - Works with or without saved addresses

---

**Status**: ✅ **Implementation Complete** - Ready for migration and testing
**TypeScript**: ✅ Compilation successful
**Plan**: Available at `/Users/erdembileg/.claude/plans/luminous-dreaming-sun.md`
