// app/layout.tsx
//
// ✅ FIX: Navbar must be inside <body>, NOT a sibling/child of <html>.
//    Placing any <div> directly inside <html> causes:
//    "In HTML, <div> cannot be a child of <html>" hydration error.
//
//    The rule: <html> can only contain <head> and <body>.
//    Everything visible goes inside <body>.

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/landingpage/Navbar";
import NavbarWrapper from "@/components/NavbarWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Serene — AI Mental Health Companion",
  description: "Your mind deserves gentle support, anytime.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
       
        <NavbarWrapper />

 
        <main>{children}</main>
      </body>
    </html>
  );
}