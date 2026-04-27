import { useEffect, useState } from "react";
import type { User } from "../types";

// Shared registry of online users (module-level for cross-hook sync)
export const onlineRegistry = new Map<string, User>();

export function useUsers(
  userStore: Map<string, { username: string; password: string; user: User }>,
) {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const poll = () => {
      const now = Date.now();
      const list: User[] = [];
      for (const entry of userStore.values()) {
        const isOnline = now - entry.user.lastSeen < 5 * 60 * 1000;
        list.push({ ...entry.user, isOnline });
      }
      setUsers(list);
    };
    poll();
    const id = setInterval(poll, 5000);
    return () => clearInterval(id);
  }, [userStore]);

  return { users };
}
