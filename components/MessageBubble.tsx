'use client';
import { Message } from '@/types';

interface Props { message: Message }

function formatTime(d: Date) {
  return new Date(d).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

const LeafAvatar = () => (
  <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
    <path d="M3 13C3 13 4 7 10 5C10 5 11 10 6 13" stroke="white" strokeWidth="1.6"
      strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 13C6 13 7 10 10 5" stroke="rgba(255,255,255,0.65)" strokeWidth="1.2"
      strokeLinecap="round"/>
  </svg>
);

const PersonAvatar = () => (
  <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="5.5" r="2.8" fill="rgba(255,255,255,0.95)"/>
    <path d="M2.5 14c0-3 2.5-4.8 5.5-4.8s5.5 1.8 5.5 4.8"
      stroke="rgba(255,255,255,0.95)" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
);

// Render markdown-style bold (**text**) from bot messages
function renderContent(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} style={{ fontWeight: 600, color: 'inherit' }}>
        {part.slice(2, -2)}
      </strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

export default function MessageBubble({ message }: Props) {
  const isUser = message.role === 'user';

  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-end',
      gap: '10px',
      flexDirection: isUser ? 'row-reverse' : 'row',
      animationName: 'msgIn',
      animationDuration: '0.32s',
      animationTimingFunction: 'cubic-bezier(0.16,1,0.3,1)',
      animationFillMode: 'forwards',
      opacity: 0,
    }}>

      {/* Avatar */}
      <div style={{
        width: '30px',
        height: '30px',
        borderRadius: '50%',
        background: isUser
          ? 'linear-gradient(135deg, #2d5a3d 0%, #3d7a52 100%)'
          : 'linear-gradient(135deg, #3d6b4f 0%, #2d5a3d 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        alignSelf: 'flex-end',
        marginBottom: '22px',
        boxShadow: '0 2px 8px rgba(45,90,61,0.25)',
      }}>
        {isUser ? <PersonAvatar /> : <LeafAvatar />}
      </div>

      {/* Content */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '5px',
        alignItems: isUser ? 'flex-end' : 'flex-start',
        maxWidth: '70%',
        minWidth: 0,
      }}>
        {/* Bubble */}
        <div style={{
          padding: '12px 16px',
          borderRadius: isUser ? '18px 18px 4px 18px' : '4px 18px 18px 18px',
          fontSize: '14px',
          lineHeight: '1.7',
          wordBreak: 'break-word',
          ...(isUser ? {
            background: 'linear-gradient(135deg, #2d5a3d 0%, #3d7a52 100%)',
            color: '#ffffff',
            boxShadow: '0 4px 16px rgba(45,90,61,0.22), 0 1px 4px rgba(45,90,61,0.15)',
          } : {
            background: '#ffffff',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-color)',
            boxShadow: '0 2px 12px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.04)',
          }),
        }}>
          {renderContent(message.content)}
          {message.isStreaming && (
            <span style={{
              display: 'inline-block',
              width: '2px',
              height: '15px',
              background: 'var(--accent-primary)',
              marginLeft: '3px',
              verticalAlign: 'middle',
              borderRadius: '1px',
              animationName: 'blink',
              animationDuration: '1s',
              animationIterationCount: 'infinite',
            }} />
          )}
        </div>

        {/* Timestamp */}
        <span style={{
          fontSize: '10.5px',
          color: 'var(--text-muted)',
          paddingInline: '4px',
          userSelect: 'none',
          fontVariantNumeric: 'tabular-nums',
        }}>
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
}