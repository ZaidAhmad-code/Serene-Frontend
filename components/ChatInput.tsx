'use client';
import { useRef, useState, useCallback, KeyboardEvent, ChangeEvent } from 'react';

interface Props { onSend: (text: string) => void; isStreaming: boolean }

export default function ChatInput({ onSend, isStreaming }: Props) {
  const [value, setValue] = useState('');
  const ref = useRef<HTMLTextAreaElement>(null);
  const canSend = value.trim().length > 0 && !isStreaming;

  const submit = useCallback(() => {
    const t = value.trim();
    if (!t || isStreaming) return;
    setValue('');
    if (ref.current) ref.current.style.height = 'auto';
    onSend(t);
  }, [value, isStreaming, onSend]);

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(); }
  };

  const onChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`;
  };

  return (
    <div style={{ padding: '10px 14px 8px' }}>
      {/* Liquid glass shell */}
      <div
        style={{
          background: 'rgba(255,255,255,0.78)',
          backdropFilter: 'blur(20px) saturate(200%)',
          WebkitBackdropFilter: 'blur(20px) saturate(200%)',
          border: '1.5px solid rgba(255,255,255,0.92)',
          borderRadius: '16px',
          boxShadow: [
            '0 6px 28px rgba(0,0,0,0.06)',
            '0 2px 8px rgba(0,0,0,0.04)',
            'inset 0 1px 0 rgba(255,255,255,0.85)',
            'inset 0 -1px 0 rgba(0,0,0,0.025)',
          ].join(', '),
          transition: 'border-color 0.22s, box-shadow 0.22s',
          position: 'relative',
          overflow: 'hidden',
        }}
        onFocusCapture={e => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.borderColor = 'rgba(45,90,61,0.28)';
          el.style.boxShadow = [
            '0 8px 32px rgba(45,90,61,0.10)',
            '0 2px 8px rgba(0,0,0,0.04)',
            'inset 0 1px 0 rgba(255,255,255,0.9)',
            'inset 0 -1px 0 rgba(0,0,0,0.02)',
          ].join(', ');
        }}
        onBlurCapture={e => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.borderColor = 'rgba(255,255,255,0.92)';
          el.style.boxShadow = [
            '0 6px 28px rgba(0,0,0,0.06)',
            '0 2px 8px rgba(0,0,0,0.04)',
            'inset 0 1px 0 rgba(255,255,255,0.85)',
            'inset 0 -1px 0 rgba(0,0,0,0.025)',
          ].join(', ');
        }}
      >
        {/* Top sheen */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '45%',
          background: 'linear-gradient(to bottom, rgba(255,255,255,0.28), transparent)',
          borderRadius: '16px 16px 0 0',
          pointerEvents: 'none',
        }} />

        {/* Textarea */}
        <div style={{ padding: '12px 14px 6px', position: 'relative' }}>
          <textarea
            ref={ref}
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
            disabled={isStreaming}
            placeholder="Write what's on your mind…"
            rows={1}
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none', outline: 'none',
              resize: 'none',
              fontSize: '13.5px', lineHeight: '1.65',
              color: 'var(--text-primary)',
              minHeight: '32px', maxHeight: '140px',
              overflowY: 'auto',
              fontFamily: 'inherit',
            }}
          />
        </div>

        {/* Bottom bar */}
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          padding: '4px 10px 10px',
          position: 'relative',
        }}>
          <span style={{
            fontSize: '10.5px', color: 'var(--text-muted)',
            letterSpacing: '0.02em', userSelect: 'none',
          }}>
            Enter to send · Shift+Enter for new line
          </span>

          <button
            onClick={submit}
            disabled={!canSend}
            style={{
              display: 'flex', alignItems: 'center', gap: '7px',
              padding: '8px 18px',
              borderRadius: '12px', border: 'none',
              fontSize: '12.5px', fontWeight: 600,
              cursor: canSend ? 'pointer' : 'not-allowed',
              transition: 'all 0.18s cubic-bezier(0.16,1,0.3,1)',
              background: canSend
                ? 'linear-gradient(135deg, #2d5a3d 0%, #3d7a52 100%)'
                : 'rgba(0,0,0,0.05)',
              color: canSend ? '#fff' : 'var(--text-muted)',
              boxShadow: canSend
                ? '0 3px 12px rgba(45,90,61,0.28), 0 1px 3px rgba(45,90,61,0.18)'
                : 'none',
            }}
            onMouseEnter={e => {
              if (canSend) (e.currentTarget).style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={e => { (e.currentTarget).style.transform = 'translateY(0)'; }}
          >
            {isStreaming ? (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                  style={{ animation: 'spin 1s linear infinite' }}>
                  <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.35)" strokeWidth="2.5"/>
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
                Thinking…
              </>
            ) : (
              <>
                Share with me
                <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor"
                    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}