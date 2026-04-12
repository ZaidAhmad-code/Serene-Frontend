// ============================================================
// api.ts — all endpoints corrected to match Flask backend
// ============================================================

import {
  AuthResponse,
  AssessmentGetResponse,
  AssessmentSubmitResponse,
  AssessmentHistoryItem,
  ChatSession,
  DashboardStats,
  MoodTrendData,
  RiskPrediction,
  SentimentData,
  User,
  UserStats,
  WellnessStats,
  StreamEvent,
} from '@/types';

const BASE_URL = '';

// ─── Generic fetch wrapper ────────────────────────────────────────────────────

async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });

  if (!res.ok) {
    // Try to parse backend error message
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || err.message || `HTTP ${res.status}`);
  }

  return res.json() as Promise<T>;
}

// ============================================================
// AUTH  — maps to /api/auth/* routes in Flask
// ============================================================
export const authAPI = {
  /**
   * POST /api/auth/login
   * Body: { username, password }
   * Returns: { success, user, session_token, message }
   */
  login: (username: string, password: string) =>
    apiFetch<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  /**
   * POST /api/auth/register
   * Body: { username, email, password, first_name?, last_name? }
   * Returns: { success, message }
   */
  register: (
    username: string,
    email: string,
    password: string,
    first_name = '',
    last_name = ''
  ) =>
    apiFetch<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password, first_name, last_name }),
    }),

  /**
   * POST /api/auth/logout
   * Returns: { success, message }
   */
  logout: () => apiFetch<{ success: boolean; message: string }>('/api/auth/logout', { method: 'POST' }),

  /**
   * GET /api/auth/profile
   * Returns: { user: User }
   */
  getProfile: () => apiFetch<{ user: User }>('/api/auth/profile'),

  /**
   * PUT /api/auth/profile
   * Body: Partial<User>
   * Returns: { success, message }
   */
  updateProfile: (data: Partial<User>) =>
    apiFetch<{ success: boolean; message: string }>('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  /**
   * POST /api/auth/change-password
   * Body: { current_password, new_password }
   * Returns: { success, message }
   */
  changePassword: (current_password: string, new_password: string) =>
    apiFetch<{ success: boolean; message: string }>('/api/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ current_password, new_password }),
    }),

  /**
   * DELETE /api/auth/delete-account
   * Body: { password }
   * Returns: { success, message }
   */
  deleteAccount: (password: string) =>
    apiFetch<{ success: boolean; message: string }>('/api/auth/delete-account', {
      method: 'DELETE',
      body: JSON.stringify({ password }),
    }),

  /**
   * PUT /api/auth/preferences
   * Body: preferences object
   */
  updatePreferences: (prefs: Record<string, unknown>) =>
    apiFetch<{ success: boolean; message: string }>('/api/auth/preferences', {
      method: 'PUT',
      body: JSON.stringify(prefs),
    }),

  /**
   * GET /api/auth/preferences
   */
  getPreferences: () =>
    apiFetch<{ preferences: Record<string, unknown> }>('/api/auth/preferences'),
};

