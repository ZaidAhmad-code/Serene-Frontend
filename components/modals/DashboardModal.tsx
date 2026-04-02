'use client';
import { useEffect, useState } from 'react';
import { dashboardAPI, analyticsAPI } from '@/libs/api';
import { DashboardStats, SentimentHistoryItem } from '@/types';

interface DashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DashboardModal({ isOpen, onClose }: DashboardModalProps) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [sentimentHistory, setSentimentHistory] = useState<SentimentHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    Promise.all([
      dashboardAPI.getStats(),
      analyticsAPI.getSentimentHistory(20).catch(() => ({ history: [] })),
    ])
      .then(([s, sent]) => {
        setStats(s);
        setSentimentHistory(sent.history || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isOpen]);

  if (!isOpen) return null;

  // Compute sentiment distribution from history
  const total = sentimentHistory.length || 1;
  const positive = sentimentHistory.filter(h => h.label === 'positive' || h.score > 0.3).length;
  const negative = sentimentHistory.filter(h => h.label === 'negative' || h.score < -0.3).length;
  const neutral = total - positive - negative;
  const pctPositive = Math.round((positive / total) * 100);
  const pctNeutral = Math.round((neutral / total) * 100);
  const pctNegative = Math.round((negative / total) * 100);

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        className="animate-slideup rounded-3xl overflow-hidden w-[90%] max-w-3xl max-h-[85vh] overflow-y-auto"
        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-lg)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: 'var(--border-color)' }}>
          <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'DM Serif Display, serif' }}>
            📊 Your Dashboard
          </h2>
          <button onClick={onClose}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-xl transition-all"
            style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
            ×
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-center py-12" style={{ color: 'var(--text-muted)' }}>Loading your data...</div>
          ) : (
            <>
              {/* Stats — using correct DashboardStats property names */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  { icon: '💬', value: stats?.total_chats ?? '—', label: 'Chats' },
                  { icon: '📝', value: stats?.total_messages ?? '—', label: 'Messages' },
                  { icon: '🔥', value: stats?.streak_days ?? '—', label: 'Day Streak' },
                  { icon: '😊', value: sentimentHistory.length > 0 ? `${pctPositive}%` : '—', label: 'Positive' },
                ].map(s => (
                  <div key={s.label} className="text-center p-5 rounded-xl border" style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}>
                    <div className="text-3xl mb-2">{s.icon}</div>
                    <div className="text-3xl font-bold" style={{ color: 'var(--accent-primary)', fontFamily: 'DM Serif Display, serif' }}>{s.value}</div>
                    <div className="text-xs mt-1 uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Recent Activity */}
              {stats?.recent_activity && stats.recent_activity.length > 0 && (
                <div className="rounded-xl p-5 border mb-6" style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}>
                  <h3 className="font-semibold mb-4 text-sm" style={{ color: 'var(--text-primary)' }}>Recent Activity</h3>
                  {stats.recent_activity.map((activity, i) => (
                    <div key={i} className="flex items-center gap-3 mb-3 last:mb-0">
                      <span className="text-lg">💬</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{activity.title}</div>
                        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{activity.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Sentiment Distribution */}
              {sentimentHistory.length > 0 && (
                <div className="rounded-xl p-5 border" style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}>
                  <h3 className="font-semibold mb-4 text-sm" style={{ color: 'var(--text-primary)' }}>Emotional Trends</h3>
                  {[
                    { label: 'Positive', value: pctPositive, color: 'var(--success)' },
                    { label: 'Neutral', value: pctNeutral, color: 'var(--text-muted)' },
                    { label: 'Negative', value: pctNegative, color: 'var(--danger)' },
                  ].map(b => (
                    <div key={b.label} className="flex items-center gap-3 mb-3">
                      <span className="w-16 text-xs" style={{ color: 'var(--text-secondary)' }}>{b.label}</span>
                      <div className="flex-1 h-2 rounded-full" style={{ background: 'var(--bg-tertiary)' }}>
                        <div className="h-full rounded-full" style={{ width: `${b.value}%`, background: b.color, transition: 'width 0.5s ease' }} />
                      </div>
                      <span className="w-10 text-right text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{b.value}%</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}