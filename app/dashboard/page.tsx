"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { dashboardAPI, analyticsAPI, chatAPI } from "@/libs/api";
import { DashboardStats, SentimentHistoryItem, ChatSession, MoodTrendPoint } from "@/types";
import { useAuth } from "@/hooks/useAuth";

function StatCard({ icon, value, label, color, delay }: { icon: string; value: string | number; label: string; color: string; delay: number }) {
  return (
    <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)", borderRadius: "20px", padding: "24px", animation: `fadeUp 0.5s ease ${delay}s both`, boxShadow: "0 4px 20px rgba(0,0,0,0.05)", overflow: "hidden", position: "relative" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: color }} />
      <div style={{ fontSize: "28px", marginBottom: "14px" }}>{icon}</div>
      <div style={{ fontSize: "36px", fontWeight: 700, color: "var(--text-primary)", fontFamily: "DM Serif Display, serif", lineHeight: 1, marginBottom: "6px" }}>{value}</div>
      <div style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em" }}>{label}</div>
    </div>
  );
}

function SentimentBadge({ label, score }: { label: string; score: number }) {
  const isPositive = label === "positive" || score > 0.3;
  const isNegative = label === "negative" || score < -0.3;
  const color = isPositive ? "#10b981" : isNegative ? "#ef4444" : "#f59e0b";
  const bg = isPositive ? "rgba(16,185,129,0.12)" : isNegative ? "rgba(239,68,68,0.12)" : "rgba(245,158,11,0.12)";
  const text = isPositive ? "Positive" : isNegative ? "Negative" : "Neutral";
  return (
    <span style={{ fontSize: "11px", padding: "3px 10px", borderRadius: "20px", background: bg, color, fontWeight: 600 }}>{text}</span>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [sentiment, setSentiment] = useState<SentimentHistoryItem[]>([]);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [moodTrend, setMoodTrend] = useState<MoodTrendPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    Promise.all([
      dashboardAPI.getStats().catch(() => null),
      analyticsAPI.getSentimentHistory(15).catch(() => ({ history: [] })),
      chatAPI.getSessions().catch(() => ({ sessions: [] })),
      analyticsAPI.getMoodTrend(7).catch(() => ({ trend: "Stable", data: [] })),
    ]).then(([s, sent, sess, mood]) => {
      if (s) setStats(s);
      setSentiment(sent.history || []);
      setSessions((sess.sessions || []).slice(0, 8));
      setMoodTrend(mood.data || []);
    }).finally(() => setLoading(false));
  }, [user]);

  if (authLoading || loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-primary)" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "40px", marginBottom: "14px", animation: "pulse 2s infinite" }}>🌿</div>
          <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  const total = sentiment.length || 1;
  const positive = sentiment.filter(h => h.label === "positive" || h.score > 0.3).length;
  const negative = sentiment.filter(h => h.label === "negative" || h.score < -0.3).length;
  const neutral = total - positive - negative;
  const pctPositive = Math.round((positive / total) * 100);
  const pctNeutral = Math.round((neutral / total) * 100);
  const pctNegative = Math.round((negative / total) * 100);

  const moodMax = Math.max(...moodTrend.map(d => d.avg_score), 1);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100% { transform:scale(1); } 50% { transform:scale(1.08); } }
        @keyframes barGrow { from { height:0; } to { height:var(--h); } }
        .session-row:hover { background: var(--bg-tertiary) !important; }
        .sent-row:hover { background: var(--bg-tertiary) !important; }
      `}</style>

      {/* Header */}
      <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "rgba(255,255,255,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--border-color)", boxShadow: "0 1px 24px rgba(0,0,0,0.06)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px", height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "10px", background: "linear-gradient(135deg,#2d5a3d,#4a7c59)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: "16px" }}>🌿</span>
            </div>
            <span style={{ fontSize: "17px", fontWeight: 700, color: "var(--text-primary)", fontFamily: "DM Serif Display, serif" }}>Serene</span>
          </Link>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <span style={{ fontSize: "14px", color: "var(--text-secondary)" }}>Welcome back, <strong style={{ color: "var(--text-primary)" }}>{user?.username}</strong></span>
            <Link href="/application" style={{ padding: "8px 18px", borderRadius: "10px", fontSize: "13px", fontWeight: 600, background: "linear-gradient(135deg,#2d5a3d,#4a7c59)", color: "#fff", textDecoration: "none", boxShadow: "0 4px 14px rgba(45,90,61,0.25)" }}>
              Open Chat →
            </Link>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "84px 24px 60px" }}>
        {/* Hero */}
        <div style={{ marginBottom: "40px", animation: "fadeUp 0.4s ease forwards" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "5px 16px", borderRadius: "20px", marginBottom: "16px", background: "rgba(45,90,61,0.08)", border: "1px solid rgba(45,90,61,0.15)" }}>
            <span style={{ fontSize: "11px", color: "var(--accent-primary)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>Your Mental Health Overview</span>
          </div>
          <h1 style={{ fontSize: "36px", fontWeight: 700, color: "var(--text-primary)", fontFamily: "DM Serif Display, serif", margin: "0 0 10px", lineHeight: 1.2 }}>Dashboard</h1>
          <p style={{ fontSize: "15px", color: "var(--text-secondary)", margin: 0 }}>Track your journey, mood trends, and wellness at a glance.</p>
        </div>

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "18px", marginBottom: "36px" }}>
          <StatCard icon="💬" value={stats?.total_chats ?? "—"} label="Total Chats" color="linear-gradient(90deg,#6c63ff,#9b94ff)" delay={0.05} />
          <StatCard icon="📝" value={stats?.total_messages ?? "—"} label="Messages Sent" color="linear-gradient(90deg,#0ea5e9,#38bdf8)" delay={0.1} />
          <StatCard icon="🔥" value={stats?.streak_days ?? "—"} label="Day Streak" color="linear-gradient(90deg,#f59e0b,#fbbf24)" delay={0.15} />
          <StatCard icon="😊" value={sentiment.length > 0 ? `${pctPositive}%` : "—"} label="Positive Sentiment" color="linear-gradient(90deg,#10b981,#34d399)" delay={0.2} />
        </div>

        {/* Main grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "28px" }}>

          {/* Mood Trend Chart */}
          <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)", borderRadius: "22px", padding: "28px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)", animation: "fadeUp 0.5s ease 0.25s both" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
              <div>
                <h2 style={{ fontSize: "17px", fontWeight: 700, color: "var(--text-primary)", margin: "0 0 4px", fontFamily: "DM Serif Display, serif" }}>Mood Trend</h2>
                <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: 0 }}>Last 7 days</p>
              </div>
            </div>
            {moodTrend.length > 0 ? (
              <div style={{ display: "flex", alignItems: "flex-end", gap: "10px", height: "120px" }}>
                {moodTrend.map((d, i) => {
                  const h = Math.max(12, (d.avg_score / moodMax) * 100);
                  const color = d.avg_score > 0.5 ? "#10b981" : d.avg_score > 0.1 ? "#f59e0b" : "#ef4444";
                  return (
                    <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                      <div style={{ width: "100%", height: `${h}px`, borderRadius: "6px 6px 0 0", background: color, opacity: 0.8, transition: "height 0.8s ease", boxShadow: `0 4px 12px ${color}40` }} />
                      <span style={{ fontSize: "10px", color: "var(--text-muted)", textAlign: "center" }}>
                        {new Date(d.date).toLocaleDateString("en", { weekday: "short" })}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ height: "120px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", fontSize: "13px" }}>
                No mood data yet. Start chatting to see trends!
              </div>
            )}
          </div>

          {/* Sentiment Distribution */}
          <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)", borderRadius: "22px", padding: "28px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)", animation: "fadeUp 0.5s ease 0.3s both" }}>
            <h2 style={{ fontSize: "17px", fontWeight: 700, color: "var(--text-primary)", margin: "0 0 6px", fontFamily: "DM Serif Display, serif" }}>Sentiment Overview</h2>
            <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "0 0 24px" }}>Based on last {sentiment.length} messages</p>

            {sentiment.length > 0 ? (
              <>
                {/* Stacked bar */}
                <div style={{ height: "16px", borderRadius: "8px", overflow: "hidden", display: "flex", marginBottom: "20px" }}>
                  {pctPositive > 0 && <div style={{ width: `${pctPositive}%`, background: "#10b981", transition: "width 1s ease" }} />}
                  {pctNeutral > 0 && <div style={{ width: `${pctNeutral}%`, background: "#f59e0b", transition: "width 1s ease" }} />}
                  {pctNegative > 0 && <div style={{ width: `${pctNegative}%`, background: "#ef4444", transition: "width 1s ease" }} />}
                </div>
                <div style={{ display: "flex", gap: "16px" }}>
                  {[
                    { color: "#10b981", label: "Positive", pct: pctPositive, count: positive },
                    { color: "#f59e0b", label: "Neutral", pct: pctNeutral, count: neutral },
                    { color: "#ef4444", label: "Negative", pct: pctNegative, count: negative },
                  ].map(s => (
                    <div key={s.label} style={{ flex: 1, padding: "14px 16px", borderRadius: "14px", background: `${s.color}0a`, border: `1px solid ${s.color}25`, textAlign: "center" }}>
                      <div style={{ fontSize: "22px", fontWeight: 700, color: s.color, fontFamily: "DM Serif Display, serif" }}>{s.pct}%</div>
                      <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "3px", fontWeight: 600 }}>{s.label}</div>
                      <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{s.count} msgs</div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div style={{ height: "120px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", fontSize: "13px" }}>
                No sentiment data yet.
              </div>
            )}
          </div>
        </div>

        {/* Bottom grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>

          {/* Recent Chats */}
          <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)", borderRadius: "22px", padding: "28px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)", animation: "fadeUp 0.5s ease 0.35s both" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ fontSize: "17px", fontWeight: 700, color: "var(--text-primary)", margin: 0, fontFamily: "DM Serif Display, serif" }}>Recent Chats</h2>
              <Link href="/application" style={{ fontSize: "12px", color: "var(--accent-primary)", fontWeight: 600, textDecoration: "none" }}>Open Chat →</Link>
            </div>
            {sessions.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {sessions.map((s, i) => (
                  <div key={s.id} className="session-row" style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 14px", borderRadius: "12px", background: "var(--bg-primary)", border: "1px solid var(--border-color)", cursor: "pointer", transition: "background 0.15s", animation: `fadeUp 0.4s ease ${0.05 * i}s both` }}>
                    <div style={{ width: "34px", height: "34px", borderRadius: "10px", background: "linear-gradient(135deg,#2d5a3d,#4a7c59)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ fontSize: "14px" }}>💬</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.title}</div>
                      <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                        {s.message_count ? `${s.message_count} messages · ` : ""}{new Date(s.updated_at || s.created_at).toLocaleDateString("en", { month: "short", day: "numeric" })}
                      </div>
                    </div>
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round"><path d="M4 8h8M9 5l3 3-3 3" /></svg>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: "32px", textAlign: "center", color: "var(--text-muted)", fontSize: "13px" }}>
                <div style={{ fontSize: "28px", marginBottom: "10px" }}>💬</div>
                No chats yet. <Link href="/application" style={{ color: "var(--accent-primary)", textDecoration: "none", fontWeight: 600 }}>Start a conversation →</Link>
              </div>
            )}
          </div>

          {/* Recent Activity + Sentiment log */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* Recent Activity */}
            {stats?.recent_activity && stats.recent_activity.length > 0 && (
              <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)", borderRadius: "22px", padding: "28px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)", animation: "fadeUp 0.5s ease 0.4s both" }}>
                <h2 style={{ fontSize: "17px", fontWeight: 700, color: "var(--text-primary)", margin: "0 0 18px", fontFamily: "DM Serif Display, serif" }}>Recent Activity</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {stats.recent_activity.slice(0, 4).map((a, i) => (
                    <div key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start", padding: "12px", borderRadius: "12px", background: "var(--bg-primary)", border: "1px solid var(--border-color)" }}>
                      <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--accent-primary)", flexShrink: 0, marginTop: "5px" }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "2px" }}>{a.title}</div>
                        <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{a.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sentiment log */}
            <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)", borderRadius: "22px", padding: "28px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)", flex: 1, animation: "fadeUp 0.5s ease 0.45s both" }}>
              <h2 style={{ fontSize: "17px", fontWeight: 700, color: "var(--text-primary)", margin: "0 0 18px", fontFamily: "DM Serif Display, serif" }}>Sentiment Log</h2>
              {sentiment.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {sentiment.slice(0, 5).map((s, i) => (
                    <div key={i} className="sent-row" style={{ display: "flex", alignItems: "center", gap: "12px", padding: "11px 14px", borderRadius: "12px", background: "var(--bg-primary)", border: "1px solid var(--border-color)", transition: "background 0.15s" }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: "13px", color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.message}</div>
                        <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>{new Date(s.timestamp).toLocaleDateString("en", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</div>
                      </div>
                      <SentimentBadge label={s.label} score={s.score} />
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: "24px", textAlign: "center", color: "var(--text-muted)", fontSize: "13px" }}>
                  <div style={{ fontSize: "28px", marginBottom: "10px" }}>📊</div>
                  No sentiment data yet.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div style={{ marginTop: "28px", padding: "24px", background: "linear-gradient(135deg, rgba(45,90,61,0.05) 0%, rgba(74,124,89,0.08) 100%)", border: "1px solid rgba(45,90,61,0.15)", borderRadius: "22px", display: "flex", gap: "16px", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", animation: "fadeUp 0.5s ease 0.5s both" }}>
          <div>
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)", margin: "0 0 4px", fontFamily: "DM Serif Display, serif" }}>Ready to check in?</h3>
            <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: 0 }}>Chat with Serene, take an assessment, or do a breathing exercise.</p>
          </div>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Link href="/application" style={{ padding: "11px 22px", borderRadius: "12px", fontSize: "13px", fontWeight: 600, background: "linear-gradient(135deg,#2d5a3d,#4a7c59)", color: "#fff", textDecoration: "none", boxShadow: "0 4px 14px rgba(45,90,61,0.25)" }}>💬 Open Chat</Link>
            <Link href="/assessments" style={{ padding: "11px 22px", borderRadius: "12px", fontSize: "13px", fontWeight: 600, background: "var(--bg-secondary)", border: "1px solid var(--border-color)", color: "var(--text-primary)", textDecoration: "none" }}>📋 Assessments</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
