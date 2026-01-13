"use client";

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);

  const supabase = createClient();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({
        type: "success",
        text: "Баталгаажуулах холбоосыг имэйлээс шалгана уу!",
      });
      setEmail("");
      setPassword("");
    }
    setLoading(false);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({ type: "success", text: "Амжилттай нэвтэрлээ!" });
      window.location.href = "/dashboard";
    }
    setLoading(false);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Нэвтрэх</CardTitle>
        <CardDescription>
          Бүртгэлдээ нэвтрэх эсвэл шинээр үүсгэх
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">И-мэйл</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="boldoo@gmail.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Нууц үг</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {message && (
            <div
              className={`p-3 rounded-md text-sm ${
                message.type === "error"
                  ? "bg-destructive/10 text-destructive border border-destructive/20"
                  : "bg-green-50 text-green-800 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30"
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="flex gap-3">
            <Button
              onClick={handleSignIn}
              disabled={loading}
              className="flex-1"
              type="button"
            >
              {loading ? "Уншиж байна..." : "Нэвтрэх"}
            </Button>

            <Button
              onClick={handleSignUp}
              disabled={loading}
              variant="secondary"
              className="flex-1"
              type="button"
            >
              {loading ? "Уншиж байна..." : "Бүртгүүлэх"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
