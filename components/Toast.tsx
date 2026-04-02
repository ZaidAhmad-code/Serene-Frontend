'use client';
import { useEffect } from 'react';
import { ToastMessage } from '@/types';

interface ToastProps {
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
}

const borderMap: Record<string, string> = {
  success: 'var(--success)',
  error: 'var(--danger)',
  warning: 'var(--warning)',
  info: 'var(--info)',
};

// Small dot indicator instead of emoji
const DotIndicator = ({ type }: { type: string }) => (
  <div
    style={{
      width: '7px',
      height: '7px',
      borderRadius: '50%',
      background: borderMap[type] || 'var(--text-muted)',
      flexShrink: 0,
    }}
  />
);

function ToastItem({ toast, onRemove }: { toast: ToastMessage; onRemove: () => void }) {
  useEffect(() => {
    const t = setTimeout(onRemove, 3500);
    return () => clearTimeout(t);
  }, [onRemove]);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '12px 20px',
        borderRadius: '12px',
        fontSize: '13.5px',
        fontWeight: 500,
        background: 'var(--bg-secondary)',
        color: 'var(--text-primary)',
        border: `1px solid ${borderMap[toast.type] || 'var(--border-color)'}`,
        boxShadow: 'var(--shadow-lg)',
        animation: 'slideup 0.25s ease forwards',
        backdropFilter: 'blur(8px)',
        minWidth: '260px',
        maxWidth: '380px',
      }}
    >
      <DotIndicator type={toast.type} />
      <span style={{ flex: 1 }}>{toast.message}</span>
      <button
        onClick={onRemove}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--text-muted)',
          cursor: 'pointer',
          fontSize: '16px',
          lineHeight: 1,
          padding: '0 0 0 4px',
          flexShrink: 0,
        }}
      >
        ×
      </button>
    </div>
  );
}

export default function Toast({ toasts, removeToast }: ToastProps) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: '32px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 3000,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        alignItems: 'center',
      }}
    >
      {toasts.map(t => (
        <ToastItem key={t.id} toast={t} onRemove={() => removeToast(t.id)} />
      ))}
    </div>
  );
}