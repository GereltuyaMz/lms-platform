"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { updateUserProfile } from "@/lib/actions";
import { uploadAvatar } from "@/lib/storage/avatar-upload";
import { getUserShippingAddress, saveShippingAddress } from "@/lib/actions/shipping-address-actions";
import { createClient } from "@/lib/supabase/client";
import { ShippingAddressForm } from "@/components/shop/ShippingAddressForm";
import type { ShippingAddress } from "@/types/shop";
import { toast } from "sonner";
import { Upload, Loader2, Package } from "lucide-react";

type ProfileTabProps = {
  username: string;
  email: string;
  avatarUrl: string;
  dateOfBirth?: string;
  phoneNumber?: string;
  learningGoals?: string;
};

export const ProfileTab = ({
  username: initialUsername,
  email,
  avatarUrl: initialAvatarUrl,
  dateOfBirth: initialDateOfBirth = "",
  phoneNumber: initialPhoneNumber = "",
  learningGoals: initialLearningGoals = "",
}: ProfileTabProps) => {
  const [username, setUsername] = useState(initialUsername);
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl);
  const [dateOfBirth, setDateOfBirth] = useState(initialDateOfBirth);
  const [phoneNumber, setPhoneNumber] = useState(initialPhoneNumber);
  const [learningGoals, setLearningGoals] = useState(initialLearningGoals);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress | null>(null);
  const [isLoadingAddress, setIsLoadingAddress] = useState(true);

  // Load shipping address on mount
  useEffect(() => {
    getUserShippingAddress()
      .then((address) => setShippingAddress(address))
      .finally(() => setIsLoadingAddress(false));
  }, []);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const loadingToast = toast.loading("Зураг байршуулж байна...");

    try {
      // Get user ID from Supabase client
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error("Нэвтрэх шаардлагатай", { id: loadingToast });
        return;
      }

      // Upload to Supabase Storage
      const result = await uploadAvatar(file, user.id);

      if (result.success && result.avatarUrl) {
        setAvatarUrl(result.avatarUrl);
        toast.success("Зураг амжилттай байршлаа!", { id: loadingToast });
      } else {
        toast.error(result.error || "Зураг байршуулахад алдаа гарлаа", {
          id: loadingToast,
        });
      }
    } catch {
      toast.error("Алдаа гарлаа. Дахин оролдоно уу.", { id: loadingToast });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const result = await updateUserProfile({
        fullName: username,
        avatarUrl,
        dateOfBirth,
        phoneNumber,
        learningGoals,
      });

      if (result.success) {
        // Check if XP was awarded (updateUserProfile already calls checkAndAwardProfileCompletionXP)
        if (result.xpAwarded && result.xpAwarded > 0) {
          toast.success(`🎉 +${result.xpAwarded} XP`, {
            description: "Профайл бөглөгдсөн!",
            duration: 5000,
          });
        } else {
          toast.success("Профайл амжилттай шинэчлэгдлээ!");
        }
      } else {
        toast.error(result.message || "Профайл шинэчлэхэд алдаа гарлаа");
      }
    } catch {
      toast.error("Алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAddress = async (address: ShippingAddress) => {
    const result = await saveShippingAddress(address);
    if (result.success) {
      toast.success(result.message);
      setShippingAddress(result.address || address);
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold mb-6">Профайл тохиргоо</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Avatar Section */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Профайл зураг</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <Avatar className="w-32 h-32 bg-emerald-500">
              {avatarUrl ? (
                <AvatarImage src={avatarUrl} alt={username} />
              ) : (
                <AvatarFallback className="bg-emerald-500 text-white text-4xl">
                  {getInitials(username)}
                </AvatarFallback>
              )}
            </Avatar>

            <Label
              htmlFor="avatar-upload"
              className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2 border border-input rounded-md transition-colors ${
                isUploading
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer hover:bg-accent hover:text-white"
              }`}
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Байршуулж байна...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Зураг байршуулах
                </>
              )}
            </Label>
            <Input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
              disabled={isUploading}
            />
            <p className="text-xs text-muted-foreground text-center">
              JPG, PNG, GIF, WEBP. Хамгийн ихдээ 2MB.
            </p>
          </CardContent>
        </Card>

        {/* Profile Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Хувийн мэдээлэл</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username">Хэрэглэгчийн нэр</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Хэрэглэгчийн нэрээ оруулна уу"
                />
              </div>

              {/* Email (read-only) */}
              <div className="space-y-2">
                <Label htmlFor="email">Имэйл</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  disabled
                  className="bg-gray-50"
                />
                <p className="text-xs text-muted-foreground">
                  Имэйл хаягийг өөрчлөх боломжгүй
                </p>
              </div>

              {/* Date of Birth */}
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Төрсөн огноо</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  max={new Date().toISOString().split("T")[0]}
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Утасны дугаар</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Жишээ: 99119911"
                />
              </div>

              {/* Learning Goals */}
              <div className="space-y-2">
                <Label htmlFor="learningGoals">Суралцах зорилго</Label>
                <Textarea
                  id="learningGoals"
                  value={learningGoals}
                  onChange={(e) => setLearningGoals(e.target.value)}
                  placeholder="Жишээ: Математикийн мэдлэгээ сайжруулах, Программчлал сурах, Англи хэл дээршүүлэх&#10;&#10;(Таслалаар тусгаарлана уу)"
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  Таслал (,) эсвэл шинэ мөрөөр тусгаарлана уу •{" "}
                  {learningGoals.length} / 500 тэмдэгт
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="cursor-pointer hover:text-white"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Хадгалж байна...
                    </>
                  ) : (
                    "Xадгалах"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setUsername(initialUsername);
                    setAvatarUrl(initialAvatarUrl);
                    setDateOfBirth(initialDateOfBirth);
                    setPhoneNumber(initialPhoneNumber);
                    setLearningGoals(initialLearningGoals);
                  }}
                  className="cursor-pointer"
                >
                  Цуцлах
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Shipping Address Section */}
      <Card className="mt-6">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-muted-foreground" />
            <div>
              <CardTitle>Хүргэлтийн хаяг</CardTitle>
              <CardDescription>
                XP дэлгүүрээс физик бараа захиалах үед ашиглагдана
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingAddress ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <ShippingAddressForm
              mode="profile"
              address={shippingAddress}
              onSave={handleSaveAddress}
            />
          )}
        </CardContent>
      </Card>

      {/* Account Stats */}
      {/* <Card className="mt-6">
        <CardHeader>
          <CardTitle>Хэрэглэгчийн статистик</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold">0</p>
              <p className="text-sm text-muted-foreground">Элссэн хичээл</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold">0</p>
              <p className="text-sm text-muted-foreground">Дууссан хичээл</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold">0ц</p>
              <p className="text-sm text-muted-foreground">Суралцсан цаг</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold">0</p>
              <p className="text-sm text-muted-foreground">Сертификат</p>
            </div>
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
};
