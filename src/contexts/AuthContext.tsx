'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Session } from '@/src/lib/types';
import * as UserAuth from '@/src/services/UserAuth';
import * as SessionManager from '@/src/services/SessionManager';

interface AuthContextValue {
  user: Session | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (username: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = SessionManager.getSession();
    if (session) {
      setUser(session);
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const result = await UserAuth.login(username, password);
    if (result.success) {
      const session = SessionManager.getSession();
      setUser(session);
    }
    return result;
  }, []);

  const signup = useCallback(async (username: string, email: string, password: string) => {
    const result = await UserAuth.signup(username, email, password);
    if (result.success) {
      const session = SessionManager.getSession();
      setUser(session);
    }
    return result;
  }, []);

  const logout = useCallback(() => {
    UserAuth.logout();
    setUser(null);
  }, []);

  const isAuthenticated = user !== null;

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated,
      loading,
      login,
      signup,
      logout,
    }),
    [user, isAuthenticated, loading, login, signup, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export { AuthProvider, useAuth, AuthContext };