import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "../styles/globals.css";
import "lenis/dist/lenis.css";
import { Toaster } from "sonner";
import { Footer, Header } from "@/components/layout";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "ExpondMind - LMS Platform",
  description: "Learn and grow with ExpondMind",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${nunito.variable} antialiased`}>
        <Header />
        {children}
        <Footer />
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
