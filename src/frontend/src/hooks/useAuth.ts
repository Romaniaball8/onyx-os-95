import { useCallback, useEffect, useRef, useState } from "react";
import type { AuthState, TextPlate, User, UsernameEffect } from "../types";

// ── LocalStorage keys ────────────────────────────────────────────────────────
const LS_USERS = "onyxos_users";
const LS_SESSION = "onyxos_user";
const LS_ONLINE = "onyxos_online";

// ── Serialisable record stored per user ─────────────────────────────────────
interface UserRecord {
  username: string;
  password: string;
  user: User;
}

// ── Online heartbeat helpers ──────────────────────────────────────────────────
function writeOnlineHeartbeat(username: string) {
  try {
    const raw = localStorage.getItem(LS_ONLINE);
    const obj: Record<string, number> = raw
      ? (JSON.parse(raw) as Record<string, number>)
      : {};
    obj[username] = Date.now();
    localStorage.setItem(LS_ONLINE, JSON.stringify(obj));
  } catch {
    /* noop */
  }
}

function removeOnlineHeartbeat(username: string) {
  try {
    const raw = localStorage.getItem(LS_ONLINE);
    if (!raw) return;
    const obj = JSON.parse(raw) as Record<string, number>;
    delete obj[username];
    localStorage.setItem(LS_ONLINE, JSON.stringify(obj));
  } catch {
    /* noop */
  }
}

// ── Persist / restore helpers ─────────────────────────────────────────────────
function loadUsers(): Map<string, UserRecord> {
  try {
    const raw = localStorage.getItem(LS_USERS);
    if (!raw) return new Map();
    const obj = JSON.parse(raw) as Record<string, UserRecord>;
    // Migrate old records missing new fields
    const entries = Object.entries(obj).map(([k, v]) => {
      const u = v.user;
      if (!u.textPlate) u.textPlate = "None";
      if (!u.biography) u.biography = "";
      if (!u.bio) u.bio = "";
      if (!u.usernameEffect) u.usernameEffect = "None";
      // Always enforce owner role integrity
      if (u.username === "Mr.Romaniaman") u.role = "Owner";
      else if (u.role === "Owner") u.role = "User";
      return [k, v] as [string, UserRecord];
    });
    return new Map(entries);
  } catch {
    return new Map();
  }
}

function saveUsers(store: Map<string, UserRecord>) {
  try {
    const obj: Record<string, UserRecord> = {};
    for (const [k, v] of store) obj[k] = v;
    localStorage.setItem(LS_USERS, JSON.stringify(obj));
  } catch {
    /* noop */
  }
}

function loadSession(): string | null {
  try {
    return localStorage.getItem(LS_SESSION);
  } catch {
    return null;
  }
}

function saveSession(username: string | null) {
  try {
    if (username) localStorage.setItem(LS_SESSION, username);
    else localStorage.removeItem(LS_SESSION);
  } catch {
    /* noop */
  }
}

// ── Module-level store (initialised from localStorage once) ──────────────────
const userStore: Map<string, UserRecord> = loadUsers();

