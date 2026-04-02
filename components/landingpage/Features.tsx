"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  Wind,
  BarChart2,
  Moon,
  Phone,
  Lock,
} from "lucide-react";

// ─── Data ───────────────────────────────────────────────────
const FEATURES = [
  {
    icon: MessageCircle,
    label: "Empathetic Conversations",
    summary: "Listens without judgment, responds with care.",
    detail:
      "Share freely and receive thoughtful, compassionate responses that feel genuinely human — available any hour, any day.",
  },
  {
    icon: Wind,
    label: "Guided Wellness Exercises",
    summary: "Box breathing, grounding, muscle relaxation.",
    detail:
      "Serene walks you through calming techniques in real time — not just instructions, but a gentle voice when you need it most.",
  },
  {
    icon: BarChart2,
    label: "Mood Tracking & Assessments",
    summary: "Understand your emotional patterns over time.",
    detail:
      "Gentle daily check-ins and evidence-based assessments reveal the rhythms behind how you feel, so nothing sneaks up on you.",
  },
  {
    icon: Moon,
    label: "Sleep & Rest Support",
    summary: "Wind-down routines and sleep hygiene tools.",
    detail:
      "Struggling to quiet your mind at night? Serene offers bedtime rituals, relaxation exercises, and personalised sleep guidance.",
  },
  {
    icon: Phone,
    label: "Crisis Resources",
    summary: "Emergency lines always one tap away.",
    detail:
      "Safety is never buried. Crisis contacts and professional helplines surface instantly — because reaching out should never feel hard.",
  },
  {
    icon: Lock,
    label: "Private by Design",
    summary: "No ads. No data sold. Ever.",
    detail:
      "Your conversations belong only to you. Serene is a space to think — not a platform to be profiled, tracked, or monetised.",
  },
];

// ─── Animation variants ─────────────────────────────────────
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const rowVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

// ─── Component ──────────────────────────────────────────────
export default function Features() {
  const [active, setActive] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const toggle = (i: number) => setActive((prev) => (prev === i ? null : i));

  return (
    <section id="features" className="w-full bg-[#FAFAFA] px-6 py-28 md:py-36">
      <div className="max-w-3xl mx-auto">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 md:mb-20"
        >
  
          <h2 className="text-[2rem] md:text-[2.75rem] font-semibold text-stone-900 leading-[1.15] tracking-tight">
            Everything your mind needs,
            <br />
            <span className="text-stone-400">in one calm space.</span>
          </h2>
        </motion.div>

        {/* ── Feature Rows ── */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="divide-y divide-stone-100"
        >
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            const isActive = active === i;

            return (
              <motion.div key={i} variants={rowVariants}>
                <button
                  onClick={() => toggle(i)}
                  className="w-full text-left py-6 group focus:outline-none"
                  aria-expanded={isActive}
                >
                  <div className="flex items-start gap-5 md:gap-7">

                    {/* Index number */}
                    <span className="shrink-0 w-7 text-[11px] font-medium text-stone-300 tabular-nums pt-0.5 select-none">
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    {/* Icon — pure line, no fill, monochrome */}
                    <span className="shrink-0 mt-0.5">
                      <Icon
                        size={18}
                        strokeWidth={1.5}
                        className={`transition-colors duration-300 ${
                          isActive ? "text-stone-900" : "text-stone-400 group-hover:text-stone-700"
                        }`}
                      />
                    </span>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-4">
                        <span
                          className={`text-[15px] font-medium tracking-tight transition-colors duration-200 ${
                            isActive ? "text-stone-900" : "text-stone-600 group-hover:text-stone-900"
                          }`}
                        >
                          {f.label}
                        </span>

                        {/* Expand indicator */}
                        <motion.span
                          animate={{ rotate: isActive ? 45 : 0 }}
                          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                          className="shrink-0 text-stone-300 text-lg leading-none select-none"
                          aria-hidden
                        >
                          +
                        </motion.span>
                      </div>

                      {/* Summary — always visible */}
                      <p className="text-[13px] text-stone-400 mt-1 leading-relaxed">
                        {f.summary}
                      </p>

                      {/* Detail — expands on click */}
                      <AnimatePresence initial={false}>
                        {isActive && (
                          <motion.div
                            key="detail"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                            className="overflow-hidden"
                          >
                            <p className="text-[13.5px] text-stone-500 leading-relaxed pt-3 pb-1 max-w-lg">
                              {f.detail}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </button>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}