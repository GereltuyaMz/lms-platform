"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "../ui/button";
import { UserNav } from "./UserNav";
import type { User } from "@supabase/supabase-js";

type ClientHeaderProps = {
  initialUser: User | null;
};

// Active link theme (green)
const activeTheme = {
  bg: "rgba(41,204,87,0.04)",
  border: "#aaeebd",
  hoverBg: "rgba(41,204,87,0.08)",
};

export const ClientHeader = ({ initialUser }: ClientHeaderProps) => {
  const homeLink = initialUser ? "/dashboard" : "/";
  const pathname = usePathname();

  // Helper function to get link styles and inline styles based on active state
  const getLinkProps = (href: string) => {
    const isActive = pathname.startsWith(href);

    if (isActive) {
      return {
        className: "px-3 py-3 rounded-lg border text-[#1a1a1a] text-base transition-colors cursor-pointer",
        style: {
          backgroundColor: activeTheme.bg,
          borderColor: activeTheme.border,
        } as React.CSSProperties,
      };
    }

    return {
      className: "px-3 py-3 rounded-lg text-[#1a1a1a] text-base hover:bg-[rgba(0,0,0,0.04)] transition-colors cursor-pointer",
      style: undefined,
    };
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-[0px_4px_33px_-10px_rgba(0,0,0,0.08)]">
        <nav className="max-w-[1512px] mx-auto flex justify-between items-center px-8 lg:px-[120px] py-3 h-20">
          <div className="flex items-center">
            <Link href={homeLink} className="shrink-0">
              <Image
                src="/edu-logo.png"
                alt="logo"
                width={50}
                height={56}
                className="h-14 w-auto"
              />
            </Link>
          </div>

          <ul className="hidden lg:flex gap-3 items-center">
            <li>
              <Link
                href="/courses"
                {...getLinkProps("/courses")}
              >
                Сургалтууд
              </Link>
            </li>
            <li>
              <Link
                href="/mock-test"
                {...getLinkProps("/mock-test")}
              >
                ЭЕШ Тест
              </Link>
            </li>
            <li>
              <Link
                href="/guide"
                {...getLinkProps("/guide")}
              >
                Заавар
              </Link>
            </li>
            <li>
              <Link
                href="/shop"
                {...getLinkProps("/shop")}
              >
                Дэлгүүр
              </Link>
            </li>
          </ul>

          <div className="hidden lg:flex items-center gap-3">
            {initialUser ? (
              <UserNav user={initialUser} />
            ) : (
              <>
                <Link href="/signin">
                  <Button
                    variant="outline"
                    className="px-6 py-3 rounded-lg border-[#ccc] text-[#1a1a1a] text-base font-normal hover:bg-gray-50 cursor-pointer"
                  >
                    Нэвтрэх
                  </Button>
                </Link>

                <Link href="/signup">
                  <Button
                    className="px-6 py-3 rounded-lg bg-[#29cc57] text-white text-base font-normal hover:bg-[#24b34d] cursor-pointer"
                  >
                    Эхлэх
                  </Button>
                </Link>
              </>
            )}
          </div>

          <Button variant="outline" size="icon" className="lg:hidden cursor-pointer">
            <Menu />
          </Button>
        </nav>
      </header>

      <div aria-hidden className="h-20" />
    </>
  );
};
