"use client";
import { useState } from "react";
import Link from "next/link";
import { assessmentAPI } from "@/libs/api";

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */
interface Option {
  label: string;
  value: number;
}
interface Question {
  id: string;
  text: string;
  options: Option[];
}
interface Assessment {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  description: string;
  about: string;
  duration: string;
  questions: number;
  totalScore: number;
  questionList: Question[];
}

/* ─────────────────────────────────────────────
   SHARED OPTION SETS
───────────────────────────────────────────── */
const FREQ_4: Option[] = [
  { label: "Not at all", value: 0 },
  { label: "Several days", value: 1 },
  { label: "More than half the days", value: 2 },
  { label: "Nearly every day", value: 3 },
];

const FREQ_5: Option[] = [
  { label: "Never", value: 0 },
  { label: "Almost never", value: 1 },
  { label: "Sometimes", value: 2 },
  { label: "Fairly often", value: 3 },
  { label: "Very often", value: 4 },
];

const WHO5_OPTS: Option[] = [
  { label: "At no time", value: 0 },
  { label: "Some of the time", value: 1 },
  { label: "Less than half the time", value: 2 },
  { label: "More than half the time", value: 3 },
  { label: "Most of the time", value: 4 },
  { label: "All of the time", value: 5 },
];

/* ─────────────────────────────────────────────
   CLINICAL DATA (accurate & complete)
───────────────────────────────────────────── */
const ASSESSMENTS: Assessment[] = [
  {
    id: "phq9",
    title: "PHQ-9",
    subtitle: "Depression Scale",
    icon: "🧠",
    color: "#4A90D9",
    description:
      "Patient Health Questionnaire for measuring depression severity.",
    about:
      "The PHQ-9 is a validated 9-item instrument derived from the Primary Care Evaluation of Mental Disorders (PRIME-MD) diagnostic tool. Each item asks how often the respondent has been bothered by a symptom over the past two weeks, scored 0–3.",
    duration: "5 min",
    questions: 9,
    totalScore: 27,
    questionList: [
      {
        id: "q1",
        text: "Little interest or pleasure in doing things",
        options: FREQ_4,
      },
      {
        id: "q2",
        text: "Feeling down, depressed, or hopeless",
        options: FREQ_4,
      },
      {
        id: "q3",
        text: "Trouble falling or staying asleep, or sleeping too much",
        options: FREQ_4,
      },
      {
        id: "q4",
        text: "Feeling tired or having little energy",
        options: FREQ_4,
      },
      { id: "q5", text: "Poor appetite or overeating", options: FREQ_4 },
      {
        id: "q6",
        text: "Feeling bad about yourself — or that you are a failure or have let yourself or your family down",
        options: FREQ_4,
      },
      {
        id: "q7",
        text: "Trouble concentrating on things, such as reading the newspaper or watching television",
        options: FREQ_4,
      },
      {
        id: "q8",
        text: "Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual",
        options: FREQ_4,
      },
      {
        id: "q9",
        text: "Thoughts that you would be better off dead, or of hurting yourself in some way",
        options: FREQ_4,
      },
    ],
  },
  {
    id: "gad7",
    title: "GAD-7",
    subtitle: "Anxiety Scale",
    icon: "😰",
    color: "#E8934A",
    description:
      "Generalized Anxiety Disorder scale for assessing anxiety severity.",
    about:
      "The GAD-7 is a validated 7-item self-report questionnaire developed by Spitzer et al. (2006) for screening and measuring the severity of Generalized Anxiety Disorder. Items are scored 0–3 based on symptom frequency over the past two weeks.",
    duration: "4 min",
    questions: 7,
    totalScore: 21,
    questionList: [
      {
        id: "q1",
        text: "Feeling nervous, anxious, or on edge",
        options: FREQ_4,
      },
      {
        id: "q2",
        text: "Not being able to stop or control worrying",
        options: FREQ_4,
      },
      {
        id: "q3",
        text: "Worrying too much about different things",
        options: FREQ_4,
      },
      { id: "q4", text: "Trouble relaxing", options: FREQ_4 },
      {
        id: "q5",
        text: "Being so restless that it is hard to sit still",
        options: FREQ_4,
      },
      {
        id: "q6",
        text: "Becoming easily annoyed or irritable",
        options: FREQ_4,
      },
      {
        id: "q7",
        text: "Feeling afraid as if something awful might happen",
        options: FREQ_4,
      },
    ],
  },
  {
    id: "pss10",
    title: "PSS-10",
    subtitle: "Perceived Stress Scale",
    icon: "⚡",
    color: "#C95F8A",
    description:
      "Measures the degree to which situations in your life are perceived as stressful.",
    about:
      "The Perceived Stress Scale (PSS-10) by Cohen, Kamarck & Mermelstein (1983) is the most widely used psychological instrument for measuring stress perception. It evaluates how often you felt or thought a certain way during the last month. Items 4, 5, 7 & 8 are positively stated and reverse-scored.",
    duration: "5 min",
    questions: 10,
    totalScore: 40,
    questionList: [
      {
        id: "q1",
        text: "Been upset because of something that happened unexpectedly",
        options: FREQ_5,
      },
      {
        id: "q2",
        text: "Felt that you were unable to control the important things in your life",
        options: FREQ_5,
      },
      { id: "q3", text: "Felt nervous and stressed", options: FREQ_5 },
      {
        id: "q4",
        text: "Felt confident about your ability to handle your personal problems",
        /* reverse */ options: FREQ_5,
      },
      {
        id: "q5",
        text: "Felt that things were going your way",
        /* reverse */ options: FREQ_5,
      },
      {
        id: "q6",
        text: "Found that you could not cope with all the things that you had to do",
        options: FREQ_5,
      },
      {
        id: "q7",
        text: "Been able to control irritations in your life",
        /* reverse */ options: FREQ_5,
      },
      {
        id: "q8",
        text: "Felt that you were on top of things",
        /* reverse */ options: FREQ_5,
      },
      {
        id: "q9",
        text: "Been angered because of things that were outside of your control",
        options: FREQ_5,
      },
      {
        id: "q10",
        text: "Felt difficulties were piling up so high that you could not overcome them",
        options: FREQ_5,
      },
    ],
  },
  {
    id: "who5",
    title: "WHO-5",
    subtitle: "Well-Being Index",
    icon: "🌟",
    color: "#5BAD7A",
    description:
      "World Health Organization index for measuring subjective psychological well-being.",
    about:
      "The WHO-5 Well-Being Index was developed by the WHO Regional Office for Europe in 1998. It is one of the most widely used questionnaires to assess subjective psychological well-being. The raw score (0–25) is multiplied by 4 to give a percentage score (0–100). A score ≤ 50 suggests poor well-being and warrants screening for depression.",
    duration: "2 min",
    questions: 5,
    totalScore: 25,
    questionList: [
      {
        id: "q1",
        text: "I have felt cheerful and in good spirits",
        options: WHO5_OPTS,
      },
      { id: "q2", text: "I have felt calm and relaxed", options: WHO5_OPTS },
      { id: "q3", text: "I have felt active and vigorous", options: WHO5_OPTS },
      {
        id: "q4",
        text: "I woke up feeling fresh and rested",
        options: WHO5_OPTS,
      },
      {
        id: "q5",
        text: "My daily life has been filled with things that interest me",
        options: WHO5_OPTS,
      },
    ],
  },
];

