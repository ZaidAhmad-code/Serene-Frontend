"use client";
import { useState } from "react";
import Link from "next/link";
import { assessmentAPI } from "@/libs/api";

interface Question {
  id: string;
  text: string;
  options: { label: string; value: number }[];
}
interface Assessment {
  id: string;
  title: string;
  icon: string;
  description: string;
  duration: string;
  questions: Question[];
}

const ASSESSMENTS: Assessment[] = [
  {
    id: "phq9",
    title: "PHQ-9 Depression",
    icon: "🧠",
    description:
      "Patient Health Questionnaire for measuring depression severity.",
    duration: "5 min",
    questions: [
      {
        id: "q1",
        text: "Little interest or pleasure in doing things",
        options: [
          { label: "Not at all", value: 0 },
          { label: "Several days", value: 1 },
          { label: "More than half the days", value: 2 },
          { label: "Nearly every day", value: 3 },
        ],
      },
      {
        id: "q2",
        text: "Feeling down, depressed, or hopeless",
        options: [
          { label: "Not at all", value: 0 },
          { label: "Several days", value: 1 },
          { label: "More than half the days", value: 2 },
          { label: "Nearly every day", value: 3 },
        ],
      },
      {
        id: "q3",
        text: "Trouble falling or staying asleep, or sleeping too much",
        options: [
          { label: "Not at all", value: 0 },
          { label: "Several days", value: 1 },
          { label: "More than half the days", value: 2 },
          { label: "Nearly every day", value: 3 },
        ],
      },
      {
        id: "q4",
        text: "Feeling tired or having little energy",
        options: [
          { label: "Not at all", value: 0 },
          { label: "Several days", value: 1 },
          { label: "More than half the days", value: 2 },
          { label: "Nearly every day", value: 3 },
        ],
      },
      {
        id: "q5",
        text: "Poor appetite or overeating",
        options: [
          { label: "Not at all", value: 0 },
          { label: "Several days", value: 1 },
          { label: "More than half the days", value: 2 },
          { label: "Nearly every day", value: 3 },
        ],
      },
    ],
  },
  {
    id: "gad7",
    title: "GAD-7 Anxiety",
    icon: "😰",
    description: "Generalized Anxiety Disorder scale for anxiety severity.",
    duration: "4 min",
    questions: [
      {
        id: "q1",
        text: "Feeling nervous, anxious, or on edge",
        options: [
          { label: "Not at all", value: 0 },
          { label: "Several days", value: 1 },
          { label: "More than half the days", value: 2 },
          { label: "Nearly every day", value: 3 },
        ],
      },
      {
        id: "q2",
        text: "Not being able to stop or control worrying",
        options: [
          { label: "Not at all", value: 0 },
          { label: "Several days", value: 1 },
          { label: "More than half the days", value: 2 },
          { label: "Nearly every day", value: 3 },
        ],
      },
      {
        id: "q3",
        text: "Worrying too much about different things",
        options: [
          { label: "Not at all", value: 0 },
          { label: "Several days", value: 1 },
          { label: "More than half the days", value: 2 },
          { label: "Nearly every day", value: 3 },
        ],
      },
      {
        id: "q4",
        text: "Trouble relaxing",
        options: [
          { label: "Not at all", value: 0 },
          { label: "Several days", value: 1 },
          { label: "More than half the days", value: 2 },
          { label: "Nearly every day", value: 3 },
        ],
      },
    ],
  },
  {
    id: "stress",
    title: "Stress Scale",
    icon: "⚡",
    description: "Perceived Stress Scale to measure stress levels.",
    duration: "3 min",
    questions: [
      {
        id: "q1",
        text: "Been upset because of something that happened unexpectedly",
        options: [
          { label: "Never", value: 0 },
          { label: "Almost never", value: 1 },
          { label: "Sometimes", value: 2 },
          { label: "Fairly often", value: 3 },
          { label: "Very often", value: 4 },
        ],
      },
      {
        id: "q2",
        text: "Felt that you were unable to control important things in your life",
        options: [
          { label: "Never", value: 0 },
          { label: "Almost never", value: 1 },
          { label: "Sometimes", value: 2 },
          { label: "Fairly often", value: 3 },
          { label: "Very often", value: 4 },
        ],
      },
      {
        id: "q3",
        text: "Felt nervous and stressed",
        options: [
          { label: "Never", value: 0 },
          { label: "Almost never", value: 1 },
          { label: "Sometimes", value: 2 },
          { label: "Fairly often", value: 3 },
          { label: "Very often", value: 4 },
        ],
      },
    ],
  },
  {
    id: "wellbeing",
    title: "Well-being Index",
    icon: "🌟",
    description: "WHO-5 Well-Being Index for overall mental wellness.",
    duration: "2 min",
    questions: [
      {
        id: "q1",
        text: "I have felt cheerful and in good spirits",
        options: [
          { label: "At no time", value: 0 },
          { label: "Some of the time", value: 1 },
          { label: "Less than half the time", value: 2 },
          { label: "More than half the time", value: 3 },
          { label: "Most of the time", value: 4 },
          { label: "All of the time", value: 5 },
        ],
      },
      {
        id: "q2",
        text: "I have felt calm and relaxed",
        options: [
          { label: "At no time", value: 0 },
          { label: "Some of the time", value: 1 },
          { label: "Less than half the time", value: 2 },
          { label: "More than half the time", value: 3 },
          { label: "Most of the time", value: 4 },
          { label: "All of the time", value: 5 },
        ],
      },
      {
        id: "q3",
        text: "I have felt active and vigorous",
        options: [
          { label: "At no time", value: 0 },
          { label: "Some of the time", value: 1 },
          { label: "Less than half the time", value: 2 },
          { label: "More than half the time", value: 3 },
          { label: "Most of the time", value: 4 },
          { label: "All of the time", value: 5 },
        ],
      },
    ],
  },
];

