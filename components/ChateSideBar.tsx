"use client";
import Link from "next/link";
import { ChatSession } from "@/types";

interface ChatSidebarProps {
  sessions: ChatSession[];
  currentSessionId: number | null;
  onLoadSession: (id: number) => void;
  onDeleteSession: (id: number) => void;
  onNewChat: () => void;
  onOpenDashboard?: () => void;
  onOpenWellness?: () => void;
  onOpenProfile?: () => void;
  onLogout?: () => void;
  username?: string;
  email?: string;
  onOpenJournal?: () => void;
}

/* ── tiny SVG icons ── */
const GuidedIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.45"
    strokeLinecap="round"
  >
    <path d="M3 13C3 13 4 7 10 5C10 5 11 10 6 13" />
    <path d="M6 13C6 13 7 10 10 5" />
  </svg>
);
const JournalIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.45"
    strokeLinecap="round"
  >
    <rect x="3" y="2" width="10" height="12" rx="2" />
    <path d="M6 6h4M6 9h3" />
  </svg>
);
const CopingIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.45"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M8 2l1.5 3.5 3.5.5-2.5 2.5.5 3.5L8 10.5 5 12.5l.5-3.5L3 6.5l3.5-.5z" />
  </svg>
);
const ReflectionIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.45"
    strokeLinecap="round"
  >
    <circle cx="8" cy="6" r="3" />
    <path d="M4 14c0-2.2 1.8-3.5 4-3.5s4 1.3 4 3.5" />
  </svg>
);
const AssessmentIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.45"
    strokeLinecap="round"
  >
    <rect x="3" y="2" width="10" height="12" rx="2" />
    <path d="M6 5h4M6 8h4M6 11h2" />
  </svg>
);
const WellnessIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.45"
    strokeLinecap="round"
  >
    <path d="M8 13.5S2 9.5 2 5.5C2 3.5 3.5 2 5.5 2c1.1 0 2 .6 2.5 1.5C8.5 2.6 9.4 2 10.5 2 12.5 2 14 3.5 14 5.5c0 4-6 8-6 8z" />
  </svg>
);
const SettingsIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
    strokeLinecap="round"
  >
    <circle cx="8" cy="8" r="2.5" />
    <path d="M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15M3.05 3.05l1.06 1.06M11.89 11.89l1.06 1.06M3.05 12.95l1.06-1.06M11.89 4.11l1.06-1.06" />
  </svg>
);
const PrivacyIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
    strokeLinecap="round"
  >
    <path d="M8 2L3 4.5v3.5c0 3 2.5 5.5 5 6 2.5-.5 5-3 5-6V4.5L8 2z" />
  </svg>
);
const SignOutIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
    strokeLinecap="round"
  >
    <path d="M10 8H3M6 5l-3 3 3 3M11 5v-2a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2" />
  </svg>
);

const NAV_ITEMS = [
  { label: "Dashboard", Icon: GuidedIcon, href: "/dashboard", key: "dashboard" },
  { label: "Journals", Icon: JournalIcon, href: "#", key: "journal" },
  { label: "Assessments", Icon: AssessmentIcon, href: "/assessments" },
  { label: "Wellness", Icon: WellnessIcon, href: "#", key: "wellness" },
];

const navItemBase: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  padding: "8px 10px",
  borderRadius: "9px",
  marginBottom: "1px",
  fontSize: "13.5px",
  fontWeight: 400,
  color: "var(--text-secondary)",
  background: "transparent",
  textDecoration: "none",
  transition: "all 0.13s",
  cursor: "pointer",
  border: "none",
  width: "100%",
  textAlign: "left" as const,
};