// ============================================================
// CHAT SESSIONS  — maps to /api/chats/* routes
// ============================================================
export const chatAPI = {
  /**
   * GET /api/chats
   * Returns: { sessions: ChatSession[] }
   */
  getSessions: () => apiFetch<{ sessions: ChatSession[] }>('/api/chats'),

  /**
   * POST /api/chats
   * Body: { title? }
   * Returns: { id, title, message }
   */
  createSession: (title = 'New Chat') =>
    apiFetch<{ id: number; title: string; message: string }>('/api/chats', {
      method: 'POST',
      body: JSON.stringify({ title }),
    }),

  /**
   * GET /api/chats/:sessionId
   * Returns: { session: ChatSession, messages: ChatMessage[] }
   */
  getSession: (sessionId: number) =>
    apiFetch<{
      session: ChatSession;
      messages: Array<{ message: string; response: string; timestamp: string }>;
    }>(`/api/chats/${sessionId}`),

  /**
   * POST /api/chats/:sessionId/load
   * Returns: { message, session, messages }
   */
  loadSession: (sessionId: number) =>
    apiFetch<{
      message: string;
      session: ChatSession;
      messages: Array<{ message: string; response: string; timestamp: string }>;
    }>(`/api/chats/${sessionId}/load`, { method: 'POST' }),

  /**
   * PUT /api/chats/:sessionId
   * Body: { title }
   * Returns: { message, title }
   */
  renameSession: (sessionId: number, title: string) =>
    apiFetch<{ message: string; title: string }>(`/api/chats/${sessionId}`, {
      method: 'PUT',
      body: JSON.stringify({ title }),
    }),

  /**
   * DELETE /api/chats/:sessionId
   * Returns: { message }
   */
  deleteSession: (sessionId: number) =>
    apiFetch<{ message: string }>(`/api/chats/${sessionId}`, { method: 'DELETE' }),

  /**
   * DELETE /api/chats/clear
   * Returns: { message }
   */
  clearAllChats: () =>
    apiFetch<{ message: string }>('/api/chats/clear', { method: 'DELETE' }),

  /**
   * POST /api/chat/stream  — Server-Sent Events
   *
   * BE expects:  { query: string, chat_session_id: number | null }
   * BE streams:  data: { type: 'token', content }
   *              data: { type: 'done', crisis_detected, crisis_level, crisis_resources, full_response }
   *              data: { type: 'error', message }
   *
   * @param query           The user message text
   * @param sessionId       Current chat session id (null for new)
   * @param onToken         Called for each streamed token chunk
   * @param onDone          Called when stream completes; receives the done event payload
   * @param onError         Called on stream or parse error
   */
  streamMessage: async (
    query: string,
    sessionId: number | null,
    onToken: (chunk: string) => void,
    onDone: (event: StreamEvent & { type: 'done' }) => void,
    onError?: (message: string) => void
  ): Promise<void> => {
    const res = await fetch(`${BASE_URL}/api/chat/stream`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      // Key fix: backend reads 'query' and 'chat_session_id', not 'message' / 'session_id'
      body: JSON.stringify({ query, chat_session_id: sessionId }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Stream request failed' }));
      throw new Error(err.error || `HTTP ${res.status}`);
    }

    const reader = res.body?.getReader();
    if (!reader) throw new Error('Response body is not readable');

    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');

        // Keep the last (potentially incomplete) line in the buffer
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data: ')) continue;

          const jsonStr = trimmed.slice(6).trim();
          if (!jsonStr) continue;

          try {
            const event = JSON.parse(jsonStr) as StreamEvent;

            if (event.type === 'token') {
              onToken(event.content);
            } else if (event.type === 'done') {
              onDone(event);
            } else if (event.type === 'error') {
              onError?.(event.message);
              return;
            }
          } catch {
            // Partial JSON or non-data line — skip silently
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  },

  /**
   * POST /ask (non-streaming fallback)
   * Uses FormData because Flask reads request.form['query']
   *
   * Returns: { response, crisis_detected, cached, sentiment, chat_session_id }
   */
  sendMessageFallback: async (
    query: string,
    chatSessionId: number | null
  ): Promise<{
    response: string;
    crisis_detected: boolean;
    cached: boolean;
    chat_session_id: number | null;
    sentiment?: unknown;
  }> => {
    const form = new FormData();
    form.append('query', query);
    if (chatSessionId != null) form.append('chat_session_id', String(chatSessionId));

    const res = await fetch(`${BASE_URL}/ask`, {
      method: 'POST',
      credentials: 'include',
      body: form,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(err.error || `HTTP ${res.status}`);
    }

    return res.json();
  },
};

// ============================================================
// DASHBOARD  — maps to /api/dashboard/*
// ============================================================
export const dashboardAPI = {
  /**
   * GET /api/dashboard/stats
   * Returns: { total_chats, total_messages, streak_days, recent_activity }
   */
  getStats: () => apiFetch<DashboardStats>('/api/dashboard/stats'),

  /**
   * POST /api/dashboard/mood
   * Body: { mood: string }
   */
  saveMood: (mood: string) =>
    apiFetch<{ message: string }>('/api/dashboard/mood', {
      method: 'POST',
      body: JSON.stringify({ mood }),
    }),
};

// ============================================================
// ANALYTICS  — maps to /api/analytics/*
// ============================================================
export const analyticsAPI = {
  /**
   * GET /api/analytics/user-stats
   */
  getUserStats: () => apiFetch<UserStats>('/api/analytics/user-stats'),

  /**
   * GET /api/analytics/trends/:type?days=30
   * type: 'phq9' | 'gad7'
   */
  getTrends: (type: 'phq9' | 'gad7', days = 30) =>
    apiFetch<unknown>(`/api/analytics/trends/${type}?days=${days}`),

  /**
   * GET /api/analytics/engagement
   */
  getEngagement: () => apiFetch<unknown>('/api/analytics/engagement'),

  /**
   * GET /api/analytics/trajectory
   */
  getTrajectory: () => apiFetch<unknown>('/api/analytics/trajectory'),

  /**
   * GET /api/analytics/sentiment-history?limit=10
   * Returns: { history: SentimentHistoryItem[] }
   */
  getSentimentHistory: (limit = 10) =>
    apiFetch<SentimentData>(`/api/analytics/sentiment-history?limit=${limit}`),

  /**
   * GET /api/analytics/mood-trend?days=7
   * Returns: { trend: string, data: MoodTrendPoint[] }
   */
  getMoodTrend: (days = 7) =>
    apiFetch<MoodTrendData>(`/api/analytics/mood-trend?days=${days}`),
};

// ============================================================
// ASSESSMENTS  — maps to /api/assessment/phq9 and /api/assessment/gad7
// ============================================================
export const assessmentAPI = {
  /**
   * GET /api/assessment/phq9
   */
  getPHQ9: () => apiFetch<AssessmentGetResponse>('/api/assessment/phq9'),

  /**
   * GET /api/assessment/gad7
   */
  getGAD7: () => apiFetch<AssessmentGetResponse>('/api/assessment/gad7'),

  /**
   * POST /api/assessment/phq9
   * Body: { answers: number[] }
   * Returns: AssessmentSubmitResponse
   */
  submitPHQ9: (answers: number[]) =>
    apiFetch<AssessmentSubmitResponse>('/api/assessment/phq9', {
      method: 'POST',
      body: JSON.stringify({ answers }),
    }),

  /**
   * POST /api/assessment/gad7
   * Body: { answers: number[] }
   */
  submitGAD7: (answers: number[]) =>
    apiFetch<AssessmentSubmitResponse>('/api/assessment/gad7', {
      method: 'POST',
      body: JSON.stringify({ answers }),
    }),

  /**
   * Convenience: get questions for any supported type
   */
  getQuestions: (type: 'phq9' | 'gad7') =>
    type === 'phq9'
      ? assessmentAPI.getPHQ9()
      : assessmentAPI.getGAD7(),

  /**
   * Convenience: submit answers for any supported type
   */
  submit: (type: 'phq9' | 'gad7', answers: number[]) =>
    type === 'phq9'
      ? assessmentAPI.submitPHQ9(answers)
      : assessmentAPI.submitGAD7(answers),

  /**
   * GET /api/assessment/history
   * Returns: { history: AssessmentHistoryItem[] }
   */
  getHistory: () =>
    apiFetch<{ history: AssessmentHistoryItem[] }>('/api/assessment/history'),
};

// ============================================================
// PREDICTIVE ANALYTICS  — maps to /api/predictive/*
// ============================================================
export const predictiveAPI = {
  /**
   * GET /api/predictive/risk?days=14
   */
  getRisk: (days = 14) =>
    apiFetch<RiskPrediction>(`/api/predictive/risk?days=${days}`),

  /**
   * GET /api/predictive/forecast?days=7
   */
  getMoodForecast: (days = 7) =>
    apiFetch<unknown>(`/api/predictive/forecast?days=${days}`),

  /**
   * GET /api/predictive/patterns?days=30
   */
  getPatterns: (days = 30) =>
    apiFetch<unknown>(`/api/predictive/patterns?days=${days}`),

  /**
   * GET /api/predictive/comprehensive
   */
  getComprehensive: () => apiFetch<unknown>('/api/predictive/comprehensive'),
};

// ============================================================
// WELLNESS  — maps to /api/wellness/*
// ============================================================
export const wellnessAPI = {
  /**
   * GET /api/wellness/breathing
   */
  getBreathingExercises: () => apiFetch<{ exercises: unknown[] }>('/api/wellness/breathing'),

  /**
   * GET /api/wellness/meditation
   */
  getMeditationSessions: () => apiFetch<{ sessions: unknown[] }>('/api/wellness/meditation'),

  /**
   * GET /api/wellness/exercise/:id
   */
  getExercise: (id: string) => apiFetch<unknown>(`/api/wellness/exercise/${id}`),

  /**
   * GET /api/wellness/recommend?mood=&time=
   */
  getRecommendations: (mood?: string, time?: number) => {
    const params = new URLSearchParams();
    if (mood) params.set('mood', mood);
    if (time != null) params.set('time', String(time));
    return apiFetch<{ recommendations: unknown[] }>(`/api/wellness/recommend?${params}`);
  },

  /**
   * POST /api/wellness/session
   * Body: { session_type, exercise_id, duration_seconds, completed, mood_before, mood_after, notes }
   */
  saveSession: (data: {
    session_type: 'breathing' | 'meditation';
    exercise_id: string;
    duration_seconds: number;
    completed?: boolean;
    mood_before?: string;
    mood_after?: string;
    notes?: string;
  }) =>
    apiFetch<unknown>('/api/wellness/session', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /**
   * GET /api/wellness/stats
   */
  getStats: () => apiFetch<WellnessStats>('/api/wellness/stats'),
};

// ============================================================
// HEALTH  — maps to /api/health
// ============================================================
export const healthAPI = {
  check: () => apiFetch<Record<string, unknown>>('/api/health'),
};

// ============================================================
// SENTIMENT  — maps to /api/sentiment/*
// ============================================================
export const sentimentAPI = {
  /**
   * POST /api/sentiment/analyze
   * Body: { text }
   */
  analyze: (text: string) =>
    apiFetch<{
      sentiment: { score: number; sentiment: string };
      emotions: Record<string, number>;
    }>('/api/sentiment/analyze', {
      method: 'POST',
      body: JSON.stringify({ text }),
    }),

  /**
   * GET /api/sentiment/history?limit=50
   */
  getHistory: (limit = 50) =>
    apiFetch<{ history: unknown[] }>(`/api/sentiment/history?limit=${limit}`),

  /**
   * GET /api/sentiment/mood-trend?days=7
   */
  getMoodTrend: (days = 7) =>
    apiFetch<{ trend: unknown[] }>(`/api/sentiment/mood-trend?days=${days}`),
};

// ============================================================
// MEMORY / CACHE  — maps to /api/memory/* and /api/cache/*
// ============================================================
export const systemAPI = {
  clearMemory: () =>
    apiFetch<{ status: string; message: string }>('/api/memory/clear', { method: 'POST' }),

  getMemoryStats: () => apiFetch<unknown>('/api/memory/stats'),

  getCacheStats: () => apiFetch<unknown>('/api/cache/stats'),

  clearCache: () =>
    apiFetch<{ status: string; message: string }>('/api/cache/clear', { method: 'POST' }),
};