/* ─────────────────────────────────────────────
   SCORING / INTERPRETATION
───────────────────────────────────────────── */
// PSS-10 reverse-scored items (q4, q5, q7, q8)
const PSS_REVERSE = new Set(["q4", "q5", "q7", "q8"]);

function computeScore(
  assessment: Assessment,
  raw: Record<string, number>,
): number {
  if (assessment.id === "pss10") {
    return Object.entries(raw).reduce((sum, [qid, val]) => {
      return sum + (PSS_REVERSE.has(qid) ? 4 - val : val);
    }, 0);
  }
  if (assessment.id === "who5") {
    // WHO-5 raw 0–25 → percent 0–100
    const rawSum = Object.values(raw).reduce((a, b) => a + b, 0);
    return rawSum * 4; // return percentage
  }
  return Object.values(raw).reduce((a, b) => a + b, 0);
}

interface Interpretation {
  label: string;
  color: string;
  emoji: string;
  detail: string;
  recommendation: string;
}

function interpret(id: string, score: number): Interpretation {
  if (id === "phq9") {
    if (score <= 4)
      return {
        label: "Minimal",
        color: "#5BAD7A",
        emoji: "🌿",
        detail: "Little to no depressive symptoms present.",
        recommendation: "Continue healthy habits and self-care.",
      };
    if (score <= 9)
      return {
        label: "Mild",
        color: "#A8C96B",
        emoji: "🌱",
        detail: "Mild depressive symptoms that may cause some distress.",
        recommendation: "Monitor symptoms; consider lifestyle adjustments.",
      };
    if (score <= 14)
      return {
        label: "Moderate",
        color: "#E8C44A",
        emoji: "⚠️",
        detail: "Moderate depressive symptoms causing notable distress.",
        recommendation: "Consider speaking with a mental health professional.",
      };
    if (score <= 19)
      return {
        label: "Moderately Severe",
        color: "#E8934A",
        emoji: "🔶",
        detail: "Significant depressive symptoms with functional impact.",
        recommendation: "Professional evaluation and treatment is advised.",
      };
    return {
      label: "Severe",
      color: "#D95F5F",
      emoji: "🆘",
      detail: "Severe depressive symptoms requiring urgent attention.",
      recommendation: "Please reach out to a healthcare provider promptly.",
    };
  }
  if (id === "gad7") {
    if (score <= 4)
      return {
        label: "Minimal",
        color: "#5BAD7A",
        emoji: "🌿",
        detail: "Anxiety is within a normal range.",
        recommendation:
          "No intervention needed; maintain current wellness practices.",
      };
    if (score <= 9)
      return {
        label: "Mild",
        color: "#A8C96B",
        emoji: "🌱",
        detail: "Some anxiety symptoms; manageable with self-care.",
        recommendation: "Try mindfulness, breathing exercises, or journaling.",
      };
    if (score <= 14)
      return {
        label: "Moderate",
        color: "#E8C44A",
        emoji: "⚠️",
        detail: "Moderate anxiety that may interfere with daily functioning.",
        recommendation: "Consider speaking with a therapist or counsellor.",
      };
    return {
      label: "Severe",
      color: "#D95F5F",
      emoji: "🆘",
      detail: "Severe anxiety with significant functional impairment.",
      recommendation: "Please consult a mental health professional.",
    };
  }
  if (id === "pss10") {
    if (score <= 13)
      return {
        label: "Low Stress",
        color: "#5BAD7A",
        emoji: "🌿",
        detail: "You are managing life's demands effectively.",
        recommendation: "Keep up your stress-management routines.",
      };
    if (score <= 26)
      return {
        label: "Moderate Stress",
        color: "#E8C44A",
        emoji: "⚠️",
        detail: "Some perceived stress that may benefit from attention.",
        recommendation:
          "Explore stress-reduction techniques such as exercise and mindfulness.",
      };
    return {
      label: "High Stress",
      color: "#D95F5F",
      emoji: "🆘",
      detail:
        "High stress levels that could impact your health and well-being.",
      recommendation:
        "Please prioritise self-care; professional support may be beneficial.",
    };
  }
  // WHO-5 — score is percentage (0–100)
  if (score >= 72)
    return {
      label: "Good Well-Being",
      color: "#5BAD7A",
      emoji: "🌟",
      detail: "You are thriving emotionally.",
      recommendation: "Maintain your positive habits and social connections.",
    };
  if (score >= 52)
    return {
      label: "Moderate Well-Being",
      color: "#A8C96B",
      emoji: "🌱",
      detail: "Generally positive but with some areas to nurture.",
      recommendation: "Small daily rituals can help sustain your well-being.",
    };
  if (score >= 28)
    return {
      label: "Low Well-Being",
      color: "#E8C44A",
      emoji: "⚠️",
      detail: "Below-average well-being; emotional needs may be unmet.",
      recommendation:
        "Consider speaking with someone you trust or a professional.",
    };
  return {
    label: "Poor Well-Being",
    color: "#D95F5F",
    emoji: "🆘",
    detail:
      "Score ≤ 28 suggests possible depression; further screening is recommended.",
    recommendation:
      "Please consult a mental health or healthcare professional.",
  };
}

