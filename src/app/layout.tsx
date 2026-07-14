import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";
import { ensureSeedData } from "@/lib/db-service";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "CHARIS Power Ministry - Prayer Broadcast System",
  description:
    "Automated Daily Telegram Voice Chat Prayer Broadcast System for CHARIS Power Ministry",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Ensure default data exists
  await ensureSeedData().catch(() => {
    // DB may not be ready during build; that's okay
  });

  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-slate-50 text-slate-800 antialiased min-h-screen font-sans">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="lg:pl-64">
          <main className="min-h-screen pb-12">{children}</main>
        </div>
      </body>
    </html>
  );
}
