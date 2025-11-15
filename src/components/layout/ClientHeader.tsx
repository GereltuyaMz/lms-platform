"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronDown, Menu } from "lucide-react";
import { Button } from "../ui/button";
import { useState, useEffect } from "react";
import { UserNav } from "./UserNav";
import type { User } from "@supabase/supabase-js";

type ClientHeaderProps = {
  initialUser: User | null;
};

export const ClientHeader = ({ initialUser }: ClientHeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollTop = window.scrollY;
          setIsScrolled(scrollTop > 50);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`py-6 px-2 transition-all duration-500 ease-in-out ${
        isScrolled
          ? "fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm w-full"
          : "relative max-w-[1600px] mx-auto"
      }`}
    >
      <nav
        className={`flex justify-between items-center ${
          isScrolled ? "max-w-[1600px] mx-auto" : ""
        }`}
      >
        <div className="flex items-center gap-8">
          <Link href="/">
            <Image
              src="/company-logo.png"
              alt="logo"
              width={100}
              height={100}
            />
          </Link>
          <ul className="hidden md:flex gap-6">
            <li>
              <Link href="/courses">Courses</Link>
            </li>
            <li>
              <Link href="/guide">Guide</Link>
            </li>
            <li>
              <Link href="/shop">Shop</Link>
            </li>
          </ul>
        </div>
        <div className="hidden md:flex items-center gap-4">
          {initialUser ? (
            <UserNav user={initialUser} />
          ) : (
            <>
              <Link href="/signin">
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-3xl font-bold cursor-pointer"
                >
                  Sign In
                </Button>
              </Link>
              <div
                className={`transition-all duration-300 ease-in-out ${
                  isScrolled
                    ? "opacity-100 transform"
                    : "opacity-0 transform pointer-events-none"
                }`}
              >
                <Link href="/signup">
                  <Button
                    size="lg"
                    className="rounded-3xl font-bold bg-primary hover:bg-primary/90 cursor-pointer"
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu />
        </Button>
      </nav>
    </header>
  );
};
