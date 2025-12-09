import Link from "next/link";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";

export const Footer = () => {
  return (
    <footer className="bg-primary text-white px-36">
      <div className="container mx-auto py-20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Image
            src="/company-logo-2.png"
            alt="logo"
            width={100}
            height={100}
          />

          <nav className="flex flex-wrap justify-center gap-6 font-semibold">
            <Link href="/courses" className="hover:underline">
              Сургалтууд
            </Link>
            <Link href="/guide" className="hover:underline">
              Заавар
            </Link>
            <Link href="/shop" className="hover:underline">
              Дэлгүүр
            </Link>
          </nav>

          <div className="flex gap-4">
            <Image
              src="/assets/facebook.svg"
              alt="facebook"
              width={24}
              height={24}
            />
            <Image
              src="/assets/instagram.svg"
              alt="facebook"
              width={24}
              height={24}
            />
            <Image
              src="/assets/youtube.svg"
              alt="facebook"
              width={24}
              height={24}
            />
          </div>
        </div>
      </div>

      <Separator className="bg-gray-300" />
      <div className="container mx-auto px-4 pt-10 pb-20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-small">
            © 2025 Expont Mind Solution ХХК. Бүх эрх хуулиар хамгаалагдсан.
          </div>

          {/* <div className="flex flex-wrap justify-center gap-6">
            <Link
              href="/privacy"
              className="text-small underline hover:no-underline"
            >
              Privacy policy
            </Link>
            <Link
              href="/terms"
              className="text-small underline hover:no-underline"
            >
              Terms of service
            </Link>
            <Link
              href="/cookies"
              className="text-small underline hover:no-underline"
            >
              Cookies settings
            </Link>
          </div> */}
        </div>
      </div>
    </footer>
  );
};
