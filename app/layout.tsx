import type { Metadata } from "next";
import { Anton, Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

const anton = Anton({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Elevate Creative Media | We Make You Unmissable",
  description:
    "Elevate Creative Media is a creative agency built for brands that refuse to blend in. Strategy, content, and growth that get you seen.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${anton.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-black text-white font-sans">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
