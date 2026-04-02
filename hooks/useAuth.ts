'use client';
import { useCallback, useEffect, useState } from 'react';
import { authAPI } from '@/libs/api';
import { User } from '@/types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const data = await authAPI.getProfile();
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (username: string, password: string) => {
    const data = await authAPI.login(username, password);
    if (data.success && data.user) setUser(data.user);
    return data;
  };

  const register = async (username: string, email: string, password: string) => {
    const data = await authAPI.register(username, email, password);
    if (data.success && data.user) setUser(data.user);
    return data;
  };

  const logout = async () => {
    await authAPI.logout();
    setUser(null);
  };

  return { user, loading, login, register, logout, checkAuth };
}