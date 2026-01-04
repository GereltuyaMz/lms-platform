export type ProductType =
  | "physical_merch"
  | "physical_gift_card"
  | "digital_course"
  | "digital_boost";

export type OrderStatus = "pending" | "processing" | "completed" | "cancelled";

export type FulfillmentStatus = "pending" | "shipped" | "delivered";

export type ShippingAddress = {
  id?: string;
  fullName: string;
  phone: string;
  city?: string;
  district?: string;
  khoroo?: string;
  addressLine: string;
};

export type ProductMetadata = {
  course_id?: string;
  duration_hours?: number;
  level?: string;
  multiplier?: number;
  hint_count?: number;
  [key: string]: unknown;
};
