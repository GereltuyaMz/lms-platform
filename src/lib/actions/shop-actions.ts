"use server";

import { createClient } from "@/lib/supabase/server";
import {
  getAuthenticatedUser,
  revalidateUserPages,
  handleActionError,
} from "./helpers";

export type ShopProduct = {
  id: string;
  name: string;
  name_mn: string;
  description: string;
  description_mn: string;
  product_type:
    | "physical_merch"
    | "physical_gift_card"
    | "digital_course_unlock"
    | "digital_course_discount"
    | "digital_boost";
  xp_cost: number;
  inventory_available: number | null;
  image_url: string;
  metadata: Record<string, unknown>;
  is_active: boolean;
  display_order: number;
};

export type ShopOrder = {
  id: string;
  user_id: string;
  status: string;
  total_xp_cost: number;
  created_at: string;
  completed_at: string | null;
  items: ShopOrderItem[];
};

export type ShopOrderItem = {
  id: string;
  product_snapshot: {
    name_mn: string;
    product_type: string;
    xp_cost: number;
    image_url: string;
    shipping_address?: {
      fullName: string;
      phone: string;
      city?: string;
      district?: string;
      khoroo?: string;
      addressLine: string;
    };
  };
  quantity: number;
  fulfillment_status: string | null;
  tracking_number: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
};

export type PurchaseResult = {
  success: boolean;
  message: string;
  orderId?: string;
};

/**
 * Get all active shop products
 */
export async function getShopProducts(
  productType?: string
): Promise<ShopProduct[]> {
  try {
    const supabase = await createClient();

    let query = supabase
      .from("shop_products")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (productType) {
      query = query.eq("product_type", productType);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching shop products:", error);
    return [];
  }
}

/**
 * Get user's XP balance
 */
export async function getUserXPBalance(): Promise<number> {
  try {
    const { user, supabase, error: authError } = await getAuthenticatedUser();

    if (authError || !user) return 0;

    const { data } = await supabase
      .from("user_profiles")
      .select("total_xp")
      .eq("id", user.id)
      .single();

    return data?.total_xp || 0;
  } catch {
    return 0;
  }
}

/**
 * Purchase a product
 */
export async function purchaseProduct(
  productId: string,
  addressId?: string
): Promise<PurchaseResult> {
  try {
    const { user, supabase, error: authError } = await getAuthenticatedUser();

    if (authError || !user) {
      return { success: false, message: "Нэвтрэх шаардлагатай" };
    }

    // Call database function to create order atomically
    const { data, error } = await supabase.rpc("create_shop_order", {
      p_user_id: user.id,
      p_product_id: productId,
      p_quantity: 1,
      p_address_id: addressId || null,
    });

    if (error) {
      if (error.message.includes("Insufficient XP")) {
        return { success: false, message: "Хангалттай XP байхгүй байна" };
      }
      if (error.message.includes("out of stock")) {
        return { success: false, message: "Бараа дууссан байна" };
      }
      if (error.message.includes("not found")) {
        return { success: false, message: "Бүтээгдэхүүн олдсонгүй" };
      }
      if (error.message.includes("Shipping address")) {
        return { success: false, message: "Хүргэлтийн хаяг олдсонгүй" };
      }
      throw error;
    }

    revalidateUserPages();

    return {
      success: true,
      message: "Амжилттай худалдан авлаа!",
      orderId: data,
    };
  } catch (error) {
    return handleActionError(error) as PurchaseResult;
  }
}

/**
 * Get user's order history
 */
export async function getUserOrders(): Promise<ShopOrder[]> {
  try {
    const { user, supabase, error: authError } = await getAuthenticatedUser();

    if (authError || !user) return [];

    const { data, error } = await supabase
      .from("shop_orders")
      .select(
        `
        id,
        user_id,
        status,
        total_xp_cost,
        created_at,
        completed_at,
        shop_order_items (
          id,
          product_snapshot,
          quantity,
          fulfillment_status,
          tracking_number,
          shipped_at,
          delivered_at
        )
      `
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return (data || []).map((order) => ({
      ...order,
      items: order.shop_order_items || [],
    })) as ShopOrder[];
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return [];
  }
}

/**
 * Check if user can afford a product
 */
export async function canAffordProduct(productId: string): Promise<boolean> {
  try {
    const { user, supabase, error: authError } = await getAuthenticatedUser();

    if (authError || !user) return false;

    const [productResult, xpResult] = await Promise.all([
      supabase
        .from("shop_products")
        .select("xp_cost")
        .eq("id", productId)
        .single(),
      supabase
        .from("user_profiles")
        .select("total_xp")
        .eq("id", user.id)
        .single(),
    ]);

    if (productResult.error || xpResult.error) return false;

    return (
      (xpResult.data?.total_xp || 0) >= (productResult.data?.xp_cost || 0)
    );
  } catch {
    return false;
  }
}

/**
 * Get user's digital inventory
 */
export async function getUserDigitalInventory(): Promise<
  { product_id: string; acquired_at: string }[]
> {
  try {
    const { user, supabase, error: authError } = await getAuthenticatedUser();

    if (authError || !user) return [];

    const { data, error } = await supabase
      .from("user_digital_inventory")
      .select("product_id, acquired_at")
      .eq("user_id", user.id);

    if (error) throw error;
    return data || [];
  } catch {
    return [];
  }
}

/**
 * Check if user owns a digital product
 */
export async function userOwnsDigitalProduct(
  productId: string
): Promise<boolean> {
  try {
    const { user, supabase, error: authError } = await getAuthenticatedUser();

    if (authError || !user) return false;

    const { data, error } = await supabase
      .from("user_digital_inventory")
      .select("id")
      .eq("user_id", user.id)
      .eq("product_id", productId)
      .single();

    return !error && !!data;
  } catch {
    return false;
  }
}

/**
 * Get user's active course discount coupons
 */
export async function getUserCourseCoupons(): Promise<
  {
    id: string;
    course_id: string;
    discount_percentage: number;
    is_used: boolean;
    expires_at: string | null;
    created_at: string;
  }[]
> {
  try {
    const { user, supabase, error: authError } = await getAuthenticatedUser();

    if (authError || !user) return [];

    const { data, error } = await supabase
      .from("course_discount_coupons")
      .select("id, course_id, discount_percentage, is_used, expires_at, created_at")
      .eq("user_id", user.id)
      .eq("is_used", false)
      .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching user coupons:", error);
    return [];
  }
}

/**
 * Get user's coupon for a specific course
 */
export async function getUserCourseCoupon(courseId: string): Promise<{
  id: string;
  discount_percentage: number;
  expires_at: string | null;
} | null> {
  try {
    const { user, supabase, error: authError } = await getAuthenticatedUser();

    if (authError || !user) return null;

    const { data, error } = await supabase
      .from("course_discount_coupons")
      .select("id, discount_percentage, expires_at")
      .eq("user_id", user.id)
      .eq("course_id", courseId)
      .eq("is_used", false)
      .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
      .order("discount_percentage", { ascending: false }) // Prefer 100% over 50%
      .limit(1)
      .single();

    if (error) return null;
    return data;
  } catch {
    return null;
  }
}
