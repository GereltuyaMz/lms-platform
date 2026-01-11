"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
import {
  CameraIcon,
  SpinnerGapIcon,
  UserIcon,
  CalendarIcon,
  PhoneIcon,
  TargetIcon,
  MapPinIcon,
} from "@phosphor-icons/react";

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
          toast.success(`+${result.xpAwarded} XP`, {
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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Профайл тохиргоо</h2>
        <p className="text-sm text-gray-500 mt-1">
          Хувийн мэдээллээ шинэчилж, профайлаа бүрэн бөглөнө үү
        </p>
      </div>

      {/* Avatar Section Card */}
      <Card className="rounded-2xl border-0 overflow-hidden bg-[var(--dashboard-tab-active)]">
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            {/* Avatar with upload overlay */}
            <div className="relative group">
              <Avatar className="w-24 h-24 ring-4 ring-white shadow-lg">
                {avatarUrl ? (
                  <AvatarImage src={avatarUrl} alt={username} />
                ) : (
                  <AvatarFallback className="bg-[var(--dashboard-text-active)] text-white text-2xl font-semibold">
                    {getInitials(username)}
                  </AvatarFallback>
                )}
              </Avatar>

              {/* Upload overlay */}
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute inset-0 rounded-full flex items-center justify-center
                  bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer
                  ${isUploading ? "opacity-100 cursor-wait" : ""}
                `}
              >
                {isUploading ? (
                  <SpinnerGapIcon size={28} className="text-white animate-spin" />
                ) : (
                  <CameraIcon size={28} className="text-white" />
                )}
              </label>
              <Input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
                disabled={isUploading}
              />
            </div>

            {/* User info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-gray-900 truncate">{username}</h3>
              <p className="text-sm text-[var(--dashboard-text-primary)]">{email}</p>
              <p className="text-xs text-gray-500 mt-2">
                JPG, PNG, GIF, WEBP. Хамгийн ихдээ 2MB.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Form */}
      <Card className="rounded-2xl">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username" className="flex items-center gap-2 text-gray-700">
                <span className="w-8 h-8 rounded-full bg-[var(--dashboard-icon-bg)] flex items-center justify-center">
                  <UserIcon size={16} className="text-[var(--dashboard-text-active)]" />
                </span>
                Хэрэглэгчийн нэр
              </Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Хэрэглэгчийн нэрээ оруулна уу"
                className="rounded-xl border-gray-200 focus:border-[var(--dashboard-text-active)] focus:ring-[var(--dashboard-text-active)]"
              />
            </div>

            {/* Email (read-only) */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">
                Имэйл
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                disabled
                className="rounded-xl bg-gray-50 border-gray-200"
              />
              <p className="text-xs text-gray-400">
                Имэйл хаягийг өөрчлөх боломжгүй
              </p>
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth" className="flex items-center gap-2 text-gray-700">
                <span className="w-8 h-8 rounded-full bg-[var(--dashboard-icon-bg)] flex items-center justify-center">
                  <CalendarIcon size={16} className="text-[var(--dashboard-text-active)]" />
                </span>
                Төрсөн огноо
              </Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                max={new Date().toISOString().split("T")[0]}
                className="rounded-xl border-gray-200 focus:border-[var(--dashboard-text-active)] focus:ring-[var(--dashboard-text-active)]"
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="flex items-center gap-2 text-gray-700">
                <span className="w-8 h-8 rounded-full bg-[var(--dashboard-icon-bg)] flex items-center justify-center">
                  <PhoneIcon size={16} className="text-[var(--dashboard-text-active)]" />
                </span>
                Утасны дугаар
              </Label>
              <Input
                id="phoneNumber"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Жишээ: 99119911"
                className="rounded-xl border-gray-200 focus:border-[var(--dashboard-text-active)] focus:ring-[var(--dashboard-text-active)]"
              />
            </div>

            {/* Learning Goals */}
            <div className="space-y-2">
              <Label htmlFor="learningGoals" className="flex items-center gap-2 text-gray-700">
                <span className="w-8 h-8 rounded-full bg-[var(--dashboard-icon-bg)] flex items-center justify-center">
                  <TargetIcon size={16} className="text-[var(--dashboard-text-active)]" />
                </span>
                Суралцах зорилго
              </Label>
              <Textarea
                id="learningGoals"
                value={learningGoals}
                onChange={(e) => setLearningGoals(e.target.value)}
                placeholder="Жишээ: Математикийн мэдлэгээ сайжруулах, Программчлал сурах, Англи хэл дээршүүлэх&#10;&#10;(Таслалаар тусгаарлана уу)"
                rows={4}
                className="rounded-xl border-gray-200 focus:border-[var(--dashboard-text-active)] focus:ring-[var(--dashboard-text-active)] resize-none"
              />
              <p className="text-xs text-gray-400">
                Таслал (,) эсвэл шинэ мөрөөр тусгаарлана уу • {learningGoals.length} / 500 тэмдэгт
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                type="submit"
                disabled={isSaving}
                className="rounded-xl font-semibold bg-[#29CC57] hover:bg-[#16A34A] shadow-[0_4px_0_0_#16A34A] transition-all active:translate-y-[2px] active:shadow-[0_2px_0_0_#16A34A]"
              >
                {isSaving ? (
                  <>
                    <SpinnerGapIcon className="mr-2 h-4 w-4 animate-spin" />
                    Хадгалж байна...
                  </>
                ) : (
                  "Хадгалах"
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
                className="rounded-xl border-gray-200"
              >
                Цуцлах
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Shipping Address Section */}
      <Card className="rounded-2xl">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-5">
            <span className="w-10 h-10 rounded-full bg-[var(--dashboard-icon-bg)] flex items-center justify-center">
              <MapPinIcon size={20} className="text-[var(--dashboard-text-active)]" />
            </span>
            <div>
              <h3 className="font-semibold text-gray-900">Хүргэлтийн хаяг</h3>
              <p className="text-sm text-gray-500">
                XP дэлгүүрээс физик бараа захиалах үед ашиглагдана
              </p>
            </div>
          </div>

          {isLoadingAddress ? (
            <div className="flex items-center justify-center py-8">
              <SpinnerGapIcon className="w-6 h-6 animate-spin text-[var(--dashboard-text-active)]" />
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
    </div>
  );
};
