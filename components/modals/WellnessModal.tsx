'use client';
import { useState } from 'react';

interface WellnessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TABS = ['Breathing', 'Meditation', 'Grounding', 'Journaling'];

const EXERCISES: Record<string, { icon: string; title: string; desc: string; action: string }[]> = {
  Breathing: [
    { icon: '🫁', title: 'Box Breathing', desc: '4-4-4-4 pattern to calm your nervous system in minutes.', action: 'Start Exercise' },
    { icon: '🌊', title: '4-7-8 Breathing', desc: 'Inhale 4s, hold 7s, exhale 8s — promotes deep relaxation.', action: 'Start Exercise' },
    { icon: '🍃', title: 'Belly Breathing', desc: 'Diaphragmatic breathing to reduce stress instantly.', action: 'Start Exercise' },
  ],
  Meditation: [
    { icon: '🧘', title: 'Body Scan', desc: 'Progressive relaxation from head to toe in 10 minutes.', action: 'Begin' },
    { icon: '🌟', title: 'Loving Kindness', desc: 'Cultivate compassion for yourself and others.', action: 'Begin' },
    { icon: '🎯', title: 'Mindfulness', desc: 'Present-moment awareness without judgement.', action: 'Begin' },
  ],
  Grounding: [
    { icon: '5️⃣', title: '5-4-3-2-1 Technique', desc: 'Use your senses to anchor yourself to the present.', action: 'Try Now' },
    { icon: '🌍', title: 'Physical Grounding', desc: 'Connect with your physical environment and body.', action: 'Try Now' },
    { icon: '🔢', title: 'Mental Grounding', desc: 'Cognitive techniques to interrupt anxious thinking.', action: 'Try Now' },
  ],
  Journaling: [
    { icon: '📔', title: 'Gratitude Journal', desc: 'Record three things you are grateful for today.', action: 'Write' },
    { icon: '💭', title: 'Thought Reframing', desc: 'Challenge negative thoughts with balanced perspectives.', action: 'Write' },
    { icon: '🌱', title: 'Growth Reflection', desc: 'Reflect on your personal growth and progress.', action: 'Write' },
  ],
};

export default function WellnessModal({ isOpen, onClose }: WellnessModalProps) {
  const [activeTab, setActiveTab] = useState('Breathing');

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        className="animate-slideup rounded-3xl overflow-hidden w-[90%] max-w-2xl max-h-[85vh] overflow-y-auto"
        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-lg)' }}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: 'var(--border-color)' }}>
          <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'DM Serif Display, serif' }}>
            🧘 Wellness Center
          </h2>
          <button onClick={onClose}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-xl transition-all"
            style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
            ×
          </button>
        </div>

        <div className="p-6">
          {/* Tabs */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="px-5 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: activeTab === tab ? 'var(--accent-primary)' : 'var(--bg-primary)',
                  color: activeTab === tab ? 'var(--text-inverse)' : 'var(--text-secondary)',
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Exercises */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {EXERCISES[activeTab].map(ex => (
              <div
                key={ex.title}
                className="p-5 rounded-2xl border transition-all hover:-translate-y-1 cursor-pointer"
                style={{
                  background: 'var(--bg-primary)',
                  borderColor: 'var(--border-color)',
                }}
              >
                <div className="text-4xl mb-3">{ex.icon}</div>
                <h3 className="font-semibold mb-2 text-sm" style={{ color: 'var(--text-primary)' }}>{ex.title}</h3>
                <p className="text-xs mb-4 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{ex.desc}</p>
                <button
                  className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all"
                  style={{ background: 'var(--accent-primary)', color: 'var(--text-inverse)' }}
                >
                  {ex.action}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}