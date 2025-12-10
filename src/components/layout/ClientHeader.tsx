"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";
import { Button } from "../ui/button";
import { useState, useEffect } from "react";
import { UserNav } from "./UserNav";
import type { User } from "@supabase/supabase-js";

type ClientHeaderProps = {
  initialUser: User | null;
};

export const ClientHeader = ({ initialUser }: ClientHeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const homeLink = initialUser ? "/dashboard" : "/";

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

  // Keep heights in sync with Tailwind sizes:
  // not-scrolled => h-24 (6rem) ; scrolled => h-16 (4rem)
  // spacer below header uses same values so page content is pushed below header.
  const headerHeightClass = isScrolled ? "h-20" : "h-24";
  const headerPaddingClass = isScrolled ? "py-0" : "py-0"; // padding moved into height control

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${headerHeightClass} ${headerPaddingClass}
          ${
            isScrolled
              ? "bg-white/95 backdrop-blur-sm shadow-sm"
              : "bg-transparent"
          }
        `}
      >
        <nav className="max-w-[1600px] mx-auto flex justify-between items-center px-4 h-full">
          <div className="flex items-center gap-8">
            <Link href={homeLink}>
              <Image src="/edu-logo.png" alt="logo" width={50} height={50} />
            </Link>

            <ul className="hidden md:flex gap-6">
              <li>
                <Link
                  href="/courses"
                  className="transition-colors duration-200 hover:text-primary"
                >
                  Сургалтууд
                </Link>
              </li>
              <li>
                <Link
                  href="/guide"
                  className="transition-colors duration-200 hover:text-primary"
                >
                  Заавар
                </Link>
              </li>
              <li>
                <Link
                  href="/shop"
                  className="transition-colors duration-200 hover:text-primary"
                >
                  Дэлгүүр
                </Link>
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
                    className="rounded-3xl font-bold cursor-pointer hover:text-white"
                  >
                    Нэвтрэх
                  </Button>
                </Link>

                <div
                  className={`transition-all duration-300 ease-in-out ${
                    isScrolled ? "opacity-100" : "opacity-0 pointer-events-none"
                  }`}
                >
                  <Link href="/signup">
                    <Button
                      size="lg"
                      className="rounded-3xl font-bold bg-primary hover:bg-primary/90 cursor-pointer uppercase"
                    >
                      Эхлэх
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

      {/* Spacer to prevent content from being hidden under fixed header.
          Matches header heights used above (h-24 when not scrolled, h-16 when scrolled). */}
      <div
        aria-hidden
        className={`transition-all duration-300 ease-in-out ${headerHeightClass}`}
      />
    </>
  );
};
