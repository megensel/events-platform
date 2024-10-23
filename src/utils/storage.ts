import { Event, User, AuthState } from '../types';

const STORAGE_KEYS = {
  EVENTS: 'eventhub_events',
  AUTH: 'eventhub_auth',
  USERS: 'eventhub_users',
} as const;

export function saveEvents(events: Event[]): void {
  localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
}

export function loadEvents(): Event[] {
  const stored = localStorage.getItem(STORAGE_KEYS.EVENTS);
  return stored ? JSON.parse(stored) : [];
}

export function saveAuth(auth: AuthState): void {
  localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(auth));
}

export function loadAuth(): AuthState | null {
  const stored = localStorage.getItem(STORAGE_KEYS.AUTH);
  return stored ? JSON.parse(stored) : null;
}

export function saveUsers(users: User[]): void {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

export function loadUsers(): User[] {
  const stored = localStorage.getItem(STORAGE_KEYS.USERS);
  return stored ? JSON.parse(stored) : [];
}