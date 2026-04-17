'use client';
import { useState, useEffect, useRef } from 'react';

interface WellnessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/* ── Breathing patterns ── */
const PATTERNS = [
  { label: 'Box Breathing', inhale: 4, hold1: 4, exhale: 4, hold2: 4, desc: 'Equal 4-4-4-4 — great for focus & calm.' },
  { label: '4-7-8 Breathing', inhale: 4, hold1: 7, exhale: 8, hold2: 0, desc: 'Inhale 4s · hold 7s · exhale 8s — promotes deep relaxation.' },
  { label: 'Belly Breathing', inhale: 5, hold1: 0, exhale: 5, hold2: 0, desc: 'Slow diaphragmatic breaths — reduces stress instantly.' },
];

type Phase = 'inhale' | 'hold1' | 'exhale' | 'hold2';
const PHASE_LABELS: Record<Phase, string> = {
  inhale: 'Inhale',
  hold1: 'Hold',
  exhale: 'Exhale',
  hold2: 'Hold',
};

function BreathingTab() {
  const [patternIdx, setPatternIdx] = useState(0);
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState<Phase>('inhale');
  const [count, setCount] = useState(0);
  const [cycles, setCycles] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stateRef = useRef({ phase: 'inhale' as Phase, count: 0 });

  const pattern = PATTERNS[patternIdx];

  const getPhaseDuration = (p: Phase) => {
    if (p === 'inhale') return pattern.inhale;
    if (p === 'hold1') return pattern.hold1;
    if (p === 'exhale') return pattern.exhale;
    return pattern.hold2;
  };

  const nextPhase = (p: Phase): Phase => {
    if (p === 'inhale') return pattern.hold1 > 0 ? 'hold1' : 'exhale';
    if (p === 'hold1') return 'exhale';
    if (p === 'exhale') return pattern.hold2 > 0 ? 'hold2' : 'inhale';
    return 'inhale';
  };

  const stop = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setRunning(false);
    setPhase('inhale');
    setCount(0);
    setCycles(0);
    stateRef.current = { phase: 'inhale', count: 0 };
  };

  const start = () => {
    const initialDuration = getPhaseDuration('inhale');
    setPhase('inhale');
    setCount(initialDuration);
    setCycles(0);
    stateRef.current = { phase: 'inhale', count: initialDuration };
    setRunning(true);

    intervalRef.current = setInterval(() => {
      stateRef.current.count -= 1;
      if (stateRef.current.count <= 0) {
        const np = nextPhase(stateRef.current.phase);
        if (np === 'inhale') setCycles(c => c + 1);
        const nd = getPhaseDuration(np);
        stateRef.current = { phase: np, count: nd };
        setPhase(np);
        setCount(nd);
      } else {
        setCount(stateRef.current.count);
      }
    }, 1000);
  };

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  /* circle animation scale */
  const circleScale = phase === 'inhale' ? 1 : phase === 'exhale' ? 0.55 : 0.9;
  const phaseDuration = running ? getPhaseDuration(phase) : 1;
  const progressPct = running ? ((phaseDuration - count) / phaseDuration) * 100 : 0;

  const phaseColors: Record<Phase, string> = {
    inhale: 'var(--color-text-info)',
    hold1: 'var(--color-text-warning)',
    exhale: 'var(--color-text-success)',
    hold2: 'var(--color-text-warning)',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Pattern selector */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {PATTERNS.map((p, i) => (
          <button
            key={p.label}
            onClick={() => { stop(); setPatternIdx(i); }}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              border: `1px solid ${patternIdx === i ? 'var(--color-border-info)' : 'var(--color-border-tertiary)'}`,
              background: patternIdx === i ? 'var(--color-background-info)' : 'var(--color-background-secondary)',
              color: patternIdx === i ? 'var(--color-text-info)' : 'var(--color-text-secondary)',
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: 0 }}>{pattern.desc}</p>

      {/* Circle */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '8px 0' }}>
        <div style={{ position: 'relative', width: '160px', height: '160px' }}>
          {/* Progress ring */}
          <svg width="160" height="160" style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' }}>
            <circle cx="80" cy="80" r="72" fill="none" stroke="var(--color-border-tertiary)" strokeWidth="4" />
            <circle
              cx="80" cy="80" r="72" fill="none"
              stroke={running ? phaseColors[phase] : 'var(--color-border-tertiary)'}
              strokeWidth="4"
              strokeDasharray={`${2 * Math.PI * 72}`}
              strokeDashoffset={`${2 * Math.PI * 72 * (1 - progressPct / 100)}`}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.9s linear, stroke 0.3s' }}
            />
          </svg>
          {/* Breathing circle */}
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: `translate(-50%, -50%) scale(${running ? circleScale : 0.7})`,
            transition: `transform ${phase === 'inhale' ? pattern.inhale : phase === 'exhale' ? pattern.exhale : 0.3}s ease-in-out`,
            width: '110px', height: '110px', borderRadius: '50%',
            background: 'var(--color-background-info)',
            border: '1px solid var(--color-border-tertiary)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: '2px',
          }}>
            <span style={{ fontSize: '26px', fontWeight: 500, color: running ? phaseColors[phase] : 'var(--color-text-secondary)', transition: 'color 0.3s' }}>
              {running ? count : '·'}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)', letterSpacing: '0.04em' }}>
              {running ? PHASE_LABELS[phase] : 'ready'}
            </span>
          </div>
        </div>

        {running && (
          <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: 0 }}>
            Cycle {cycles + 1}
          </p>
        )}

        <button
          onClick={running ? stop : start}
          style={{
            padding: '10px 32px',
            borderRadius: '10px',
            border: '1px solid var(--color-border-secondary)',
            background: running ? 'var(--color-background-danger)' : 'var(--color-background-success)',
            color: running ? 'var(--color-text-danger)' : 'var(--color-text-success)',
            fontSize: '14px',
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          {running ? 'Stop' : 'Start Breathing'}
        </button>
      </div>
    </div>
  );
}

