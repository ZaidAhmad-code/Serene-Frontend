"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Techniques", href: "#techniques" },
  { label: "About", href: "#about" },
];

// How many px the user must scroll before we react — prevents flicker on tiny jitters
const SCROLL_THRESHOLD = 8;
// Navbar is ~56px tall + 20px top offset
const NAVBAR_TRANSLATE = "-90px";

export default function Navbar() {
  const [visible, setVisible] = useState(true); // show or hide
  const [isScrolled, setIsScrolled] = useState(false); // glass intensity
  const [menuOpen, setMenuOpen] = useState(false);

  const lastScrollY = useRef(0); // previous scroll position
  const ticking = useRef(false); // rAF guard — prevents scroll handler thrash

  const pathname = useRef(usePathname());
  const prevPathname = useRef(pathname.current);
  const currentPath = usePathname();

  // ── Close mobile menu on route change (ESLint-safe ref guard) ──
  useEffect(() => {
    if (prevPathname.current !== currentPath) {
      prevPathname.current = currentPath;
      setMenuOpen(false);
    }
  }, [currentPath]);

  // ── Smart scroll: hide on down, reveal on up ──
  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return;

      ticking.current = true;
      requestAnimationFrame(() => {
        const currentY = window.scrollY;
        const delta = currentY - lastScrollY.current;

        // Always show navbar when near the top of the page
        if (currentY < 60) {
          setVisible(true);
          setIsScrolled(false);
          lastScrollY.current = currentY;
          ticking.current = false;
          return;
        }

        setIsScrolled(true);

        // Only react if scroll delta exceeds threshold — kills micro-jitter
        if (Math.abs(delta) > SCROLL_THRESHOLD) {
          if (delta > 0) {
            // ── Scrolling DOWN → hide ──
            setVisible(false);
            // Also close mobile menu so it doesn't hang open invisibly
            setMenuOpen(false);
          } else {
            // ── Scrolling UP → show ──
            setVisible(true);
          }
          lastScrollY.current = currentY;
        }

        ticking.current = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Derived: where mobile dropdown should sit ──
  // When navbar hides, dropdown hides with it (translate inherits from parent wrapper)
  const dropdownTop = visible ? "top-[76px]" : "top-[76px]";

  return (
    <>
      {/*
        ── Outer wrapper handles the hide/show translate ──
        Using translateY on the WRAPPER (not the nav itself) means
        the mobile dropdown moves with it for free.
        transition-transform is GPU-composited — no layout reflow.
      */}
      <div
        className="fixed inset-x-0 z-50 flex flex-col items-center pointer-events-none"
        style={{
          top: "20px",
          transform: visible
            ? "translateY(0)"
            : `translateY(${NAVBAR_TRANSLATE})`,
          transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {/* ── Floating Nav Pill ── */}
        <nav
          className={[
            "pointer-events-auto",
            "flex items-center justify-between gap-6 px-4 py-2.5",
            "w-full max-w-3xl mx-4 rounded-2xl",
            "border border-white/70",
            "transition-[background,box-shadow,backdrop-filter] duration-500 ease-out",
            isScrolled
              ? "bg-white/60 backdrop-blur-2xl backdrop-saturate-[1.8] shadow-[0_12px_48px_rgba(0,0,0,0.11),inset_0_1px_0_rgba(255,255,255,0.9)]"
              : "bg-white/35 backdrop-blur-xl backdrop-saturate-150 shadow-[0_4px_24px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.8)]",
          ].join(" ")}
          style={{ WebkitBackdropFilter: "blur(20px) saturate(180%)" }}
        >
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 shrink-0 text-stone-800 font-semibold text-[15px] tracking-tight hover:opacity-70 transition-opacity duration-200"
          >
            <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-700 flex items-center justify-center shadow-sm">
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" />
                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
              </svg>
            </span>
            Serene
          </Link>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-0.5 flex-1 justify-center">
            {NAV_LINKS.map(({ label, href }) => (
              <li key={label}>
                <Link
                  href={href}
                  className="px-3.5 py-1.5 rounded-xl text-[13px] font-medium text-stone-500 hover:text-stone-900 hover:bg-white/70 transition-all duration-200"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            <Link
              href="/login"
              className="px-3.5 py-1.5 rounded-xl text-[13px] font-medium text-stone-600 border border-stone-200/90 hover:bg-white/70 hover:text-stone-900 transition-all duration-200"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-3.5 py-1.5 rounded-xl text-[13px] font-semibold text-white bg-stone-900 hover:bg-stone-700 shadow-sm transition-all duration-200"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen((p) => !p)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-[5px] rounded-xl hover:bg-white/60 transition-colors duration-200 shrink-0"
          >
            {(
              [
                menuOpen ? "rotate-45 translate-y-[6.5px]" : "",
                menuOpen ? "opacity-0 scale-x-0" : "",
                menuOpen ? "-rotate-45 -translate-y-[6.5px]" : "",
              ] as string[]
            ).map((extra, i) => (
              <span
                key={i}
                className={`block h-[1.5px] w-4 bg-stone-800 rounded-full transition-all duration-300 origin-center ${extra}`}
              />
            ))}
          </button>
        </nav>

        {/* ── Mobile Dropdown — rides with parent translate ── */}
        <div
          className={[
            "pointer-events-none w-full max-w-3xl px-4 mt-2",
            "transition-all duration-300 ease-out",
            menuOpen
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 -translate-y-2",
          ].join(" ")}
        >
          <div
            className="w-full rounded-2xl px-3 py-3 flex flex-col gap-1 bg-white/70 backdrop-blur-2xl backdrop-saturate-[1.8] border border-white/70 shadow-[0_16px_48px_rgba(0,0,0,0.1)]"
            style={{ WebkitBackdropFilter: "blur(20px) saturate(180%)" }}
          >
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="py-2.5 px-3 text-[13px] font-medium text-stone-600 hover:text-stone-900 hover:bg-white/70 rounded-xl transition-colors duration-200"
              >
                {label}
              </Link>
            ))}
            <div className="mt-1 pt-2 border-t border-stone-100/80 flex flex-col gap-1.5">
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="w-full text-center py-2 rounded-xl text-[13px] font-medium text-stone-700 border border-stone-200/80 hover:bg-white/70 transition-colors duration-200"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                onClick={() => setMenuOpen(false)}
                className="w-full text-center py-2 rounded-xl text-[13px] font-semibold text-white bg-stone-900 hover:bg-stone-700 transition-colors duration-200"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
