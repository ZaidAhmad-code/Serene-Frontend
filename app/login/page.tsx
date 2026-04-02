"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";

function BrandIcon({ size = 36 }: { size?: number }) {
  return (
    <span
      className="rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-700 flex items-center justify-center shadow-lg shrink-0"
      style={{ width: size, height: size }}
    >
      <svg
        width={size * 0.48}
        height={size * 0.48}
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
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-[11px] font-medium tracking-widest uppercase text-emerald-700 mb-1.5">
      {children}
    </label>
  );
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white text-sm text-stone-800 placeholder:text-stone-300 outline-none transition-all duration-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
    />
  );
}

export default function SignInPage() {
  const router = useRouter();
  const { login, user } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    if (user) router.push("/application");
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await login(username, password);
      if (!res.success) setError(res.message || "Invalid credentials");
      else router.push("/application");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* ══════════════════════════════
          LEFT — photo + overlay + copy
          ══════════════════════════════ */}
      <div className="hidden lg:flex relative w-[52%] flex-col overflow-hidden">

        {/* Background photo */}
        <Image
          src="/login.jpg"
          alt="Serene"
          fill
          className="object-cover object-center"
          priority
        />

        {/* Gradient overlay — heavier at top and bottom, lightest in middle */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/70 z-10" />

        {/* Content */}
        <div className="relative z-20 h-full flex flex-col justify-between p-14">

          {/* Brand */}
          <div className="flex items-center gap-3">
            <BrandIcon size={38} />
            <span
              className="text-white text-xl tracking-tight"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              Serene
            </span>
          </div>

          {/* Headline */}
          <div>
            <h1
              className="text-white leading-[1.1] tracking-tight mb-5"
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "clamp(38px, 3.8vw, 54px)",
              }}
            >
              A gentle space<br />
              for your{" "}
              <em className="not-italic text-emerald-300">mind</em>
              <br />
              to breathe.
            </h1>
            <p className="text-white/70 text-[15px] font-light leading-relaxed max-w-xs">
              AI-guided support that meets you where you are — no judgment, just presence.
            </p>
          </div>

          {/* Pull quote — glassmorphism card */}
          <div
            className="border-l-2 border-emerald-400/50 pl-5 pr-6 py-4 rounded-r-2xl backdrop-blur-md"
            style={{ background: "rgba(255,255,255,0.09)", borderColor: "rgba(74,222,128,0.45)" }}
          >
            <p className="text-white/80 text-[13px] italic leading-relaxed">
              "Taking the first step to talk about how you feel is already a form of healing."
            </p>
            <cite className="not-italic text-white/40 text-[11px] tracking-widest uppercase mt-2 block">
              — Serene Care Team
            </cite>
          </div>

        </div>
      </div>

      {/* ══════════════════════════════
          RIGHT — clean white form
          ══════════════════════════════ */}
      <div className="flex-1 flex items-center justify-center bg-white px-6 py-12 overflow-y-auto relative">
        <div className="w-full max-w-[380px]">

          {/* Mobile brand — only visible below lg */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <BrandIcon size={32} />
            <span
              className="text-stone-800 text-lg"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              Serene
            </span>
          </div>

          {/* Heading */}
          <h2
            className="text-[32px] text-stone-900 tracking-tight leading-tight mb-1"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            Welcome back
          </h2>
          <p className="text-sm text-stone-400 font-light mb-8">
            Sign in to continue your journey.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            {/* Username */}
            <div>
              <FieldLabel>Username</FieldLabel>
              <TextInput
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="your_username"
                autoComplete="username"
              />
            </div>

            {/* Password */}
            <div>
              <FieldLabel>Password</FieldLabel>
              <TextInput
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            {/* Error banner */}
            {error && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed text-white text-[15px] font-medium shadow-[0_4px_20px_rgba(22,163,74,0.25)] hover:shadow-[0_6px_24px_rgba(22,163,74,0.35)] transition-all duration-200 flex items-center justify-center gap-2"
            >
              {loading && (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              {loading ? "Signing in…" : "Sign In"}
            </button>

          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <hr className="flex-1 border-stone-100" />
            <span className="text-xs text-stone-300">or</span>
            <hr className="flex-1 border-stone-100" />
          </div>

          {/* Switch */}
          <p className="text-center text-sm text-stone-400">
            Don't have an account?{" "}
            <Link href="/register" className="text-emerald-600 font-medium hover:underline">
              Create one free
            </Link>
          </p>

        </div>

        {/* Footer */}
        <p className="absolute bottom-5 left-0 right-0 text-center text-[11px] text-stone-300">
          By continuing you agree to our{" "}
          <Link href="/privacy" className="underline hover:text-stone-500 transition-colors">
            privacy policy
          </Link>
          {" & "}
          <Link href="/terms" className="underline hover:text-stone-500 transition-colors">
            terms of service
          </Link>
          .
        </p>
      </div>

    </div>
  );
}