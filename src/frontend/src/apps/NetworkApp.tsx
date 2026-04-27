import { useEffect, useState } from "react";
import type { User } from "../types";

const LS_USERS = "onyxos_users";
const LS_ONLINE = "onyxos_online";
const ONLINE_THRESHOLD_MS = 90_000; // 90 seconds

interface UserRecord {
  username: string;
  password: string;
  user: User;
}

interface NetworkUser {
  user: User;
  isOnline: boolean;
}

function readAllUsers(): UserRecord[] {
  try {
    const raw = localStorage.getItem(LS_USERS);
    if (!raw) return [];
    const obj = JSON.parse(raw) as Record<string, UserRecord>;
    return Object.values(obj);
  } catch {
    return [];
  }
}

function readOnlineMap(): Record<string, number> {
  try {
    const raw = localStorage.getItem(LS_ONLINE);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, number>;
  } catch {
    return {};
  }
}

function isOnline(
  username: string,
  onlineMap: Record<string, number>,
): boolean {
  const ts = onlineMap[username];
  if (!ts) return false;
  return Date.now() - ts < ONLINE_THRESHOLD_MS;
}

const ROLE_COLORS: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  Owner: { bg: "#ffd700", text: "#000", border: "#b8860b" },
  Admin: { bg: "#4169e1", text: "#fff", border: "#27408b" },
  User: { bg: "#c0c0c0", text: "#000", border: "#808080" },
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface Props {
  userStore?: Map<string, UserRecord>;
}

