import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import ChatWidget from "@/components/ChatWidget";

export const metadata: Metadata = {
  title: "Shery Cafe — Taste, Vibe & Entertainment",
  description:
    "Premium cafe & lounge: gourmet food, specialty coffee, sheesha lounge and gaming arena. Order online, reserve tables, play.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-ink-950 text-zinc-100 font-sans antialiased min-h-screen">
        <Navbar />
        <main className="min-h-[80vh]">{children}</main>
        <CartDrawer />
        <ChatWidget />
      </body>
    </html>
  );
}