/* ── Mindful Walking Tab ── */
const WALK_TOTAL = 10 * 60; // 10 minutes

const WALK_CUES = [
  { at: 600, text: 'Begin walking at a comfortable pace. Feel the ground beneath each step.' },
  { at: 480, text: 'Notice the sensation of each footfall — heel, arch, toe.' },
  { at: 360, text: 'Breathe naturally. Inhale for 4 steps, exhale for 4 steps.' },
  { at: 240, text: 'Soften your gaze. Take in your surroundings without judgment.' },
  { at: 120, text: 'Feel your arms swinging gently. Relax your shoulders.' },
  { at: 60,  text: 'Begin slowing your pace. One minute remaining.' },
  { at: 10,  text: 'Come to a gentle stop. Take three deep breaths.' },
];

function WalkingTab() {
  const [running, setRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(WALK_TOTAL);
  const [cueText, setCueText] = useState('');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeRef = useRef(WALK_TOTAL);

  const stop = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setRunning(false);
    setTimeLeft(WALK_TOTAL);
    timeRef.current = WALK_TOTAL;
    setCueText('');
  };

  const start = () => {
    timeRef.current = WALK_TOTAL;
    setTimeLeft(WALK_TOTAL);
    setCueText('Find a safe place to walk. Start whenever you\'re ready.');
    setRunning(true);

    intervalRef.current = setInterval(() => {
      timeRef.current -= 1;
      setTimeLeft(timeRef.current);

      const cue = WALK_CUES.find(c => c.at === timeRef.current);
      if (cue) setCueText(cue.text);

      if (timeRef.current <= 0) {
        clearInterval(intervalRef.current!);
        setRunning(false);
        setCueText('Well done. Your mindful walk is complete.');
      }
    }, 1000);
  };

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const progress = ((WALK_TOTAL - timeLeft) / WALK_TOTAL) * 100;
  const circumference = 2 * Math.PI * 68;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
      {/* Timer ring */}
      <div style={{ position: 'relative', width: '170px', height: '170px' }}>
        <svg width="170" height="170" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="85" cy="85" r="68" fill="none" stroke="var(--color-border-tertiary)" strokeWidth="5" />
          <circle
            cx="85" cy="85" r="68" fill="none"
            stroke="var(--color-text-success)"
            strokeWidth="5"
            strokeDasharray={`${circumference}`}
            strokeDashoffset={`${circumference * (1 - progress / 100)}`}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.9s linear' }}
          />
        </svg>
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '30px', fontWeight: 500, color: 'var(--color-text-primary)', fontVariantNumeric: 'tabular-nums' }}>
            {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>remaining</div>
        </div>
      </div>

      {/* Cue card */}
      <div style={{
        minHeight: '52px', padding: '12px 16px',
        background: 'var(--color-background-secondary)',
        border: '0.5px solid var(--color-border-tertiary)',
        borderRadius: 'var(--border-radius-lg)',
        width: '100%', textAlign: 'center',
      }}>
        <p style={{ fontSize: '13.5px', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
          {cueText || '10-minute mindful walk with gentle cues throughout.'}
        </p>
      </div>

      <button
        onClick={running ? stop : start}
        style={{
          padding: '10px 32px',
          borderRadius: '10px',
          border: '1px solid var(--color-border-secondary)',
          background: running ? 'var(--color-background-danger)' : 'var(--color-background-success)',
          color: running ? 'var(--color-text-danger)' : 'var(--color-text-success)',
          fontSize: '14px', fontWeight: 500, cursor: 'pointer',
        }}
      >
        {running ? 'Stop Walk' : 'Start Walk'}
      </button>
    </div>
  );
}

/* ── Music Tab ── */
function MusicTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center', padding: '12px 0' }}>
      <div style={{
        width: '80px', height: '80px', borderRadius: '50%',
        background: 'var(--color-background-info)',
        border: '0.5px solid var(--color-border-tertiary)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="var(--color-text-info)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 6v14M12 6l12-3v14M24 17c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3zM12 20c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3z"/>
        </svg>
      </div>

      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: '15px', fontWeight: 500, color: 'var(--color-text-primary)', margin: '0 0 6px' }}>
          Listen to calm music
        </p>
        <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.6 }}>
          Curated soundscapes and music designed to reduce stress and aid focus.
        </p>
      </div>

      <a
        href="https://www.calm.com/"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          padding: '10px 28px',
          borderRadius: '10px',
          border: '1px solid var(--color-border-info)',
          background: 'var(--color-background-info)',
          color: 'var(--color-text-info)',
          fontSize: '14px', fontWeight: 500,
          textDecoration: 'none',
          cursor: 'pointer',
        }}
      >
        Open Calm →
      </a>

      <p style={{ fontSize: '11.5px', color: 'var(--color-text-tertiary)', margin: 0 }}>
        Opens calm.com in a new tab
      </p>
    </div>
  );
}

