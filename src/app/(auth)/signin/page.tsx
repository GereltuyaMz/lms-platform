"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema, type SignInFormData } from "@/lib/validations";
import { signInWithGoogleAction, signInAction } from "@/app/(auth)/actions";
import { useState, useTransition } from "react";

export default function SignInPage() {
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInFormData) => {
    setServerError("");

    startTransition(async () => {
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("password", data.password);

      const result = await signInAction(formData);

      if (result?.error) {
        setServerError(result.error);
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
        <Image src="/assets/log-in.png" alt="login" width={206} height={142} />
        <h1 className="text-h1 font-bold text-foreground text-center">Login</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-10/12">
          {serverError && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200">
              <p className="text-sm text-red-600">{serverError}</p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="sr-only">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Email"
              className="h-14 rounded-lg border-gray-300"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="sr-only">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Password"
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
            className="w-full h-12 rounded-3xl bg-primary hover:bg-primary/90 text-white font-medium disabled:opacity-50"
          >
            <p className="text-medium">
              {isPending ? "Signing in..." : "Sign in"}
            </p>
          </Button>
        </form>

        <Button
          type="button"
          variant="outline"
          disabled={isPending}
          onClick={handleGoogleSignIn}
          className="w-10/12 h-12 rounded-lg border-gray-300 hover:bg-gray-50 disabled:opacity-50"
        >
          <Image src="/assets/google.svg" alt="Google" width={32} height={32} />
        </Button>

        <div className="text-center">
          <p className="text-small text-muted-foreground">
            New User?
            <Link
              href="/signup"
              className="text-primary underline hover:no-underline font-medium"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
