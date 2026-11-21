import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans_Thai } from "next/font/google";
import { StoreGate } from "@/components/layout";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const plexThai = IBM_Plex_Sans_Thai({
  variable: "--font-sans",
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: { default: "FDE Shop", template: "%s | FDE Shop" },
  description: "ช้อปออนไลน์ ของแท้ ส่งไว พร้อมโค้ดส่วนลดจากร้านค้า",
};

export const viewport: Viewport = {
  themeColor: "#ee4d2d",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="th" className={`${plexThai.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <StoreGate>{children}</StoreGate>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