// ✅ Fix: result state uses a plain string for interpretation (not the nested object)
type ResultState = { score: number; interpretation: string } | null;

// ✅ Fix: narrow Assessment id to the union the API accepts
function isApiAssessmentType(id: string): id is "phq9" | "gad7" {
  return id === "phq9" || id === "gad7";
}

type Step = "list" | "taking" | "result";

export default function AssessmentsPage() {
  const [step, setStep] = useState<Step>("list");
  const [selected, setSelected] = useState<Assessment | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [currentQ, setCurrentQ] = useState(0);
  // ✅ Fix: ResultState uses string interpretation — compatible with both API and local paths
  const [result, setResult] = useState<ResultState>(null);
  const [submitting, setSubmitting] = useState(false);

  const startAssessment = (a: Assessment) => {
    setSelected(a);
    setAnswers({});
    setCurrentQ(0);
    setResult(null);
    setStep("taking");
  };

  const handleAnswer = (value: number) => {
    if (!selected) return;
    const qId = selected.questions[currentQ].id;
    const newAnswers = { ...answers, [qId]: value };
    setAnswers(newAnswers);
    if (currentQ < selected.questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      submitAssessment(newAnswers);
    }
  };

  const submitAssessment = async (finalAnswers: Record<string, number>) => {
    if (!selected) return;
    setSubmitting(true);

    const numericAnswers = Object.values(finalAnswers);
    const total = numericAnswers.reduce((a, b) => a + b, 0);

    try {
      // ✅ Fix: only call the API for types it supports (phq9 / gad7)
      if (isApiAssessmentType(selected.id)) {
        // assessmentAPI.submit expects number[] — values in insertion order are correct
        const res = await assessmentAPI.submit(selected.id, numericAnswers);
        // ✅ Fix: flatten the nested interpretation object into the string the state expects
        setResult({
          score: res.score,
          interpretation:
            `${res.interpretation.severity} — ${res.interpretation.description}` +
            (res.interpretation.recommendation
              ? ` ${res.interpretation.recommendation}`
              : ""),
        });
      } else {
        // Local scoring for stress / wellbeing (no backend endpoint)
        setResult({
          score: total,
          interpretation: getLocalInterpretation(selected.id, total),
        });
      }
    } catch {
      // API failed — fall back to local interpretation
      setResult({
        score: total,
        interpretation: getLocalInterpretation(selected.id, total),
      });
    } finally {
      setSubmitting(false);
      setStep("result");
    }
  };

  const getLocalInterpretation = (type: string, score: number): string => {
    if (type === "phq9") {
      if (score <= 4)
        return "Minimal depression — You appear to be doing well emotionally.";
      if (score <= 9)
        return "Mild depression — Some symptoms present. Self-care recommended.";
      if (score <= 14)
        return "Moderate depression — Consider speaking with a mental health professional.";
      return "Severe depression — Please reach out to a healthcare provider.";
    }
    if (type === "gad7") {
      if (score <= 4)
        return "Minimal anxiety — Your anxiety levels appear manageable.";
      if (score <= 9)
        return "Mild anxiety — Some anxiety present. Relaxation techniques may help.";
      if (score <= 14)
        return "Moderate anxiety — Consider professional support.";
      return "Severe anxiety — Please consult a healthcare professional.";
    }
    if (type === "stress") {
      if (score <= 6) return "Low stress — You are managing stress well.";
      if (score <= 12)
        return "Moderate stress — Consider stress-reduction strategies.";
      return "High stress — Please prioritize self-care and consider support.";
    }
    // wellbeing
    if (score >= 13) return "Good well-being — You are thriving!";
    if (score >= 8) return "Moderate well-being — Some room for improvement.";
    return "Low well-being — Consider speaking with a mental health professional.";
  };

  const progress = selected ? (currentQ / selected.questions.length) * 100 : 0;

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      {/* Header */}
      <header
        className="fixed top-0 left-0 right-0 z-100 border-b-2"
        style={{
          background: "var(--bg-secondary)",
          borderColor: "var(--border-strong)",
          boxShadow: "var(--shadow-md)",
        }}
      >
        <div className="max-w-350 mx-auto px-6 py-3 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl"
            style={{
              color: "var(--text-primary)",
              fontFamily: "DM Serif Display, serif",
            }}
          >
            🌿 Serene
          </Link>
          <Link
            href="/application"
            className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
            style={{
              background: "var(--bg-tertiary)",
              border: "1px solid var(--border-color)",
              color: "var(--text-primary)",
            }}
          >
            ← Back to Chat
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 pt-28 pb-16">
        {/* Assessment List */}
        {step === "list" && (
          <>
            <div className="text-center mb-12 animate-fade">
              <h1
                className="text-4xl font-bold mb-3"
                style={{
                  color: "var(--text-primary)",
                  fontFamily: "DM Serif Display, serif",
                }}
              >
                Clinical Assessments
              </h1>
              <p
                className="text-base max-w-xl mx-auto"
                style={{ color: "var(--text-secondary)" }}
              >
                Evidence-based tools to help you understand your mental health.
                Results are private and for self-awareness only.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {ASSESSMENTS.map((a, i) => (
                <div
                  key={a.id}
                  className="rounded-2xl p-6 border-2 transition-all cursor-pointer hover:-translate-y-1"
                  style={{
                    background: "var(--bg-secondary)",
                    borderColor: "var(--border-color)",
                    boxShadow: "var(--shadow-sm)",
                    animationDelay: `${i * 0.1}s`,
                  }}
                  onClick={() => startAssessment(a)}
                >
                  <div className="text-4xl mb-3">{a.icon}</div>
                  <h3
                    className="font-bold text-lg mb-2"
                    style={{
                      color: "var(--text-primary)",
                      fontFamily: "DM Serif Display, serif",
                    }}
                  >
                    {a.title}
                  </h3>
                  <p
                    className="text-sm mb-4 leading-relaxed"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {a.description}
                  </p>
                  <div className="flex items-center justify-between">
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
                      className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                      style={{
                        background: "var(--accent-primary)",
                        color: "var(--text-inverse)",
                      }}
                    >
                      Start →
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div
              className="mt-8 p-5 rounded-2xl text-sm text-center"
              style={{
                background: "rgba(184,90,74,0.08)",
                border: "1px solid rgba(184,90,74,0.2)",
                color: "var(--text-secondary)",
              }}
            >
              ⚠️ These assessments are for informational purposes only and do
              not constitute a clinical diagnosis. Please consult a qualified
              healthcare professional for medical advice.
            </div>
          </>
        )}

        {/* Taking Assessment */}
        {step === "taking" && selected && (
          <div className="max-w-2xl mx-auto animate-fade">
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <h2
                  className="font-bold text-xl"
                  style={{
                    color: "var(--text-primary)",
                    fontFamily: "DM Serif Display, serif",
                  }}
                >
                  {selected.icon} {selected.title}
                </h2>
                <span
                  className="text-sm"
                  style={{ color: "var(--text-muted)" }}
                >
                  {currentQ + 1} / {selected.questions.length}
                </span>
              </div>
              <div
                className="h-2 rounded-full overflow-hidden"
                style={{ background: "var(--bg-tertiary)" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${progress}%`,
                    background: "var(--accent-primary)",
                  }}
                />
              </div>
            </div>
            <div
              className="rounded-2xl p-8 mb-6 border-2"
              style={{
                background: "var(--bg-secondary)",
                borderColor: "var(--border-color)",
                boxShadow: "var(--shadow-md)",
              }}
            >
              <p
                className="text-lg font-medium mb-8 leading-relaxed"
                style={{ color: "var(--text-primary)" }}
              >
                {selected.questions[currentQ].text}
              </p>
              <div className="space-y-3">
                {selected.questions[currentQ].options.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleAnswer(opt.value)}
                    disabled={submitting}
                    className="w-full text-left px-5 py-4 rounded-xl border-2 font-medium text-sm transition-all hover:-translate-x-1"
                    style={{
                      background: "var(--bg-primary)",
                      borderColor: "var(--border-color)",
                      color: "var(--text-primary)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor =
                        "var(--accent-primary)";
                      e.currentTarget.style.background = "rgba(45,90,61,0.05)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--border-color)";
                      e.currentTarget.style.background = "var(--bg-primary)";
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={() => setStep("list")}
              className="text-sm transition-all"
              style={{ color: "var(--text-muted)" }}
            >
              ← Cancel Assessment
            </button>
          </div>
        )}

        {/* Result */}
        {step === "result" && selected && result && (
          <div className="max-w-2xl mx-auto text-center animate-fade">
            <div className="text-6xl mb-6">
              {result.score <= 5
                ? "🌟"
                : result.score <= 10
                  ? "🌱"
                  : result.score <= 15
                    ? "⚠️"
                    : "🆘"}
            </div>
            <h2
              className="text-3xl font-bold mb-2"
              style={{
                color: "var(--text-primary)",
                fontFamily: "DM Serif Display, serif",
              }}
            >
              Assessment Complete
            </h2>
            <p
              className="text-base mb-8"
              style={{ color: "var(--text-secondary)" }}
            >
              {selected.title} Results
            </p>
            <div
              className="rounded-2xl p-8 mb-6 border-2 text-left"
              style={{
                background: "var(--bg-secondary)",
                borderColor: "var(--border-strong)",
                boxShadow: "var(--shadow-md)",
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <span
                  className="text-sm font-semibold"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Your Score
                </span>
                <span
                  className="text-4xl font-bold"
                  style={{
                    color: "var(--accent-primary)",
                    fontFamily: "DM Serif Display, serif",
                  }}
                >
                  {result.score}
                </span>
              </div>
              <div
                className="h-px mb-4"
                style={{ background: "var(--border-color)" }}
              />
              {/* ✅ result.interpretation is always a plain string now */}
              <p
                className="text-base leading-relaxed"
                style={{ color: "var(--text-primary)" }}
              >
                {result.interpretation}
              </p>
            </div>
            <div className="flex gap-3 justify-center flex-wrap">
              <button
                onClick={() => startAssessment(selected)}
                className="px-6 py-3 rounded-xl font-semibold text-sm transition-all"
                style={{
                  background: "var(--accent-primary)",
                  color: "var(--text-inverse)",
                }}
              >
                Retake Assessment
              </button>
              <button
                onClick={() => setStep("list")}
                className="px-6 py-3 rounded-xl font-semibold text-sm transition-all border-2"
                style={{
                  borderColor: "var(--border-strong)",
                  color: "var(--text-primary)",
                  background: "transparent",
                }}
              >
                All Assessments
              </button>
              <Link
                href="/application"
                className="px-6 py-3 rounded-xl font-semibold text-sm transition-all"
                style={{
                  background: "var(--bg-tertiary)",
                  color: "var(--text-secondary)",
                  border: "1px solid var(--border-color)",
                }}
              >
                Back to Chat
              </Link>
            </div>
            <p className="text-xs mt-8" style={{ color: "var(--text-muted)" }}>
              This result is for personal awareness only. Please consult a
              qualified professional for diagnosis.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

