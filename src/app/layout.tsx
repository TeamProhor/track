import type { Metadata } from "next";
import { Hind_Siliguri } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const hindSiliguri = Hind_Siliguri({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["bengali"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "প্রহর ট্র্যাক | ওয়েবসাইটের পরিবর্তন পর্যবেক্ষণ করুন",
  description: "ওয়েবসাইটের উপাদান পরিবর্তন ট্র্যাকিং ও পর্যবেক্ষণ প্লাটফর্ম।",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="bn"
      className={cn(
        "h-full",
        "antialiased",
        hindSiliguri.className,
        hindSiliguri.variable,
        "font-sans",
      )}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
