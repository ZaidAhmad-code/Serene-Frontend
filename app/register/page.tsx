"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";

const FEATURES = [
  {
    icon: "🌿",
    title: "Always available",
    desc: "Support at 2am or 2pm — Serene never sleeps.",
  },
  {
    icon: "🔒",
    title: "Private by design",
    desc: "Your conversations are yours. We never share or sell data.",
  },
  {
    icon: "💚",
    title: "Judgment-free",
    desc: "A compassionate space built for every kind of person.",
  },
];

const STRENGTH_LABEL = ["", "Weak", "Fair", "Good", "Strong"];
const STRENGTH_COLOR = [
  "",
  "text-red-400",
  "text-amber-400",
  "text-lime-400",
  "text-emerald-500",
];
const STRENGTH_BAR = [
  "",
  "bg-red-400",
  "bg-amber-400",
  "bg-lime-400",
  "bg-emerald-500",
];

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
      className="w-full px-4 py-3 rounded-xl  border border-stone-200 bg-white text-sm text-stone-800 placeholder:text-stone-300 outline-none transition-all duration-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
    />
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const { register, user } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const strength = (() => {
    if (!password) return 0;
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  })();

  useEffect(() => {
    if (user) router.push("/application");
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (strength < 2) {
      setError("Please choose a stronger password.");
      return;
    }
    setLoading(true);
    try {
      const res = await register(username, email, password);
      if (!res.success) setError(res.message || "Registration failed.");
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
          src="/signup.jpg"
          alt="Serene"
          fill
          className="object-cover object-center"
          priority
        />

        {/* Gradient overlay — heavier at bottom so feature pills stay legible */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/75 z-10" />

        {/* Text content */}
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
                fontSize: "clamp(38px,3.8vw,54px)",
              }}
            >
              Your journey
              <br />
              to <em className="not-italic text-emerald-300">clarity</em>
              <br />
              starts here.
            </h1>
            <p className="text-white/70 text-[15px] font-light leading-relaxed max-w-xs">
              Join thousands of people who have found a gentler way to navigate
              life's challenges.
            </p>
          </div>

          {/* Feature pills — glassmorphism on photo */}
          <div className="flex flex-col gap-3">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="flex items-start gap-4 px-5 py-4 rounded-2xl border border-white/20 backdrop-blur-md"
                style={{ background: "rgba(255,255,255,0.09)" }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-base shrink-0"
                  style={{ background: "rgba(255,255,255,0.15)" }}
                >
                  {f.icon}
                </div>
                <div>
                  <p className="text-white text-[13px] font-medium mb-0.5">
                    {f.title}
                  </p>
                  <p className="text-white/55 text-xs leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════
          RIGHT — form
          ══════════════════════════════ */}
      <div className="flex-1 flex items-center justify-center bg-white px-6 py-12 overflow-y-auto relative">
        <div className="w-full max-w-[420px]">
          {/* Mobile brand */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <BrandIcon size={32} />
            <span
              className="text-stone-800 text-lg"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              Serene
            </span>
          </div>

          {/* Page heading */}
          <h2
            className="text-[32px] text-stone-900 tracking-tight leading-tight mb-1"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            Create your account
          </h2>
          <p className="text-sm text-stone-400 font-light mb-8">
            Free forever. No credit card required.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Username + Email — 2-col grid */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <FieldLabel>Username</FieldLabel>
                <TextInput
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="your_name"
                  autoComplete="username"
                />
              </div>
              <div>
                <FieldLabel>Email</FieldLabel>
                <TextInput
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password + strength bar */}
            <div>
              <FieldLabel>Password</FieldLabel>
              <TextInput
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 8 characters"
                autoComplete="new-password"
              />
              {password && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-[3px] flex-1 rounded-full transition-colors duration-300 ${
                          i <= strength
                            ? STRENGTH_BAR[strength]
                            : "bg-emerald-100"
                        }`}
                      />
                    ))}
                  </div>
                  <span className={`text-[11px] ${STRENGTH_COLOR[strength]}`}>
                    {STRENGTH_LABEL[strength]}
                  </span>
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <FieldLabel>Confirm Password</FieldLabel>
              <TextInput
                required
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
              />
              {confirm && (
                <span
                  className={`text-[11px] mt-1 block ${confirm === password ? "text-emerald-500" : "text-red-400"}`}
                >
                  {confirm === password
                    ? "✓ Passwords match"
                    : "✗ Passwords do not match"}
                </span>
              )}
            </div>

            {/* Error banner */}
            {error && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
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
              className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed text-white text-[15px] font-medium shadow-[0_4px_20px_rgba(22,163,74,0.3)] hover:shadow-[0_6px_24px_rgba(22,163,74,0.4)] transition-all duration-200 flex items-center justify-center gap-2"
            >
              {loading && (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              {loading ? "Creating account…" : "Create Free Account"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <hr className="flex-1 border-stone-100" />
            <span className="text-xs text-stone-300">already a member?</span>
            <hr className="flex-1 border-stone-100" />
          </div>

          <p className="text-center text-sm">
            <Link
              href="/login"
              className="text-emerald-600 font-medium hover:underline"
            >
              Sign in to your account →
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="absolute bottom-5 left-0 right-0 text-center text-[11px] text-stone-300">
          By registering you agree to our{" "}
          <Link
            href="/privacy"
            className="underline hover:text-stone-500 transition-colors"
          >
            privacy policy
          </Link>
          {" & "}
          <Link
            href="/terms"
            className="underline hover:text-stone-500 transition-colors"
          >
            terms of service
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
