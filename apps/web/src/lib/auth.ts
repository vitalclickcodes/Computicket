'use client';

const TOKEN_KEY = 'ctng_token';

export interface AuthedUser {
  id: string;
  email: string;
  name?: string | null;
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function signOut() {
  window.localStorage.removeItem(TOKEN_KEY);
}
