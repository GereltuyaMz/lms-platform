"use server";

import { createClient } from "@/lib/supabase/server";
import type { ShippingAddress } from "@/types/shop";

type AddressResult = {
  success: boolean;
  message: string;
  address?: ShippingAddress & { id: string };
};

/**
 * Fetches user's default shipping address
 * Returns null if no address exists
 */
export async function getUserShippingAddress(): Promise<ShippingAddress & { id: string } | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .rpc("get_user_default_address", { p_user_id: user.id })
    .single();

  if (error || !data) {
    return null;
  }

  const address = data as {
    id: string;
    user_id: string;
    full_name: string;
    phone: string;
    city: string | null;
    district: string | null;
    khoroo: string | null;
    address_line: string;
    is_default: boolean;
    created_at: string;
    updated_at: string;
  };

  return {
    id: address.id,
    fullName: address.full_name,
    phone: address.phone,
    city: address.city || undefined,
    district: address.district || undefined,
    khoroo: address.khoroo || undefined,
    addressLine: address.address_line,
  };
}

/**
 * Saves or updates user's default shipping address
 * If user already has an address, it updates it
 * If user has no address, it creates a new one
 */
export async function saveShippingAddress(
  address: ShippingAddress
): Promise<AddressResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      message: "Нэвтрэх шаардлагатай",
    };
  }

  // Validate required fields
  if (!address.fullName.trim() || !address.phone.trim() || !address.addressLine.trim()) {
    return {
      success: false,
      message: "Нэр, утас, хаяг заавал бөглөнө үү",
    };
  }

  const { data: addressId, error } = await supabase.rpc(
    "upsert_user_shipping_address",
    {
      p_user_id: user.id,
      p_full_name: address.fullName,
      p_phone: address.phone,
      p_address_line: address.addressLine,
      p_city: address.city || null,
      p_district: address.district || null,
      p_khoroo: address.khoroo || null,
    }
  );

  if (error) {
    console.error("Error saving shipping address:", error);
    return {
      success: false,
      message: "Хаяг хадгалахад алдаа гарлаа",
    };
  }

  return {
    success: true,
    message: "Хаяг амжилттай хадгалагдлаа",
    address: {
      id: addressId as string,
      ...address,
    },
  };
}

/**
 * Deletes user's shipping address
 * Optional feature - can be used for privacy
 */
export async function deleteShippingAddress(): Promise<{
  success: boolean;
  message: string;
}> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      message: "Нэвтрэх шаардлагатай",
    };
  }

  const { error } = await supabase
    .from("shop_shipping_addresses")
    .delete()
    .eq("user_id", user.id)
    .eq("is_default", true);

  if (error) {
    console.error("Error deleting shipping address:", error);
    return {
      success: false,
      message: "Хаяг устгахад алдаа гарлаа",
    };
  }

  return {
    success: true,
    message: "Хаяг амжилттай устгагдлаа",
  };
}
