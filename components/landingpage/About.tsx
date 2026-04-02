"use client";

import { useRef, useState, useEffect } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useTransform,
  animate,
  AnimatePresence,
} from "framer-motion";

// ─── Data ────────────────────────────────────────────────────

const STATS = [
  { value: 50000, suffix: "+", label: "People supported" },
  { value: 4.9,   suffix: "★", label: "Average rating",    decimal: true },
  { value: 24,    suffix: "/7", label: "Always available" },
  { value: 100,   suffix: "%", label: "Private by design" },
];

const PRINCIPLES = [
  {
    number: "01",
    title: "We never sell your data",
    body: "Your conversations are not a product. They are not analysed for advertising, shared with third parties, or used to profile you. Full stop.",
  },
  {
    number: "02",
    title: "We complement, not replace",
    body: "Serene is a supportive companion — not a substitute for professional mental healthcare. We always encourage you to reach out to licensed professionals when needed.",
  },
  {
    number: "03",
    title: "We are evidence-informed",
    body: "Every technique in Serene — breathing exercises, grounding, journalling prompts — is grounded in established therapeutic research, not invented by an algorithm.",
  },
  {
    number: "04",
    title: "We design for safety",
    body: "Crisis resources are never buried. Emergency contacts surface in one tap. We have a zero-tolerance policy for content that could cause harm.",
  },
];

const MANIFESTO_WORDS =
  "Mental health support should be available to everyone — not just those who can afford it, not just those who live near a clinic, not just those who aren't afraid to ask.".split(
    " "
  );

const TRUST = [
  "No ads. Ever.",
  "No data sold.",
  "No dark patterns.",
  "No waitlists.",
  "No judgment.",
  "No hidden costs.",
];

// ─── Animated counter ────────────────────────────────────────

