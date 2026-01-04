import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Truck, Check, ShoppingBag } from "lucide-react";
import type { ShopOrder } from "@/lib/actions/shop-actions";

type OrderHistoryProps = {
  orders: ShopOrder[];
};

const orderStatusMap: Record<string, string> = {
  pending: "Хүлээгдэж байна",
  processing: "Боловсруулж байна",
  completed: "Дууссан",
  cancelled: "Цуцлагдсан",
};

const fulfillmentStatusMap: Record<string, string> = {
  pending: "Бэлтгэж байна",
  shipped: "Илгээгдсэн",
  delivered: "Хүргэгдсэн",
};

export const OrderHistory = ({ orders }: OrderHistoryProps) => {
  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="p-12">
          <div className="text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">Захиалга байхгүй</h3>
            <p className="text-muted-foreground">
              Та одоогоор юу ч худалдан аваагүй байна
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Card key={order.id} className="overflow-hidden">
          <CardContent className="p-6">
            {order.items.map((item) => {
              const isPhysical =
                item.product_snapshot.product_type.startsWith("physical");

              return (
                <div key={item.id} className="flex flex-col md:flex-row gap-6">
                  {/* Order Image */}
                  <div className="relative w-full md:w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100">
                    <Image
                      src={
                        item.product_snapshot.image_url ||
                        "/images/placeholder-product.png"
                      }
                      alt={item.product_snapshot.name_mn}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Order Details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-bold">
                          {item.product_snapshot.name_mn}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString(
                            "mn-MN",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </p>
                      </div>

                      {/* Status Badge */}
                      <Badge
                        variant={
                          order.status === "completed" ? "default" : "secondary"
                        }
                        className={
                          order.status === "completed"
                            ? "bg-emerald-500"
                            : ""
                        }
                      >
                        {orderStatusMap[order.status]}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-amber-600 font-bold">
                        {order.total_xp_cost.toLocaleString()} XP
                      </span>
                    </div>

                    {/* Fulfillment Status (Physical Items) */}
                    {isPhysical && item.fulfillment_status && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Package className="w-4 h-4" />
                          <span>
                            {fulfillmentStatusMap[item.fulfillment_status]}
                          </span>
                        </div>

                        {item.tracking_number && (
                          <div className="flex items-center gap-2 text-sm text-blue-600">
                            <Truck className="w-4 h-4" />
                            <span>Tracking: {item.tracking_number}</span>
                          </div>
                        )}

                        {/* Shipping Address */}
                        {item.product_snapshot.shipping_address && (
                          <div className="mt-3 p-3 bg-muted rounded-lg text-sm">
                            <strong>Хүргэлтийн хаяг:</strong>
                            <br />
                            {item.product_snapshot.shipping_address.fullName}
                            <br />
                            {item.product_snapshot.shipping_address.phone}
                            <br />
                            {item.product_snapshot.shipping_address.city &&
                              `${item.product_snapshot.shipping_address.city}, `}
                            {item.product_snapshot.shipping_address.district &&
                              `${item.product_snapshot.shipping_address.district}, `}
                            {item.product_snapshot.shipping_address.khoroo &&
                              `${item.product_snapshot.shipping_address.khoroo}, `}
                            <br />
                            {
                              item.product_snapshot.shipping_address
                                .addressLine
                            }
                          </div>
                        )}
                      </div>
                    )}

                    {/* Course Unlock Confirmation */}
                    {item.product_snapshot.product_type === "digital_course" && (
                      <div className="flex items-center gap-2 text-sm text-emerald-600">
                        <Check className="w-4 h-4" />
                        <span>Хичээл нээгдсэн</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
