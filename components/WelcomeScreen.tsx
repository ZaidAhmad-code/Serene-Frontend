'use client';

const MoodCalm = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
    <circle cx="22" cy="22" r="22" fill="white"/>
    <path d="M16 28c0 0 1.5-8 8-10.5" stroke="#3a7a52" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M16 28c4-1 7.5-4 8-10.5" stroke="#3a7a52" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M22 30c0 0 3-5 2.5-10" stroke="#4a9060" strokeWidth="1.4" strokeLinecap="round"/>
    <path d="M22 30c2.5-1.5 4-5 2.5-10" stroke="#4a9060" strokeWidth="1.4" strokeLinecap="round"/>
    <circle cx="19" cy="21" r="1.2" fill="#6ab87a" opacity="0.7"/>
    <circle cx="25" cy="24" r="0.9" fill="#6ab87a" opacity="0.5"/>
  </svg>
);

const MoodMisty = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
    <circle cx="22" cy="22" r="22" fill="white"/>
    <ellipse cx="22" cy="19" rx="9" ry="6" fill="#c8d8e8" opacity="0.85"/>
    <ellipse cx="17" cy="20" rx="5" ry="4" fill="#d5e4f0" opacity="0.9"/>
    <ellipse cx="27" cy="20" rx="5" ry="4" fill="#d5e4f0" opacity="0.9"/>
    <path d="M13 26h18" stroke="#8bafc8" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
    <path d="M15 29h14" stroke="#8bafc8" strokeWidth="1.5" strokeLinecap="round" opacity="0.35"/>
  </svg>
);

const MoodOverwhelmed = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
    <circle cx="22" cy="22" r="22" fill="white"/>
    <path d="M10 24c2-5 5-9 8-10s7 1 8 5 3 6 7 5" stroke="#5580a8" strokeWidth="2" strokeLinecap="round" fill="none"/>
    <path d="M8 27c2-3 5-5 7-5s5 2 7 4 5 3 8 3" stroke="#4a6fa5" strokeWidth="1.3" strokeLinecap="round" fill="none" opacity="0.4"/>
    <circle cx="22" cy="20" r="1.5" fill="#7a9fc5" opacity="0.6"/>
    <circle cx="16" cy="23" r="1" fill="#7a9fc5" opacity="0.4"/>
    <circle cx="29" cy="22" r="1" fill="#7a9fc5" opacity="0.4"/>
  </svg>
);

const MoodRadiant = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
    <circle cx="22" cy="22" r="22" fill="white"/>
    <circle cx="22" cy="22" r="7.5" fill="#f7d44a" opacity="0.9"/>
    <circle cx="22" cy="22" r="5.5" fill="#f5c832"/>
    <path d="M22 11v3M22 30v3M11 22h3M30 22h3" stroke="#f5c842" strokeWidth="2" strokeLinecap="round"/>
    <path d="M15.2 15.2l2 2M26.8 26.8l2 2M15.2 28.8l2-2M26.8 15.2l2-2" stroke="#f5c842" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
  </svg>
);

const MoodHeavy = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
    <circle cx="22" cy="22" r="22" fill="white"/>
    <path d="M22 32c-3.5-2.5-9-7-9-11.5a9 9 0 0 1 18 0c0 4.5-5.5 9-9 11.5z" fill="#e8a0a0" opacity="0.4"/>
    <path d="M22 32c-3.5-2.5-9-7-9-11.5a9 9 0 0 1 18 0c0 4.5-5.5 9-9 11.5z" stroke="#c07070" strokeWidth="1.5" fill="none"/>
    <circle cx="19" cy="22" r="1.6" fill="#c07070" opacity="0.7"/>
    <circle cx="23.5" cy="20" r="1.6" fill="#c07070" opacity="0.7"/>
    <circle cx="22" cy="26" r="1.6" fill="#c07070" opacity="0.7"/>
    <path d="M19.5 14.5l1.5 2h2l1.5-2" stroke="#a05050" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const MOODS = [
  { label: 'CALM',        Icon: MoodCalm,        prompt: "I'm feeling calm and present" },
  { label: 'MISTY',       Icon: MoodMisty,       prompt: "I'm feeling a bit cloudy and foggy" },
  { label: 'OVERWHELMED', Icon: MoodOverwhelmed, prompt: "I'm feeling overwhelmed right now" },
  { label: 'RADIANT',     Icon: MoodRadiant,     prompt: "I'm feeling radiant and energetic" },
  { label: 'HEAVY',       Icon: MoodHeavy,       prompt: "I'm carrying something heavy today" },
];

const ReflectIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="3.5" fill="#3a7a52" opacity="0.2"/>
    <circle cx="10" cy="10" r="1.5" fill="#3a7a52"/>
    <path d="M10 4v2.5M10 13.5v2.5M4 10h2.5M13.5 10H16" stroke="#3a7a52" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);

const SparkleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M10 3l1.5 4.5L16 9l-4.5 1.5L10 15l-1.5-4.5L4 9l4.5-1.5L10 3z" stroke="#3a7a52" strokeWidth="1.3" strokeLinejoin="round" fill="none"/>
    <circle cx="10" cy="9" r="1.2" fill="#3a7a52" opacity="0.4"/>
  </svg>
);

const EyeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M2 10c2-4 4.5-6 8-6s6 2 8 6c-2 4-4.5 6-8 6s-6-2-8-6z" stroke="#3a7a52" strokeWidth="1.3"/>
    <circle cx="10" cy="10" r="2.5" fill="#3a7a52" opacity="0.3"/>
    <circle cx="10" cy="10" r="1.2" fill="#3a7a52"/>
  </svg>
);

const SESSIONS = [
  { label: 'Reflect on today', desc: 'Gently close the day with clarity', Icon: ReflectIcon },
  { label: 'Gentle Release', desc: 'Let go of what weighs on you', Icon: SparkleIcon },
  { label: 'Being Witnessed', desc: 'Share without needing advice', Icon: EyeIcon },
];

export default function WelcomeScreen({ onQuickAction }: { onQuickAction: (t: string) => void }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
      maxWidth: '700px',
      margin: '0 auto',
      padding: '44px 0 24px',
      gap: '32px',
      userSelect: 'none',
    }}>

      {/* Hero heading — matches reference typography exactly */}
      <div style={{ textAlign: 'center', maxWidth: '530px' }}>
        <h1 style={{
          fontFamily: "'DM Serif Display', Georgia, serif",
          fontSize: '44px',
          fontWeight: 400,
          lineHeight: 1.16,
          color: 'var(--text-primary)',
          letterSpacing: '-0.02em',
          margin: 0,
        }}>
          Hello, let&rsquo;s take a{' '}
          <em style={{
            fontStyle: 'italic',
            color: 'var(--accent-primary)',
          }}>
            deep breath
          </em>
          {' '}together.
        </h1>
        <p style={{
          marginTop: '18px',
          fontSize: '14.5px',
          color: 'var(--text-muted)',
          lineHeight: 1.8,
          fontWeight: 400,
        }}>
          I&rsquo;m here to listen. You&rsquo;re not alone in this space.<br />
          How is your heart feeling in this moment?
        </p>
      </div>

      {/* Mood card — warm card with decorative watermark */}
      <div style={{
        width: '100%',
        background: 'var(--bg-secondary)',
        borderRadius: '28px',
        padding: '30px 36px 36px',
        border: '1px solid var(--border-color)',
        boxShadow: '0 2px 24px rgba(0,0,0,0.04)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Flower watermark */}
        <div style={{
          position: 'absolute', top: -8, right: -8,
          opacity: 0.055, pointerEvents: 'none',
        }}>
          <svg width="120" height="120" viewBox="0 0 100 100" fill="none">
            {[0,40,80,120,160].map(deg => (
              <ellipse key={deg} cx="50" cy="50" rx="16" ry="30"
                fill="#3a7a52" transform={`rotate(${deg} 50 50)`}/>
            ))}
            <circle cx="50" cy="50" r="12" fill="#3a7a52"/>
          </svg>
        </div>

        <p style={{
          textAlign: 'center',
          fontSize: '14px',
          fontWeight: 500,
          color: 'var(--text-secondary)',
          marginBottom: '26px',
          letterSpacing: '0.005em',
        }}>
          How are you feeling right now?
        </p>

        <div style={{
          display: 'flex',
          gap: '10px',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}>
          {MOODS.map(({ label, Icon, prompt }) => (
            <button
              key={label}
              onClick={() => onQuickAction(prompt)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '10px',
                padding: '16px 14px 14px',
                borderRadius: '20px',
                border: '1.5px solid var(--border-color)',
                background: 'white',
                cursor: 'pointer',
                transition: 'all 0.22s cubic-bezier(0.16,1,0.3,1)',
                minWidth: '86px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget;
                el.style.transform = 'translateY(-5px)';
                el.style.borderColor = 'rgba(74,124,89,0.5)';
                el.style.boxShadow = '0 10px 28px rgba(45,90,61,0.14)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget;
                el.style.transform = 'translateY(0)';
                el.style.borderColor = 'var(--border-color)';
                el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
              }}
            >
              {/* Icon with circular white bg + shadow — matching reference */}
              <div style={{
                width: '54px', height: '54px',
                borderRadius: '50%',
                background: 'var(--bg-primary)',
                boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon />
              </div>
              <span style={{
                fontSize: '9.5px', fontWeight: 700,
                letterSpacing: '0.10em', color: 'var(--text-muted)',
                textTransform: 'uppercase',
              }}>
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Session suggestion cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '12px',
        width: '100%',
      }}>
        {SESSIONS.map(({ label, desc, Icon }) => (
          <button
            key={label}
            onClick={() => onQuickAction(label)}
            style={{
              padding: '20px 18px',
              borderRadius: '20px',
              border: '1.5px solid var(--border-color)',
              background: 'var(--bg-secondary)',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.18s ease',
              boxShadow: '0 1px 6px rgba(0,0,0,0.03)',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget;
              el.style.background = 'white';
              el.style.borderColor = 'rgba(74,124,89,0.4)';
              el.style.transform = 'translateY(-3px)';
              el.style.boxShadow = '0 8px 20px rgba(0,0,0,0.06)';
            }}
            onMouseLeave={e => {
              const el = e.currentTarget;
              el.style.background = 'var(--bg-secondary)';
              el.style.borderColor = 'var(--border-color)';
              el.style.transform = 'translateY(0)';
              el.style.boxShadow = '0 1px 6px rgba(0,0,0,0.03)';
            }}
          >
            <div style={{ marginBottom: '10px' }}><Icon /></div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
              {label}
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              {desc}
            </div>
          </button>
        ))}
      </div>

    </div>
  );
}