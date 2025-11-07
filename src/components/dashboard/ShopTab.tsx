import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";

export const ShopTab = () => {
  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold mb-6">Shop</h2>

      <Card>
        <CardContent className="p-12">
          <div className="text-center">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-10 h-10 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Shop Coming Soon</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Our shop is under construction. Soon you'll be able to purchase
              exclusive content, power-ups, and more using your XP points!
            </p>
            <Button disabled variant="outline">
              Explore Shop
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
