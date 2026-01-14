import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";
import { StorefrontIcon } from "@phosphor-icons/react/dist/ssr";
import type { ShopOrder } from "@/lib/actions/shop-actions";
import { OrderHistory } from "@/components/shop/OrderHistory";

type ShopTabProps = {
  orders: ShopOrder[];
};

export const ShopTab = ({ orders }: ShopTabProps) => {
  return (
    <div>
      {/* Orders Section */}
      {orders.length > 0 ? (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-5 h-5 text-muted-foreground" />
            <h3 className="text-lg font-semibold">Миний захиалга</h3>
          </div>
          <OrderHistory orders={orders} />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center bg-white rounded-2xl border">
          <StorefrontIcon size={64} className="text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Танд одоогоор захиалга байхгүй байна
          </h3>
          <p className="text-gray-600 mb-6">
            Дэлгүүрээс XP ашиглан онцгой агуулга, хүч чадал худалдан аваарай!
          </p>
          <Button asChild variant="landing">
            <Link href="/shop">Дэлгүүр үзэх</Link>
          </Button>
        </div>
      )}
    </div>
  );
};