function isApiSupported(id: string): id is "phq9" | "gad7" {
  return id === "phq9" || id === "gad7";
}

/* ─────────────────────────────────────────────
   SEVERITY BANDS for scale legend
───────────────────────────────────────────── */
type Band = { label: string; range: string; color: string };
const BANDS: Record<string, Band[]> = {
  phq9: [
    { label: "Minimal", range: "0 – 4", color: "#5BAD7A" },
    { label: "Mild", range: "5 – 9", color: "#A8C96B" },
    { label: "Moderate", range: "10 – 14", color: "#E8C44A" },
    { label: "Moderately Severe", range: "15 – 19", color: "#E8934A" },
    { label: "Severe", range: "20 – 27", color: "#D95F5F" },
  ],
  gad7: [
    { label: "Minimal", range: "0 – 4", color: "#5BAD7A" },
    { label: "Mild", range: "5 – 9", color: "#A8C96B" },
    { label: "Moderate", range: "10 – 14", color: "#E8C44A" },
    { label: "Severe", range: "15 – 21", color: "#D95F5F" },
  ],
  pss10: [
    { label: "Low Stress", range: "0 – 13", color: "#5BAD7A" },
    { label: "Moderate Stress", range: "14 – 26", color: "#E8C44A" },
    { label: "High Stress", range: "27 – 40", color: "#D95F5F" },
  ],
  who5: [
    { label: "Poor", range: "0 – 27%", color: "#D95F5F" },
    { label: "Low", range: "28 – 51%", color: "#E8C44A" },
    { label: "Moderate", range: "52 – 71%", color: "#A8C96B" },
    { label: "Good", range: "72 – 100%", color: "#5BAD7A" },
  ],
};

