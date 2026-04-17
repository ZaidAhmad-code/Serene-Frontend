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
  color: string;
  gradient: string;
  description: string;
  duration: string;
  questions: Question[];
}

const ASSESSMENTS: Assessment[] = [
  {
    id: "phq9", title: "PHQ-9 Depression", icon: "🧠", color: "#6c63ff",
    gradient: "linear-gradient(135deg, #6c63ff 0%, #9b94ff 100%)",
    description: "Patient Health Questionnaire measuring depression severity across 9 key areas.",
    duration: "5 min",
    questions: [
      { id: "q1", text: "Little interest or pleasure in doing things", options: [{ label: "Not at all", value: 0 }, { label: "Several days", value: 1 }, { label: "More than half the days", value: 2 }, { label: "Nearly every day", value: 3 }] },
      { id: "q2", text: "Feeling down, depressed, or hopeless", options: [{ label: "Not at all", value: 0 }, { label: "Several days", value: 1 }, { label: "More than half the days", value: 2 }, { label: "Nearly every day", value: 3 }] },
      { id: "q3", text: "Trouble falling or staying asleep, or sleeping too much", options: [{ label: "Not at all", value: 0 }, { label: "Several days", value: 1 }, { label: "More than half the days", value: 2 }, { label: "Nearly every day", value: 3 }] },
      { id: "q4", text: "Feeling tired or having little energy", options: [{ label: "Not at all", value: 0 }, { label: "Several days", value: 1 }, { label: "More than half the days", value: 2 }, { label: "Nearly every day", value: 3 }] },
      { id: "q5", text: "Poor appetite or overeating", options: [{ label: "Not at all", value: 0 }, { label: "Several days", value: 1 }, { label: "More than half the days", value: 2 }, { label: "Nearly every day", value: 3 }] },
    ],
  },
  {
    id: "gad7", title: "GAD-7 Anxiety", icon: "🌊", color: "#0ea5e9",
    gradient: "linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%)",
    description: "Generalized Anxiety Disorder scale measuring your anxiety levels and triggers.",
    duration: "4 min",
    questions: [
      { id: "q1", text: "Feeling nervous, anxious, or on edge", options: [{ label: "Not at all", value: 0 }, { label: "Several days", value: 1 }, { label: "More than half the days", value: 2 }, { label: "Nearly every day", value: 3 }] },
      { id: "q2", text: "Not being able to stop or control worrying", options: [{ label: "Not at all", value: 0 }, { label: "Several days", value: 1 }, { label: "More than half the days", value: 2 }, { label: "Nearly every day", value: 3 }] },
      { id: "q3", text: "Worrying too much about different things", options: [{ label: "Not at all", value: 0 }, { label: "Several days", value: 1 }, { label: "More than half the days", value: 2 }, { label: "Nearly every day", value: 3 }] },
      { id: "q4", text: "Trouble relaxing", options: [{ label: "Not at all", value: 0 }, { label: "Several days", value: 1 }, { label: "More than half the days", value: 2 }, { label: "Nearly every day", value: 3 }] },
    ],
  },
  {
    id: "stress", title: "Stress Scale", icon: "⚡", color: "#f59e0b",
    gradient: "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)",
    description: "Perceived Stress Scale to measure how much you feel in control of your life.",
    duration: "3 min",
    questions: [
      { id: "q1", text: "Been upset because of something that happened unexpectedly", options: [{ label: "Never", value: 0 }, { label: "Almost never", value: 1 }, { label: "Sometimes", value: 2 }, { label: "Fairly often", value: 3 }, { label: "Very often", value: 4 }] },
      { id: "q2", text: "Felt that you were unable to control important things in your life", options: [{ label: "Never", value: 0 }, { label: "Almost never", value: 1 }, { label: "Sometimes", value: 2 }, { label: "Fairly often", value: 3 }, { label: "Very often", value: 4 }] },
      { id: "q3", text: "Felt nervous and stressed", options: [{ label: "Never", value: 0 }, { label: "Almost never", value: 1 }, { label: "Sometimes", value: 2 }, { label: "Fairly often", value: 3 }, { label: "Very often", value: 4 }] },
    ],
  },
  {
    id: "wellbeing", title: "Well-being Index", icon: "🌟", color: "#10b981",
    gradient: "linear-gradient(135deg, #10b981 0%, #34d399 100%)",
    description: "WHO-5 Well-Being Index for a holistic picture of your overall mental wellness.",
    duration: "2 min",
    questions: [
      { id: "q1", text: "I have felt cheerful and in good spirits", options: [{ label: "At no time", value: 0 }, { label: "Some of the time", value: 1 }, { label: "Less than half", value: 2 }, { label: "More than half", value: 3 }, { label: "Most of the time", value: 4 }, { label: "All of the time", value: 5 }] },
      { id: "q2", text: "I have felt calm and relaxed", options: [{ label: "At no time", value: 0 }, { label: "Some of the time", value: 1 }, { label: "Less than half", value: 2 }, { label: "More than half", value: 3 }, { label: "Most of the time", value: 4 }, { label: "All of the time", value: 5 }] },
      { id: "q3", text: "I have felt active and vigorous", options: [{ label: "At no time", value: 0 }, { label: "Some of the time", value: 1 }, { label: "Less than half", value: 2 }, { label: "More than half", value: 3 }, { label: "Most of the time", value: 4 }, { label: "All of the time", value: 5 }] },
    ],
  },
];