function Counter({
  to,
  decimal,
  suffix,
}: {
  to: number;
  decimal?: boolean;
  suffix: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const motionVal = useMotionValue(0);

  useEffect(() => {
    if (!inView) return;
    const ctrl = animate(motionVal, to, {
      duration: decimal ? 1.2 : 1.8,
      ease: [0.22, 1, 0.36, 1],
    });
    return ctrl.stop;
  }, [inView, to, decimal, motionVal]);

  const [display, setDisplay] = useState("0");
  useEffect(() => {
    return motionVal.on("change", (v) => {
      setDisplay(decimal ? v.toFixed(1) : Math.floor(v).toLocaleString());
    });
  }, [motionVal, decimal]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

// ─── Tilt card ───────────────────────────────────────────────

function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotX = useTransform(y, [-60, 60], [4, -4]);
  const rotY = useTransform(x, [-60, 60], [-4, 4]);

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };

  const reset = () => {
    animate(x, 0, { duration: 0.5, ease: [0.22, 1, 0.36, 1] });
    animate(y, 0, { duration: 0.5, ease: [0.22, 1, 0.36, 1] });
  };

  return (
    <motion.div
      ref={ref}
      style={{ rotateX: rotX, rotateY: rotY, transformPerspective: 800 }}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Manifesto word-by-word reveal ───────────────────────────

function ManifestoWord({ word, index }: { word: string; index: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0.15, y: 6 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.45,
        delay: (index % 12) * 0.04,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="inline-block mr-[0.28em]"
    >
      {word}
    </motion.span>
  );
}

// ─── Principle row ───────────────────────────────────────────

function PrincipleRow({
  item,
  index,
}: {
  item: (typeof PRINCIPLES)[0];
  index: number;
}) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{
        duration: 0.55,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group border-b border-stone-100 py-7 cursor-default"
    >
      <div className="flex items-start gap-6">
        {/* Number */}
        <motion.span
          animate={{ color: hovered ? "#1c1917" : "#d6d3d1" }}
          transition={{ duration: 0.2 }}
          className="shrink-0 text-[11px] font-semibold tabular-nums pt-0.5 w-6"
        >
          {item.number}
        </motion.span>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <motion.h4
              animate={{ x: hovered ? 4 : 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="text-[15px] font-semibold text-stone-800 tracking-tight"
            >
              {item.title}
            </motion.h4>
            {/* Arrow that slides in */}
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : -8 }}
              transition={{ duration: 0.2 }}
              className="text-stone-400 text-sm"
            >
              →
            </motion.span>
          </div>
          <AnimatePresence>
            {hovered && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="text-[13px] text-stone-400 leading-relaxed overflow-hidden"
              >
                {item.body}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main component ──────────────────────────────────────────

export default function About() {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-80px" });

  return (
    <section id="about" className="w-full bg-white px-6 py-28 md:py-40">
      <div className="max-w-5xl mx-auto">

        {/* ── TOP: asymmetric editorial header ── */}
        <motion.div
          ref={headerRef}
          className="grid md:grid-cols-[1fr_auto] gap-10 md:gap-20 items-end mb-24 md:mb-32"
        >
          {/* Left: big statement */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={headerInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="text-[11px] font-semibold tracking-[0.22em] text-stone-400 uppercase mb-5"
            >
              About Serene
            </motion.p>

            <div className="overflow-hidden">
              <motion.h2
                initial={{ y: "105%" }}
                animate={headerInView ? { y: "0%" } : {}}
                transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                className="text-[2.6rem] md:text-[3.75rem] font-semibold text-stone-900 leading-[1.08] tracking-tight"
                style={{ fontFamily: "'DM Serif Display', serif" }}
              >
                Built for the moments
                <br />
                <span className="text-stone-300">no one sees.</span>
              </motion.h2>
            </div>
          </div>

          {/* Right: compact origin note */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="text-[13.5px] text-stone-400 leading-relaxed max-w-[240px] md:text-right md:pb-2"
          >
            Serene was created because mental health support felt too expensive, too distant, and too slow. We wanted something available at 3am without a waiting list.
          </motion.p>
        </motion.div>

        {/* ── STATS row ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-stone-100 border border-stone-100 rounded-2xl overflow-hidden mb-24 md:mb-32">
          {STATS.map((s, i) => (
            <TiltCard key={i} className="bg-white px-7 py-8 group cursor-default">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Big number */}
                <p
                  className="text-[2.4rem] font-semibold text-stone-900 leading-none tracking-tight mb-2 tabular-nums"
                  style={{ fontFamily: "'DM Serif Display', serif" }}
                >
                  <Counter to={s.value} decimal={s.decimal} suffix={s.suffix} />
                </p>
                {/* Label */}
                <p className="text-[12px] text-stone-400 font-medium leading-snug">
                  {s.label}
                </p>
                {/* Hover underline */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  className="mt-4 h-px bg-stone-900 origin-left"
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            </TiltCard>
          ))}
        </div>

        {/* ── MANIFESTO quote — word-by-word ── */}
        <div className="border-t border-stone-100 pt-20 mb-20 md:mb-28">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-[11px] font-semibold tracking-[0.22em] text-stone-300 uppercase mb-8"
          >
            Our Belief
          </motion.p>
          <p
            className="text-[1.6rem] md:text-[2.1rem] font-semibold text-stone-900 leading-[1.3] tracking-tight max-w-3xl"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            {MANIFESTO_WORDS.map((word, i) => (
              <ManifestoWord key={i} word={word} index={i} />
            ))}
          </p>
        </div>

        {/* ── PRINCIPLES accordion ── */}
        <div className="grid md:grid-cols-[1fr_1.2fr] gap-16 md:gap-24 mb-24 md:mb-32">
          {/* Left: label */}
          <div className="md:pt-7">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="text-[11px] font-semibold tracking-[0.22em] text-stone-400 uppercase mb-5"
            >
              Our Commitments
            </motion.p>
            <motion.h3
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="text-[1.6rem] font-semibold text-stone-900 leading-tight tracking-tight"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              Hover each principle to read more.
            </motion.h3>
            {/* Decorative vertical rule */}
            <motion.div
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8 w-px h-16 bg-stone-200 origin-top hidden md:block"
            />
          </div>

          {/* Right: principles */}
          <div className="border-t border-stone-100">
            {PRINCIPLES.map((item, i) => (
              <PrincipleRow key={i} item={item} index={i} />
            ))}
          </div>
        </div>

        {/* ── TRUST strip ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="border border-stone-100 rounded-2xl px-8 py-6 flex flex-wrap gap-x-8 gap-y-3 items-center justify-center bg-stone-50"
        >
          {TRUST.map((item, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.06 }}
              className="text-[12px] font-medium text-stone-500 tracking-wide cursor-default select-none"
            >
              {item}
            </motion.span>
          ))}
        </motion.div>

        {/* ── CTA strip ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-20 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-stone-100 pt-12"
        >
          <p
            className="text-[1.3rem] font-semibold text-stone-900 tracking-tight"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            Ready to feel a little lighter?
          </p>
          <motion.a
            href="/register"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-stone-900 text-white text-[14px] font-medium tracking-tight hover:bg-stone-700 transition-colors duration-200 shadow-[0_4px_20px_rgba(0,0,0,0.12)]"
          >
            Start for free
            <motion.span
              animate={{ x: [0, 3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              →
            </motion.span>
          </motion.a>
        </motion.div>

      </div>
    </section>
  );
}