"use client";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import ChatSidebar from "@/components/ChateSideBar";
import ChatWindow from "@/components/ChatWindow";
import EmergencyPanel from "@/components/EmergencyPanel";
import Toast from "@/components/Toast";
import DashboardModal from "@/components/modals/DashboardModal";
import WellnessModal from "@/components/modals/WellnessModal";
import ProfileModal from "@/components/modals/ProfileModal";
import { useAuth } from "@/hooks/useAuth";
import { useChat } from "@/hooks/useChat";
import { ToastMessage } from "@/types";
import JournalModal from "@/components/modals/JournlaModel";

export default function Home() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const {
    messages,
    sessions,
    currentSessionId,
    isStreaming,
    loadSessions,
    loadSession,
    startNewChat,
    deleteSession,
    sendMessage,
  } = useChat();

  const [sidebarHidden, setSidebarHidden] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [wellnessOpen, setWellnessOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [journalOpen, setJournalOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (user) loadSessions();
  }, [user, loadSessions]);

  const addToast = useCallback(
    (message: string, type: ToastMessage["type"] = "info") => {
      const id = Date.now().toString();
      setToasts((prev) => [...prev, { id, message, type }]);
    },
    [],
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const handleLogout = async () => {
    await logout();
    addToast("Signed out successfully", "success");
    router.push("/login");
  };

  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg-primary)",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "36px", marginBottom: "10px" }}>🌿</div>
          <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>
            Loading Serene…
          </p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const HEADER_H = 52; // px — must match Header height

  return (
    <>
      {/* Fixed top header — logo only */}
      <Header />

      {/* Full-height layout row, sitting directly below header */}
      <div
        style={{
          position: "fixed",
          top: `${HEADER_H}px`,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          overflow: "hidden",
          background: "var(--bg-primary)",
        }}
      >
        {/* Sidebar */}
        {!sidebarHidden && (
          <ChatSidebar
            sessions={sessions}
            currentSessionId={currentSessionId}
            onLoadSession={loadSession}
            onDeleteSession={async (id) => {
              await deleteSession(id);
              addToast("Conversation deleted", "success");
            }}
            onNewChat={startNewChat}
            onOpenDashboard={() => setDashboardOpen(true)}
            onOpenWellness={() => setWellnessOpen(true)}
            onOpenProfile={() => setProfileOpen(true)}
            onLogout={handleLogout}
            username={user.username}
            email={user.email}
            onOpenJournal={() => setJournalOpen(true)}
          />
        )}

        {/* Right: toggle button + chat */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            minWidth: 0,
          }}
        >
          {/* Thin top bar inside chat column */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "8px 16px",
              flexShrink: 0,
            }}
          >
            <button
              onClick={() => setSidebarHidden((v) => !v)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "4px 12px",
                borderRadius: "7px",
                fontSize: "12px",
                fontWeight: 500,
                color: "var(--text-muted)",
                background: "transparent",
                border: "1px solid var(--border-color)",
                cursor: "pointer",
                transition: "all 0.13s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--bg-secondary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              {/* chevron icon */}
              <svg
                width="11"
                height="11"
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                style={{
                  transform: sidebarHidden ? "rotate(180deg)" : "none",
                  transition: "transform 0.2s",
                }}
              >
                <path d="M8 2L4 6l4 4" />
              </svg>
              {sidebarHidden ? "Show sidebar" : "Hide sidebar"}
            </button>
          </div>

          {/* ChatWindow fills all remaining vertical space */}
          <div
            style={{
              flex: 1,
              padding: "0 16px 14px",
              overflow: "hidden",
              display: "flex",
              minHeight: 0,
            }}
          >
            <ChatWindow
              messages={messages}
              isStreaming={isStreaming}
              onSendMessage={sendMessage}
              currentSessionId={currentSessionId}
            />
          </div>
        </div>
      </div>

      <EmergencyPanel />
      <Toast toasts={toasts} removeToast={removeToast} />
      <DashboardModal
        isOpen={dashboardOpen}
        onClose={() => setDashboardOpen(false)}
      />

      <WellnessModal
        isOpen={wellnessOpen}
        onClose={() => setWellnessOpen(false)}
      />
      <ProfileModal
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
        user={user}
        onLogout={handleLogout}
        onToast={addToast}
      />
      <JournalModal
        isOpen={journalOpen}
        onClose={() => setJournalOpen(false)}
      />
    </>
  );
}
