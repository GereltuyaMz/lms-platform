"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { resetPasswordAction } from "@/app/(auth)/actions";
import { useState, useTransition } from "react";

const forgotPasswordSchema = z.object({
  email: z.string().email("Зөв имэйл хаяг оруулна уу"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setServerError("");
    setSuccessMessage("");

    startTransition(async () => {
      const formData = new FormData();
      formData.append("email", data.email);

      const result = await resetPasswordAction(formData);

      if (result?.error) {
        setServerError(result.error);
      } else if (result?.success) {
        setSuccessMessage(result.message || "Имэйл илгээгдлээ!");
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
            Нууц үг сэргээх
          </h1>
          <p className="text-sm text-[#737373] leading-5">
            Бүртгэлтэй имэйл хаягаа оруулна уу
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

          {/* Submit button with 3D effect */}
          <Button
            type="submit"
            disabled={isPending}
            className="w-full h-[46px] rounded-lg bg-[#29cc57] hover:bg-[#24b84e] text-white font-bold text-base shadow-[0px_4px_0px_0px_#1f9941] hover:shadow-[0px_2px_0px_0px_#1f9941] hover:translate-y-[2px] active:shadow-none active:translate-y-1 transition-all disabled:opacity-50 font-[family-name:var(--font-nunito)]"
          >
            {isPending ? "Илгээж байна..." : "Холбоос илгээх"}
          </Button>
        </form>

        {/* Back to sign in link */}
        <div className="flex items-center justify-center gap-2">
          <Link
            href="/signin"
            className="text-sm text-[#29cc57] font-medium underline underline-offset-2 hover:no-underline"
          >
            ← Нэвтрэх хуудас руу буцах
          </Link>
        </div>
      </div>
    </div>
  );
}
