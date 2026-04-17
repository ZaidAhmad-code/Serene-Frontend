'use client';
import { useState, useEffect, useRef } from 'react';

interface WellnessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PATTERNS = [
  { label: 'Box', inhale: 4, hold1: 4, exhale: 4, hold2: 4, desc: '4-4-4-4 · Perfect for focus & calm.' },
  { label: '4-7-8', inhale: 4, hold1: 7, exhale: 8, hold2: 0, desc: '4s in · 7s hold · 8s out · Deep relaxation.' },
  { label: 'Belly', inhale: 5, hold1: 0, exhale: 5, hold2: 0, desc: '5-5 · Diaphragmatic · Instant stress relief.' },
];

type Phase = 'inhale' | 'hold1' | 'exhale' | 'hold2';
const PHASE_LABELS: Record<Phase, string> = { inhale: 'Inhale', hold1: 'Hold', exhale: 'Exhale', hold2: 'Hold' };
const PHASE_COLORS: Record<Phase, string> = { inhale: '#0ea5e9', hold1: '#f59e0b', exhale: '#10b981', hold2: '#f59e0b' };

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
    setRunning(false); setPhase('inhale'); setCount(0); setCycles(0);
    stateRef.current = { phase: 'inhale', count: 0 };
  };

  const start = () => {
    const dur = getPhaseDuration('inhale');
    setPhase('inhale'); setCount(dur); setCycles(0);
    stateRef.current = { phase: 'inhale', count: dur };
    setRunning(true);
    intervalRef.current = setInterval(() => {
      stateRef.current.count -= 1;
      if (stateRef.current.count <= 0) {
        const np = nextPhase(stateRef.current.phase);
        if (np === 'inhale') setCycles(c => c + 1);
        const nd = getPhaseDuration(np);
        stateRef.current = { phase: np, count: nd };
        setPhase(np); setCount(nd);
      } else {
        setCount(stateRef.current.count);
      }
    }, 1000);
  };

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  const circleScale = running ? (phase === 'inhale' ? 1 : phase === 'exhale' ? 0.52 : 0.82) : 0.65;
  const phaseDuration = running ? getPhaseDuration(phase) : 1;
  const progressPct = running ? ((phaseDuration - count) / phaseDuration) * 100 : 0;
  const phaseColor = running ? PHASE_COLORS[phase] : '#94a3b8';
  const circumference = 2 * Math.PI * 72;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Pattern pills */}
      <div style={{ display: 'flex', gap: '8px' }}>
        {PATTERNS.map((p, i) => (
          <button key={p.label} onClick={() => { stop(); setPatternIdx(i); }}
            style={{ padding: '7px 18px', borderRadius: '20px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', border: 'none', background: patternIdx === i ? 'var(--accent-primary)' : 'var(--bg-tertiary)', color: patternIdx === i ? '#fff' : 'var(--text-secondary)', transition: 'all 0.2s' }}>
            {p.label}
          </button>
        ))}
      </div>
      <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.6 }}>{pattern.desc}</p>

      {/* Big circle */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', padding: '16px 0' }}>
        <div style={{ position: 'relative', width: '200px', height: '200px' }}>
          {/* Glow */}
          {running && (
            <div style={{ position: 'absolute', inset: '20px', borderRadius: '50%', background: phaseColor, opacity: 0.12, filter: 'blur(20px)', transform: `scale(${circleScale})`, transition: `transform ${phase === 'inhale' ? pattern.inhale : phase === 'exhale' ? pattern.exhale : 0.3}s ease-in-out` }} />
          )}
          {/* Progress ring */}
          <svg width="200" height="200" style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' }}>
            <circle cx="100" cy="100" r="72" fill="none" stroke="var(--border-color)" strokeWidth="5" />
            <circle cx="100" cy="100" r="72" fill="none" stroke={phaseColor} strokeWidth="5"
              strokeDasharray={`${circumference}`}
              strokeDashoffset={`${circumference * (1 - progressPct / 100)}`}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.9s linear, stroke 0.4s ease' }} />
          </svg>
          {/* Breathing orb */}
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            width: '130px', height: '130px',
            transform: `translate(-50%, -50%) scale(${circleScale})`,
            transition: `transform ${phase === 'inhale' ? pattern.inhale : phase === 'exhale' ? pattern.exhale : 0.3}s ease-in-out`,
            borderRadius: '50%',
            background: running
              ? `radial-gradient(circle, ${phaseColor}30 0%, ${phaseColor}10 60%, transparent 100%)`
              : 'radial-gradient(circle, rgba(148,163,184,0.15) 0%, transparent 70%)',
            border: `2px solid ${phaseColor}40`,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px',
            boxShadow: running ? `0 0 40px ${phaseColor}25` : 'none',
          }}>
            <span style={{ fontSize: '34px', fontWeight: 700, color: phaseColor, transition: 'color 0.4s', lineHeight: 1, fontFamily: 'DM Serif Display, serif' }}>
              {running ? count : '·'}
            </span>
            <span style={{ fontSize: '12px', color: running ? phaseColor : 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.05em', transition: 'color 0.4s' }}>
              {running ? PHASE_LABELS[phase] : 'Ready'}
            </span>
          </div>
        </div>

        {running && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
            <div style={{ display: 'flex', gap: '4px' }}>
              {Array.from({ length: Math.max(cycles, 1) }, (_, i) => (
                <div key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', background: i < cycles ? 'var(--accent-primary)' : 'var(--bg-tertiary)' }} />
              ))}
            </div>
            Cycle {cycles + 1}
          </div>
        )}

        <button onClick={running ? stop : start} style={{
          padding: '12px 36px', borderRadius: '14px', border: 'none', fontSize: '14px', fontWeight: 700, cursor: 'pointer',
          background: running ? 'rgba(239,68,68,0.1)' : 'linear-gradient(135deg, #2d5a3d, #4a7c59)',
          color: running ? '#ef4444' : '#fff',
          boxShadow: running ? 'none' : '0 6px 20px rgba(45,90,61,0.3)',
          transition: 'all 0.2s',
        }}>
          {running ? 'Stop' : '▶ Start Breathing'}
        </button>
      </div>
    </div>
  );
}