export function NetworkApp(_props: Props) {
  const [networkUsers, setNetworkUsers] = useState<NetworkUser[]>([]);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  useEffect(() => {
    const refresh = () => {
      const records = readAllUsers();
      const onlineMap = readOnlineMap();
      const users: NetworkUser[] = records.map((r) => ({
        user: r.user,
        isOnline: isOnline(r.username, onlineMap),
      }));
      // Sort: online first, then by role priority, then alphabetical
      const rolePriority: Record<string, number> = {
        Owner: 0,
        Admin: 1,
        User: 2,
      };
      users.sort((a, b) => {
        if (a.isOnline !== b.isOnline) return a.isOnline ? -1 : 1;
        const rp =
          (rolePriority[a.user.role] ?? 3) - (rolePriority[b.user.role] ?? 3);
        if (rp !== 0) return rp;
        return a.user.username.localeCompare(b.user.username);
      });
      setNetworkUsers(users);
      setLastRefresh(new Date());
    };

    refresh();
    const id = setInterval(refresh, 5_000);
    return () => clearInterval(id);
  }, []);

  const onlineCount = networkUsers.filter((u) => u.isOnline).length;
  const totalCount = networkUsers.length;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        fontFamily: "Tahoma, Verdana, 'MS Sans Serif', sans-serif",
        fontSize: 11,
        background: "#d4d0c8",
      }}
    >
      {/* Win95 toolbar-style header */}
      <div
        style={{
          background: "#000080",
          color: "#fff",
          padding: "4px 8px",
          display: "flex",
          alignItems: "center",
          gap: 8,
          borderBottom: "2px solid #808080",
        }}
      >
        <span style={{ fontSize: 16 }}>🌐</span>
        <div>
          <div style={{ fontWeight: "bold", fontSize: 12 }}>
            Network Neighborhood
          </div>
          <div style={{ fontSize: 10, opacity: 0.85 }}>
            Onyx OS 95 Local Network
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div
        data-ocid="network.stats_bar"
        style={{
          background: "#c0c0c0",
          borderBottom: "1px solid #808080",
          padding: "3px 8px",
          display: "flex",
          gap: 16,
          alignItems: "center",
        }}
      >
        <span>
          <span style={{ color: "#008000", fontWeight: "bold" }}>●</span>{" "}
          <strong>{onlineCount}</strong> online
        </span>
        <span>
          <span style={{ color: "#555" }}>●</span>{" "}
          <strong>{totalCount - onlineCount}</strong> offline
        </span>
        <span style={{ color: "#666" }}>
          Total: <strong>{totalCount}</strong> registered users
        </span>
        <span style={{ marginLeft: "auto", color: "#555", fontSize: 10 }}>
          Refreshed: {lastRefresh.toLocaleTimeString()}
        </span>
      </div>

      {/* Main list area */}
      <div
        style={{
          flex: 1,
          overflow: "auto",
          background: "#fff",
          border: "2px inset #808080",
          margin: 8,
        }}
      >
        {/* Column headers */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "28px 1fr 90px 80px",
            background: "#c0c0c8",
            borderBottom: "2px solid #808080",
            padding: "2px 6px",
            fontWeight: "bold",
            fontSize: 11,
            position: "sticky",
            top: 0,
            zIndex: 1,
          }}
        >
          <span />
          <span>Computer Name</span>
          <span>Role</span>
          <span>Status</span>
        </div>

        {networkUsers.length === 0 ? (
          <div
            data-ocid="network.empty_state"
            style={{
              padding: 24,
              textAlign: "center",
              color: "#555",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span style={{ fontSize: 32 }}>🖥️</span>
            <div style={{ fontWeight: "bold" }}>No computers found</div>
            <div style={{ fontSize: 10 }}>
              Register an account to appear on the network.
            </div>
          </div>
        ) : (
          networkUsers.map((nu, i) => {
            const roleStyle = ROLE_COLORS[nu.user.role] ?? ROLE_COLORS.User;
            return (
              <div
                key={nu.user.id}
                data-ocid={`network.item.${i + 1}`}
                style={{
                  display: "grid",
                  gridTemplateColumns: "28px 1fr 90px 80px",
                  padding: "4px 6px",
                  borderBottom: "1px solid #e8e8e8",
                  alignItems: "center",
                  background: i % 2 === 0 ? "#fff" : "#f4f4f8",
                  transition: "background 0.1s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.background =
                    "#dde8ff";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.background =
                    i % 2 === 0 ? "#fff" : "#f4f4f8";
                }}
              >
                {/* Icon */}
                <span style={{ fontSize: 16, lineHeight: 1 }}>🖥️</span>

                {/* Username */}
                <span
                  style={{
                    fontWeight: "bold",
                    fontSize: 12,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {nu.user.username}
                </span>

                {/* Role badge */}
                <span>
                  <span
                    style={{
                      background: roleStyle.bg,
                      color: roleStyle.text,
                      border: `1px solid ${roleStyle.border}`,
                      padding: "1px 6px",
                      fontSize: 10,
                      fontWeight: "bold",
                      borderRadius: 2,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {nu.user.role}
                  </span>
                </span>

                {/* Online indicator */}
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    color: nu.isOnline ? "#008000" : "#888",
                    fontWeight: nu.isOnline ? "bold" : "normal",
                  }}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: nu.isOnline ? "#00c800" : "#aaa",
                      border: `1px solid ${nu.isOnline ? "#006400" : "#888"}`,
                      display: "inline-block",
                      flexShrink: 0,
                      boxShadow: nu.isOnline ? "0 0 4px #00c800" : "none",
                    }}
                  />
                  {nu.isOnline ? "Online" : "Offline"}
                </span>
              </div>
            );
          })
        )}
      </div>

      {/* Status bar */}
      <div
        style={{
          background: "#c0c0c0",
          borderTop: "1px solid #808080",
          padding: "2px 8px",
          display: "flex",
          gap: 8,
          fontSize: 10,
          color: "#333",
        }}
      >
        <span
          style={{
            borderRight: "1px solid #808080",
            paddingRight: 8,
          }}
        >
          {totalCount} object(s)
        </span>
        <span>Auto-refreshes every 5 seconds</span>
      </div>
    </div>
  );
}
