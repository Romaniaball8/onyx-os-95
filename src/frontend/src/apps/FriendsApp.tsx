import { useCallback, useEffect, useRef, useState } from "react";
import type { User } from "../types";

// ── LocalStorage keys ─────────────────────────────────────────────────────────
const LS_USERS = "onyxos_users";
const LS_FRIENDS = "onyxos_friends";
const LS_MESSAGES = "onyxos_private_messages";
const LS_ONLINE = "onyxos_online";

// ── Types ─────────────────────────────────────────────────────────────────────
interface FriendData {
  friends: string[];
  pendingOutgoing: string[];
  pendingIncoming: string[];
}

interface PrivateMessage {
  id: string;
  from: string;
  to: string;
  body: string;
  timestamp: number;
  isRead: boolean;
}

interface UserRecord {
  username: string;
  password: string;
  user: User;
}

interface Props {
  user: User;
  userStore?: Map<string, { username: string; password: string; user: User }>;
}

type View = "friends" | "requests" | "messages";

// ── Helpers ───────────────────────────────────────────────────────────────────
function loadFriendsData(): Record<string, FriendData> {
  try {
    const raw = localStorage.getItem(LS_FRIENDS);
    return raw ? (JSON.parse(raw) as Record<string, FriendData>) : {};
  } catch {
    return {};
  }
}

function saveFriendsData(data: Record<string, FriendData>): void {
  try {
    localStorage.setItem(LS_FRIENDS, JSON.stringify(data));
  } catch {
    /* noop */
  }
}

function getEmptyFriendData(): FriendData {
  return { friends: [], pendingOutgoing: [], pendingIncoming: [] };
}

function getFriendData(username: string): FriendData {
  const all = loadFriendsData();
  return all[username] ?? getEmptyFriendData();
}

function loadMessages(): PrivateMessage[] {
  try {
    const raw = localStorage.getItem(LS_MESSAGES);
    return raw ? (JSON.parse(raw) as PrivateMessage[]) : [];
  } catch {
    return [];
  }
}

function saveMessages(msgs: PrivateMessage[]): void {
  try {
    localStorage.setItem(LS_MESSAGES, JSON.stringify(msgs));
  } catch {
    /* noop */
  }
}

function loadAllUsers(): Map<string, UserRecord> {
  try {
    const raw = localStorage.getItem(LS_USERS);
    if (!raw) return new Map();
    const obj = JSON.parse(raw) as Record<string, UserRecord>;
    return new Map(Object.entries(obj));
  } catch {
    return new Map();
  }
}

function isUserOnline(username: string): boolean {
  try {
    const raw = localStorage.getItem(LS_ONLINE);
    if (!raw) return false;
    const obj = JSON.parse(raw) as Record<string, number>;
    const ts = obj[username];
    if (!ts) return false;
    // Online if heartbeat within last 2 minutes
    return Date.now() - ts < 120_000;
  } catch {
    return false;
  }
}

// ── Sub-components ────────────────────────────────────────────────────────────

function OnlineIndicator({ isOnline }: { isOnline: boolean }) {
  return (
    <span
      style={{
        fontSize: 8,
        color: isOnline ? "#00aa00" : "#888888",
        marginRight: 3,
      }}
    >
      ●
    </span>
  );
}

