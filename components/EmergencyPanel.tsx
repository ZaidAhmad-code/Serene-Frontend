'use client';
import { useEffect, useState } from 'react';

interface EmergencyPanelProps {
  forceOpen?: boolean;
  onDismiss?: () => void;
}

const CONTACTS = [
  { name: 'Emergency Services', number: '911', desc: 'Immediate danger' },
  { name: 'National Suicide Prevention', number: '988', desc: 'Call or text 988' },
  { name: 'Crisis Text Line', number: 'Text HOME to 741741', desc: 'Text-based support', isText: true },
  { name: 'NAMI Helpline', number: '1-800-950-6264', desc: 'Mental health support' },
  { name: 'International Association', number: 'https://www.iasp.info', desc: 'Global resources', isLink: true },
];

const AlertIcon = () => (
  <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <circle cx="10" cy="10" r="8"/>
    <path d="M10 6v4M10 14h.01"/>
  </svg>
);

const PhoneIcon = () => (
  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M5 2H3a1 1 0 0 0-1 1c0 7.18 5.82 13 13 13a1 1 0 0 0 1-1v-2l-3-1-1.5 1.5A10 10 0 0 1 6.5 7.5L8 6 7 3 5 2Z"/>
  </svg>
);

export default function EmergencyPanel({ forceOpen, onDismiss }: EmergencyPanelProps) {
  const [open, setOpen] = useState(false);

  // Auto-open when crisis is detected from chat
  useEffect(() => {
    if (forceOpen) setOpen(true);
  }, [forceOpen]);

  const handleClose = () => {
    setOpen(false);
    onDismiss?.();
  };

  return (
    <>
      {/* Overlay when force-opened */}
      {forceOpen && open && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 998,
            background: 'rgba(184,90,74,0.08)',
            backdropFilter: 'blur(2px)',
          }}
          onClick={handleClose}
        />
      )}

      {/* Panel */}
      <div
        style={{
          position: 'fixed',
          zIndex: 999,
          bottom: forceOpen && open ? '50%' : '80px',
          right: forceOpen && open ? '50%' : '24px',
          transform: forceOpen && open ? 'translate(50%, 50%)' : 'none',
          width: forceOpen && open ? 'min(420px, 92vw)' : '340px',
          maxHeight: open ? '85vh' : '0',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'all' : 'none',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderTop: `3px solid var(--danger)`,
          borderRadius: '18px',
          boxShadow: forceOpen && open
            ? '0 25px 80px rgba(184,90,74,0.25), 0 8px 32px rgba(0,0,0,0.2)'
            : 'var(--shadow-lg)',
          overflow: 'hidden',
          transition: 'max-height 0.3s ease, opacity 0.2s ease, transform 0.3s ease, bottom 0.3s ease, right 0.3s ease',
        }}
      >
        <div style={{ overflowY: 'auto', maxHeight: '80vh', padding: '24px' }}>
          {/* Crisis alert banner — shown when auto-opened by AI detection */}
          {forceOpen && open && (
            <div style={{
              background: 'rgba(184,90,74,0.1)',
              border: '1px solid rgba(184,90,74,0.3)',
              borderRadius: '12px',
              padding: '14px 16px',
              marginBottom: '18px',
              display: 'flex',
              gap: '10px',
              alignItems: 'flex-start',
            }}>
              <span style={{ fontSize: '20px', flexShrink: 0 }}>🚨</span>
              <div>
                <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--danger)', margin: '0 0 4px' }}>
                  We detected a moment of distress
                </p>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
                  You are not alone. These resources are here for you right now. You matter.
                </p>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: 'var(--danger)' }}><AlertIcon /></span>
              <h3
                style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: 'var(--danger)',
                  fontFamily: "'DM Serif Display', Georgia, serif",
                  margin: 0,
                }}
              >
                Crisis Support
              </h3>
            </div>
            <button
              onClick={handleClose}
              style={{
                width: '28px', height: '28px', borderRadius: '8px',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-primary)', color: 'var(--text-muted)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '16px', lineHeight: 1,
              }}
            >×</button>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.6 }}>
            If you or someone you know is in crisis, please reach out immediately.
          </p>

          {CONTACTS.map(c => (
            <div
              key={c.name}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '12px 14px',
                borderRadius: '12px',
                marginBottom: '8px',
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-color)',
              }}
            >
              <span style={{ color: 'var(--text-muted)', marginTop: '2px', flexShrink: 0 }}><PhoneIcon /></span>
              <div>
                <strong style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {c.name}
                </strong>
                <small style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{c.desc}</small>
                {c.isLink ? (
                  <a
                    href={c.number}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginTop: '3px', color: 'var(--accent-primary)' }}
                  >
                    Visit Website →
                  </a>
                ) : c.isText ? (
                  <span style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginTop: '3px', color: 'var(--text-primary)' }}>
                    {c.number}
                  </span>
                ) : (
                  <a
                    href={`tel:${c.number}`}
                    style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginTop: '3px', color: 'var(--accent-primary)' }}
                  >
                    {c.number}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trigger button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: 'fixed',
          zIndex: 1000,
          bottom: '24px',
          right: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '7px',
          borderRadius: '24px',
          padding: '12px 22px',
          fontWeight: 600,
          fontSize: '13px',
          letterSpacing: '0.01em',
          background: forceOpen ? 'var(--danger)' : 'var(--danger)',
          color: '#fff',
          border: 'none',
          boxShadow: forceOpen
            ? '0 4px 20px rgba(184,90,74,0.5), 0 0 0 4px rgba(184,90,74,0.15)'
            : '0 4px 16px rgba(184,90,74,0.35)',
          cursor: 'pointer',
          transition: 'all 0.2s',
          animation: forceOpen ? 'urgentPulse 1.5s ease-in-out infinite' : 'none',
        }}
        onMouseEnter={e => { (e.currentTarget).style.transform = 'translateY(-2px)'; }}
        onMouseLeave={e => { (e.currentTarget).style.transform = 'translateY(0)'; }}
      >
        <AlertIcon />
        {forceOpen ? '⚠️ Immediate Help' : 'Crisis Support'}
      </button>

      <style>{`
        @keyframes urgentPulse {
          0%, 100% { box-shadow: 0 4px 20px rgba(184,90,74,0.5), 0 0 0 4px rgba(184,90,74,0.15); }
          50% { box-shadow: 0 4px 24px rgba(184,90,74,0.7), 0 0 0 8px rgba(184,90,74,0.08); }
        }
      `}</style>
    </>
  );
}