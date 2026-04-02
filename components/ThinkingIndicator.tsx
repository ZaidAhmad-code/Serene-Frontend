'use client';

export default function ThinkingIndicator() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: '10px',
        flexDirection: 'row',
        animation: 'msgIn 0.28s cubic-bezier(0.16,1,0.3,1) forwards',
        opacity: 0,
      }}
    >
      {/* Bot avatar */}
      <div
        style={{
          width: '28px',
          height: '28px',
          borderRadius: '9px',
          background: 'var(--bg-tertiary)',
          border: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          alignSelf: 'flex-end',
          marginBottom: '18px',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M3 13C3 13 4 7 10 5C10 5 11 10 6 13" stroke="var(--accent-primary)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M6 13C6 13 7 10 10 5" stroke="var(--accent-primary)" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
      </div>

      {/* Thinking bubble */}
      <div
        style={{
          padding: '14px 18px',
          borderRadius: '18px 18px 18px 4px',
          background: 'var(--bot-bubble)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
        }}
      >
        {[0, 1, 2].map(i => (
          <div
            key={i}
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: 'var(--accent-secondary)',
              opacity: 0.5,
              animation: `thinkBounce 1.4s ease-in-out ${i * 0.18}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
}