// ── Hook ─────────────────────────────────────────────────────────────────────
export function useAuth() {
  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopHeartbeat = useCallback(() => {
    if (heartbeatRef.current !== null) {
      clearInterval(heartbeatRef.current);
      heartbeatRef.current = null;
    }
  }, []);

  const startHeartbeat = useCallback(
    (username: string) => {
      stopHeartbeat();
      // Write immediately, then every 30 seconds
      writeOnlineHeartbeat(username);
      heartbeatRef.current = setInterval(() => {
        writeOnlineHeartbeat(username);
      }, 30_000);
    },
    [stopHeartbeat],
  );

  const getInitialState = (): AuthState => {
    const sessionKey = loadSession();
    if (sessionKey) {
      const entry = userStore.get(sessionKey);
      if (entry) {
        // Always re-enforce owner role on session restore
        const role =
          entry.user.username === "Mr.Romaniaman" ? "Owner" : entry.user.role;
        return {
          user: { ...entry.user, role, isOnline: true },
          isLoading: false,
          error: null,
        };
      }
    }
    return { user: null, isLoading: false, error: null };
  };

  const [state, setState] = useState<AuthState>(getInitialState);

  // Restore heartbeat on mount if session exists
  useEffect(() => {
    const sessionKey = loadSession();
    if (sessionKey && userStore.has(sessionKey)) {
      startHeartbeat(sessionKey);
    }
    return () => {
      stopHeartbeat();
    };
  }, [startHeartbeat, stopHeartbeat]);

  const login = useCallback(
    (username: string, password: string): boolean => {
      const entry = userStore.get(username);
      if (!entry || entry.password !== password) {
        setState((s) => ({ ...s, error: "Invalid username or password." }));
        return false;
      }
      // Always enforce owner role on login
      const role = username === "Mr.Romaniaman" ? "Owner" : entry.user.role;
      const user: User = {
        ...entry.user,
        role,
        isOnline: true,
        lastSeen: Date.now(),
      };
      entry.user = user;
      saveUsers(userStore);
      saveSession(username);
      startHeartbeat(username);
      setState({ user, isLoading: false, error: null });
      return true;
    },
    [startHeartbeat],
  );

  const register = useCallback(
    (username: string, password: string): boolean => {
      if (userStore.has(username)) {
        setState((s) => ({ ...s, error: "Username already taken." }));
        return false;
      }
      if (username.length < 3) {
        setState((s) => ({
          ...s,
          error: "Username must be at least 3 characters.",
        }));
        return false;
      }
      if (password.length < 4) {
        setState((s) => ({
          ...s,
          error: "Password must be at least 4 characters.",
        }));
        return false;
      }
      // Only Mr.Romaniaman is Owner — all others are plain Users
      const role = username === "Mr.Romaniaman" ? "Owner" : "User";
      const user: User = {
        id: `user-${Date.now()}`,
        username,
        role,
        bio: "",
        biography: "",
        avatarUrl: "",
        usernameEffect: "None",
        textPlate: "None",
        lastSeen: Date.now(),
        isOnline: true,
      };
      userStore.set(username, { username, password, user });
      saveUsers(userStore);
      saveSession(username);
      startHeartbeat(username);
      setState({ user, isLoading: false, error: null });
      return true;
    },
    [startHeartbeat],
  );

  const logout = useCallback(() => {
    const sessionKey = loadSession();
    if (sessionKey) {
      const entry = userStore.get(sessionKey);
      if (entry) {
        entry.user = { ...entry.user, isOnline: false, lastSeen: Date.now() };
        saveUsers(userStore);
      }
      removeOnlineHeartbeat(sessionKey);
    }
    stopHeartbeat();
    saveSession(null);
    setState({ user: null, isLoading: false, error: null });
  }, [stopHeartbeat]);

  const clearError = useCallback(() => {
    setState((s) => ({ ...s, error: null }));
  }, []);

  const updateProfile = useCallback(
    (
      updates: Partial<
        Pick<
          User,
          | "bio"
          | "avatarUrl"
          | "username"
          | "usernameEffect"
          | "textPlate"
          | "biography"
        >
      >,
    ) => {
      const sessionKey = loadSession();
      if (!sessionKey) return;
      const entry = userStore.get(sessionKey);
      if (!entry) return;
      const updatedUser: User = { ...entry.user, ...updates };
      // Always enforce owner integrity
      if (updatedUser.username === "Mr.Romaniaman") {
        updatedUser.role = "Owner";
      }
      entry.user = updatedUser;
      // Handle username rename
      if (updates.username && updates.username !== sessionKey) {
        userStore.delete(sessionKey);
        userStore.set(updates.username, {
          ...entry,
          username: updates.username,
          user: updatedUser,
        });
        saveSession(updates.username);
        // Update heartbeat under new username
        removeOnlineHeartbeat(sessionKey);
        writeOnlineHeartbeat(updates.username);
      }
      saveUsers(userStore);
      setState((s) => ({ ...s, user: updatedUser }));
    },
    [],
  );

  const setUserRole = useCallback(
    (targetUsername: string, newRole: "Admin" | "User") => {
      if (targetUsername === "Mr.Romaniaman") return; // owner is immutable
      const entry = userStore.get(targetUsername);
      if (!entry) return;
      entry.user = { ...entry.user, role: newRole };
      userStore.set(targetUsername, entry);
      saveUsers(userStore);
    },
    [],
  );

  const persistTextPlate = useCallback((username: string, plate: TextPlate) => {
    const entry = userStore.get(username);
    if (!entry) return;
    entry.user = { ...entry.user, textPlate: plate };
    saveUsers(userStore);
  }, []);

  const persistUsernameEffect = useCallback(
    (username: string, effect: UsernameEffect) => {
      const entry = userStore.get(username);
      if (!entry) return;
      entry.user = { ...entry.user, usernameEffect: effect };
      saveUsers(userStore);
    },
    [],
  );

  return {
    ...state,
    login,
    register,
    logout,
    clearError,
    updateProfile,
    setUserRole,
    persistTextPlate,
    persistUsernameEffect,
    userStore,
  };
}
