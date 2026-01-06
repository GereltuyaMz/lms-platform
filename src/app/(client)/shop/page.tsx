import {
  getShopProducts,
  getUserXPBalance,
  getUserDigitalInventory,
} from "@/lib/actions/shop-actions";
import { ShopHeader } from "@/components/shop/ShopHeader";
import { ShopGrid } from "@/components/shop/ShopGrid";

export const metadata = {
  title: "XP Дэлгүүр",
  description: "Оноогоо бодит шагналд хувиргаарай",
};

export default async function ShopPage() {
  const [products, userXP, digitalInventory] = await Promise.all([
    getShopProducts(),
    getUserXPBalance(),
    getUserDigitalInventory(),
  ]);

  const ownedProductIds = digitalInventory.map((item) => item.product_id);

  return (
    <div className="min-h-screen bg-background">
      <ShopHeader userXP={userXP} />
      <div className="container mx-auto px-4 py-12 max-w-[1400px]">
        <ShopGrid
          products={products}
          userXP={userXP}
          ownedProductIds={ownedProductIds}
        />
      </div>
    </div>
  );
}
