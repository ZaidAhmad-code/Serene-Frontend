// ============================================================
// types.ts — aligned exactly with Flask backend responses
// ============================================================

export interface User {
  id: string | number;
  username: string;
  email: string;
  display_name?: string;
  bio?: string;
  avatar_config?: string;
  created_at?: string;
  last_login?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: Date;
  isCrisis?: boolean;
  isStreaming?: boolean;
}

export interface ChatSession {
  id: number;
  title: string;
  created_at: string;
  updated_at?: string;
  message_count?: number;
}

// POST /api/auth/login → { success, user, session_token, message }
// POST /api/auth/register → { success, message, user? }
export interface AuthResponse {
  success: boolean;
  message?: string;
  error?: string;
  user?: User;
  session_token?: string;
}

// GET /api/dashboard/stats
export interface DashboardStats {
  total_chats: number;
  total_messages: number;
  streak_days: number;
  recent_activity: RecentActivity[];
}

export interface RecentActivity {
  title: string;
  description: string;
  time: string;
}

// GET /api/analytics/sentiment-history
export interface SentimentHistoryItem {
  message: string;
  score: number;
  label: string;
  emotions: Record<string, number>;
  mood_score: number;
  timestamp: string;
}

export interface SentimentData {
  history: SentimentHistoryItem[];
}

// GET /api/analytics/mood-trend
export interface MoodTrendData {
  trend: 'Improving' | 'Declining' | 'Stable';
  data: MoodTrendPoint[];
}

export interface MoodTrendPoint {
  date: string;
  avg_score: number;
}

// SSE stream event shapes from /api/chat/stream
export interface StreamTokenEvent {
  type: 'token';
  content: string;
}

export interface StreamDoneEvent {
  type: 'done';
  session_id?: number;    
  crisis_detected: boolean;
  crisis_level?: string | null;
  crisis_resources?: CrisisResource[] | null;
  full_response: string;
  
}

export interface StreamErrorEvent {
  type: 'error';
  message: string;
}

export type StreamEvent = StreamTokenEvent | StreamDoneEvent | StreamErrorEvent;

export interface CrisisResource {
  name: string;
  number?: string;
  url?: string;
}

// GET /api/assessment/phq9 or /api/assessment/gad7
export interface AssessmentQuestion {
  id: number;
  text: string;
}

export interface AssessmentOption {
  value: number;
  label: string;
}

export interface AssessmentGetResponse {
  title: string;
  description: string;
  questions: AssessmentQuestion[];
  options: AssessmentOption[];
}

// POST /api/assessment/phq9 or /api/assessment/gad7
export interface AssessmentSubmitResponse {
  id: number;
  score: number;
  max_score: number;
  interpretation: {
    severity: string;
    description: string;
    recommendation?: string;
  };
  crisis_alert: CrisisAlert | null;
}

export interface CrisisAlert {
  requires_intervention: boolean;
  level: string;
  severity: number;
}

// GET /api/assessment/history
export interface AssessmentHistoryItem {
  id: number;
  type: string;
  score: number;
  severity: string;
  timestamp: string;
}

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

// GET /api/analytics/user-stats
export interface UserStats {
  total_conversations: number;
  total_assessments: number;
  crisis_events: number;
  last_activity?: string;
}

// GET /api/predictive/risk
export interface RiskPrediction {
  risk_level: 'low' | 'medium' | 'high';
  confidence: number;
  factors: string[];
  recommendations: string[];
}

// GET /api/wellness/stats
export interface WellnessStats {
  total_sessions: number;
  streak_days: number;
  minutes_practiced: number;
  favorite_exercise?: string;
}

export interface JournalEntry {
  id: string;
  text: string;
  mood: string;
  date: string; // ISO string
  wordCount: number;
}

export type JournalMood = 'Calm' | 'Happy' | 'Anxious' | 'Sad' | 'Overwhelmed' | 'Grateful' | '';

export interface JournalStore {
  entries: JournalEntry[];
  version: number;
}