"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { updatePasswordAction } from "@/app/(auth)/actions";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Нууц үг хамгийн багадаа 6 тэмдэгт байх ёстой"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Нууц үг таарахгүй байна",
    path: ["confirmPassword"],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    setServerError("");
    setSuccessMessage("");

    startTransition(async () => {
      const formData = new FormData();
      formData.append("password", data.password);
      formData.append("confirmPassword", data.confirmPassword);

      const result = await updatePasswordAction(formData);

      if (result?.error) {
        setServerError(result.error);
      } else if (result?.success) {
        setSuccessMessage("Нууц үг амжилттай солигдлоо!");
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
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
            Шинэ нууц үг
          </h1>
          <p className="text-sm text-[#737373] leading-5">
            Шинэ нууц үгээ оруулна уу
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

          {/* New Password field */}
          <div className="flex flex-col gap-3">
            <Label htmlFor="password" className="text-sm font-medium text-[#0a0a0a]">
              Шинэ нууц үг
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Шинэ нууц үгээ оруулна уу"
              className="h-12 px-3 py-3 rounded-lg border-[#e5e5e5] shadow-sm text-base placeholder:text-[#737373]"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password field */}
          <div className="flex flex-col gap-3">
            <Label htmlFor="confirmPassword" className="text-sm font-medium text-[#0a0a0a]">
              Нууц үг баталгаажуулах
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Нууц үгээ дахин оруулна уу"
              className="h-12 px-3 py-3 rounded-lg border-[#e5e5e5] shadow-sm text-base placeholder:text-[#737373]"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Submit button with 3D effect */}
          <Button
            type="submit"
            disabled={isPending}
            className="w-full h-[46px] rounded-lg bg-[#29cc57] hover:bg-[#24b84e] text-white font-bold text-base shadow-[0px_4px_0px_0px_#1f9941] hover:shadow-[0px_2px_0px_0px_#1f9941] hover:translate-y-[2px] active:shadow-none active:translate-y-1 transition-all disabled:opacity-50 font-[family-name:var(--font-nunito)]"
          >
            {isPending ? "Хадгалж байна..." : "Нууц үг солих"}
          </Button>
        </form>
      </div>
    </div>
  );
}
