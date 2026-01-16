"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  uploadMockTestImage,
  getMockTestImageUrl,
  deleteMockTestImage,
} from "@/lib/storage/mock-test-image";

type ImageUploadFieldProps = {
  label: string;
  imageUrl: string | null;
  onChange: (url: string | null) => void;
  storagePath: string; // e.g., "problems/prob-123"
};

export const ImageUploadField = ({
  label,
  imageUrl,
  onChange,
  storagePath,
}: ImageUploadFieldProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Зургийн файл сонгоно уу");
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Зураг 5MB-аас бага байх ёстой");
      return;
    }

    setIsUploading(true);

    // Generate unique filename
    const ext = file.name.split(".").pop();
    const timestamp = Date.now();
    const filename = `${storagePath}-${timestamp}.${ext}`;

    const result = await uploadMockTestImage(file, filename);

    if (result) {
      onChange(filename); // Store storage path, not public URL
      toast.success("Зураг амжилттай орууллаа");
    } else {
      toast.error("Зураг оруулж чадсангүй");
    }

    setIsUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemove = async () => {
    if (imageUrl) {
      await deleteMockTestImage(imageUrl);
    }
    onChange(null);
    toast.success("Зураг устгалаа");
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">
        {label} <span className="text-gray-500 font-normal">(заавал биш)</span>
      </Label>

      {imageUrl ? (
        <div className="relative w-48 h-48 border rounded-lg overflow-hidden bg-gray-50">
          <Image
            src={getMockTestImageUrl(imageUrl)}
            alt={label}
            fill
            className="object-contain"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full sm:w-auto"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Оруулж байна...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Зураг оруулах
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};
