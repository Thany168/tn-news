// app/layout.tsx
import { Noto_Sans_Khmer, Kantumruy_Pro } from "next/font/google";

import type { Metadata } from "next";
import "./globals.css";

const notoSansKhmer = Noto_Sans_Khmer({
  subsets: ["khmer", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-khmer",
  display: "swap",
});

const kantumruyPro = Kantumruy_Pro({
  subsets: ["khmer", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-heading",
  display: "swap",
});
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="km"
      className={`${notoSansKhmer.variable} ${kantumruyPro.variable}`}
    >
      <body className="font-sans">{children}</body>
    </html>
  );
}