type ResultState = { score: number; interpretation: string; maxScore: number } | null;
type Step = "list" | "taking" | "result";

function isApiAssessmentType(id: string): id is "phq9" | "gad7" {
  return id === "phq9" || id === "gad7";
}

function getLocalInterpretation(type: string, score: number): string {
  if (type === "phq9") {
    if (score <= 4) return "Minimal depression — You appear to be doing well emotionally.";
    if (score <= 9) return "Mild depression — Some symptoms present. Self-care is recommended.";
    if (score <= 14) return "Moderate depression — Consider speaking with a mental health professional.";
    return "Severe depression — Please reach out to a healthcare provider soon.";
  }
  if (type === "gad7") {
    if (score <= 4) return "Minimal anxiety — Your anxiety levels appear manageable.";
    if (score <= 9) return "Mild anxiety — Some anxiety present. Relaxation techniques may help.";
    if (score <= 14) return "Moderate anxiety — Consider professional support.";
    return "Severe anxiety — Please consult a healthcare professional.";
  }
  if (type === "stress") {
    if (score <= 6) return "Low stress — You are managing stress well. Keep it up!";
    if (score <= 12) return "Moderate stress — Consider stress-reduction strategies like breathing or journaling.";
    return "High stress — Please prioritize self-care and consider seeking support.";
  }
  if (score >= 13) return "Good well-being — You are thriving! Keep nurturing yourself.";
  if (score >= 8) return "Moderate well-being — There is some room for improvement in daily habits.";
  return "Low well-being — Consider speaking with a mental health professional.";
}

function getScoreColor(score: number, maxScore: number): string {
  const pct = score / maxScore;
  if (pct <= 0.25) return "#10b981";
  if (pct <= 0.5)  return "#f59e0b";
  if (pct <= 0.75) return "#f97316";
  return "#ef4444";
}

