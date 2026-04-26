'use client';

import type { AuthResult } from './api';

const KEY = 'eventhub.session';

export function saveSession(s: AuthResult): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(KEY, JSON.stringify(s));
}

export function loadSession(): AuthResult | null {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(KEY);
  return raw ? (JSON.parse(raw) as AuthResult) : null;
}

export function clearSession(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(KEY);
}