export default function ChatSidebar({
  sessions,
  currentSessionId,
  onLoadSession,
  onDeleteSession,
  onNewChat,
  onOpenDashboard,
  onOpenWellness,
  onOpenProfile,
  onLogout,
  username,
  email,
  onOpenJournal,
}: ChatSidebarProps) {
  return (
    <aside
      style={{
        width: "200px",
        minWidth: "200px",
        flexShrink: 0,
        background: "var(--bg-sidebar)",
        borderRight: "1px solid var(--border-color)",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {/* ── User profile ── */}
      <div
        style={{
          padding: "14px 12px 12px",
          borderBottom: "1px solid var(--border-color)",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            onClick={onOpenProfile}
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #2d5a3d, #4a7c59)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "13px",
              fontWeight: 700,
              flexShrink: 0,
              cursor: "pointer",
            }}
          >
            {username ? username[0].toUpperCase() : "U"}
          </div>
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontSize: "12px",
                fontWeight: 500,
                color: "var(--text-muted)",
                lineHeight: 1,
              }}
            >
              Welcome back
            </div>
            <div
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "var(--text-primary)",
                marginTop: "2px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {username ?? "User"}
            </div>
          </div>
        </div>
      </div>

      {/* ── Navigation ── */}
      <div
        style={{
          padding: "8px 8px 4px",
          borderBottom: "1px solid var(--border-color)",
          flexShrink: 0,
        }}
      >
        {NAV_ITEMS.map(({ label, Icon, href, key }) => {
          const isActive = key === "dashboard";
          const handleClick =
            key === "wellness"
                ? () => onOpenWellness?.()
                : key === "journal"
                  ? () => onOpenJournal?.()
                  : undefined;

          return (
            <Link
              key={label}
              href={handleClick ? "#" : href}
              onClick={
                handleClick
                  ? (e) => {
                      e.preventDefault();
                      handleClick();
                    }
                  : undefined
              }
              style={{
                ...navItemBase,
                color: isActive
                  ? "var(--accent-primary)"
                  : "var(--text-secondary)",
                fontWeight: isActive ? 600 : 400,
                background: isActive ? "rgba(45,90,61,0.07)" : "transparent",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.background =
                    "rgba(0,0,0,0.035)";
                  (e.currentTarget as HTMLElement).style.color =
                    "var(--text-primary)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.background =
                    "transparent";
                  (e.currentTarget as HTMLElement).style.color =
                    "var(--text-secondary)";
                }
              }}
            >
              <span style={{ opacity: isActive ? 1 : 0.65, flexShrink: 0 }}>
                <Icon />
              </span>
              {label}
            </Link>
          );
        })}
      </div>

      {/* ── Conversations ── */}
      <div
        style={{
          padding: "10px 12px 6px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontSize: "9.5px",
            fontWeight: 700,
            letterSpacing: "0.13em",
            textTransform: "uppercase",
            color: "var(--text-muted)",
          }}
        >
          Conversations
        </span>
        <button
          onClick={onNewChat}
          title="New conversation"
          style={{
            width: "22px",
            height: "22px",
            borderRadius: "6px",
            background: "var(--accent-primary)",
            color: "#fff",
            border: "none",
            fontSize: "16px",
            fontWeight: 300,
            lineHeight: 1,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "opacity 0.13s",
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = "0.82";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "1";
          }}
        >
          +
        </button>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "0 8px" }}>
        {sessions.length === 0 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px 12px",
              textAlign: "center",
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 32 32"
              fill="none"
              style={{ opacity: 0.18, marginBottom: "8px" }}
            >
              <path
                d="M6 26C6 26 8 14 20 10C20 10 22 20 12 26"
                stroke="var(--accent-primary)"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M12 26C12 26 14 20 20 10"
                stroke="var(--accent-primary)"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <p
              style={{
                fontSize: "11.5px",
                lineHeight: 1.6,
                color: "var(--text-muted)",
              }}
            >
              No conversations yet.
              <br />
              Begin a new session.
            </p>
          </div>
        ) : (
          sessions.map((session) => {
            const isActive = currentSessionId === session.id;
            return (
              <div
                key={session.id}
                onClick={() => onLoadSession(session.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px 10px",
                  borderRadius: "9px",
                  marginBottom: "1px",
                  cursor: "pointer",
                  background: isActive ? "rgba(45,90,61,0.07)" : "transparent",
                  borderLeft: isActive
                    ? "2px solid var(--accent-primary)"
                    : "2px solid transparent",
                  transition: "all 0.12s",
                }}
                onMouseEnter={(e) => {
                  if (!isActive)
                    (e.currentTarget as HTMLElement).style.background =
                      "rgba(0,0,0,0.03)";
                }}
                onMouseLeave={(e) => {
                  if (!isActive)
                    (e.currentTarget as HTMLElement).style.background =
                      "transparent";
                }}
              >
                <div style={{ flex: 1, minWidth: 0, paddingRight: "4px" }}>
                  <div
                    style={{
                      fontSize: "12.5px",
                      fontWeight: isActive ? 500 : 400,
                      color: isActive
                        ? "var(--text-primary)"
                        : "var(--text-secondary)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {session.title || "New Conversation"}
                  </div>
                  <div
                    style={{
                      fontSize: "10.5px",
                      color: "var(--text-muted)",
                      marginTop: "1px",
                    }}
                  >
                    {new Date(session.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteSession(session.id);
                  }}
                  style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "5px",
                    background: "transparent",
                    border: "none",
                    color: "var(--text-muted)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: 0,
                    transition: "opacity 0.13s",
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = "1";
                  }}
                  title="Delete"
                >
                  <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M3 4h10M6 4V3h4v1M5 4l.5 9h5l.5-9"
                      stroke="currentColor"
                      strokeWidth="1.3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* ── Bottom: Settings / Privacy / Sign Out ── */}
      <div
        style={{
          padding: "6px 8px 10px",
          borderTop: "1px solid var(--border-color)",
          flexShrink: 0,
        }}
      >
        {[
          { Icon: SettingsIcon, label: "Settings", href: "/settings" },
          { Icon: PrivacyIcon, label: "Privacy", href: "/privacy" },
        ].map(({ Icon, label, href }) => (
          <Link
            key={label}
            href={href}
            style={{ ...navItemBase, fontSize: "13px" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background =
                "rgba(0,0,0,0.035)";
              (e.currentTarget as HTMLElement).style.color =
                "var(--text-primary)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
              (e.currentTarget as HTMLElement).style.color =
                "var(--text-secondary)";
            }}
          >
            <span style={{ opacity: 0.6, flexShrink: 0 }}>
              <Icon />
            </span>
            {label}
          </Link>
        ))}

        <button
          onClick={onLogout}
          style={{ ...navItemBase, fontSize: "13px", color: "var(--danger)" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(184,90,74,0.06)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
          }}
        >
          <span style={{ flexShrink: 0 }}>
            <SignOutIcon />
          </span>
          Sign Out
        </button>

        {/* User avatar pill at very bottom */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 10px 2px",
            marginTop: "2px",
          }}
        >
          <div
            style={{
              width: "26px",
              height: "26px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #2d5a3d, #4a7c59)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "11px",
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {username ? username[0].toUpperCase() : "U"}
          </div>
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontSize: "12px",
                fontWeight: 600,
                color: "var(--text-primary)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {username ?? "User"}
            </div>
            {email && (
              <div
                style={{
                  fontSize: "10.5px",
                  color: "var(--text-muted)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {email}
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
