"use client";

import * as React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { ShippingAddress } from "@/types/shop";

type ShippingAddressFormProps = {
  mode?: "inline" | "profile";
  address?: ShippingAddress | null;
  onAddressChange?: (address: ShippingAddress | null) => void;
  onSave?: (address: ShippingAddress) => Promise<void>;
};

export const ShippingAddressForm = ({
  mode = "inline",
  address,
  onAddressChange,
  onSave,
}: ShippingAddressFormProps) => {
  const [formData, setFormData] = React.useState<ShippingAddress>({
    fullName: address?.fullName || "",
    phone: address?.phone || "",
    city: address?.city || "",
    district: address?.district || "",
    khoroo: address?.khoroo || "",
    addressLine: address?.addressLine || "",
  });
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    if (address) {
      setFormData({
        fullName: address.fullName || "",
        phone: address.phone || "",
        city: address.city || "",
        district: address.district || "",
        khoroo: address.khoroo || "",
        addressLine: address.addressLine || "",
      });
    }
  }, [address]);

  const handleChange = (field: keyof ShippingAddress, value: string) => {
    const newAddress = {
      ...formData,
      [field]: value,
    };

    setFormData(newAddress);

    // For inline mode, call onAddressChange in real-time
    if (mode === "inline" && onAddressChange) {
      const isValid =
        newAddress.fullName.trim() &&
        newAddress.phone.trim() &&
        newAddress.addressLine.trim();

      onAddressChange(isValid ? newAddress : null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // For profile mode only
    if (mode === "profile" && onSave) {
      // Validate required fields
      if (
        !formData.fullName.trim() ||
        !formData.phone.trim() ||
        !formData.addressLine.trim()
      ) {
        return;
      }

      setIsSaving(true);
      try {
        await onSave(formData);
      } finally {
        setIsSaving(false);
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={mode === "inline" ? "space-y-4 border rounded-lg p-4 bg-muted/50" : "space-y-4"}
    >
      {mode === "inline" && <h3 className="font-semibold text-sm">Хүргэлтийн хаяг</h3>}

      <div className="space-y-4">
        <div>
          <Label htmlFor="fullName">
            Бүтэн нэр <span className="text-red-500">*</span>
          </Label>
          <Input
            id="fullName"
            placeholder="Нэрээ оруулна уу"
            value={formData.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="phone">
            Утасны дугаар <span className="text-red-500">*</span>
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="99119911"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="city">Хот</Label>
            <Input
              id="city"
              placeholder="Улаанбаатар"
              value={formData.city}
              onChange={(e) => handleChange("city", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="district">Дүүрэг</Label>
            <Input
              id="district"
              placeholder="Сүхбаатар"
              value={formData.district}
              onChange={(e) => handleChange("district", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="khoroo">Хороо</Label>
            <Input
              id="khoroo"
              placeholder="1-р хороо"
              value={formData.khoroo}
              onChange={(e) => handleChange("khoroo", e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="addressLine">
            Дэлгэрэнгүй хаяг <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="addressLine"
            placeholder="Байр, тоот, давхар, орц..."
            rows={3}
            value={formData.addressLine}
            onChange={(e) => handleChange("addressLine", e.target.value)}
            required
          />
        </div>
      </div>

      {mode === "inline" && (
        <p className="text-xs text-muted-foreground">
          <span className="text-red-500">*</span> Заавал бөглөх талбар
        </p>
      )}

      {mode === "profile" && (
        <Button
          type="submit"
          disabled={
            isSaving ||
            !formData.fullName.trim() ||
            !formData.phone.trim() ||
            !formData.addressLine.trim()
          }
          className="cursor-pointer"
        >
          {isSaving ? "Хадгалж байна..." : "Хаяг хадгалах"}
        </Button>
      )}
    </form>
  );
};
