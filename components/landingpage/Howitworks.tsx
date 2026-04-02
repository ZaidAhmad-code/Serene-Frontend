"use client";

import { useRef, useState, useEffect } from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";

// ─── Step data tied to phone conversation ───────────────────
const STEPS = [
  {
    number: "01",
    title: "Share How You Feel",
    body: "Type freely. There's no wrong way to start. Serene meets you exactly where you are, without judgment.",
    messages: [
      { from: "user", text: "I've been feeling really overwhelmed lately." },
    ],
  },
  {
    number: "02",
    title: "Explore Together",
    body: "Serene reflects, asks gentle questions, and guides you toward clarity using proven therapeutic frameworks.",
    messages: [
      { from: "user", text: "I've been feeling really overwhelmed lately." },
      {
        from: "ai",
        text: "I hear you — that feeling is real and it matters. Can you tell me what's been weighing on you most?",
      },
      { from: "user", text: "Exams and family stress at the same time." },
    ],
  },
  {
    number: "03",
    title: "Build Resilience",
    body: "Practice techniques, track your mood, and return whenever you need. Small steps create lasting change.",
    messages: [
      { from: "user", text: "I've been feeling really overwhelmed lately." },
      {
        from: "ai",
        text: "I hear you — that feeling is real and it matters. Can you tell me what's been weighing on you most?",
      },
      { from: "user", text: "Exams and family stress at the same time." },
      {
        from: "ai",
        text: "That's a lot to carry. Let's try a quick breathing exercise together — just 60 seconds. Ready?",
      },
    ],
  },
];

// ─── Typewriter hook ────────────────────────────────────────
function useTypewriter(text: string, active: boolean, speed = 22) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    if (!active) {
      setDisplayed("");
      return;
    }
    setDisplayed("");
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, active, speed]);
  return displayed;
}

