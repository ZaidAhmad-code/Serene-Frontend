"use client";
import { useCallback, useState } from "react";
import { chatAPI } from "@/libs/api";
import { ChatSession, CrisisResource, Message, StreamEvent } from "@/types";

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<number | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [crisisDetected, setCrisisDetected] = useState(false);
  const [crisisResources, setCrisisResources] = useState<CrisisResource[] | null>(null);

  const loadSessions = useCallback(async () => {
    try {
      const data = await chatAPI.getSessions();
      setSessions(data.sessions || []);
    } catch {
      setSessions([]);
    }
  }, []);

  const loadSession = useCallback(async (sessionId: number) => {
    try {
      // ✅ Fix: loadSession expects number, not string
      const data = await chatAPI.loadSession(sessionId);

      // Expand each { message, response } pair into [userMsg, botMsg]
      const expanded: Message[] = [];
      data.messages.forEach((m, i) => {
        expanded.push({
          id: `user-${i}-${Date.now()}`,
          role: "user",
          content: m.message,
          timestamp: new Date(m.timestamp),
        });
        expanded.push({
          id: `bot-${i}-${Date.now()}`,
          role: "bot",
          content: m.response,
          timestamp: new Date(m.timestamp),
        });
      });

      setMessages(expanded);
      setCurrentSessionId(sessionId);
    } catch {
      setMessages([]);
    }
  }, []);

  const startNewChat = useCallback(() => {
    setMessages([]);
    setCurrentSessionId(null);
    setCrisisDetected(false);
    setCrisisResources(null);
  }, []);

  const deleteSession = useCallback(
    async (sessionId: number) => {
      // ✅ Fix: expects number
      await chatAPI.deleteSession(sessionId);
      if (currentSessionId === sessionId) startNewChat();
      await loadSessions();
    },
    [currentSessionId, loadSessions, startNewChat],
  );

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isStreaming) return;

      const userMsg: Message = {
        id: `user-${Date.now()}`,
        role: "user",
        content,
        timestamp: new Date(),
      };

      const botMsgId = `bot-${Date.now()}`;
      const botMsg: Message = {
        id: botMsgId,
        role: "bot",
        content: "",
        timestamp: new Date(),
        isStreaming: true,
      };

      setMessages((prev) => [...prev, userMsg, botMsg]);
      setIsStreaming(true);

      try {
        // ✅ Fix: use chatAPI.streamMessage (the actual method in api.ts)
        // Signature: streamMessage(query, sessionId, onToken, onDone, onError)
        await chatAPI.streamMessage(
          content,
          currentSessionId, // number | null — matches api.ts param type
          (chunk: string) => {
            // ✅ Fix: explicit type on chunk
            setMessages((prev) =>
              prev.map((m) =>
                m.id === botMsgId ? { ...m, content: m.content + chunk } : m,
              ),
            );
          },
          (doneEvent: StreamEvent & { type: "done" }) => {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === botMsgId
                  ? {
                      ...m,
                      isStreaming: false,
                      isCrisis: doneEvent.crisis_detected,
                    }
                  : m,
              ),
            );

            // Auto-trigger crisis UI when backend flags it
            if (doneEvent.crisis_detected) {
              setCrisisDetected(true);
              setCrisisResources(doneEvent.crisis_resources ?? null);
            }

            // This is the missing piece — persist session across messages
            if (doneEvent.session_id) {
              setCurrentSessionId(doneEvent.session_id);
            }

            // Small delay so Flask has committed the session before we fetch
            setTimeout(() => loadSessions(), 200);
          },
          (errorMsg: string) => {
            // ✅ Fix: explicit type on error param
            setMessages((prev) =>
              prev.map((m) =>
                m.id === botMsgId
                  ? {
                      ...m,
                      content: `Sorry, something went wrong: ${errorMsg}`,
                      isStreaming: false,
                    }
                  : m,
              ),
            );
          },
        );
      } catch {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === botMsgId
              ? {
                  ...m,
                  content: "Sorry, something went wrong. Please try again.",
                  isStreaming: false,
                }
              : m,
          ),
        );
      } finally {
        setIsStreaming(false);
      }
    },
    [currentSessionId, isStreaming, loadSessions],
  );

  return {
    messages,
    sessions,
    currentSessionId,
    isStreaming,
    crisisDetected,
    crisisResources,
    dismissCrisis: () => { setCrisisDetected(false); setCrisisResources(null); },
    loadSessions,
    loadSession,
    startNewChat,
    deleteSession,
    sendMessage,
  };
}