function TabBar({
  view,
  onSwitch,
  unreadCount,
}: { view: View; onSwitch: (v: View) => void; unreadCount: number }) {
  const tabs: { id: View; label: string }[] = [
    { id: "friends", label: "Friends" },
    { id: "requests", label: "Requests" },
    {
      id: "messages",
      label: unreadCount > 0 ? `Messages (${unreadCount})` : "Messages",
    },
  ];
  return (
    <div
      style={{
        display: "flex",
        borderBottom: "2px solid #808080",
        background: "#c0c0c0",
      }}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          data-ocid={`friends.tab.${tab.id}`}
          onClick={() => onSwitch(tab.id)}
          style={{
            flex: 1,
            padding: "4px 6px",
            fontSize: 11,
            fontFamily: "Tahoma, sans-serif",
            fontWeight: view === tab.id ? "bold" : "normal",
            background: view === tab.id ? "#ffffff" : "#c0c0c0",
            border: "none",
            borderBottom: view === tab.id ? "2px solid #ffffff" : "none",
            borderRight: "1px solid #808080",
            cursor: "pointer",
            color:
              tab.id === "messages" && unreadCount > 0 ? "#cc0000" : "#000",
            outline: "none",
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

// ── Main FriendsApp component ─────────────────────────────────────────────────
export function FriendsApp({ user }: Props) {
  const [view, setView] = useState<View>("friends");
  const [friendData, setFriendData] = useState<FriendData>(() =>
    getFriendData(user.username),
  );
  const [allMessages, setAllMessages] = useState<PrivateMessage[]>(() =>
    loadMessages(),
  );
  const [allUsers, setAllUsers] = useState<Map<string, UserRecord>>(() =>
    loadAllUsers(),
  );
  const [selectedFriend, setSelectedFriend] = useState<string | null>(null);
  const [msgInput, setMsgInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState<
    string | null | "not-found" | "self" | "already-friend" | "already-sent"
  >(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Reload everything from localStorage periodically
  const reload = useCallback(() => {
    setFriendData(getFriendData(user.username));
    setAllMessages(loadMessages());
    setAllUsers(loadAllUsers());
  }, [user.username]);

  useEffect(() => {
    const id = setInterval(reload, 2000);
    return () => clearInterval(id);
  }, [reload]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (
        e.key === LS_FRIENDS ||
        e.key === LS_MESSAGES ||
        e.key === LS_USERS ||
        e.key === LS_ONLINE
      ) {
        reload();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [reload]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on message change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages, selectedFriend]);

  // Count unread messages
  const unreadCount = allMessages.filter(
    (m) => m.to === user.username && !m.isRead,
  ).length;

  // Conversation with selected friend
  const conversation = allMessages.filter(
    (m) =>
      (m.from === user.username && m.to === selectedFriend) ||
      (m.from === selectedFriend && m.to === user.username),
  );

  // Mark messages as read when conversation opened
  useEffect(() => {
    if (!selectedFriend) return;
    const msgs = loadMessages();
    let changed = false;
    const updated = msgs.map((m) => {
      if (m.to === user.username && m.from === selectedFriend && !m.isRead) {
        changed = true;
        return { ...m, isRead: true };
      }
      return m;
    });
    if (changed) {
      saveMessages(updated);
      setAllMessages(updated);
    }
  }, [selectedFriend, user.username]);

  // Send private message
  const sendMessage = () => {
    const body = msgInput.trim();
    if (!body || !selectedFriend) return;
    const msg: PrivateMessage = {
      id: `pm-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      from: user.username,
      to: selectedFriend,
      body,
      timestamp: Date.now(),
      isRead: false,
    };
    const updated = [...loadMessages(), msg];
    saveMessages(updated);
    setAllMessages(updated);
    setMsgInput("");
  };

  // Send friend request
  const sendFriendRequest = (targetUsername: string) => {
    const all = loadFriendsData();
    const senderData: FriendData = all[user.username] ?? getEmptyFriendData();
    if (!senderData.pendingOutgoing.includes(targetUsername)) {
      senderData.pendingOutgoing = [
        ...senderData.pendingOutgoing,
        targetUsername,
      ];
    }
    all[user.username] = senderData;
    const recipientData: FriendData =
      all[targetUsername] ?? getEmptyFriendData();
    if (!recipientData.pendingIncoming.includes(user.username)) {
      recipientData.pendingIncoming = [
        ...recipientData.pendingIncoming,
        user.username,
      ];
    }
    all[targetUsername] = recipientData;
    saveFriendsData(all);
    setFriendData({ ...senderData });
  };

  // Accept friend request
  const acceptRequest = (fromUsername: string) => {
    const all = loadFriendsData();
    const myData: FriendData = all[user.username] ?? getEmptyFriendData();
    myData.pendingIncoming = myData.pendingIncoming.filter(
      (u) => u !== fromUsername,
    );
    if (!myData.friends.includes(fromUsername)) {
      myData.friends = [...myData.friends, fromUsername];
    }
    all[user.username] = myData;
    const theirData: FriendData = all[fromUsername] ?? getEmptyFriendData();
    theirData.pendingOutgoing = theirData.pendingOutgoing.filter(
      (u) => u !== user.username,
    );
    if (!theirData.friends.includes(user.username)) {
      theirData.friends = [...theirData.friends, user.username];
    }
    all[fromUsername] = theirData;
    saveFriendsData(all);
    setFriendData({ ...myData });
  };

  // Reject friend request
  const rejectRequest = (fromUsername: string) => {
    const all = loadFriendsData();
    const myData: FriendData = all[user.username] ?? getEmptyFriendData();
    myData.pendingIncoming = myData.pendingIncoming.filter(
      (u) => u !== fromUsername,
    );
    all[user.username] = myData;
    const theirData: FriendData = all[fromUsername] ?? getEmptyFriendData();
    theirData.pendingOutgoing = theirData.pendingOutgoing.filter(
      (u) => u !== user.username,
    );
    all[fromUsername] = theirData;
    saveFriendsData(all);
    setFriendData({ ...myData });
  };

  // Remove friend
  const removeFriend = (targetUsername: string) => {
    const all = loadFriendsData();
    const myData: FriendData = all[user.username] ?? getEmptyFriendData();
    myData.friends = myData.friends.filter((u) => u !== targetUsername);
    all[user.username] = myData;
    const theirData: FriendData = all[targetUsername] ?? getEmptyFriendData();
    theirData.friends = theirData.friends.filter((u) => u !== user.username);
    all[targetUsername] = theirData;
    saveFriendsData(all);
    setFriendData({ ...myData });
  };

  // Search for user
  const handleSearch = () => {
    const q = searchQuery.trim();
    if (!q) {
      setSearchResult(null);
      return;
    }
    if (q === user.username) {
      setSearchResult("self");
      return;
    }
    // Reload fresh friend data before checking
    const freshFriendData = getFriendData(user.username);
    if (freshFriendData.friends.includes(q)) {
      setSearchResult("already-friend");
      return;
    }
    if (freshFriendData.pendingOutgoing.includes(q)) {
      setSearchResult("already-sent");
      return;
    }
    const users = loadAllUsers();
    if (users.has(q)) {
      setSearchResult(q);
    } else {
      setSearchResult("not-found");
    }
  };

  // ── Panels ────────────────────────────────────────────────────────────────

  const renderFriendsPanel = () => {
    if (friendData.friends.length === 0) {
      return (
        <div
          data-ocid="friends.friends_list.empty_state"
          style={{
            padding: 16,
            textAlign: "center",
            color: "#666",
            fontSize: 12,
          }}
        >
          <div style={{ fontSize: 24, marginBottom: 8 }}>👤</div>
          <div style={{ fontWeight: "bold", marginBottom: 4 }}>
            No friends yet
          </div>
          <div style={{ fontSize: 11, color: "#888" }}>
            Go to Requests to add friends!
          </div>
          <button
            type="button"
            data-ocid="friends.go_to_requests_button"
            className="btn-95"
            onClick={() => setView("requests")}
            style={{ marginTop: 10, fontSize: 11 }}
          >
            Add Friends
          </button>
        </div>
      );
    }

    return (
      <div
        data-ocid="friends.friends_list"
        style={{ flex: 1, overflowY: "auto" }}
      >
        <div
          style={{
            background: "#000080",
            color: "#fff",
            padding: "3px 6px",
            fontSize: 10,
            fontWeight: "bold",
          }}
        >
          Friends ({friendData.friends.length})
        </div>
        {friendData.friends.map((friendName, idx) => {
          const online = isUserOnline(friendName);
          const unreadFromFriend = allMessages.filter(
            (m) => m.from === friendName && m.to === user.username && !m.isRead,
          ).length;

          return (
            <div
              key={friendName}
              data-ocid={`friends.friend_item.${idx + 1}`}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "5px 6px",
                borderBottom: "1px solid #d0d0d0",
                background: "#f0f0f0",
                gap: 6,
              }}
            >
              <OnlineIndicator isOnline={online} />
              <span
                style={{
                  flex: 1,
                  fontSize: 12,
                  fontWeight: online ? "bold" : "normal",
                  color: online ? "#000" : "#555",
                }}
              >
                {friendName}
                {!online && (
                  <span style={{ fontSize: 10, color: "#888", marginLeft: 4 }}>
                    (offline)
                  </span>
                )}
              </span>
              {unreadFromFriend > 0 && (
                <span
                  style={{
                    background: "#cc0000",
                    color: "#fff",
                    borderRadius: 8,
                    padding: "0 5px",
                    fontSize: 10,
                    fontWeight: "bold",
                  }}
                >
                  {unreadFromFriend}
                </span>
              )}
              <button
                type="button"
                data-ocid={`friends.message_button.${idx + 1}`}
                className="btn-95"
                style={{ fontSize: 10, padding: "2px 6px" }}
                onClick={() => {
                  setSelectedFriend(friendName);
                  setView("messages");
                }}
              >
                💬 Chat
              </button>
              <button
                type="button"
                data-ocid={`friends.remove_button.${idx + 1}`}
                className="btn-95"
                style={{ fontSize: 10, padding: "2px 4px", color: "#800" }}
                onClick={() => removeFriend(friendName)}
              >
                ✖
              </button>
            </div>
          );
        })}
      </div>
    );
  };

  const renderRequestsPanel = () => (
    <div style={{ flex: 1, overflowY: "auto" }}>
      {/* Search/Add */}
      <div
        style={{
          background: "#000080",
          color: "#fff",
          padding: "3px 6px",
          fontSize: 10,
          fontWeight: "bold",
        }}
      >
        ➕ Add a Friend
      </div>
      <div
        style={{
          padding: "6px 6px 4px",
          background: "#e8e8e8",
          borderBottom: "1px solid #aaa",
        }}
      >
        <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
          <input
            data-ocid="friends.search_input"
            className="text-input-95"
            type="text"
            placeholder="Enter exact username..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSearchResult(null);
            }}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            style={{ flex: 1, fontSize: 11 }}
          />
          <button
            type="button"
            data-ocid="friends.search_button"
            className="btn-95"
            style={{ fontSize: 11 }}
            onClick={handleSearch}
          >
            Find
          </button>
        </div>

        {searchResult &&
          searchResult !== "not-found" &&
          searchResult !== "self" &&
          searchResult !== "already-friend" &&
          searchResult !== "already-sent" && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: "#d8ffd8",
                border: "1px solid #4a4",
                padding: "4px 6px",
                borderRadius: 2,
              }}
            >
              <OnlineIndicator
                isOnline={isUserOnline(searchResult as string)}
              />
              <span style={{ flex: 1, fontSize: 12, fontWeight: "bold" }}>
                {searchResult}
              </span>
              <button
                type="button"
                data-ocid="friends.send_request_button"
                className="btn-95"
                style={{ fontSize: 11 }}
                onClick={() => {
                  sendFriendRequest(searchResult as string);
                  setSearchQuery("");
                  setSearchResult("already-sent");
                }}
              >
                Add Friend
              </button>
            </div>
          )}
        {searchResult === "not-found" && (
          <div
            data-ocid="friends.search_error_state"
            style={{ color: "#cc0000", fontSize: 11 }}
          >
            ⚠ No registered user with that username.
          </div>
        )}
        {searchResult === "self" && (
          <div
            data-ocid="friends.search_error_state"
            style={{ color: "#555", fontSize: 11 }}
          >
            That's you! 😄
          </div>
        )}
        {searchResult === "already-friend" && (
          <div
            data-ocid="friends.search_error_state"
            style={{ color: "#006", fontSize: 11 }}
          >
            ✅ Already friends!
          </div>
        )}
        {searchResult === "already-sent" && (
          <div
            data-ocid="friends.search_error_state"
            style={{ color: "#555", fontSize: 11 }}
          >
            📨 Friend request sent!
          </div>
        )}
      </div>

      {/* All registered users (not self, not already friended) */}
      <div
        style={{
          background: "#1a4a70",
          color: "#fff",
          padding: "3px 6px",
          fontSize: 10,
          fontWeight: "bold",
          marginTop: 4,
        }}
      >
        👥 All Registered Users
      </div>
      {(() => {
        const registeredUsers = [...allUsers.keys()].filter(
          (u) =>
            u !== user.username &&
            !friendData.friends.includes(u) &&
            !friendData.pendingOutgoing.includes(u),
        );
        if (registeredUsers.length === 0) {
          return (
            <div
              style={{
                padding: "8px 6px",
                fontSize: 11,
                color: "#666",
                background: "#f5f5f5",
              }}
            >
              No other users to add right now.
            </div>
          );
        }
        return registeredUsers.map((uname, idx) => {
          const isPending = friendData.pendingIncoming.includes(uname);
          const online = isUserOnline(uname);
          return (
            <div
              key={uname}
              data-ocid={`friends.user_item.${idx + 1}`}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "4px 6px",
                borderBottom: "1px solid #d0d0d0",
                background: "#f8f8f8",
                gap: 6,
              }}
            >
              <OnlineIndicator isOnline={online} />
              <span style={{ flex: 1, fontSize: 12 }}>{uname}</span>
              {isPending ? (
                <span
                  style={{ fontSize: 10, color: "#888", fontStyle: "italic" }}
                >
                  incoming request
                </span>
              ) : (
                <button
                  type="button"
                  data-ocid={`friends.add_button.${idx + 1}`}
                  className="btn-95"
                  style={{ fontSize: 10, padding: "2px 6px" }}
                  onClick={() => {
                    sendFriendRequest(uname);
                    setSearchResult("already-sent");
                  }}
                >
                  + Add
                </button>
              )}
            </div>
          );
        });
      })()}

      {/* Incoming requests */}
      <div
        style={{
          background: "#800000",
          color: "#fff",
          padding: "3px 6px",
          fontSize: 10,
          fontWeight: "bold",
          marginTop: 4,
        }}
      >
        📥 Incoming Requests ({friendData.pendingIncoming.length})
      </div>
      {friendData.pendingIncoming.length === 0 ? (
        <div
          data-ocid="friends.incoming_empty_state"
          style={{
            padding: "8px 6px",
            fontSize: 11,
            color: "#666",
            background: "#f5f5f5",
          }}
        >
          No incoming requests.
        </div>
      ) : (
        friendData.pendingIncoming.map((fromUser, idx) => (
          <div
            key={fromUser}
            data-ocid={`friends.incoming_request.${idx + 1}`}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "5px 6px",
              borderBottom: "1px solid #d0d0d0",
              background: "#fff8e0",
              gap: 6,
            }}
          >
            <span style={{ flex: 1, fontSize: 12, fontWeight: "bold" }}>
              {fromUser}
            </span>
            <span style={{ fontSize: 10, color: "#666" }}>
              wants to be friends
            </span>
            <button
              type="button"
              data-ocid={`friends.accept_button.${idx + 1}`}
              className="btn-95"
              style={{ fontSize: 10, padding: "2px 6px", color: "#005500" }}
              onClick={() => acceptRequest(fromUser)}
            >
              ✔ Accept
            </button>
            <button
              type="button"
              data-ocid={`friends.reject_button.${idx + 1}`}
              className="btn-95"
              style={{ fontSize: 10, padding: "2px 6px", color: "#800" }}
              onClick={() => rejectRequest(fromUser)}
            >
              ✖ Reject
            </button>
          </div>
        ))
      )}

      {/* Outgoing requests */}
      <div
        style={{
          background: "#004080",
          color: "#fff",
          padding: "3px 6px",
          fontSize: 10,
          fontWeight: "bold",
          marginTop: 4,
        }}
      >
        📤 Outgoing Requests ({friendData.pendingOutgoing.length})
      </div>
      {friendData.pendingOutgoing.length === 0 ? (
        <div
          data-ocid="friends.outgoing_empty_state"
          style={{
            padding: "8px 6px",
            fontSize: 11,
            color: "#666",
            background: "#f5f5f5",
          }}
        >
          No pending outgoing requests.
        </div>
      ) : (
        friendData.pendingOutgoing.map((toUser, idx) => (
          <div
            key={toUser}
            data-ocid={`friends.outgoing_request.${idx + 1}`}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "5px 6px",
              borderBottom: "1px solid #d0d0d0",
              background: "#e8f0ff",
              gap: 6,
            }}
          >
            <span style={{ flex: 1, fontSize: 12 }}>{toUser}</span>
            <span style={{ fontSize: 10, color: "#888", fontStyle: "italic" }}>
              pending...
            </span>
          </div>
        ))
      )}
    </div>
  );

  const renderMessagesPanel = () => {
    if (!selectedFriend) {
      const friends = friendData.friends;
      if (friends.length === 0) {
        return (
          <div
            data-ocid="friends.messages_empty_state"
            style={{
              padding: 16,
              textAlign: "center",
              color: "#666",
              fontSize: 12,
            }}
          >
            <div style={{ fontSize: 24, marginBottom: 8 }}>💬</div>
            <div style={{ fontWeight: "bold", marginBottom: 4 }}>
              No conversations yet
            </div>
            <div style={{ fontSize: 11, color: "#888" }}>
              Add friends first to chat privately!
            </div>
          </div>
        );
      }
      return (
        <div
          data-ocid="friends.conversation_list"
          style={{ flex: 1, overflowY: "auto" }}
        >
          <div
            style={{
              background: "#000080",
              color: "#fff",
              padding: "3px 6px",
              fontSize: 10,
              fontWeight: "bold",
            }}
          >
            💬 Select a Conversation
          </div>
          {friends.map((friendName, idx) => {
            const unreadFromFriend = allMessages.filter(
              (m) =>
                m.from === friendName && m.to === user.username && !m.isRead,
            ).length;
            const lastMsg = [...allMessages]
              .filter(
                (m) =>
                  (m.from === user.username && m.to === friendName) ||
                  (m.from === friendName && m.to === user.username),
              )
              .sort((a, b) => b.timestamp - a.timestamp)[0];
            const online = isUserOnline(friendName);

            return (
              <button
                type="button"
                key={friendName}
                data-ocid={`friends.conversation_item.${idx + 1}`}
                onClick={() => setSelectedFriend(friendName)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  padding: "6px 8px",
                  borderBottom: "1px solid #ccc",
                  background: "#f8f8f8",
                  cursor: "pointer",
                  border: "none",
                  borderBottomColor: "#ccc",
                  borderBottomWidth: 1,
                  borderBottomStyle: "solid",
                  textAlign: "left",
                  gap: 6,
                }}
              >
                <OnlineIndicator isOnline={online} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{ fontWeight: "bold", fontSize: 12, color: "#000" }}
                  >
                    {friendName}
                  </div>
                  {lastMsg && (
                    <div
                      style={{
                        fontSize: 10,
                        color: "#666",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: 180,
                      }}
                    >
                      {lastMsg.from === user.username ? "You: " : ""}
                      {lastMsg.body}
                    </div>
                  )}
                </div>
                {unreadFromFriend > 0 && (
                  <span
                    style={{
                      background: "#cc0000",
                      color: "#fff",
                      borderRadius: 8,
                      padding: "1px 6px",
                      fontSize: 10,
                      fontWeight: "bold",
                      flexShrink: 0,
                    }}
                  >
                    {unreadFromFriend}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      );
    }

    const online = isUserOnline(selectedFriend);

    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        {/* Conversation header */}
        <div
          style={{
            background: "#000080",
            color: "#fff",
            padding: "4px 6px",
            display: "flex",
            alignItems: "center",
            gap: 6,
            borderBottom: "2px solid #00008b",
          }}
        >
          <button
            type="button"
            data-ocid="friends.back_button"
            onClick={() => setSelectedFriend(null)}
            style={{
              background: "#c0c0c0",
              color: "#000",
              border: "2px solid",
              borderColor: "#fff #808080 #808080 #fff",
              padding: "1px 6px",
              fontSize: 10,
              cursor: "pointer",
              fontFamily: "Tahoma, sans-serif",
            }}
          >
            ◄ Back
          </button>
          <OnlineIndicator isOnline={online} />
          <span style={{ fontWeight: "bold", fontSize: 12 }}>
            {selectedFriend}
          </span>
          {!online && (
            <span style={{ fontSize: 10, color: "#aaa", fontStyle: "italic" }}>
              (offline)
            </span>
          )}
        </div>

        {/* Messages area */}
        <div
          data-ocid="friends.messages_panel"
          style={{
            flex: 1,
            overflowY: "auto",
            background: "#fff",
            padding: 8,
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          {conversation.length === 0 ? (
            <div
              style={{
                color: "#888",
                fontSize: 11,
                textAlign: "center",
                marginTop: 20,
              }}
            >
              No messages yet. Say hello! 👋
            </div>
          ) : (
            conversation.map((msg, idx) => {
              const isMine = msg.from === user.username;
              return (
                <div
                  key={msg.id}
                  data-ocid={`friends.message.${idx + 1}`}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: isMine ? "flex-end" : "flex-start",
                    gap: 2,
                  }}
                >
                  <div
                    style={{
                      maxWidth: "80%",
                      padding: "5px 8px",
                      fontSize: 12,
                      fontFamily: "Tahoma, sans-serif",
                      background: isMine ? "#000080" : "#e0e0e0",
                      color: isMine ? "#fff" : "#000",
                      borderRadius: isMine
                        ? "8px 8px 2px 8px"
                        : "8px 8px 8px 2px",
                      border: isMine ? "none" : "1px solid #bbb",
                      wordBreak: "break-word",
                    }}
                  >
                    {msg.body}
                  </div>
                  <span style={{ fontSize: 9, color: "#999" }}>
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              );
            })
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input area */}
        <div
          style={{
            padding: "4px 6px",
            background: "#c0c0c0",
            borderTop: "2px solid #808080",
            display: "flex",
            gap: 4,
          }}
        >
          <input
            data-ocid="friends.message_input"
            className="text-input-95"
            type="text"
            placeholder="Type a message..."
            value={msgInput}
            onChange={(e) => setMsgInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            style={{ flex: 1, fontSize: 11 }}
            maxLength={500}
          />
          <button
            type="button"
            data-ocid="friends.send_button"
            className="btn-95"
            onClick={sendMessage}
            style={{ fontSize: 11, whiteSpace: "nowrap" }}
          >
            Send
          </button>
        </div>
      </div>
    );
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        fontFamily: "Tahoma, Verdana, sans-serif",
        fontSize: 12,
        background: "#c0c0c0",
      }}
    >
      {/* App title bar */}
      <div
        style={{
          background: "linear-gradient(to right, #000080, #1084d0)",
          color: "#fff",
          padding: "4px 8px",
          display: "flex",
          alignItems: "center",
          gap: 8,
          borderBottom: "2px solid #808080",
        }}
      >
        <span style={{ fontSize: 16 }}>👥</span>
        <span style={{ fontWeight: "bold", fontSize: 13 }}>Friends</span>
        <span style={{ fontSize: 11, color: "#cce", marginLeft: 4 }}>
          — {user.username}
        </span>
        <span
          style={{
            marginLeft: "auto",
            fontSize: 10,
            background: "#00aa00",
            color: "#fff",
            padding: "1px 6px",
            borderRadius: 10,
          }}
        >
          ● Online
        </span>
      </div>

      {/* Tab navigation */}
      <TabBar
        view={view}
        onSwitch={(v) => {
          setView(v);
          if (v !== "messages") setSelectedFriend(null);
        }}
        unreadCount={unreadCount}
      />

      {/* Panel content */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {view === "friends" && renderFriendsPanel()}
        {view === "requests" && renderRequestsPanel()}
        {view === "messages" && renderMessagesPanel()}
      </div>

      {/* Status bar */}
      <div
        style={{
          background: "#c0c0c0",
          borderTop: "2px solid #808080",
          padding: "2px 8px",
          fontSize: 10,
          color: "#444",
          display: "flex",
          gap: 12,
        }}
      >
        <span>
          👤 {friendData.friends.length} friend
          {friendData.friends.length !== 1 ? "s" : ""}
        </span>
        {friendData.pendingIncoming.length > 0 && (
          <span style={{ color: "#cc0000", fontWeight: "bold" }}>
            📥 {friendData.pendingIncoming.length} pending
          </span>
        )}
        {unreadCount > 0 && (
          <span style={{ color: "#006600", fontWeight: "bold" }}>
            💬 {unreadCount} unread
          </span>
        )}
      </div>
    </div>
  );
}
