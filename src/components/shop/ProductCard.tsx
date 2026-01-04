"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X, Sparkles, Zap, Gift } from "lucide-react";
import type { ShopProduct } from "@/lib/actions/shop-actions";

type ProductCardProps = {
  product: ShopProduct;
  userXP: number;
  onPurchaseClick: (product: ShopProduct) => void;
  userOwnsProduct?: boolean;
};

export const ProductCard = ({
  product,
  userXP,
  onPurchaseClick,
  userOwnsProduct = false,
}: ProductCardProps) => {
  const canAfford = userXP >= product.xp_cost;
  const isOutOfStock =
    product.inventory_available !== null && product.inventory_available <= 0;
  const isLowStock =
    product.inventory_available !== null &&
    product.inventory_available > 0 &&
    product.inventory_available < 10;

  const isPhysical = product.product_type.startsWith("physical");

  return (
    <div className="group relative h-full">
      {/* Subtle hover glow using brand colors */}
      <div className="absolute -inset-[1px] bg-gradient-to-br from-primary/30 to-secondary/30 rounded-xl opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300" />

      {/* Card */}
      <Card className="relative h-full flex flex-col overflow-hidden border-border group-hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02]">
        {/* Product Image */}
        <div className="relative w-full h-52 overflow-hidden bg-gradient-to-br from-primary/5 to-secondary/5">
          <Image
            src={product.image_url || "/images/placeholder-product.png"}
            alt={product.name_mn}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Subtle overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />

          {/* Course Unlock Badge (100% Free) */}
          {product.product_type === "digital_course_unlock" && (
            <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground cursor-pointer shadow-lg hover:shadow-xl transition-shadow">
              <Sparkles className="w-3 h-3 mr-1" />
              100% ҮНЭГҮЙ
            </Badge>
          )}

          {/* Course Discount Badge (50% Off) */}
          {product.product_type === "digital_course_discount" && (
            <Badge className="absolute top-3 right-3 bg-secondary text-secondary-foreground cursor-pointer shadow-lg hover:shadow-xl transition-shadow">
              <Zap className="w-3 h-3 mr-1" />
              50% ХЯМДРАЛ
            </Badge>
          )}

          {/* Low Stock Badge */}
          {isLowStock && !userOwnsProduct && (
            <Badge variant="destructive" className="absolute top-3 right-3 cursor-pointer shadow-lg animate-pulse">
              🔥 Дөнгөж {product.inventory_available} үлдсэн!
            </Badge>
          )}

          {/* Out of Stock Overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-background/95 backdrop-blur-sm flex items-center justify-center">
              <div className="text-center space-y-2">
                <div className="text-4xl opacity-40">🚫</div>
                <Badge variant="secondary" className="text-base">
                  Дууссан
                </Badge>
              </div>
            </div>
          )}

          {/* Already Owned Badge (for digital items) */}
          {userOwnsProduct && !isPhysical && (
            <div className="absolute inset-0 bg-primary/5 backdrop-blur-[2px] flex items-center justify-center">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 mx-auto rounded-full bg-primary flex items-center justify-center shadow-lg">
                  <Check className="w-8 h-8 text-primary-foreground stroke-[3]" />
                </div>
                <Badge className="bg-primary text-primary-foreground text-base shadow-lg">
                  Эзэмшсэн
                </Badge>
              </div>
            </div>
          )}

          {/* Product type indicator icon */}
          {isPhysical && (
            <div className="absolute top-3 left-3">
              <div className="w-8 h-8 rounded-lg bg-background/90 backdrop-blur-sm border border-border flex items-center justify-center shadow-sm">
                <Gift className="w-4 h-4 text-primary" />
              </div>
            </div>
          )}
        </div>

        {/* Product Info */}
        <CardContent className="p-5 flex flex-col flex-1">
          <h3 className="text-lg font-bold mb-2 line-clamp-1 text-foreground group-hover:text-primary transition-colors">
            {product.name_mn}
          </h3>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {product.description_mn}
          </p>

          {/* Course Details */}
          <div className="min-h-[32px] mb-4">
            {(product.product_type === "digital_course_unlock" ||
              product.product_type === "digital_course_discount") &&
              product.metadata &&
              ("level" in product.metadata || "duration_hours" in product.metadata) && (
                <div className="flex items-center gap-2 text-xs">
                  {"level" in product.metadata && product.metadata.level ? (
                    <Badge variant="secondary" className="font-semibold capitalize">
                      {String(product.metadata.level)}
                    </Badge>
                  ) : null}
                  {"duration_hours" in product.metadata && product.metadata.duration_hours ? (
                    <Badge variant="secondary" className="font-semibold">
                      ⏱ {String(product.metadata.duration_hours)}h
                    </Badge>
                  ) : null}
                </div>
              )}
          </div>

          {/* XP Price Display */}
          <div className="relative mb-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md">
                  <Zap className="w-4 h-4 text-white fill-white" />
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-foreground tabular-nums">
                    {product.xp_cost.toLocaleString()}
                  </span>
                  <span className="text-xs font-bold text-amber-600">XP</span>
                </div>
              </div>

              {/* Affordability Indicator */}
              {!isOutOfStock && !userOwnsProduct && (
                <>
                  {canAfford ? (
                    <Badge className="bg-primary/10 border-primary/20 text-primary hover:bg-primary/20">
                      <Check className="w-3 h-3 mr-1" /> Хүрэлцэнэ
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      <X className="w-3 h-3 mr-1" />{" "}
                      {(product.xp_cost - userXP).toLocaleString()} XP
                    </Badge>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Purchase Button */}
          <Button
            className="w-full cursor-pointer h-11 font-bold text-base"
            disabled={isOutOfStock || !canAfford || userOwnsProduct}
            onClick={() => onPurchaseClick(product)}
          >
            {isOutOfStock ? (
              "Дууссан"
            ) : userOwnsProduct ? (
              <>
                <Check className="w-4 h-4 mr-2" /> Эзэмшсэн
              </>
            ) : canAfford ? (
              <>
                <Sparkles className="w-4 h-4 mr-2" /> Худалдан авах
              </>
            ) : (
              "XP хүрэлцэхгүй байна"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
