import type { Metadata } from "next";
import { Fraunces, Outfit } from "next/font/google";
import { Header, BottomNav } from "@/components/nav";
import "./globals.css";

const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", axes: ["SOFT", "opsz"] });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "Laoka — Lisitry ny laoka Malagasy",
  description: "Tehirizo, kajio ary safidio ireo laoka Malagasy tianao indrindra.",
  icons: { icon: "/icon.svg", apple: "/icon.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="mg" className={`${fraunces.variable} ${outfit.variable}`}>
      <body className="min-h-dvh antialiased">
        <Header />
        <main className="mx-auto max-w-6xl px-4 pb-28 sm:px-6 md:pb-16">{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}
