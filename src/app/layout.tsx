import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import Script from "next/script";
import "../styles/globals.css";
import "lenis/dist/lenis.css";
import { Toaster } from "sonner";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "ExpontMind - LMS Platform",
  description: "Learn and grow with ExpontMind",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <head>
        <Script
          src="https://assets.mediadelivery.net/playerjs/playerjs-latest.min.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className={`${nunito.variable} antialiased`}>
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
