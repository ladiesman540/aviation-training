import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { MobileNav } from "@/components/MobileNav";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-body",
});
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "SkyTrail | PSTAR Exam Prep",
  description: "PSTAR exam preparation for Canadian student pilots",
  other: {
    "viewport": "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
    "theme-color": "#060809",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${jetbrains.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#060809" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="bg-bg-deep">
        <div className="app-scroll-container bg-bg-deep text-[#e8ecf0]">
          <div className="bg-grid fixed inset-0 pointer-events-none z-0" aria-hidden />
          <div className="bg-noise fixed inset-0 pointer-events-none z-0" aria-hidden />

          <header className="relative z-10 border-b border-[#1e252d] bg-bg-deep/85 backdrop-blur-md">
            <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
              <Link href="/" className="flex items-center gap-2">
                <span className="text-accent-green text-lg">◈</span>
                <span className="font-display font-semibold tracking-widest text-xs">
                  SKYTRAIL
                </span>
              </Link>

              {/* Desktop nav */}
              <nav className="hidden md:flex gap-1">
                <Link href="/hop" className="px-3 py-1.5 text-sm text-[#8b949e] hover:text-[#e8ecf0] rounded hover:bg-accent-green/5 transition">
                  Fly
                </Link>
                <Link href="/progress" className="px-3 py-1.5 text-sm text-[#8b949e] hover:text-[#e8ecf0] rounded hover:bg-accent-green/5 transition">
                  Progress
                </Link>
                <Link href="/sim" className="px-3 py-1.5 text-sm text-[#8b949e] hover:text-[#e8ecf0] rounded hover:bg-accent-green/5 transition">
                  Exam
                </Link>
                <Link href="/bank" className="px-3 py-1.5 text-sm text-[#8b949e] hover:text-[#e8ecf0] rounded hover:bg-accent-green/5 transition">
                  Bank
                </Link>
              </nav>

              {/* Mobile nav */}
              <MobileNav />
            </div>
          </header>

          <main className="relative z-[1] pb-24">{children}</main>
        </div>
      </body>
    </html>
  );
}
