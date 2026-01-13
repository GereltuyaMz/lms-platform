"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOutAction } from "@/app/(auth)/actions";
import { LogOut, User as UserIcon } from "lucide-react";
import { useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type User = {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
};

type UserNavProps = {
  user: User;
};

export const UserNav = ({ user }: UserNavProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSignOut = () => {
    startTransition(async () => {
      const result = await signOutAction();
      if (result?.success) {
        router.refresh();
        router.push("/");
      }
    });
  };

  const getInitials = () => {
    if (user.user_metadata?.full_name) {
      return user.user_metadata.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return user.email?.slice(0, 2).toUpperCase() || "U";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none">
        <Avatar className="h-10 w-10 cursor-pointer hover:opacity-80 transition-opacity ring-2 ring-[#29cc57]/20 hover:ring-[#29cc57]/40">
          <AvatarImage
            src={user.user_metadata?.avatar_url}
            alt={user.user_metadata?.full_name || "User"}
          />
          <AvatarFallback className="bg-[#29cc57] text-white font-semibold">
            {getInitials()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-60 rounded-xl p-2 shadow-[0_4px_20px_rgba(0,0,0,0.12)] border border-gray-100"
      >
        <DropdownMenuLabel className="px-3 py-3">
          <div className="flex flex-col space-y-1">
            <p className="text-base font-semibold text-[#1a1a1a]">
              {user.user_metadata?.full_name || "User"}
            </p>
            <p className="text-sm text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-100 my-1" />
        <DropdownMenuItem
          asChild
          className="rounded-lg px-3 py-2.5 cursor-pointer transition-colors data-[highlighted]:bg-[#29cc57] data-[highlighted]:text-white focus:bg-[#29cc57] focus:text-white"
        >
          <Link href="/dashboard" className="flex items-center">
            <UserIcon className="mr-2 h-4 w-4" />
            <span className="font-medium">Профайл</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleSignOut}
          disabled={isPending}
          className="rounded-lg px-3 py-2.5 cursor-pointer transition-colors text-red-600 data-[highlighted]:bg-red-50 data-[highlighted]:text-red-600 focus:bg-red-50 focus:text-red-600"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span className="font-medium">{isPending ? "Гарч байна…" : "Гарах"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
