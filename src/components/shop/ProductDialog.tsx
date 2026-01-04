"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";
import type { ShopProduct } from "@/lib/actions/shop-actions";
import { purchaseProduct } from "@/lib/actions/shop-actions";
import { getUserShippingAddress, saveShippingAddress } from "@/lib/actions/shipping-address-actions";
import { ShippingAddressForm } from "./ShippingAddressForm";
import type { ShippingAddress } from "@/types/shop";

type ProductDialogProps = {
  product: ShopProduct;
  userXP: number;
  isOpen: boolean;
  onClose: () => void;
  userOwnsProduct?: boolean;
};

export const ProductDialog = ({
  product,
  userXP,
  isOpen,
  onClose,
  userOwnsProduct = false,
}: ProductDialogProps) => {
  const router = useRouter();
  const [savedAddress, setSavedAddress] = useState<(ShippingAddress & { id: string }) | null>(null);
  const [addressMode, setAddressMode] = useState<"saved" | "new">("saved");
  const [newAddress, setNewAddress] = useState<ShippingAddress | null>(null);
  const [saveForFuture, setSaveForFuture] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);

  const canAfford = userXP >= product.xp_cost;
  const isOutOfStock =
    product.inventory_available !== null && product.inventory_available <= 0;
  const isPhysical = product.product_type.startsWith("physical");
  const needsShipping = isPhysical && canAfford && !isOutOfStock && !userOwnsProduct;

  // Load saved address when dialog opens
  useEffect(() => {
    if (isOpen && needsShipping) {
      setIsLoadingAddress(true);
      getUserShippingAddress()
        .then((address) => {
          if (address) {
            setSavedAddress(address);
            setAddressMode("saved");
          } else {
            setAddressMode("new");
          }
        })
        .finally(() => setIsLoadingAddress(false));
    }
  }, [isOpen, needsShipping]);

  const handlePurchaseClick = () => {
    if (needsShipping) {
      // Validate based on mode
      if (addressMode === "new" && !newAddress) {
        toast.error("Хаягаа бөглөнө үү");
        return;
      }
    }
    setShowConfirmation(true);
  };

  const handleConfirmPurchase = async () => {
    setIsPurchasing(true);

    try {
      let addressId: string | undefined;

      // For physical items, ensure we have an address ID
      if (needsShipping) {
        if (addressMode === "saved" && savedAddress) {
          addressId = savedAddress.id;
        } else if (addressMode === "new" && newAddress) {
          // Save the new address first
          const saveResult = await saveShippingAddress(newAddress);
          if (!saveResult.success || !saveResult.address) {
            toast.error("Хаяг хадгалахад алдаа гарлаа");
            setIsPurchasing(false);
            return;
          }
          addressId = saveResult.address.id;
        }
      }

      const result = await purchaseProduct(product.id, addressId);

      if (result.success) {
        toast.success(result.message, {
          description: `${product.name_mn} таны захиалгын жагсаалтад нэмэгдлээ`,
          duration: 5000,
          action: {
            label: "Захиалга үзэх",
            onClick: () => router.push("/dashboard?tab=shop"),
          },
        });
        onClose();
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setIsPurchasing(false);
      setShowConfirmation(false);
    }
  };

  const currentAddress = addressMode === "saved" ? savedAddress : newAddress;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {product.name_mn}
            </DialogTitle>
          </DialogHeader>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Left: Product Image */}
            <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden bg-gradient-to-br from-primary/5 to-secondary/5 border border-border">
              <Image
                src={product.image_url || "/images/placeholder-product.png"}
                alt={product.name_mn}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
            </div>

            {/* Right: Product Details */}
            <div className="space-y-6">
              {/* Description */}
              <div>
                <h3 className="font-semibold mb-2">Дэлгэрэнгүй</h3>
                <p className="text-sm text-muted-foreground">
                  {product.description_mn}
                </p>
              </div>

              {/* Stock Status */}
              {product.inventory_available !== null &&
                product.inventory_available > 0 &&
                product.inventory_available < 10 && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Хомс болж байна!</AlertTitle>
                    <AlertDescription>
                      Дөнгөж {product.inventory_available} ширхэг үлдсэн
                    </AlertDescription>
                  </Alert>
                )}

              {/* XP Cost */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Үнэ</span>
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-bold text-foreground">
                        {product.xp_cost.toLocaleString()}
                      </span>
                      <span className="text-xl text-amber-600">XP</span>
                    </div>
                  </div>

                  <Separator className="my-3" />

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Таны XP
                    </span>
                    <span className="text-xl font-semibold">
                      {userXP.toLocaleString()}
                    </span>
                  </div>

                  {!canAfford && (
                    <div className="mt-3 px-3 py-2 rounded-md bg-destructive/10 border border-destructive/20">
                      <span className="text-sm text-destructive">
                        Дутуу: {(product.xp_cost - userXP).toLocaleString()} XP
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Shipping Address Section (Physical Items Only) */}
              {needsShipping && !isLoadingAddress && (
                <div className="space-y-4">
                  {savedAddress ? (
                    <>
                      {/* Address Mode Selection */}
                      <RadioGroup value={addressMode} onValueChange={(value) => setAddressMode(value as "saved" | "new")}>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="saved" id="use-saved" />
                            <Label htmlFor="use-saved" className="cursor-pointer">
                              Хадгалсан хаяг ашиглах
                            </Label>
                          </div>
                          {addressMode === "saved" && (
                            <div className="ml-6 p-3 bg-muted/50 rounded-lg text-sm">
                              {savedAddress.fullName} · {savedAddress.phone}
                              <br />
                              {savedAddress.city && `${savedAddress.city}, `}
                              {savedAddress.district && `${savedAddress.district}, `}
                              {savedAddress.khoroo && `${savedAddress.khoroo}, `}
                              <br />
                              {savedAddress.addressLine}
                            </div>
                          )}

                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="new" id="enter-new" />
                            <Label htmlFor="enter-new" className="cursor-pointer">
                              Шинэ хаяг оруулах
                            </Label>
                          </div>
                        </div>
                      </RadioGroup>

                      {/* New Address Form */}
                      {addressMode === "new" && (
                        <div className="space-y-3">
                          <ShippingAddressForm
                            mode="inline"
                            onAddressChange={setNewAddress}
                            address={newAddress}
                          />
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="update-saved"
                              checked={saveForFuture}
                              onCheckedChange={(checked) => setSaveForFuture(checked as boolean)}
                            />
                            <Label htmlFor="update-saved" className="cursor-pointer text-sm">
                              Хадгалсан хаягаа шинэчлэх
                            </Label>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      {/* No Saved Address - Show Form */}
                      <ShippingAddressForm
                        mode="inline"
                        onAddressChange={setNewAddress}
                        address={newAddress}
                      />
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="save-for-future"
                          checked={saveForFuture}
                          onCheckedChange={(checked) => setSaveForFuture(checked as boolean)}
                        />
                        <Label htmlFor="save-for-future" className="cursor-pointer text-sm">
                          Дараа ашиглахаар хаягаа хадгалах
                        </Label>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Purchase Button */}
              <Button
                className="w-full text-lg py-6 cursor-pointer font-bold"
                disabled={isOutOfStock || !canAfford || userOwnsProduct || isPurchasing || isLoadingAddress}
                onClick={handlePurchaseClick}
              >
                {!canAfford
                  ? `${(product.xp_cost - userXP).toLocaleString()} XP дутуу байна`
                  : isOutOfStock
                  ? "Дууссан"
                  : userOwnsProduct
                  ? "Эзэмшсэн"
                  : isPurchasing
                  ? "Боловсруулж байна..."
                  : isLoadingAddress
                  ? "Ачааллаж байна..."
                  : `${product.xp_cost.toLocaleString()} XP-ээр худалдан авах`}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Худалдан авалтыг баталгаажуулах</AlertDialogTitle>
            <AlertDialogDescription>
              Та <strong>{product.name_mn}</strong>-г{" "}
              <strong>{product.xp_cost.toLocaleString()} XP</strong>-ээр
              худалдан авахдаа итгэлтэй байна уу?
            </AlertDialogDescription>
          </AlertDialogHeader>
          {currentAddress && (
            <div className="mt-2 p-3 bg-muted rounded-lg text-sm">
              <strong>Хүргэлтийн хаяг:</strong>
              <br />
              {currentAddress.fullName}
              <br />
              {currentAddress.phone}
              <br />
              {currentAddress.city && `${currentAddress.city}, `}
              {currentAddress.district && `${currentAddress.district}, `}
              {currentAddress.khoroo && `${currentAddress.khoroo}, `}
              <br />
              {currentAddress.addressLine}
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPurchasing}>
              Цуцлах
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmPurchase}
              disabled={isPurchasing}
            >
              {isPurchasing ? "Боловсруулж байна..." : "Баталгаажуулах"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