export default function AssessmentsPage() {
  const [step, setStep] = useState<Step>("list");
  const [selected, setSelected] = useState<Assessment | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [currentQ, setCurrentQ] = useState(0);
  const [result, setResult] = useState<ResultState>(null);
  const [submitting, setSubmitting] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const startAssessment = (a: Assessment) => {
    setSelected(a); setAnswers({}); setCurrentQ(0); setResult(null); setSelectedAnswer(null); setStep("taking");
  };

  const handleAnswer = (value: number) => {
    if (!selected || submitting || selectedAnswer !== null) return;
    setSelectedAnswer(value);
    setTimeout(() => {
      const qId = selected.questions[currentQ].id;
      const newAnswers = { ...answers, [qId]: value };
      setAnswers(newAnswers);
      setSelectedAnswer(null);
      if (currentQ < selected.questions.length - 1) {
        setCurrentQ(currentQ + 1);
      } else {
        submitAssessment(newAnswers);
      }
    }, 320);
  };

  const submitAssessment = async (finalAnswers: Record<string, number>) => {
    if (!selected) return;
    setSubmitting(true);
    const numericAnswers = Object.values(finalAnswers);
    const total = numericAnswers.reduce((a, b) => a + b, 0);
    const maxScore = selected.questions.length * (selected.questions[0]?.options.at(-1)?.value ?? 3);
    try {
      if (isApiAssessmentType(selected.id)) {
        const res = await assessmentAPI.submit(selected.id, numericAnswers);
        setResult({ score: res.score, maxScore: res.max_score, interpretation: `${res.interpretation.severity} — ${res.interpretation.description}${res.interpretation.recommendation ? " " + res.interpretation.recommendation : ""}` });
      } else {
        setResult({ score: total, maxScore, interpretation: getLocalInterpretation(selected.id, total) });
      }
    } catch {
      setResult({ score: total, maxScore, interpretation: getLocalInterpretation(selected.id, total) });
    } finally {
      setSubmitting(false);
      setStep("result");
    }
  };

  const progress = selected ? (currentQ / selected.questions.length) * 100 : 0;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
        @keyframes scaleIn { from { opacity:0; transform:scale(0.94); } to { opacity:1; transform:scale(1); } }
        @keyframes progressFill { from { width:0; } to { width:var(--pw); } }
        .card-hover { transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.2s; }
        .card-hover:hover { transform: translateY(-8px); box-shadow: 0 24px 60px rgba(0,0,0,0.13) !important; }
        .opt-btn { transition: all 0.18s ease; }
        .opt-btn:hover:not(:disabled) { transform: translateX(5px); }
      `}</style>

      {/* Header */}
      <header style={{ position:"fixed", top:0, left:0, right:0, zIndex:100, background:"rgba(255,255,255,0.9)", backdropFilter:"blur(20px)", borderBottom:"1px solid var(--border-color)", boxShadow:"0 1px 24px rgba(0,0,0,0.06)" }}>
        <div style={{ maxWidth:"1000px", margin:"0 auto", padding:"0 24px", height:"60px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <Link href="/" style={{ display:"flex", alignItems:"center", gap:"10px", textDecoration:"none" }}>
            <div style={{ width:"32px", height:"32px", borderRadius:"10px", background:"linear-gradient(135deg,#2d5a3d,#4a7c59)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <span style={{ fontSize:"16px" }}>🌿</span>
            </div>
            <span style={{ fontSize:"17px", fontWeight:700, color:"var(--text-primary)", fontFamily:"DM Serif Display, serif" }}>Serene</span>
          </Link>
          {step !== "list" && (
            <button onClick={() => { setStep("list"); setSelected(null); }} style={{ padding:"8px 18px", borderRadius:"10px", fontSize:"13px", fontWeight:500, background:"var(--bg-secondary)", border:"1px solid var(--border-color)", color:"var(--text-primary)", cursor:"pointer" }}>
              ← All Assessments
            </button>
          )}
          {step === "list" && (
            <Link href="/application" style={{ padding:"8px 18px", borderRadius:"10px", fontSize:"13px", fontWeight:500, background:"var(--bg-secondary)", border:"1px solid var(--border-color)", color:"var(--text-primary)", textDecoration:"none" }}>
              ← Back to Chat
            </Link>
          )}
        </div>
      </header>

      <main style={{ maxWidth:"860px", margin:"0 auto", padding:"90px 24px 80px" }}>

        {/* ── LIST ── */}
        {step === "list" && (
          <div style={{ animation:"fadeUp 0.5s ease forwards" }}>
            <div style={{ textAlign:"center", marginBottom:"52px" }}>
              <div style={{ display:"inline-flex", alignItems:"center", gap:"8px", padding:"5px 16px", borderRadius:"20px", marginBottom:"18px", background:"rgba(45,90,61,0.08)", border:"1px solid rgba(45,90,61,0.15)" }}>
                <span style={{ fontSize:"11px", color:"var(--accent-primary)", fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase" }}>Evidence-Based</span>
              </div>
              <h1 style={{ fontSize:"44px", fontWeight:700, color:"var(--text-primary)", fontFamily:"DM Serif Display, serif", margin:"0 0 16px", lineHeight:1.15 }}>
                Mental Health<br />Assessments
              </h1>
              <p style={{ fontSize:"16px", color:"var(--text-secondary)", maxWidth:"460px", margin:"0 auto", lineHeight:1.75 }}>
                Clinically validated tools for self-awareness. Results are private and for personal insight only.
              </p>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(360px, 1fr))", gap:"22px", marginBottom:"36px" }}>
              {ASSESSMENTS.map((a, i) => (
                <div key={a.id} className="card-hover" onClick={() => startAssessment(a)} style={{ background:"var(--bg-secondary)", border:"1px solid var(--border-color)", borderRadius:"22px", overflow:"hidden", cursor:"pointer", animation:`fadeUp 0.5s ease ${i * 0.1}s both`, boxShadow:"0 4px 20px rgba(0,0,0,0.05)" }}>
                  <div style={{ height:"5px", background:a.gradient }} />
                  <div style={{ padding:"26px" }}>
                    <div style={{ display:"flex", alignItems:"flex-start", gap:"16px" }}>
                      <div style={{ width:"56px", height:"56px", borderRadius:"18px", background:a.gradient, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"26px", boxShadow:`0 8px 24px ${a.color}35` }}>
                        {a.icon}
                      </div>
                      <div style={{ flex:1 }}>
                        <h3 style={{ fontSize:"17px", fontWeight:700, color:"var(--text-primary)", margin:"0 0 7px", fontFamily:"DM Serif Display, serif" }}>{a.title}</h3>
                        <p style={{ fontSize:"13px", color:"var(--text-secondary)", margin:0, lineHeight:1.65 }}>{a.description}</p>
                      </div>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginTop:"22px", paddingTop:"18px", borderTop:"1px solid var(--border-color)" }}>
                      <div style={{ display:"flex", gap:"8px" }}>
                        <span style={{ fontSize:"12px", padding:"4px 12px", borderRadius:"20px", background:`${a.color}15`, color:a.color, fontWeight:600 }}>⏱ {a.duration}</span>
                        <span style={{ fontSize:"12px", padding:"4px 12px", borderRadius:"20px", background:"var(--bg-tertiary)", color:"var(--text-muted)", fontWeight:500 }}>{a.questions.length} questions</span>
                      </div>
                      <span style={{ display:"flex", alignItems:"center", gap:"5px", color:a.color, fontSize:"13px", fontWeight:700 }}>
                        Start
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M4 8h8M9 5l3 3-3 3"/></svg>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ padding:"18px 24px", borderRadius:"16px", textAlign:"center", background:"rgba(245,158,11,0.07)", border:"1px solid rgba(245,158,11,0.2)", fontSize:"13px", color:"var(--text-secondary)", lineHeight:1.65 }}>
              ⚠️ These assessments are for <strong>informational purposes only</strong> and do not constitute a clinical diagnosis. Please consult a qualified healthcare professional for medical advice.
            </div>
          </div>
        )}

        {/* ── TAKING ── */}
        {step === "taking" && selected && (
          <div style={{ maxWidth:"620px", margin:"0 auto", animation:"scaleIn 0.38s ease forwards" }}>
            {/* Assessment header */}
            <div style={{ display:"flex", alignItems:"center", gap:"18px", marginBottom:"36px" }}>
              <div style={{ width:"60px", height:"60px", borderRadius:"20px", background:selected.gradient, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"28px", flexShrink:0, boxShadow:`0 10px 28px ${selected.color}35` }}>
                {selected.icon}
              </div>
              <div>
                <h2 style={{ fontSize:"24px", fontWeight:700, color:"var(--text-primary)", fontFamily:"DM Serif Display, serif", margin:"0 0 5px" }}>{selected.title}</h2>
                <p style={{ fontSize:"13px", color:"var(--text-muted)", margin:0 }}>Question {currentQ + 1} of {selected.questions.length}</p>
              </div>
            </div>

            {/* Step dots */}
            <div style={{ display:"flex", gap:"8px", marginBottom:"32px", alignItems:"center" }}>
              {selected.questions.map((_, i) => (
                <div key={i} style={{ flex:1, height:"6px", borderRadius:"3px", background: i < currentQ ? selected.color : i === currentQ ? `${selected.color}60` : "var(--bg-tertiary)", transition:"background 0.35s ease", boxShadow: i < currentQ ? `0 2px 8px ${selected.color}40` : "none" }} />
              ))}
              <span style={{ fontSize:"12px", color:"var(--text-muted)", marginLeft:"8px", minWidth:"30px" }}>{Math.round(progress)}%</span>
            </div>

            {/* Question card */}
            <div style={{ background:"var(--bg-secondary)", border:"1px solid var(--border-color)", borderRadius:"24px", padding:"36px 36px 32px", boxShadow:"0 12px 48px rgba(0,0,0,0.09)", marginBottom:"16px" }}>
              <span style={{ display:"inline-flex", alignItems:"center", padding:"4px 14px", borderRadius:"20px", background:`${selected.color}12`, color:selected.color, fontSize:"12px", fontWeight:700, marginBottom:"20px" }}>
                Q{currentQ + 1}
              </span>
              <p style={{ fontSize:"19px", fontWeight:600, color:"var(--text-primary)", lineHeight:1.6, marginBottom:"28px" }}>
                {selected.questions[currentQ].text}
              </p>
              <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
                {selected.questions[currentQ].options.map((opt, oi) => {
                  const isSelected = selectedAnswer === opt.value;
                  return (
                    <button key={opt.value} onClick={() => handleAnswer(opt.value)} disabled={submitting || selectedAnswer !== null} className="opt-btn"
                      style={{ display:"flex", alignItems:"center", gap:"16px", padding:"15px 20px", borderRadius:"16px", border:`2px solid ${isSelected ? selected.color : "var(--border-color)"}`, background: isSelected ? `${selected.color}0d` : "var(--bg-primary)", color:"var(--text-primary)", fontSize:"15px", fontWeight:500, cursor: (submitting || selectedAnswer !== null) ? "default" : "pointer", textAlign:"left", boxShadow: isSelected ? `0 0 0 4px ${selected.color}18` : "none", outline:"none" }}>
                      <div style={{ width:"32px", height:"32px", borderRadius:"50%", flexShrink:0, background: isSelected ? selected.color : "var(--bg-tertiary)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"13px", fontWeight:700, color: isSelected ? "#fff" : "var(--text-muted)", transition:"all 0.2s" }}>
                        {String.fromCharCode(65 + oi)}
                      </div>
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {submitting && (
              <div style={{ textAlign:"center", padding:"14px", color:"var(--text-muted)", fontSize:"13px", display:"flex", alignItems:"center", justifyContent:"center", gap:"10px" }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="var(--accent-primary)" strokeWidth="2" strokeLinecap="round" style={{ animation:"spin 1s linear infinite" }}><path d="M8 2a6 6 0 1 0 0 12"/></svg>
                Calculating your results…
              </div>
            )}
          </div>
        )}

        {/* ── RESULT ── */}
        {step === "result" && selected && result && (
          <div style={{ maxWidth:"580px", margin:"0 auto", animation:"fadeUp 0.5s ease forwards" }}>
            <div style={{ textAlign:"center", marginBottom:"40px" }}>
              <div style={{ width:"96px", height:"96px", borderRadius:"28px", background:selected.gradient, margin:"0 auto 24px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"44px", boxShadow:`0 16px 48px ${selected.color}35` }}>
                {selected.icon}
              </div>
              <h2 style={{ fontSize:"34px", fontWeight:700, color:"var(--text-primary)", fontFamily:"DM Serif Display, serif", margin:"0 0 8px" }}>Assessment Complete</h2>
              <p style={{ fontSize:"15px", color:"var(--text-secondary)", margin:0 }}>{selected.title}</p>
            </div>

            <div style={{ background:"var(--bg-secondary)", border:"1px solid var(--border-color)", borderRadius:"24px", padding:"32px", boxShadow:"0 12px 48px rgba(0,0,0,0.09)", marginBottom:"22px" }}>
              <div style={{ marginBottom:"28px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:"14px" }}>
                  <span style={{ fontSize:"12px", fontWeight:700, color:"var(--text-secondary)", textTransform:"uppercase", letterSpacing:"0.07em" }}>Your Score</span>
                  <div>
                    <span style={{ fontSize:"46px", fontWeight:700, color:getScoreColor(result.score, result.maxScore), fontFamily:"DM Serif Display, serif", lineHeight:1 }}>{result.score}</span>
                    <span style={{ fontSize:"18px", color:"var(--text-muted)", marginLeft:"4px" }}>/ {result.maxScore}</span>
                  </div>
                </div>
                <div style={{ height:"12px", borderRadius:"6px", background:"var(--bg-tertiary)", overflow:"hidden" }}>
                  <div style={{ height:"100%", borderRadius:"6px", background:getScoreColor(result.score, result.maxScore), width:`${Math.min(100, (result.score / result.maxScore) * 100)}%`, transition:"width 1.2s cubic-bezier(0.4,0,0.2,1)", boxShadow:`0 2px 10px ${getScoreColor(result.score, result.maxScore)}60` }} />
                </div>
              </div>
              <div style={{ height:"1px", background:"var(--border-color)", marginBottom:"24px" }} />
              <h3 style={{ fontSize:"14px", fontWeight:700, color:"var(--text-secondary)", textTransform:"uppercase", letterSpacing:"0.06em", margin:"0 0 12px" }}>What this means</h3>
              <p style={{ fontSize:"15.5px", color:"var(--text-primary)", lineHeight:1.75, margin:0 }}>{result.interpretation}</p>
            </div>

            <div style={{ display:"flex", gap:"12px", justifyContent:"center", flexWrap:"wrap" }}>
              <button onClick={() => startAssessment(selected)} style={{ padding:"13px 26px", borderRadius:"13px", fontSize:"14px", fontWeight:600, background:selected.gradient, color:"#fff", border:"none", cursor:"pointer", boxShadow:`0 6px 20px ${selected.color}35` }}>
                Retake
              </button>
              <button onClick={() => setStep("list")} style={{ padding:"13px 26px", borderRadius:"13px", fontSize:"14px", fontWeight:600, background:"var(--bg-secondary)", border:"2px solid var(--border-strong)", color:"var(--text-primary)", cursor:"pointer" }}>
                All Assessments
              </button>
              <Link href="/application" style={{ padding:"13px 26px", borderRadius:"13px", fontSize:"14px", fontWeight:600, background:"var(--bg-tertiary)", border:"1px solid var(--border-color)", color:"var(--text-secondary)", textDecoration:"none" }}>
                Back to Chat
              </Link>
            </div>

            <p style={{ textAlign:"center", fontSize:"12px", color:"var(--text-muted)", marginTop:"24px", lineHeight:1.65 }}>
              For personal awareness only. Consult a qualified professional for diagnosis and treatment.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
