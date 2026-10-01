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

// Critical text colors as inline styles — these travel with the HTML
// and cannot be broken by network-level CSS modification or caching.
const criticalStyles = `
  .text-white { color: #ffffff !important; }
  .text-zinc-50 { color: #fafafa !important; }
  .text-zinc-100 { color: #f4f4f5 !important; }
  .text-zinc-200 { color: #e4e4e7 !important; }
  .text-zinc-300 { color: #d4d4d8 !important; }
  .text-zinc-400 { color: #a1a1aa !important; }
  .text-gold-400 { color: #F59E0B !important; }
  .text-gold-500 { color: #D97706 !important; }
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <style dangerouslySetInnerHTML={{ __html: criticalStyles }} />
      </head>
      <body className="bg-ink-950 text-zinc-100 font-sans antialiased min-h-screen overflow-x-clip">
        <Navbar />
        <main className="min-h-[80vh]">{children}</main>
        <CartDrawer />
        <ChatWidget />
      </body>
    </html>
  );
}