/* ── Main Modal ── */
type Tab = 'breathing' | 'walking' | 'music';

const TABS: { key: Tab; label: string }[] = [
  { key: 'breathing', label: 'Breathing' },
  { key: 'walking',   label: 'Mindful Walk' },
  { key: 'music',     label: 'Calm Music' },
];

export default function WellnessModal({ isOpen, onClose }: WellnessModalProps) {
  const [tab, setTab] = useState<Tab>('breathing');

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 2000,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)',
      }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        width: '90%', maxWidth: '520px',
        maxHeight: '88vh', overflowY: 'auto',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: '18px',
        boxShadow: 'var(--shadow-lg)',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{
          padding: '18px 24px 0',
          borderBottom: '1px solid var(--border-color)',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '30px', height: '30px', borderRadius: '8px',
                background: 'linear-gradient(135deg, #2d5a3d, #4a7c59)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M8 13.5S2 9.5 2 5.5C2 3.5 3.5 2 5.5 2c1.1 0 2 .6 2.5 1.5C8.5 2.6 9.4 2 10.5 2 12.5 2 14 3.5 14 5.5c0 4-6 8-6 8z"/>
                </svg>
              </div>
              <h2 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                Wellness Center
              </h2>
            </div>
            <button
              onClick={onClose}
              style={{
                width: '30px', height: '30px', border: 'none',
                background: 'var(--bg-tertiary)', borderRadius: '8px',
                cursor: 'pointer', color: 'var(--text-muted)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                <path d="M3 3l10 10M13 3L3 13"/>
              </svg>
            </button>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex' }}>
            {TABS.map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                style={{
                  padding: '8px 18px',
                  background: 'transparent', border: 'none',
                  borderBottom: tab === t.key ? '2px solid var(--accent-primary)' : '2px solid transparent',
                  color: tab === t.key ? 'var(--accent-primary)' : 'var(--text-muted)',
                  fontSize: '13.5px', fontWeight: tab === t.key ? 600 : 400,
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '24px', flex: 1 }}>
          {tab === 'breathing' && <BreathingTab />}
          {tab === 'walking'   && <WalkingTab />}
          {tab === 'music'     && <MusicTab />}
        </div>
      </div>
    </div>
  );
}