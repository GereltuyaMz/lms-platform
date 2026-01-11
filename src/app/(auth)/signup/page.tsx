"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, type SignUpFormData } from "@/lib/validations";
import { signUpAction, signInWithGoogleAction } from "@/app/(auth)/actions";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { GoogleIcon } from "@/icons";

export default function SignUpPage() {
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormData) => {
    setServerError("");
    setSuccessMessage("");

    startTransition(async () => {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("password", data.password);

      const result = await signUpAction(formData);

      if (result?.error) {
        setServerError(result.error);
      } else if (result?.success) {
        if (result.message) {
          setSuccessMessage(result.message);
        } else {
          router.refresh();
          router.push("/onboarding");
        }
      }
    });
  };

  const handleGoogleSignIn = async () => {
    setServerError("");
    startTransition(async () => {
      const result = await signInWithGoogleAction();
      if (result?.error) {
        setServerError(result.error);
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute -top-20 -left-20 w-[400px] h-[400px] pointer-events-none">
        <Image
          src="/assets/auth/green-star.svg"
          alt=""
          fill
          className="object-contain"
          aria-hidden="true"
        />
      </div>
      <div className="absolute -bottom-32 -right-32 w-[550px] h-[550px] pointer-events-none">
        <Image
          src="/assets/auth/orange-blob.svg"
          alt=""
          fill
          className="object-contain"
          aria-hidden="true"
        />
      </div>

      {/* Main card container */}
      <div className="w-full max-w-[410px] p-6 border border-[#cac4d0] rounded-2xl bg-white flex flex-col gap-6 relative z-10">
        {/* Title section */}
        <div className="flex flex-col gap-1 items-center text-center">
          <h1 className="text-2xl font-semibold text-black font-[family-name:var(--font-nunito)]">
            Бүртгүүлэх
          </h1>
          <p className="text-sm text-[#737373] leading-5">
            Бүртгүүлээд өөрийн профайлыг үүсгээрэй.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          {serverError && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200">
              <p className="text-sm text-red-600">{serverError}</p>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-lg bg-green-50 border border-green-200">
              <p className="text-sm text-green-600">{successMessage}</p>
            </div>
          )}

          {/* Name field */}
          <div className="flex flex-col gap-3">
            <Label htmlFor="name" className="text-sm font-medium text-[#0a0a0a]">
              Таны хэн гэж дуудах уу?
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Нэрээ оруулна уу"
              className="h-12 px-3 py-3 rounded-lg border-[#e5e5e5] shadow-sm text-base placeholder:text-[#737373]"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Email field */}
          <div className="flex flex-col gap-3">
            <Label htmlFor="email" className="text-sm font-medium text-[#0a0a0a]">
              И-мэйл
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="boldoo@gmail.com"
              className="h-12 px-3 py-3 rounded-lg border-[#e5e5e5] shadow-sm text-base placeholder:text-[#737373]"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          {/* Password field */}
          <div className="flex flex-col gap-3">
            <Label htmlFor="password" className="text-sm font-medium text-[#0a0a0a]">
              Нууц үг
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Нууц үгээ үүсгээрэй"
              className="h-12 px-3 py-3 rounded-lg border-[#e5e5e5] shadow-sm text-base placeholder:text-[#737373]"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          {/* Submit button with 3D effect */}
          <Button
            type="submit"
            disabled={isPending}
            className="w-full h-[46px] rounded-lg bg-[#29cc57] hover:bg-[#24b84e] text-white font-bold text-base shadow-[0px_4px_0px_0px_#1f9941] hover:shadow-[0px_2px_0px_0px_#1f9941] hover:translate-y-[2px] active:shadow-none active:translate-y-1 transition-all disabled:opacity-50 font-[family-name:var(--font-nunito)]"
          >
            {isPending ? "Үүсгэж байна..." : "Профайл үүсгэх"}
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-1">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#cac4d0]" />
          <span className="text-base text-[#737373] px-2 font-[family-name:var(--font-nunito)]">
            Эсвэл
          </span>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#cac4d0]" />
        </div>

        {/* Google sign-in button with 3D effect */}
        <Button
          type="button"
          variant="outline"
          disabled={isPending}
          onClick={handleGoogleSignIn}
          className="w-full h-[46px] rounded-lg border-[#e5e5e5] bg-white hover:bg-gray-50 shadow-[0px_4px_0px_0px_#e5e5e5] hover:shadow-[0px_2px_0px_0px_#e5e5e5] hover:translate-y-[2px] active:shadow-none active:translate-y-1 transition-all disabled:opacity-50 font-bold text-base text-black font-[family-name:var(--font-nunito)]"
        >
          <GoogleIcon fill="#29cc57" width={20} height={20} />
          Continue with Google
        </Button>

        {/* Sign in link */}
        <div className="flex items-center justify-center gap-2">
          <span className="text-base text-[#737373] font-[family-name:var(--font-nunito)]">
            Та бүртгэлтэй бол ?
          </span>
          <Link
            href="/signin"
            className="text-sm text-[#29cc57] font-medium underline underline-offset-2 hover:no-underline"
          >
            Нэвтрэх
          </Link>
        </div>
      </div>
    </div>
  );
}
