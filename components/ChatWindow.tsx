'use client';
import { useEffect, useRef } from 'react';
import { Message } from '@/types';
import MessageBubble from './MessageBubble';
import ThinkingIndicator from './ThinkingIndicator';
import WelcomeScreen from './WelcomeScreen';
import ChatInput from './ChatInput';

interface ChatWindowProps {
  messages: Message[];
  isStreaming: boolean;
  onSendMessage: (text: string) => void;
  currentSessionId?: number | null;
  sessionTitle?: string;
}

export default function ChatWindow({
  messages,
  isStreaming,
  onSendMessage,
  sessionTitle,
}: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  return (
    /* Outer shell — fills whatever height parent gives it */
    <div style={{
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: '#ffffff',
      borderRadius: '14px',
      border: '1px solid var(--border-color)',
      boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
      overflow: 'hidden',
      /* CRITICAL: let this fill the flex parent without overflowing */
      minHeight: 0,
      flex: 1,
    }}>

      {/* ── Chat header ── */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 18px',
        borderBottom: '1px solid var(--border-color)',
        background: '#ffffff',
        flexShrink: 0,
      }}>
        <div style={{
          width: '30px', height: '30px',
          borderRadius: '9px',
          background: 'linear-gradient(135deg, #2d5a3d 0%, #4a7c59 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
          boxShadow: '0 2px 6px rgba(45,90,61,0.22)',
        }}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M2 14C2 14 3.5 7 9 5C9 5 10.5 11 5 14"
              stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M5 14C5 14 6.5 10 9 5"
              stroke="rgba(255,255,255,0.6)" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontSize: '14px', fontWeight: 600,
            color: 'var(--text-primary)',
            letterSpacing: '-0.01em', lineHeight: 1.2,
            fontFamily: "'DM Serif Display', Georgia, serif",
          }}>
            {sessionTitle ?? 'Evening Calm'}
          </p>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1, marginTop: '2px' }}>
            Your gentle companion
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
          {isStreaming ? (
            <span style={{
              fontSize: '11px', padding: '3px 10px', borderRadius: '20px',
              background: 'rgba(45,90,61,0.07)', color: 'var(--accent-primary)', fontWeight: 500,
            }}>
              Thinking…
            </span>
          ) : (
            <>
              <div style={{
                width: '7px', height: '7px', borderRadius: '50%',
                background: 'var(--success)',
                animation: 'pulseDot 2s ease-in-out infinite',
              }} />
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Active</span>
            </>
          )}
        </div>
      </header>

      {/* ── Messages — scrollable, flex 1 ── */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        minHeight: 0,               /* required for scroll to work inside flex */
        padding: messages.length === 0 ? '0' : '18px 22px 8px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}>
        {messages.length === 0 ? (
          /* WelcomeScreen is itself scrollable when content is taller than area */
          <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
            <WelcomeScreen onQuickAction={onSendMessage} />
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2px' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
              <span style={{
                fontSize: '9.5px', color: 'var(--text-muted)',
                fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', userSelect: 'none',
              }}>Today</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
            </div>

            {messages.map(msg => <MessageBubble key={msg.id} message={msg} />)}
            {isStreaming && <ThinkingIndicator />}
          </>
        )}
        <div ref={bottomRef} />
      </div>

      {/* ── Input ── */}
      <div style={{
        flexShrink: 0,
        borderTop: '1px solid var(--border-color)',
        background: 'var(--bg-tertiary)',
      }}>
        <ChatInput onSend={onSendMessage} isStreaming={isStreaming} />
        <div style={{
          textAlign: 'center',
          paddingBottom: '8px',
          fontSize: '9.5px',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
          opacity: 0.55,
          userSelect: 'none',
        }}>
          Your words are encrypted and private
        </div>
      </div>
    </div>
  );
}