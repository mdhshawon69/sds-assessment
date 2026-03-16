"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

export interface User {
  email: string;
  name: string;
}

interface StoredUser {
  email: string;
  name: string;
  password: string;
}

const USERS_KEY = "cinewatch_users";
const SESSION_KEY = "cinewatch_session";

const SEED_USERS: StoredUser[] = [
  { email: "demo@example.com", name: "Demo User", password: "demo1234" },
  { email: "russo@example.com", name: "Anthony Russo", password: "password123" },
];

function initializeUsers(): StoredUser[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(USERS_KEY);
  if (stored) return JSON.parse(stored);
  localStorage.setItem(USERS_KEY, JSON.stringify(SEED_USERS));
  return SEED_USERS;
}

function getUsers(): StoredUser[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(USERS_KEY);
  return stored ? JSON.parse(stored) : initializeUsers();
}

function saveUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getSession(): User | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(SESSION_KEY);
  return stored ? JSON.parse(stored) : null;
}

function saveSession(user: User) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export function loginUser(
  email: string,
  password: string
): { success: boolean; error?: string; user?: User } {
  const users = getUsers();
  const found = users.find((u) => u.email === email && u.password === password);
  if (!found) return { success: false, error: "Invalid email or password." };

  const session: User = { email: found.email, name: found.name };
  saveSession(session);
  return { success: true, user: session };
}

export function registerUser(
  name: string,
  email: string,
  password: string
): { success: boolean; error?: string; user?: User } {
  const users = getUsers();
  if (users.find((u) => u.email === email)) {
    return { success: false, error: "An account with this email already exists." };
  }

  const newUser: StoredUser = { email, name, password };
  users.push(newUser);
  saveUsers(users);

  const session: User = { email, name };
  saveSession(session);
  return { success: true, user: session };
}

export function logoutUser() {
  clearSession();
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    initializeUsers();
    setUser(getSession());
    setLoading(false);
  }, []);

  const login = useCallback((email: string, password: string) => {
    const result = loginUser(email, password);
    if (result.success && result.user) setUser(result.user);
    return result;
  }, []);

  const register = useCallback((name: string, email: string, password: string) => {
    const result = registerUser(name, email, password);
    if (result.success && result.user) setUser(result.user);
    return result;
  }, []);

  const logout = useCallback(() => {
    logoutUser();
    setUser(null);
    router.push("/");
  }, [router]);

  return { user, loading, login, register, logout, isAuthenticated: !!user };
}
