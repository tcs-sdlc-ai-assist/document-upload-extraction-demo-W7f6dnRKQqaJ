import { Session } from '@/src/lib/types';
import { STORAGE_KEYS } from '@/src/lib/constants';

function getSession(): Session | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SESSION);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setSession(session: Session): void {
  localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
}

function clearSession(): void {
  localStorage.removeItem(STORAGE_KEYS.SESSION);
}

function isAuthenticated(): boolean {
  return getSession() !== null;
}

function getUsername(): string | null {
  const session = getSession();
  return session ? session.username : null;
}

function getUserId(): string | null {
  const session = getSession();
  return session ? session.userId : null;
}

function createSession(userId: string, username: string, email: string): Session {
  const session: Session = {
    userId,
    username,
    email,
    loginAt: new Date().toISOString(),
  };
  setSession(session);
  return session;
}

export {
  getSession,
  setSession,
  clearSession,
  isAuthenticated,
  getUsername,
  getUserId,
  createSession,
};