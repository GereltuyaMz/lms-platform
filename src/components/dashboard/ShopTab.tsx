import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Store, Package } from "lucide-react";
import type { ShopOrder } from "@/lib/actions/shop-actions";
import { OrderHistory } from "@/components/shop/OrderHistory";

type ShopTabProps = {
  orders: ShopOrder[];
};

export const ShopTab = ({ orders }: ShopTabProps) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-bold">Дэлгүүр</h2>
        <Link href="/shop">
          <Button className="cursor-pointer">
            <Store className="w-4 h-4 mr-2" />
            Дэлгүүр үзэх
          </Button>
        </Link>
      </div>

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
        <Card>
          <CardContent className="p-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Дэлгүүр үдэхгүй нээгдэнэ</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Дэлгүүр бэлтгэгдэж байна. Удахгүй та XP ашиглан онцгой
                агуулга, хүч чадал болон бусад зүйлсийг худалдан авах боломжтой
                болно!
              </p>
              <Link href="/shop">
                <Button className="cursor-pointer">
                  <Store className="w-4 h-4 mr-2" />
                  Дэлгүүр үзэх
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