const WALK_TOTAL = 10 * 60;
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
    setRunning(false); setTimeLeft(WALK_TOTAL); timeRef.current = WALK_TOTAL; setCueText('');
  };

  const start = () => {
    timeRef.current = WALK_TOTAL;
    setTimeLeft(WALK_TOTAL);
    setCueText("Find a safe place to walk. Start whenever you're ready.");
    setRunning(true);
    intervalRef.current = setInterval(() => {
      timeRef.current -= 1;
      setTimeLeft(timeRef.current);
      const cue = WALK_CUES.find(c => c.at === timeRef.current);
      if (cue) setCueText(cue.text);
      if (timeRef.current <= 0) {
        clearInterval(intervalRef.current!);
        setRunning(false);
        setCueText('Well done. Your mindful walk is complete. 🌿');
      }
    }, 1000);
  };

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const progress = ((WALK_TOTAL - timeLeft) / WALK_TOTAL) * 100;
  const circumference = 2 * Math.PI * 72;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '22px' }}>
      {/* Timer ring */}
      <div style={{ position: 'relative', width: '200px', height: '200px' }}>
        {running && <div style={{ position: 'absolute', inset: '20px', borderRadius: '50%', background: '#10b981', opacity: 0.08, filter: 'blur(18px)' }} />}
        <svg width="200" height="200" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="100" cy="100" r="72" fill="none" stroke="var(--border-color)" strokeWidth="5" />
          <circle cx="100" cy="100" r="72" fill="none" stroke="#10b981" strokeWidth="5"
            strokeDasharray={`${circumference}`}
            strokeDashoffset={`${circumference * (1 - progress / 100)}`}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.9s linear' }} />
        </svg>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
          <div style={{ fontSize: '36px', fontWeight: 700, color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums', fontFamily: 'DM Serif Display, serif' }}>
            {String(mins).padStart(2,'0')}:{String(secs).padStart(2,'0')}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>remaining</div>
        </div>
      </div>

      <div style={{ padding: '16px 20px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '16px', width: '100%', textAlign: 'center', minHeight: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.65, margin: 0 }}>
          {cueText || '10-minute mindful walk with gentle cues throughout.'}
        </p>
      </div>

      <button onClick={running ? stop : start} style={{
        padding: '12px 36px', borderRadius: '14px', border: 'none', fontSize: '14px', fontWeight: 700, cursor: 'pointer',
        background: running ? 'rgba(239,68,68,0.1)' : 'linear-gradient(135deg,#10b981,#34d399)',
        color: running ? '#ef4444' : '#fff',
        boxShadow: running ? 'none' : '0 6px 20px rgba(16,185,129,0.3)',
        transition: 'all 0.2s',
      }}>
        {running ? 'Stop Walk' : '🚶 Start Walk'}
      </button>
    </div>
  );
}

function MusicTab() {
  const playlists = [
    { name: 'Rain & Nature', icon: '🌧️', url: 'https://www.youtube.com/results?search_query=rain+sounds+sleep', desc: 'Calm rain and forest sounds' },
    { name: 'Lo-fi Focus', icon: '🎵', url: 'https://www.youtube.com/results?search_query=lofi+hip+hop+study', desc: 'Gentle beats to focus' },
    { name: 'Calm.com', icon: '🧘', url: 'https://www.calm.com/', desc: 'Guided meditation & music' },
    { name: 'Ocean Waves', icon: '🌊', url: 'https://www.youtube.com/results?search_query=ocean+waves+relaxing', desc: 'Soothing coastal sounds' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
        Curated soundscapes and music designed to reduce stress and promote focus.
      </p>
      {playlists.map(p => (
        <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer"
          style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 18px', borderRadius: '16px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', textDecoration: 'none', transition: 'border-color 0.2s, box-shadow 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-primary)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(45,90,61,0.12)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.boxShadow = 'none'; }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'linear-gradient(135deg,#2d5a3d,#4a7c59)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>{p.icon}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px' }}>{p.name}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{p.desc}</div>
          </div>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round"><path d="M4 8h8M9 5l3 3-3 3" /></svg>
        </a>
      ))}
    </div>
  );
}