// ─── Single animated chat message ───────────────────────────
function ChatMessage({
  msg,
  delay,
  visible,
}: {
  msg: { from: string; text: string };
  delay: number;
  visible: boolean;
}) {
  const isUser = msg.from === "user";
  const typed = useTypewriter(msg.text, visible);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className={`flex ${isUser ? "justify-end" : "justify-start"} mb-2`}
        >
          <div
            className={`max-w-[82%] px-3 py-2 rounded-2xl text-[11px] leading-relaxed ${
              isUser
                ? "bg-stone-900 text-white rounded-br-sm"
                : "rounded-bl-sm text-stone-800"
            }`}
            style={
              isUser
                ? {}
                : {
                    background: "rgba(255,255,255,0.55)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    border: "1px solid rgba(255,255,255,0.75)",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                  }
            }
          >
            {typed}
            {typed.length < msg.text.length && (
              <span className="inline-block w-0.5 h-3 bg-current ml-0.5 animate-pulse" />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── iPhone mockup ───────────────────────────────────────────
function IPhone({ activeStep }: { activeStep: number }) {
  const messages = STEPS[activeStep].messages;

  return (
    <div className="relative select-none" style={{ width: 260, height: 530 }}>
      {/* ── Ambient glow behind phone ── */}
      <div
        className="absolute inset-0 rounded-[48px] blur-3xl opacity-30 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 60%, rgba(110,180,140,0.5) 0%, rgba(180,210,190,0.3) 50%, transparent 80%)",
          transform: "scale(1.15) translateY(8%)",
        }}
      />

      {/* ── Phone body — titanium-finish frame ── */}
      <div
        className="absolute inset-0 rounded-[48px]"
        style={{
          background:
            "linear-gradient(160deg, #d4d4d4 0%, #a8a8a8 40%, #c0c0c0 70%, #d8d8d8 100%)",
          boxShadow:
            "0 0 0 1px rgba(255,255,255,0.6) inset, 0 0 0 2px rgba(0,0,0,0.18), 0 32px 80px rgba(0,0,0,0.22), 0 8px 24px rgba(0,0,0,0.12)",
        }}
      />

      {/* ── Inner screen recess ── */}
      <div
        className="absolute rounded-[44px] overflow-hidden"
        style={{
          inset: 3,
          background: "#0a0a0a",
          boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.5)",
        }}
      >
        {/* Wallpaper — soft sage gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(160deg, #e8f0e9 0%, #c8dcc9 35%, #a8c5aa 65%, #8fb090 100%)",
          }}
        />

        {/* ── Status bar ── */}
        <div className="relative flex justify-between items-center px-6 pt-3 pb-1 z-10">
          <span className="text-[9px] font-semibold text-stone-700">9:41</span>
          <div className="flex gap-1 items-center">
            {/* Signal */}
            {[3, 4, 5, 6].map((h) => (
              <div
                key={h}
                className="w-[2.5px] rounded-full bg-stone-700"
                style={{ height: h }}
              />
            ))}
            {/* Wifi */}
            <svg width="11" height="8" viewBox="0 0 11 8" className="mx-0.5">
              <path
                d="M5.5 6.5a1 1 0 1 1 0 .01"
                stroke="#44403c"
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M3 4.5c.7-.7 1.5-1 2.5-1s1.8.3 2.5 1"
                stroke="#44403c"
                strokeWidth="1.2"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M1 2.5C2.3 1.3 3.8.8 5.5.8s3.2.5 4.5 1.7"
                stroke="#44403c"
                strokeWidth="1.2"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            {/* Battery */}
            <div className="flex items-center gap-[1px]">
              <div className="w-5 h-2.5 rounded-[2px] border border-stone-600 flex items-center px-[1.5px]">
                <div className="h-1.5 w-3.5 rounded-[1px] bg-stone-700" />
              </div>
              <div className="w-[1.5px] h-1.5 rounded-full bg-stone-600" />
            </div>
          </div>
        </div>

        {/* ── Dynamic Island ── */}
        <div className="flex justify-center mb-1 relative z-10">
          <div
            className="rounded-full bg-black"
            style={{ width: 90, height: 26 }}
          />
        </div>

        {/* ── App chrome — liquid glass header ── */}
        <div
          className="mx-3 rounded-2xl px-3 py-2 mb-2 relative z-10 flex items-center gap-2"
          style={{
            background: "rgba(255,255,255,0.45)",
            backdropFilter: "blur(20px) saturate(1.8)",
            WebkitBackdropFilter: "blur(20px) saturate(1.8)",
            border: "1px solid rgba(255,255,255,0.75)",
            boxShadow:
              "0 2px 12px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)",
          }}
        >
          {/* Avatar */}
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-700 flex items-center justify-center shadow-sm shrink-0">
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" />
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-semibold text-stone-800 leading-none">
              Serene
            </p>
            <p className="text-[8px] text-emerald-600 mt-0.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
              Online now
            </p>
          </div>
        </div>

        {/* ── Chat messages ── */}
        <div
          className="px-3 flex flex-col justify-end"
          style={{ minHeight: 200 }}
        >
          <AnimatePresence mode="wait">
            <motion.div key={activeStep}>
              {messages.map((msg, idx) => (
                <ChatMessage
                  key={`${activeStep}-${idx}`}
                  msg={msg}
                  delay={idx * 0.35}
                  visible
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Input bar — liquid glass ── */}
        <div className="absolute bottom-8 left-3 right-3 z-10">
          <div
            className="rounded-2xl px-3 py-2 flex items-center gap-2"
            style={{
              background: "rgba(255,255,255,0.5)",
              backdropFilter: "blur(20px) saturate(1.8)",
              WebkitBackdropFilter: "blur(20px) saturate(1.8)",
              border: "1px solid rgba(255,255,255,0.8)",
              boxShadow:
                "0 2px 12px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)",
            }}
          >
            <span className="text-[10px] text-stone-400 flex-1">
              Share what&apos;s on your mind…
            </span>
            <div className="w-5 h-5 rounded-full bg-stone-900 flex items-center justify-center">
              <svg width="8" height="8" viewBox="0 0 24 24" fill="white">
                <path
                  d="M5 12h14M13 6l6 6-6 6"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* ── Home indicator ── */}
        <div className="absolute bottom-2 left-0 right-0 flex justify-center">
          <div className="w-20 h-1 rounded-full bg-stone-700/40" />
        </div>

        {/* ── Screen glare ── */}
        <div
          className="absolute top-0 left-0 right-0 h-1/2 pointer-events-none rounded-t-[44px]"
          style={{
            background:
              "linear-gradient(160deg, rgba(255,255,255,0.18) 0%, transparent 60%)",
          }}
        />
      </div>

      {/* ── Side buttons — volume + power ── */}
      {/* Left: volume up */}
      <div
        className="absolute rounded-full bg-[#b8b8b8]"
        style={{
          left: -3,
          top: 110,
          width: 3,
          height: 28,
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -1px 0 rgba(0,0,0,0.2)",
        }}
      />
      {/* Left: volume down */}
      <div
        className="absolute rounded-full bg-[#b8b8b8]"
        style={{
          left: -3,
          top: 148,
          width: 3,
          height: 28,
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -1px 0 rgba(0,0,0,0.2)",
        }}
      />
      {/* Right: power */}
      <div
        className="absolute rounded-full bg-[#b8b8b8]"
        style={{
          right: -3,
          top: 130,
          width: 3,
          height: 54,
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -1px 0 rgba(0,0,0,0.2)",
        }}
      />
    </div>
  );
}

// ─── Step item ───────────────────────────────────────────────
function StepItem({
  step,
  index,
  isActive,
  isCompleted,
  onClick,
}: {
  step: (typeof STEPS)[0];
  index: number;
  isActive: boolean;
  isCompleted: boolean;
  onClick: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -24 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{
        duration: 0.6,
        delay: index * 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="relative pl-10 cursor-pointer group"
      onClick={onClick}
    >
      {/* Vertical connector line */}
      {index < STEPS.length - 1 && (
        <div
          className="absolute left-[14px] top-8 bottom-0 w-px overflow-hidden"
          style={{ height: "calc(100% + 32px)" }}
        >
          <div className="w-full h-full bg-stone-100" />
          <motion.div
            className="absolute top-0 left-0 w-full bg-stone-400"
            initial={{ height: "0%" }}
            animate={{ height: isCompleted ? "100%" : "0%" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      )}

      {/* Node circle */}
      <div className="absolute left-0 top-1 w-7 h-7">
        <motion.div
          animate={{
            scale: isActive ? 1 : 0.85,
            backgroundColor: isActive
              ? "#1c1917"
              : isCompleted
                ? "#78716c"
                : "#e7e5e4",
          }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="w-7 h-7 rounded-full flex items-center justify-center"
        >
          <motion.span
            animate={{ color: isActive || isCompleted ? "#fff" : "#a8a29e" }}
            className="text-[9px] font-semibold tabular-nums"
          >
            {step.number}
          </motion.span>
        </motion.div>

        {/* Pulse ring when active */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              key="pulse"
              className="absolute inset-0 rounded-full border border-stone-400"
              initial={{ scale: 1, opacity: 0.6 }}
              animate={{ scale: 1.7, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Text content */}
      <div className="pb-10">
        <motion.h3
          animate={{ color: isActive ? "#1c1917" : "#78716c" }}
          transition={{ duration: 0.3 }}
          className="text-[15px] font-semibold tracking-tight mb-2"
        >
          {step.title}
        </motion.h3>

        <AnimatePresence initial={false}>
          {isActive && (
            <motion.p
              key="body"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="text-[13.5px] text-stone-400 leading-relaxed overflow-hidden"
            >
              {step.body}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─── Main section ────────────────────────────────────────────
export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });

  // Auto-advance steps every 3.5s
  useEffect(() => {
    const id = setInterval(() => {
      setActiveStep((s) => (s + 1) % STEPS.length);
    }, 3500);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      id="techniques"
      ref={sectionRef}
      className="w-full bg-[#FAFAFA] px-6 py-28 md:py-36 overflow-hidden"
    >
      <div className="max-w-5xl mx-auto">
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16"
        >
          <p className="text-[11px] font-semibold tracking-[0.2em] text-stone-400 uppercase mb-4">
            Simple to Start
          </p>
          <h2 className="text-[2rem] md:text-[2.75rem] font-semibold text-stone-900 leading-[1.15] tracking-tight">
            Three steps to feeling better.
            <br />
            <span className="text-stone-400">
              No waitlists. No sign-up hassle.
            </span>
          </h2>
        </motion.div>

        {/* ── Two-column layout ── */}
        <div className="flex flex-col md:flex-row gap-16 md:gap-24 items-start">
          {/* Left: steps */}
          <div className="flex-1 pt-1">
            {STEPS.map((step, i) => (
              <StepItem
                key={i}
                step={step}
                index={i}
                isActive={activeStep === i}
                isCompleted={activeStep > i}
                onClick={() => setActiveStep(i)}
              />
            ))}
          </div>

          {/* Right: iPhone — sticky while steps scroll */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="flex-shrink-0 flex justify-center md:justify-end md:sticky md:top-32"
          >
            {/* Subtle tilt on step change */}
            <motion.div
              animate={{
                rotate: activeStep === 0 ? -1.5 : activeStep === 2 ? 1.5 : 0,
              }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <IPhone activeStep={activeStep} />
            </motion.div>
          </motion.div>
        </div>

        {/* ── Step dots (mobile progress) ── */}
        <div className="flex gap-2 justify-center mt-10 md:hidden">
          {STEPS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveStep(i)}
              className="focus:outline-none"
              aria-label={`Step ${i + 1}`}
            >
              <motion.div
                animate={{
                  width: activeStep === i ? 20 : 6,
                  backgroundColor: activeStep === i ? "#1c1917" : "#e7e5e4",
                }}
                className="h-1.5 rounded-full"
                transition={{ duration: 0.3 }}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