/* ─────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────── */
type Step = "list" | "taking" | "result";

export default function AssessmentsPage() {
  const [step, setStep] = useState<Step>("list");
  const [selected, setSelected] = useState<Assessment | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [interp, setInterp] = useState<Interpretation | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  const startAssessment = (a: Assessment) => {
    setSelected(a);
    setAnswers({});
    setCurrentQ(0);
    setScore(0);
    setInterp(null);
    setStep("taking");
  };

  const handleAnswer = (value: number) => {
    if (!selected) return;
    const qId = selected.questionList[currentQ].id;
    const newAnswers = { ...answers, [qId]: value };
    setAnswers(newAnswers);
    if (currentQ < selected.questionList.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      void submitAssessment(selected, newAnswers);
    }
  };

  const submitAssessment = async (
    a: Assessment,
    finalAnswers: Record<string, number>,
  ) => {
    setSubmitting(true);
    const computed = computeScore(a, finalAnswers);
    try {
      if (isApiSupported(a.id)) {
        const res = await assessmentAPI.submit(
          a.id,
          Object.values(finalAnswers),
        );
        setScore(res.score);
        setInterp(interpret(a.id, res.score));
      } else {
        setScore(computed);
        setInterp(interpret(a.id, computed));
      }
    } catch {
      setScore(computed);
      setInterp(interpret(a.id, computed));
    } finally {
      setSubmitting(false);
      setStep("result");
    }
  };

  const progress = selected
    ? (currentQ / selected.questionList.length) * 100
    : 0;

  /* ── RENDER ── */
  return (
    <div
      className="min-h-screen"
      style={{
        background: "var(--bg-primary)",
        fontFamily: "'Lora', Georgia, serif",
      }}
    >
      {/* ── HEADER ── */}
      <header
        className="fixed top-0 left-0 right-0 z-50 border-b"
        style={{
          background: "var(--bg-secondary)",
          borderColor: "var(--border-color)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl"
            style={{
              color: "var(--text-primary)",
              fontFamily: "'DM Serif Display', serif",
            }}
          >
            🌿 Serene
          </Link>
          <div className="flex items-center gap-3">
            {step !== "list" && (
              <button
                onClick={() => setStep("list")}
                className="px-3 py-1.5 rounded-lg text-sm"
                style={{
                  background: "var(--bg-tertiary)",
                  color: "var(--text-secondary)",
                  border: "1px solid var(--border-color)",
                }}
              >
                ← Assessments
              </button>
            )}
            <Link
              href="/application"
              className="px-4 py-2 rounded-xl text-sm font-medium"
              style={{
                background: "var(--bg-tertiary)",
                border: "1px solid var(--border-color)",
                color: "var(--text-primary)",
              }}
            >
              ← Chat
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 pt-28 pb-20">
        {/* ════════════════════════════════════════
            STEP: LIST
        ════════════════════════════════════════ */}
        {step === "list" && (
          <>
            {/* Hero */}
            <div className="text-center mb-14">
              <p
                className="text-xs font-semibold tracking-widest mb-3 uppercase"
                style={{
                  color: "var(--accent-primary)",
                  letterSpacing: "0.15em",
                }}
              >
                Evidence-Based Tools
              </p>
              <h1
                className="text-5xl font-bold mb-4"
                style={{
                  color: "var(--text-primary)",
                  fontFamily: "'DM Serif Display', serif",
                  lineHeight: 1.2,
                }}
              >
                Clinical Assessments
              </h1>
              <p
                className="text-base max-w-xl mx-auto leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                Validated instruments used by clinicians worldwide to understand
                and track mental health. All responses are private and for
                self-awareness only.
              </p>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
              {ASSESSMENTS.map((a) => (
                <div
                  key={a.id}
                  className="rounded-2xl overflow-hidden border transition-all cursor-pointer group"
                  style={{
                    background: "var(--bg-secondary)",
                    borderColor: "var(--border-color)",
                    boxShadow: "var(--shadow-sm)",
                  }}
                >
                  {/* colour strip */}
                  <div className="h-1" style={{ background: a.color }} />

                  <div className="p-6">
                    {/* top row */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-2xl">{a.icon}</span>
                          <span
                            className="text-xl font-bold"
                            style={{
                              color: "var(--text-primary)",
                              fontFamily: "'DM Serif Display', serif",
                            }}
                          >
                            {a.title}
                          </span>
                        </div>
                        <p
                          className="text-xs font-semibold tracking-wide uppercase"
                          style={{ color: a.color }}
                        >
                          {a.subtitle}
                        </p>
                      </div>
                      <div className="text-right">
                        <p
                          className="text-2xl font-bold"
                          style={{
                            color: "var(--text-primary)",
                            fontFamily: "'DM Serif Display', serif",
                          }}
                        >
                          {a.questions}
                        </p>
                        <p
                          className="text-xs"
                          style={{ color: "var(--text-muted)" }}
                        >
                          questions
                        </p>
                      </div>
                    </div>

                    <p
                      className="text-sm leading-relaxed mb-4"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {a.description}
                    </p>

                    {/* expandable about */}
                    <div className="mb-5">
                      <button
                        onClick={() =>
                          setExpanded(expanded === a.id ? null : a.id)
                        }
                        className="text-xs font-medium flex items-center gap-1 transition-opacity hover:opacity-80"
                        style={{ color: a.color }}
                      >
                        {expanded === a.id
                          ? "▲ Less info"
                          : "▼ About this scale"}
                      </button>
                      {expanded === a.id && (
                        <p
                          className="text-xs leading-relaxed mt-2 p-3 rounded-lg"
                          style={{
                            color: "var(--text-secondary)",
                            background: "var(--bg-tertiary)",
                            border: "1px solid var(--border-color)",
                          }}
                        >
                          {a.about}
                        </p>
                      )}
                    </div>

                    {/* severity bands */}
                    <div className="mb-5">
                      <p
                        className="text-xs font-semibold mb-2"
                        style={{ color: "var(--text-muted)" }}
                      >
                        SEVERITY RANGES
                      </p>
                      <div className="space-y-1.5">
                        {BANDS[a.id].map((b) => (
                          <div
                            key={b.label}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                                style={{ background: b.color }}
                              />
                              <span
                                className="text-xs"
                                style={{ color: "var(--text-secondary)" }}
                              >
                                {b.label}
                              </span>
                            </div>
                            <span
                              className="text-xs font-mono"
                              style={{ color: "var(--text-muted)" }}
                            >
                              {b.range}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* footer */}
                    <div
                      className="flex items-center justify-between pt-4 border-t"
                      style={{ borderColor: "var(--border-color)" }}
                    >
                      <span
                        className="text-xs px-3 py-1 rounded-full font-medium"
                        style={{
                          background: "rgba(45,90,61,0.1)",
                          color: "var(--accent-primary)",
                        }}
                      >
                        ⏱ {a.duration}
                      </span>
                      <button
                        onClick={() => startAssessment(a)}
                        className="px-5 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-90 active:scale-95"
                        style={{ background: a.color, color: "#fff" }}
                      >
                        Begin →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* disclaimer */}
            <div
              className="p-5 rounded-2xl text-sm text-center"
              style={{
                background: "rgba(217,95,95,0.07)",
                border: "1px solid rgba(217,95,95,0.2)",
                color: "var(--text-secondary)",
              }}
            >
              ⚠️ These assessments are validated screening tools for
              informational and self-awareness purposes only. They do not
              constitute a clinical diagnosis. Always consult a qualified
              healthcare professional for medical advice.
            </div>
          </>
        )}

        {/* ════════════════════════════════════════
            STEP: TAKING
        ════════════════════════════════════════ */}
        {step === "taking" && selected && (
          <div className="max-w-2xl mx-auto">
            {/* progress header */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <span
                    className="text-lg font-bold mr-2"
                    style={{
                      color: "var(--text-primary)",
                      fontFamily: "'DM Serif Display', serif",
                    }}
                  >
                    {selected.icon} {selected.title}
                  </span>
                  <span className="text-sm" style={{ color: selected.color }}>
                    {selected.subtitle}
                  </span>
                </div>
                <div className="text-right">
                  <span
                    className="text-sm font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {currentQ + 1}
                  </span>
                  <span
                    className="text-sm"
                    style={{ color: "var(--text-muted)" }}
                  >
                    /{selected.questionList.length}
                  </span>
                </div>
              </div>

              {/* progress bar */}
              <div
                className="h-1.5 rounded-full overflow-hidden"
                style={{ background: "var(--bg-tertiary)" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${progress}%`, background: selected.color }}
                />
              </div>

              {/* step dots */}
              <div className="flex gap-1 mt-3 flex-wrap">
                {selected.questionList.map((_, i) => (
                  <div
                    key={i}
                    className="h-1 flex-1 rounded-full transition-all"
                    style={{
                      background:
                        i < currentQ
                          ? selected.color
                          : i === currentQ
                            ? selected.color + "99"
                            : "var(--bg-tertiary)",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* question card */}
            <div
              className="rounded-2xl p-8 mb-6 border-2"
              style={{
                background: "var(--bg-secondary)",
                borderColor: "var(--border-color)",
                boxShadow: "var(--shadow-md)",
              }}
            >
              <div className="mb-2">
                <span
                  className="text-xs font-semibold tracking-widest uppercase"
                  style={{ color: "var(--text-muted)" }}
                >
                  Question {currentQ + 1} of {selected.questionList.length}
                </span>
              </div>

              <p
                className="text-lg font-medium mb-8 leading-relaxed"
                style={{
                  color: "var(--text-primary)",
                  fontFamily: "'Lora', Georgia, serif",
                }}
              >
                {selected.questionList[currentQ].text}
              </p>

              <p
                className="text-xs mb-5"
                style={{ color: "var(--text-muted)" }}
              >
                Over the last {selected.id === "pss10" ? "month" : "2 weeks"},
                how often have you been bothered by this?
              </p>

              <div className="space-y-2.5">
                {selected.questionList[currentQ].options.map((opt, oi) => (
                  <button
                    key={opt.value}
                    onClick={() => handleAnswer(opt.value)}
                    disabled={submitting}
                    className="w-full text-left px-5 py-3.5 rounded-xl border transition-all flex items-center gap-3 group"
                    style={{
                      background: "var(--bg-primary)",
                      borderColor: "var(--border-color)",
                      color: "var(--text-primary)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = selected.color;
                      e.currentTarget.style.background = selected.color + "0D";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--border-color)";
                      e.currentTarget.style.background = "var(--bg-primary)";
                    }}
                  >
                    <span
                      className="w-6 h-6 rounded-full border flex-shrink-0 flex items-center justify-center text-xs font-bold"
                      style={{
                        borderColor: "var(--border-color)",
                        color: "var(--text-muted)",
                      }}
                    >
                      {oi}
                    </span>
                    <span className="text-sm font-medium">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* nav row */}
            <div className="flex items-center justify-between">
              <button
                onClick={() =>
                  currentQ > 0 ? setCurrentQ(currentQ - 1) : setStep("list")
                }
                className="text-sm transition-opacity hover:opacity-70"
                style={{ color: "var(--text-muted)" }}
              >
                ← {currentQ > 0 ? "Previous" : "Cancel"}
              </button>
              {submitting && (
                <span
                  className="text-sm animate-pulse"
                  style={{ color: "var(--text-muted)" }}
                >
                  Calculating…
                </span>
              )}
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════
            STEP: RESULT
        ════════════════════════════════════════ */}
        {step === "result" && selected && interp && (
          <div className="max-w-2xl mx-auto">
            {/* top badge */}
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">{interp.emoji}</div>
              <h2
                className="text-3xl font-bold mb-1"
                style={{
                  color: "var(--text-primary)",
                  fontFamily: "'DM Serif Display', serif",
                }}
              >
                {selected.title} Complete
              </h2>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                {selected.subtitle} · {selected.about.split(".")[0]}.
              </p>
            </div>

            {/* main result card */}
            <div
              className="rounded-2xl overflow-hidden border-2 mb-5"
              style={{
                background: "var(--bg-secondary)",
                borderColor: interp.color + "66",
                boxShadow: "var(--shadow-md)",
              }}
            >
              <div className="h-1.5" style={{ background: interp.color }} />

              <div className="p-8">
                {/* score row */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p
                      className="text-xs font-semibold tracking-wide uppercase mb-1"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Your Score
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span
                        className="text-5xl font-bold"
                        style={{
                          color: interp.color,
                          fontFamily: "'DM Serif Display', serif",
                        }}
                      >
                        {score}
                      </span>
                      <span
                        className="text-sm"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {selected.id === "who5"
                          ? "/ 100%"
                          : `/ ${selected.totalScore}`}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className="text-xs font-semibold tracking-wide uppercase mb-1"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Severity
                    </p>
                    <span
                      className="text-base font-bold px-3 py-1 rounded-full"
                      style={{
                        background: interp.color + "22",
                        color: interp.color,
                      }}
                    >
                      {interp.label}
                    </span>
                  </div>
                </div>

                {/* score bar */}
                <div className="mb-6">
                  <div
                    className="h-3 rounded-full overflow-hidden"
                    style={{ background: "var(--bg-tertiary)" }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${(score / (selected.id === "who5" ? 100 : selected.totalScore)) * 100}%`,
                        background: interp.color,
                      }}
                    />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span
                      className="text-xs"
                      style={{ color: "var(--text-muted)" }}
                    >
                      0
                    </span>
                    <span
                      className="text-xs"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {selected.id === "who5" ? "100%" : selected.totalScore}
                    </span>
                  </div>
                </div>

                <div
                  className="h-px mb-6"
                  style={{ background: "var(--border-color)" }}
                />

                {/* interpretation */}
                <p
                  className="text-base leading-relaxed mb-3"
                  style={{ color: "var(--text-primary)" }}
                >
                  {interp.detail}
                </p>
                <div
                  className="flex items-start gap-2 p-4 rounded-xl"
                  style={{
                    background: interp.color + "11",
                    border: `1px solid ${interp.color}33`,
                  }}
                >
                  <span style={{ color: interp.color }}>💡</span>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {interp.recommendation}
                  </p>
                </div>
              </div>
            </div>

            {/* severity reference */}
            <div
              className="rounded-xl p-5 mb-6 border"
              style={{
                background: "var(--bg-secondary)",
                borderColor: "var(--border-color)",
              }}
            >
              <p
                className="text-xs font-semibold tracking-wide uppercase mb-3"
                style={{ color: "var(--text-muted)" }}
              >
                Score Reference — {selected.title}
              </p>
              <div className="space-y-2">
                {BANDS[selected.id].map((b) => {
                  const isActive = interp.label
                    .toLowerCase()
                    .includes(b.label.split(" ")[0].toLowerCase());
                  return (
                    <div
                      key={b.label}
                      className="flex items-center justify-between py-1.5 px-3 rounded-lg transition-all"
                      style={{
                        background: isActive ? b.color + "18" : "transparent",
                        border: isActive
                          ? `1px solid ${b.color}44`
                          : "1px solid transparent",
                      }}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ background: b.color }}
                        />
                        <span
                          className="text-sm font-medium"
                          style={{
                            color: isActive ? b.color : "var(--text-secondary)",
                          }}
                        >
                          {b.label}
                        </span>
                        {isActive && (
                          <span
                            className="text-xs px-2 py-0.5 rounded-full font-semibold"
                            style={{ background: b.color, color: "#fff" }}
                          >
                            You
                          </span>
                        )}
                      </div>
                      <span
                        className="text-xs font-mono"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {b.range}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* actions */}
            <div className="flex gap-3 justify-center flex-wrap mb-6">
              <button
                onClick={() => startAssessment(selected)}
                className="px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90 active:scale-95"
                style={{ background: selected.color, color: "#fff" }}
              >
                Retake
              </button>
              <button onClick={() => setStep("list")} style={{ padding:"13px 26px", borderRadius:"13px", fontSize:"14px", fontWeight:600, background:"var(--bg-secondary)", border:"2px solid var(--border-strong)", color:"var(--text-primary)", cursor:"pointer" }}>
                All Assessments
              </button>
              <Link href="/application" style={{ padding:"13px 26px", borderRadius:"13px", fontSize:"14px", fontWeight:600, background:"var(--bg-tertiary)", border:"1px solid var(--border-color)", color:"var(--text-secondary)", textDecoration:"none" }}>
                Back to Chat
              </Link>
            </div>

            <p
              className="text-xs text-center"
              style={{ color: "var(--text-muted)" }}
            >
              This result is for personal awareness only and does not constitute
              a clinical diagnosis. Please consult a qualified professional if
              you have concerns.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
