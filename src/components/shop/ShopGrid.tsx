"use client";

import { useState } from "react";
import { ProductCard } from "./ProductCard";
import { ProductDialog } from "./ProductDialog";
import type { ShopProduct } from "@/lib/actions/shop-actions";

type ShopGridProps = {
  products: ShopProduct[];
  userXP: number;
  ownedProductIds?: string[];
};

export const ShopGrid = ({ products, userXP, ownedProductIds = [] }: ShopGridProps) => {
  const [selectedProduct, setSelectedProduct] = useState<ShopProduct | null>(
    null
  );

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          Одоогоор бүтээгдэхүүн байхгүй байна
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            userXP={userXP}
            onPurchaseClick={setSelectedProduct}
            userOwnsProduct={ownedProductIds.includes(product.id)}
          />
        ))}
      </div>

      {/* Product Dialog */}
      {selectedProduct && (
        <ProductDialog
          product={selectedProduct}
          userXP={userXP}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          userOwnsProduct={ownedProductIds.includes(selectedProduct.id)}
        />
      )}
    </>
  );
};
