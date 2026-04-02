'use client';
import { useState } from 'react';
import { authAPI } from '@/libs/api';
import { User } from '@/types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onLogout: () => void;
  onToast: (msg: string, type: 'success' | 'error') => void;
}

export default function ProfileModal({ isOpen, onClose, user, onLogout, onToast }: ProfileModalProps) {
  const [displayName, setDisplayName] = useState(user?.display_name || user?.username || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [saving, setSaving] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!isOpen || !user) return null;

  const handleSave = async () => {
    setSaving(true);
    try {
      // Flask accepts: display_name, email, bio, avatar_config
      await authAPI.updateProfile({ display_name: displayName, bio });
      onToast('Profile updated!', 'success');
      onClose();
    } catch {
      onToast('Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      onToast('Password is required to delete account', 'error');
      return;
    }
    try {
      await authAPI.deleteAccount(deletePassword);
      onLogout();
      onClose();
    } catch {
      onToast('Failed to delete account. Check your password.', 'error');
    }
  };

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        className="animate-slideup rounded-3xl overflow-hidden w-[90%] max-w-md max-h-[85vh] overflow-y-auto"
        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-lg)' }}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: 'var(--border-color)' }}>
          <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'DM Serif Display, serif' }}>
            👤 Profile
          </h2>
          <button onClick={onClose}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-xl"
            style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
            ×
          </button>
        </div>

        <div className="p-6">
          {/* Avatar */}
          <div className="flex justify-center mb-6">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold"
              style={{ background: 'var(--accent-primary)', color: 'var(--text-inverse)' }}
            >
              {user.username[0].toUpperCase()}
            </div>
          </div>

          {/* Fields */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>Display Name</label>
              <input
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>Bio</label>
              <textarea
                value={bio}
                onChange={e => setBio(e.target.value)}
                rows={3}
                placeholder="Tell us about yourself..."
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all resize-none"
                style={{
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>Email</label>
              <input
                value={user.email}
                readOnly
                className="w-full px-4 py-3 rounded-xl text-sm opacity-60 cursor-not-allowed"
                style={{
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-3 rounded-xl font-semibold text-sm mb-4 transition-all disabled:opacity-60"
            style={{ background: 'var(--accent-primary)', color: 'var(--text-inverse)' }}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>

          {/* Danger zone */}
          <div className="rounded-xl p-4 mt-4" style={{ background: 'rgba(199,107,92,0.05)', border: '1px solid rgba(199,107,92,0.2)' }}>
            <h4 className="text-xs font-bold mb-3" style={{ color: 'var(--danger)' }}>Danger Zone</h4>
            <div className="flex gap-2 flex-wrap mb-3">
              <button
                onClick={() => { onLogout(); onClose(); }}
                className="px-4 py-2 rounded-xl text-xs font-semibold transition-all"
                style={{ background: 'var(--danger)', color: 'white' }}
              >
                Sign Out
              </button>
              <button
                onClick={() => setShowDeleteConfirm(!showDeleteConfirm)}
                className="px-4 py-2 rounded-xl text-xs font-semibold transition-all border"
                style={{ borderColor: 'var(--danger)', color: 'var(--danger)', background: 'transparent' }}
              >
                Delete Account
              </button>
            </div>
            {showDeleteConfirm && (
              <div className="space-y-3 mt-3 pt-3 border-t" style={{ borderColor: 'rgba(199,107,92,0.2)' }}>
                <p className="text-xs" style={{ color: 'var(--danger)' }}>
                  Enter your password to confirm account deletion. This action cannot be undone.
                </p>
                <input
                  type="password"
                  value={deletePassword}
                  onChange={e => setDeletePassword(e.target.value)}
                  placeholder="Your password"
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                  style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                />
                <button
                  onClick={handleDeleteAccount}
                  disabled={!deletePassword}
                  className="w-full py-2 rounded-lg text-xs font-semibold transition-all disabled:opacity-50"
                  style={{ background: 'var(--danger)', color: 'white' }}
                >
                  Confirm Delete Account
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}