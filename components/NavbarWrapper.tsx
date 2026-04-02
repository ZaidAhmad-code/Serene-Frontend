// components/NavbarWrapper.tsx
"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/landingpage/Navbar";

const HIDDEN_PATHS = ["/application", "/login", "/register"];

export default function NavbarWrapper() {
  const pathname = usePathname();
  if (HIDDEN_PATHS.some((p) => pathname.startsWith(p))) return null;
  return <Navbar />;
}
