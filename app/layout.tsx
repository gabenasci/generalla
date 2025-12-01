import type { Metadata } from "next";
import { Cinzel, Inter } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Generalla - Valhalla Dice Game",
  description: "A Norse-themed Generala dice game score tracker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="valhalla">
      <body className={`${cinzel.variable} ${inter.variable} font-sans antialiased min-h-screen bg-base-100`}>
        {children}
      </body>
    </html>
  );
}
