"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export const Footer = () => {
  const pathname = usePathname();
  const isLearnPage = pathname.includes("/learn/");
  const isMockTestTakePage =
    pathname.includes("/mock-test") && pathname.includes("/take");

  if (isLearnPage || isMockTestTakePage) return null;

  return (
    <footer className="bg-[#1a1a1a] text-white">
      <div className="max-w-[1512px] mx-auto px-8 lg:px-[120px] py-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row items-center justify-between border-b border-[rgba(255,255,255,0.2)] pb-4 pt-2 gap-4">
            <div className="flex gap-3 items-center">
              <Link
                href="#"
                className="bg-[#333] p-2 rounded-full hover:bg-[#444] transition-colors cursor-pointer"
              >
                <Image
                  src="/assets/facebook.svg"
                  alt="Facebook"
                  width={24}
                  height={24}
                />
              </Link>
              <Link
                href="#"
                className="bg-[#333] p-2 rounded-full hover:bg-[#444] transition-colors cursor-pointer"
              >
                <Image
                  src="/assets/instagram.svg"
                  alt="Instagram"
                  width={24}
                  height={24}
                />
              </Link>
              <Link
                href="#"
                className="bg-[#333] p-2 rounded-full hover:bg-[#444] transition-colors cursor-pointer"
              >
                <Image
                  src="/assets/youtube.svg"
                  alt="YouTube"
                  width={24}
                  height={24}
                />
              </Link>
            </div>

            <nav className="flex flex-wrap justify-center gap-2">
              <Link
                href="/courses"
                className="px-3 py-3 rounded-lg text-white text-sm hover:bg-[rgba(255,255,255,0.1)] transition-colors cursor-pointer"
              >
                Сургалтууд
              </Link>
              <Link
                href="/mock-test"
                className="px-3 py-3 rounded-lg text-white text-sm hover:bg-[rgba(255,255,255,0.1)] transition-colors cursor-pointer"
              >
                ЭЕШ Тест
              </Link>
              <Link
                href="/guide"
                className="px-3 py-3 rounded-lg text-white text-sm hover:bg-[rgba(255,255,255,0.1)] transition-colors cursor-pointer"
              >
                Заавар
              </Link>
              <Link
                href="/shop"
                className="px-3 py-3 rounded-lg text-white text-sm hover:bg-[rgba(255,255,255,0.1)] transition-colors cursor-pointer"
              >
                Дэлгүүр
              </Link>
            </nav>
          </div>

          <div className="flex items-center justify-center py-2.5">
            <Link
              href="https://expontmind.com"
              className="text-[#9e9e9e] text-xs hover:text-white transition-colors cursor-pointer"
            >
              © 2025 Expont Mind Solution ХХК. Бүх эрх хуулиар хамгаалагдсан.
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
