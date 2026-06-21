import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#edf7f6",
};

export const metadata: Metadata = {
  title: "Ashutosh Vijay | Smart Portfolio Engine",
  description: "AI-Powered Career Agent and System Fitment Matrix",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable}`}
      style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
    >
      <body className="bg-azure text-slate-900 antialiased selection:bg-baltic/20 selection:text-baltic">
        {children}
        <Analytics />
      </body>
    </html>
  );
}