"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
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
          router.refresh(); // Force Next.js to update server-side auth state
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
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-lg space-y-8 flex flex-col items-center justify-center">
        <h1 className="text-h1 font-bold text-foreground text-center">
          Профайл үүсгэх
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-10/12">
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

          <div className="space-y-2">
            <Label htmlFor="name" className="sr-only">
              Нэр
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Нэр"
              className="h-14 rounded-lg border-gray-300"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="sr-only">
              Имэйл
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Имэйл"
              className="h-14 rounded-lg border-gray-300"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="sr-only">
              Нууц үг
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Нууц үг"
              className="h-14 rounded-lg border-gray-300"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full h-12 rounded-3xl bg-primary hover:bg-primary/90 text-white font-medium disabled:opacity-50 cursor-pointer"
          >
            <p className="text-medium">
              {isPending ? "Үүсгэж байна..." : "Бүртгүүлэх"}
            </p>
          </Button>
        </form>

        <Button
          type="button"
          variant="outline"
          disabled={isPending}
          onClick={handleGoogleSignIn}
          className="w-10/12 h-12 rounded-lg border-gray-300 hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
        >
          <GoogleIcon fill="#10b981" width={32} height={32} />
        </Button>

        <div className="text-center">
          <p className="text-small text-muted-foreground">
            Бүртгэлтэй юу?{" "}
            <Link
              href="/signin"
              className="text-primary underline hover:no-underline font-medium"
            >
              Нэвтрэх
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