type Tab = 'breathing' | 'walking' | 'music';
const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: 'breathing', label: 'Breathing', icon: '🫁' },
  { key: 'walking',   label: 'Mindful Walk', icon: '🚶' },
  { key: 'music',     label: 'Calm Music', icon: '🎵' },
];

export default function WellnessModal({ isOpen, onClose }: WellnessModalProps) {
  const [tab, setTab] = useState<Tab>('breathing');
  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ width: '90%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '24px', boxShadow: '0 32px 80px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ padding: '22px 24px 0', borderBottom: '1px solid var(--border-color)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '11px', background: 'linear-gradient(135deg,#2d5a3d,#4a7c59)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(45,90,61,0.3)' }}>
                <span style={{ fontSize: '18px' }}>🌿</span>
              </div>
              <div>
                <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', margin: 0, fontFamily: 'DM Serif Display, serif' }}>Wellness Center</h2>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>Take a moment for yourself</p>
              </div>
            </div>
            <button onClick={onClose} style={{ width: '32px', height: '32px', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', borderRadius: '10px', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>×</button>
          </div>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: '4px' }}>
            {TABS.map(t => (
              <button key={t.key} onClick={() => setTab(t.key)} style={{ flex: 1, padding: '9px 12px', background: 'transparent', border: 'none', borderBottom: tab === t.key ? '2.5px solid var(--accent-primary)' : '2.5px solid transparent', color: tab === t.key ? 'var(--accent-primary)' : 'var(--text-muted)', fontSize: '13px', fontWeight: tab === t.key ? 700 : 400, cursor: 'pointer', transition: 'all 0.15s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <span>{t.icon}</span>{t.label}
              </button>
            ))}
          </div>
        </div>
        {/* Body */}
        <div style={{ padding: '28px 24px 24px', flex: 1 }}>
          {tab === 'breathing' && <BreathingTab />}
          {tab === 'walking'   && <WalkingTab />}
          {tab === 'music'     && <MusicTab />}
        </div>
      </div>
    </div>
  );
}
