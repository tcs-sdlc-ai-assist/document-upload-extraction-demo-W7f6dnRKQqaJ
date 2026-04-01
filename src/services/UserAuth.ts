import { User, Session } from '@/src/lib/types';
import { STORAGE_KEYS } from '@/src/lib/constants';

function getUsers(): User[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveUsers(users: User[]): void {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

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

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

async function hashPassword(password: string): Promise<string> {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  } catch {
    // Fallback for environments without crypto.subtle
    return btoa(password);
  }
}

export async function signup(
  username: string,
  email: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  const trimmedUsername = username.trim();
  const trimmedEmail = email.trim().toLowerCase();

  if (trimmedUsername.length < 3 || trimmedUsername.length > 32) {
    return { success: false, error: 'Username must be between 3 and 32 characters' };
  }

  if (!/^[a-zA-Z0-9]+$/.test(trimmedUsername)) {
    return { success: false, error: 'Username must be alphanumeric' };
  }

  if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    return { success: false, error: 'Please provide a valid email address' };
  }

  if (password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters' };
  }

  try {
    const users = getUsers();

    const existingUsername = users.find(
      (u) => u.username.toLowerCase() === trimmedUsername.toLowerCase()
    );
    if (existingUsername) {
      return { success: false, error: 'Username already exists' };
    }

    const existingEmail = users.find((u) => u.email === trimmedEmail);
    if (existingEmail) {
      return { success: false, error: 'Email already registered' };
    }

    const hashedPassword = await hashPassword(password);

    const newUser: User = {
      id: generateId(),
      username: trimmedUsername,
      email: trimmedEmail,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveUsers(users);

    const session: Session = {
      userId: newUser.id,
      username: newUser.username,
      email: newUser.email,
      loginAt: new Date().toISOString(),
    };
    setSession(session);

    return { success: true };
  } catch {
    return { success: false, error: 'An unexpected error occurred during signup' };
  }
}

export async function login(
  username: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  const trimmedUsername = username.trim();

  if (!trimmedUsername || !password) {
    return { success: false, error: 'Username and password are required' };
  }

  try {
    const users = getUsers();
    const user = users.find(
      (u) => u.username.toLowerCase() === trimmedUsername.toLowerCase()
    );

    if (!user) {
      return { success: false, error: 'Invalid credentials' };
    }

    const hashedPassword = await hashPassword(password);
    if (user.password !== hashedPassword) {
      return { success: false, error: 'Invalid credentials' };
    }

    const session: Session = {
      userId: user.id,
      username: user.username,
      email: user.email,
      loginAt: new Date().toISOString(),
    };
    setSession(session);

    return { success: true };
  } catch {
    return { success: false, error: 'An unexpected error occurred during login' };
  }
}

export function logout(): void {
  clearSession();
}

export function getCurrentUser(): Session | null {
  return getSession();
}