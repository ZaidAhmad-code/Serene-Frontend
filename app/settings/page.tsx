"use client";
import { useState } from "react";
import Link from "next/link";

type Tab = "notifications" | "privacy" | "data";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("notifications");
  const [notifications, setNotifications] = useState({
    dailyReminder: true,
    weeklyReport: false,
    moodCheckin: true,
    journalPrompt: false,
  });

  // UI feedback
  const [saved, setSaved]     = useState(false);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState("");
  const [deleting, setDeleting] = useState(false);

  /* ── helpers ── */
  const showSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };
  const clearError = () => setError("");

  /* ── Save notification preferences ── */
  const handleSavePreferences = async () => {
    clearError();
    setSaving(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/preferences`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(notifications),
        }
      );
      if (!res.ok) throw new Error("Failed to save preferences");
      showSaved();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  /* ── Delete account — calls /api/auth/delete-account ── */
  const handleDeleteAccount = async () => {
    clearError();
    const password = window.prompt(
      "Enter your password to permanently delete your account:"
    );
    if (!password) return;

    const confirmed = window.confirm(
      "⚠️ This will permanently delete your account and ALL your data (chats, journals, assessments, mood logs). This cannot be undone. Are you absolutely sure?"
    );
    if (!confirmed) return;

    setDeleting(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/delete-account`,
        {
          method: "DELETE",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        localStorage.clear();
        window.location.href = "/login";
      } else {
        throw new Error(data.error || "Failed to delete account");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setDeleting(false);
    }
  };

  /* ── Clear chat history — calls /api/chats/clear ── */
  const handleClearData = async (label: string) => {
    clearError();
    const confirmed = window.confirm(`Clear all ${label}? This cannot be undone.`);
    if (!confirmed) return;

    try {
      if (label === "Chat History") {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/chats/clear`,
          { method: "DELETE", credentials: "include" }
        );
        if (!res.ok) throw new Error("Failed to clear chat history");
      }
      showSaved();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  const SaveButton = ({ onClick }: { onClick: () => void }) => (
    <button
      onClick={onClick}
      disabled={saving}
      style={{
        padding: "10px 24px",
        borderRadius: "12px",
        fontSize: "14px",
        fontWeight: 600,
        background: "var(--accent-primary)",
        color: "#fff",
        border: "none",
        cursor: saving ? "not-allowed" : "pointer",
        opacity: saving ? 0.7 : 1,
        transition: "opacity 0.15s",
      }}
    >
      {saving ? "Saving…" : saved ? "✓ Saved!" : "Save Changes"}
    </button>
  );

  const TABS: { key: Tab; label: string; icon: string }[] = [
    { key: "notifications", label: "Notifications", icon: "🔔" },
    { key: "privacy",       label: "Privacy",       icon: "🔒" },
    { key: "data",          label: "Data",          icon: "📊" },
  ];

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)", fontFamily: "'Lora', Georgia, serif" }}>

      {/* ── Header ── */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b"
        style={{ background: "var(--bg-secondary)", borderColor: "var(--border-color)", backdropFilter: "blur(12px)" }}>
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl"
            style={{ color: "var(--text-primary)", fontFamily: "'DM Serif Display', serif" }}>
            🌿 Serene
          </Link>
          <Link href="/application" className="px-4 py-2 rounded-xl text-sm font-medium"
            style={{ background: "var(--bg-tertiary)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }}>
            ← Back to Chat
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 pt-28 pb-20">

        {/* Page title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2"
            style={{ color: "var(--text-primary)", fontFamily: "'DM Serif Display', serif" }}>
            Settings
          </h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Manage your account preferences and app configuration.
          </p>
        </div>

        {/* Global error banner */}
        {error && (
          <div className="mb-6 p-4 rounded-xl text-sm flex items-center justify-between"
            style={{ background: "rgba(217,95,95,0.08)", border: "1px solid rgba(217,95,95,0.3)", color: "#D95F5F" }}>
            <span>⚠️ {error}</span>
            <button onClick={clearError}
              style={{ color: "#D95F5F", background: "none", border: "none", cursor: "pointer", fontSize: "18px", lineHeight: 1 }}>
              ×
            </button>
          </div>
        )}

        <div className="flex gap-6">

          {/* ── Sidebar tabs ── */}
          <div className="w-48 flex-shrink-0">
            <div className="rounded-2xl overflow-hidden border"
              style={{ background: "var(--bg-secondary)", borderColor: "var(--border-color)" }}>
              {TABS.map(({ key, label, icon }) => (
                <button key={key}
                  onClick={() => { setActiveTab(key); clearError(); }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    width: "100%",
                    padding: "12px 16px",
                    textAlign: "left",
                    fontSize: "14px",
                    fontWeight: activeTab === key ? 600 : 400,
                    color: activeTab === key ? "var(--accent-primary)" : "var(--text-secondary)",
                    background: activeTab === key ? "rgba(45,90,61,0.08)" : "transparent",
                    borderLeft: activeTab === key ? "2px solid var(--accent-primary)" : "2px solid transparent",
                    border: "none",
                    borderBottom: "none",
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}>
                  <span>{icon}</span>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* ── Content ── */}
          <div className="flex-1">
            <div className="rounded-2xl border p-6"
              style={{ background: "var(--bg-secondary)", borderColor: "var(--border-color)" }}>

              {/* ════ NOTIFICATIONS ════ */}
              {activeTab === "notifications" && (
                <div>
                  <h2 className="text-xl font-bold mb-6"
                    style={{ color: "var(--text-primary)", fontFamily: "'DM Serif Display', serif" }}>
                    Notifications
                  </h2>
                  <div className="space-y-4">
                    {[
                      { key: "dailyReminder", label: "Daily Check-in Reminder",  desc: "Get a daily nudge to log your mood." },
                      { key: "weeklyReport",  label: "Weekly Wellness Report",    desc: "Receive a summary of your week." },
                      { key: "moodCheckin",   label: "Mood Check-in Prompts",     desc: "Periodic reminders to log how you feel." },
                      { key: "journalPrompt", label: "Journal Prompts",           desc: "Receive guided journaling prompts." },
                    ].map(({ key, label, desc }) => {
                      const on = notifications[key as keyof typeof notifications];
                      return (
                        <div key={key} className="flex items-center justify-between p-4 rounded-xl border"
                          style={{ background: "var(--bg-primary)", borderColor: "var(--border-color)" }}>
                          <div>
                            <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{label}</p>
                            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{desc}</p>
                          </div>
                          <button onClick={() => setNotifications((n) => ({ ...n, [key]: !on }))}
                            style={{
                              position: "relative", width: "44px", height: "24px", borderRadius: "12px",
                              background: on ? "var(--accent-primary)" : "var(--bg-tertiary)",
                              border: "none", cursor: "pointer", flexShrink: 0, transition: "background 0.2s",
                            }}>
                            <span style={{
                              position: "absolute", top: "2px", left: "2px", width: "20px", height: "20px",
                              borderRadius: "50%", background: "#fff", transition: "transform 0.2s",
                              transform: on ? "translateX(20px)" : "translateX(0)",
                            }} />
                          </button>
                        </div>
                      );
                    })}
                    <SaveButton onClick={handleSavePreferences} />
                  </div>
                </div>
              )}

              {/* ════ PRIVACY ════ */}
              {activeTab === "privacy" && (
                <div>
                  <h2 className="text-xl font-bold mb-6"
                    style={{ color: "var(--text-primary)", fontFamily: "'DM Serif Display', serif" }}>
                    Privacy & Security
                  </h2>
                  <div className="space-y-4">
                    {[
                      { label: "Two-Factor Authentication", desc: "Add an extra layer of security to your account.", action: "Enable" },
                      { label: "Active Sessions",           desc: "View and manage devices logged in to your account.", action: "View" },
                      { label: "Download My Data",          desc: "Export all your journals, mood data, and assessments.", action: "Export" },
                    ].map(({ label, desc, action }) => (
                      <div key={label} className="flex items-center justify-between p-4 rounded-xl border"
                        style={{ background: "var(--bg-primary)", borderColor: "var(--border-color)" }}>
                        <div>
                          <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{label}</p>
                          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{desc}</p>
                        </div>
                        <button style={{
                          padding: "6px 14px", borderRadius: "10px", fontSize: "12px", fontWeight: 600,
                          border: "1px solid var(--border-color)", color: "var(--accent-primary)",
                          background: "transparent", cursor: "pointer", flexShrink: 0, marginLeft: "16px",
                        }}>
                          {action}
                        </button>
                      </div>
                    ))}

                    {/* Danger zone */}
                    <div className="mt-6 p-5 rounded-xl"
                      style={{ background: "rgba(217,95,95,0.05)", border: "1px solid rgba(217,95,95,0.25)" }}>
                      <p className="text-sm font-bold mb-1" style={{ color: "#D95F5F" }}>Danger Zone</p>
                      <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>
                        Deleting your account is permanent and cannot be undone. All your chats, journals,
                        assessments, and mood data will be erased from our servers immediately.
                      </p>
                      <button onClick={handleDeleteAccount} disabled={deleting}
                        style={{
                          padding: "8px 18px", borderRadius: "10px", fontSize: "14px", fontWeight: 600,
                          background: "rgba(217,95,95,0.12)", color: "#D95F5F",
                          border: "1px solid rgba(217,95,95,0.3)",
                          cursor: deleting ? "not-allowed" : "pointer",
                          opacity: deleting ? 0.6 : 1, transition: "opacity 0.15s",
                        }}>
                        {deleting ? "Deleting…" : "Delete Account"}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ════ DATA ════ */}
              {activeTab === "data" && (
                <div>
                  <h2 className="text-xl font-bold mb-6"
                    style={{ color: "var(--text-primary)", fontFamily: "'DM Serif Display', serif" }}>
                    Data & Storage
                  </h2>
                  <div className="space-y-4">
                    {[
                      { label: "Chat History",       desc: "All your conversation sessions.",              canClear: true  },
                      { label: "Journal Entries",    desc: "Your private journal logs.",                   canClear: false },
                      { label: "Assessment Results", desc: "PHQ-9, GAD-7, and other assessment records.", canClear: false },
                      { label: "Mood Logs",          desc: "Your mood tracking history.",                  canClear: false },
                    ].map(({ label, desc, canClear }) => (
                      <div key={label} className="flex items-center justify-between p-4 rounded-xl border"
                        style={{ background: "var(--bg-primary)", borderColor: "var(--border-color)" }}>
                        <div>
                          <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{label}</p>
                          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{desc}</p>
                        </div>
                        {canClear && (
                          <button onClick={() => handleClearData(label)}
                            style={{
                              fontSize: "12px", padding: "6px 12px", borderRadius: "8px",
                              border: "1px solid rgba(217,95,95,0.3)", color: "#D95F5F",
                              background: "transparent", cursor: "pointer", flexShrink: 0, marginLeft: "16px",
                            }}>
                            Clear
                          </button>
                        )}
                      </div>
                    ))}

                    <div className="p-4 rounded-xl"
                      style={{ background: "rgba(45,90,61,0.05)", border: "1px solid rgba(45,90,61,0.2)" }}>
                      <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                        💡 Your data is stored securely and never shared with third parties.
                        Assessment results are used only to personalise your Serene experience.
                      </p>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}