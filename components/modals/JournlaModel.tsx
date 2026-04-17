"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { JournalEntry, JournalMood } from "@/types"
import {
  getAllEntries,
  addEntry,
  deleteEntry,
  updateEntry,
} from './JournalStorage'

/* ── Mood config ── */
const MOODS: { label: JournalMood; icon: string; color: string }[] = [
  { label: "Calm",       icon: "🌿", color: "#2d5a3d" },
  { label: "Happy",      icon: "✨", color: "#c8973a" },
  { label: "Anxious",    icon: "🌊", color: "#4a6fa5" },
  { label: "Sad",        icon: "🌧",  color: "#7a6a9a" },
  { label: "Overwhelmed",icon: "🌀", color: "#a0554a" },
  { label: "Grateful",   icon: "🌸", color: "#b05a7a" },
];

function getMoodMeta(label: string) {
  return MOODS.find((m) => m.label === label) ?? null;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const isToday =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();
  if (isToday) {
    return (
      "Today · " +
      d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
    );
  }
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/* ══════════════════════════════════════════════
   WRITE VIEW — new entry composer
══════════════════════════════════════════════ */
function WriteView({
  onSave,
}: {
  onSave: (text: string, mood: JournalMood) => void;
}) {
  const [text, setText] = useState("");
  const [mood, setMood] = useState<JournalMood>("");
  const taRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    taRef.current?.focus();
  }, []);

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  const canSave = text.trim().length > 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Mood row */}
      <div style={{ padding: "20px 24px 0" }}>
        <p
          style={{
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--text-muted)",
            marginBottom: "10px",
          }}
        >
          How are you feeling?
        </p>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {MOODS.map((m) => {
            const active = mood === m.label;
            return (
              <button
                key={m.label}
                onClick={() => setMood(active ? "" : m.label)}
                style={{
                  padding: "5px 13px",
                  borderRadius: "20px",
                  border: active
                    ? `1.5px solid ${m.color}`
                    : "1px solid var(--border-color)",
                  background: active
                    ? `${m.color}18`
                    : "var(--bg-tertiary)",
                  color: active ? m.color : "var(--text-secondary)",
                  fontSize: "12.5px",
                  fontWeight: active ? 600 : 400,
                  cursor: "pointer",
                  transition: "all 0.15s",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                <span style={{ fontSize: "13px" }}>{m.icon}</span>
                {m.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Textarea */}
      <div style={{ flex: 1, padding: "16px 24px", display: "flex", flexDirection: "column" }}>
        <textarea
          ref={taRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write freely… this space is just for you. Your words never leave this device."
          style={{
            flex: 1,
            width: "100%",
            minHeight: "220px",
            border: "1px solid var(--border-color)",
            borderRadius: "12px",
            padding: "16px",
            fontSize: "14.5px",
            lineHeight: 1.75,
            fontFamily: "inherit",
            color: "var(--text-primary)",
            background: "var(--bg-tertiary)",
            resize: "none",
            outline: "none",
            transition: "border-color 0.15s",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "var(--accent-primary)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "var(--border-color)";
          }}
        />
        {/* Footer row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "12px",
          }}
        >
          <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
            {text.length > 0 ? `${wordCount} word${wordCount !== 1 ? "s" : ""}` : "Start writing…"}
          </span>
          <button
            disabled={!canSave}
            onClick={() => {
              if (canSave) {
                onSave(text, mood);
                setText("");
                setMood("");
              }
            }}
            style={{
              padding: "9px 22px",
              background: canSave ? "var(--accent-primary)" : "var(--border-color)",
              color: canSave ? "#fff" : "var(--text-muted)",
              border: "none",
              borderRadius: "10px",
              fontSize: "13.5px",
              fontWeight: 500,
              cursor: canSave ? "pointer" : "not-allowed",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              if (canSave) e.currentTarget.style.opacity = "0.85";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1";
            }}
          >
            Save Entry
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   HISTORY VIEW — list of past entries
══════════════════════════════════════════════ */
function HistoryView({
  entries,
  onDelete,
  onEdit,
}: {
  entries: JournalEntry[];
  onDelete: (id: string) => void;
  onEdit: (entry: JournalEntry) => void;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  if (entries.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          gap: "12px",
          color: "var(--text-muted)",
          padding: "40px 24px",
        }}
      >
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" style={{ opacity: 0.25 }}>
          <rect x="6" y="4" width="28" height="32" rx="5" stroke="var(--accent-primary)" strokeWidth="1.5"/>
          <path d="M13 14h14M13 20h14M13 26h8" stroke="var(--accent-primary)" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <p style={{ fontSize: "14px", textAlign: "center", lineHeight: 1.6 }}>
          No journal entries yet.<br />
          Write your first one above.
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: "8px 24px 24px", overflowY: "auto", maxHeight: "100%" }}>
      {entries.map((entry) => {
        const moodMeta = getMoodMeta(entry.mood);
        const isExpanded = expandedId === entry.id;
        const isDeleting = confirmDelete === entry.id;
        const preview = entry.text.length > 120 ? entry.text.slice(0, 120) + "…" : entry.text;

        return (
          <div
            key={entry.id}
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
              borderRadius: "12px",
              padding: "14px 16px",
              marginBottom: "8px",
              transition: "border-color 0.15s",
              cursor: "pointer",
            }}
            onClick={() => setExpandedId(isExpanded ? null : entry.id)}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "var(--border-strong)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "var(--border-color)";
            }}
          >
            {/* Entry header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                {moodMeta && (
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 600,
                      padding: "3px 9px",
                      borderRadius: "10px",
                      background: `${moodMeta.color}15`,
                      color: moodMeta.color,
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    {moodMeta.icon} {moodMeta.label}
                  </span>
                )}
                <span style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>
                  {formatDate(entry.date)}
                </span>
              </div>
              <div style={{ display: "flex", gap: "4px" }} onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => onEdit(entry)}
                  title="Edit"
                  style={{
                    width: "26px", height: "26px",
                    border: "none", background: "transparent",
                    cursor: "pointer", borderRadius: "6px",
                    color: "var(--text-muted)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "background 0.12s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bg-tertiary)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                >
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
                    <path d="M11 2l3 3-8 8H3v-3l8-8z"/>
                  </svg>
                </button>
                {isDeleting ? (
                  <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                    <button
                      onClick={() => { onDelete(entry.id); setConfirmDelete(null); }}
                      style={{
                        fontSize: "11px", padding: "3px 8px",
                        background: "var(--danger)", color: "#fff",
                        border: "none", borderRadius: "6px", cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setConfirmDelete(null)}
                      style={{
                        fontSize: "11px", padding: "3px 8px",
                        background: "var(--bg-tertiary)", color: "var(--text-secondary)",
                        border: "1px solid var(--border-color)", borderRadius: "6px", cursor: "pointer",
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmDelete(entry.id)}
                    title="Delete"
                    style={{
                      width: "26px", height: "26px",
                      border: "none", background: "transparent",
                      cursor: "pointer", borderRadius: "6px",
                      color: "var(--text-muted)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "background 0.12s",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(184,90,74,0.08)"; e.currentTarget.style.color = "var(--danger)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-muted)"; }}
                  >
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
                      <path d="M3 4h10M6 4V3h4v1M5 4l.5 9h5l.5-9"/>
                    </svg>
                  </button>
                )}
              </div>
            </div>
            {/* Entry text */}
            <p style={{
              fontSize: "13.5px", lineHeight: 1.65,
              color: "var(--text-secondary)",
              whiteSpace: "pre-wrap", margin: 0,
            }}>
              {isExpanded ? entry.text : preview}
            </p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "8px" }}>
              <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                {entry.wordCount} word{entry.wordCount !== 1 ? "s" : ""}
              </span>
              {entry.text.length > 120 && (
                <span style={{ fontSize: "11.5px", color: "var(--accent-primary)", fontWeight: 500 }}>
                  {isExpanded ? "Show less ↑" : "Read more ↓"}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ══════════════════════════════════════════════
   EDIT VIEW
══════════════════════════════════════════════ */
function EditView({
  entry,
  onSave,
  onCancel,
}: {
  entry: JournalEntry;
  onSave: (id: string, text: string, mood: string) => void;
  onCancel: () => void;
}) {
  const [text, setText] = useState(entry.text);
  const [mood, setMood] = useState<JournalMood>(entry.mood as JournalMood);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ padding: "16px 24px 0" }}>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {MOODS.map((m) => {
            const active = mood === m.label;
            return (
              <button
                key={m.label}
                onClick={() => setMood(active ? "" : m.label)}
                style={{
                  padding: "5px 13px", borderRadius: "20px",
                  border: active ? `1.5px solid ${m.color}` : "1px solid var(--border-color)",
                  background: active ? `${m.color}18` : "var(--bg-tertiary)",
                  color: active ? m.color : "var(--text-secondary)",
                  fontSize: "12.5px", fontWeight: active ? 600 : 400,
                  cursor: "pointer", transition: "all 0.15s",
                  display: "flex", alignItems: "center", gap: "5px",
                }}
              >
                <span style={{ fontSize: "13px" }}>{m.icon}</span>
                {m.label}
              </button>
            );
          })}
        </div>
      </div>
      <div style={{ flex: 1, padding: "14px 24px", display: "flex", flexDirection: "column" }}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          autoFocus
          style={{
            flex: 1, width: "100%", minHeight: "220px",
            border: "1px solid var(--accent-primary)",
            borderRadius: "12px", padding: "16px",
            fontSize: "14.5px", lineHeight: 1.75,
            fontFamily: "inherit", color: "var(--text-primary)",
            background: "var(--bg-tertiary)", resize: "none", outline: "none",
          }}
        />
        <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end", marginTop: "12px" }}>
          <button
            onClick={onCancel}
            style={{
              padding: "9px 18px", background: "transparent",
              color: "var(--text-secondary)",
              border: "1px solid var(--border-color)",
              borderRadius: "10px", fontSize: "13.5px", cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(entry.id, text, mood)}
            style={{
              padding: "9px 22px", background: "var(--accent-primary)",
              color: "#fff", border: "none", borderRadius: "10px",
              fontSize: "13.5px", fontWeight: 500, cursor: "pointer",
            }}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   MAIN JOURNAL MODAL
══════════════════════════════════════════════ */
type Tab = "write" | "history";

interface JournalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function JournalModal({ isOpen, onClose }: JournalModalProps) {
  const [tab, setTab] = useState<Tab>("write");
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [saved, setSaved] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Load entries from localStorage
  useEffect(() => {
    if (isOpen) setEntries(getAllEntries());
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleSave = useCallback((text: string, mood: JournalMood) => {
    addEntry({ mood }, text);
    setEntries(getAllEntries());
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    setTab("history");
  }, []);

  const handleDelete = useCallback((id: string) => {
    deleteEntry(id);
    setEntries(getAllEntries());
  }, []);

  const handleEdit = useCallback((entry: JournalEntry) => {
    setEditingEntry(entry);
    setTab("write");
  }, []);

  const handleEditSave = useCallback((id: string, text: string, mood: string) => {
    updateEntry(id, text, mood);
    setEntries(getAllEntries());
    setEditingEntry(null);
    setTab("history");
  }, []);

  if (!isOpen) return null;

  return (
    /* Overlay */
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.45)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        animation: "fade 0.2s ease",
      }}
    >
      {/* Modal box */}
      <div
        style={{
          width: "100%",
          maxWidth: "580px",
          maxHeight: "88vh",
          background: "var(--bg-primary)",
          border: "1px solid var(--border-color)",
          borderRadius: "18px",
          boxShadow: "var(--shadow-lg)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          animation: "slideup 0.22s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "18px 24px 0",
            borderBottom: "1px solid var(--border-color)",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "30px", height: "30px", borderRadius: "8px",
                  background: "linear-gradient(135deg, #2d5a3d, #4a7c59)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round">
                  <rect x="3" y="2" width="10" height="12" rx="2"/>
                  <path d="M6 6h4M6 9h3"/>
                </svg>
              </div>
              <div>
                <h2 style={{ fontSize: "15px", fontWeight: 600, color: "var(--text-primary)", margin: 0 }}>
                  My Journal
                </h2>
                <p style={{ fontSize: "11px", color: "var(--text-muted)", margin: 0, display: "flex", alignItems: "center", gap: "4px" }}>
                  <svg width="9" height="9" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M8 2L3 4.5v3.5c0 3 2.5 5.5 5 6 2.5-.5 5-3 5-6V4.5L8 2z"/>
                  </svg>
                  Saved only on this device
                </p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {saved && (
                <span style={{
                  fontSize: "12px", color: "var(--accent-primary)",
                  background: "rgba(45,90,61,0.08)", padding: "4px 10px",
                  borderRadius: "20px", fontWeight: 500,
                  animation: "fade 0.2s ease",
                }}>
                  ✓ Saved
                </span>
              )}
              <button
                onClick={onClose}
                style={{
                  width: "30px", height: "30px", border: "none",
                  background: "var(--bg-tertiary)", borderRadius: "8px",
                  cursor: "pointer", color: "var(--text-muted)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "background 0.12s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "var(--border-color)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "var(--bg-tertiary)"; }}
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                  <path d="M3 3l10 10M13 3L3 13"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: "0" }}>
            {(["write", "history"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setEditingEntry(null); }}
                style={{
                  padding: "8px 18px",
                  background: "transparent",
                  border: "none",
                  borderBottom: tab === t ? "2px solid var(--accent-primary)" : "2px solid transparent",
                  color: tab === t ? "var(--accent-primary)" : "var(--text-muted)",
                  fontSize: "13.5px",
                  fontWeight: tab === t ? 600 : 400,
                  cursor: "pointer",
                  transition: "all 0.15s",
                  textTransform: "capitalize",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                {t === "write" ? "Write" : "History"}
                {t === "history" && entries.length > 0 && (
                  <span style={{
                    fontSize: "10px", fontWeight: 600,
                    background: tab === "history" ? "var(--accent-primary)" : "var(--border-color)",
                    color: tab === "history" ? "#fff" : "var(--text-muted)",
                    borderRadius: "10px", padding: "1px 6px",
                    transition: "all 0.15s",
                  }}>
                    {entries.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", minHeight: 0 }}>
          {tab === "write" ? (
            editingEntry ? (
              <EditView
                entry={editingEntry}
                onSave={handleEditSave}
                onCancel={() => { setEditingEntry(null); }}
              />
            ) : (
              <WriteView onSave={handleSave} />
            )
          ) : (
            <HistoryView
              entries={entries}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          )}
        </div>
      </div>
    </div>
  );
}