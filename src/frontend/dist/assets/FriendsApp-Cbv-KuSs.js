import { r as reactExports, j as jsxRuntimeExports } from "./index-D7X0lYXV.js";
const LS_USERS = "onyxos_users";
const LS_FRIENDS = "onyxos_friends";
const LS_MESSAGES = "onyxos_private_messages";
const LS_ONLINE = "onyxos_online";
function loadFriendsData() {
  try {
    const raw = localStorage.getItem(LS_FRIENDS);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}
function saveFriendsData(data) {
  try {
    localStorage.setItem(LS_FRIENDS, JSON.stringify(data));
  } catch {
  }
}
function getEmptyFriendData() {
  return { friends: [], pendingOutgoing: [], pendingIncoming: [] };
}
function getFriendData(username) {
  const all = loadFriendsData();
  return all[username] ?? getEmptyFriendData();
}
function loadMessages() {
  try {
    const raw = localStorage.getItem(LS_MESSAGES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
function saveMessages(msgs) {
  try {
    localStorage.setItem(LS_MESSAGES, JSON.stringify(msgs));
  } catch {
  }
}
function loadAllUsers() {
  try {
    const raw = localStorage.getItem(LS_USERS);
    if (!raw) return /* @__PURE__ */ new Map();
    const obj = JSON.parse(raw);
    return new Map(Object.entries(obj));
  } catch {
    return /* @__PURE__ */ new Map();
  }
}
function isUserOnline(username) {
  try {
    const raw = localStorage.getItem(LS_ONLINE);
    if (!raw) return false;
    const obj = JSON.parse(raw);
    const ts = obj[username];
    if (!ts) return false;
    return Date.now() - ts < 12e4;
  } catch {
    return false;
  }
}
function OnlineIndicator({ isOnline }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      style: {
        fontSize: 8,
        color: isOnline ? "#00aa00" : "#888888",
        marginRight: 3
      },
      children: "●"
    }
  );
}
function TabBar({
  view,
  onSwitch,
  unreadCount
}) {
  const tabs = [
    { id: "friends", label: "Friends" },
    { id: "requests", label: "Requests" },
    {
      id: "messages",
      label: unreadCount > 0 ? `Messages (${unreadCount})` : "Messages"
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      style: {
        display: "flex",
        borderBottom: "2px solid #808080",
        background: "#c0c0c0"
      },
      children: tabs.map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          "data-ocid": `friends.tab.${tab.id}`,
          onClick: () => onSwitch(tab.id),
          style: {
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
            color: tab.id === "messages" && unreadCount > 0 ? "#cc0000" : "#000",
            outline: "none"
          },
          children: tab.label
        },
        tab.id
      ))
    }
  );
}
function FriendsApp({ user }) {
  const [view, setView] = reactExports.useState("friends");
  const [friendData, setFriendData] = reactExports.useState(
    () => getFriendData(user.username)
  );
  const [allMessages, setAllMessages] = reactExports.useState(
    () => loadMessages()
  );
  const [allUsers, setAllUsers] = reactExports.useState(
    () => loadAllUsers()
  );
  const [selectedFriend, setSelectedFriend] = reactExports.useState(null);
  const [msgInput, setMsgInput] = reactExports.useState("");
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [searchResult, setSearchResult] = reactExports.useState(null);
  const bottomRef = reactExports.useRef(null);
  const reload = reactExports.useCallback(() => {
    setFriendData(getFriendData(user.username));
    setAllMessages(loadMessages());
    setAllUsers(loadAllUsers());
  }, [user.username]);
  reactExports.useEffect(() => {
    const id = setInterval(reload, 2e3);
    return () => clearInterval(id);
  }, [reload]);
  reactExports.useEffect(() => {
    const onStorage = (e) => {
      if (e.key === LS_FRIENDS || e.key === LS_MESSAGES || e.key === LS_USERS || e.key === LS_ONLINE) {
        reload();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [reload]);
  reactExports.useEffect(() => {
    var _a;
    (_a = bottomRef.current) == null ? void 0 : _a.scrollIntoView({ behavior: "smooth" });
  }, [allMessages, selectedFriend]);
  const unreadCount = allMessages.filter(
    (m) => m.to === user.username && !m.isRead
  ).length;
  const conversation = allMessages.filter(
    (m) => m.from === user.username && m.to === selectedFriend || m.from === selectedFriend && m.to === user.username
  );
  reactExports.useEffect(() => {
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
  const sendMessage = () => {
    const body = msgInput.trim();
    if (!body || !selectedFriend) return;
    const msg = {
      id: `pm-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      from: user.username,
      to: selectedFriend,
      body,
      timestamp: Date.now(),
      isRead: false
    };
    const updated = [...loadMessages(), msg];
    saveMessages(updated);
    setAllMessages(updated);
    setMsgInput("");
  };
  const sendFriendRequest = (targetUsername) => {
    const all = loadFriendsData();
    const senderData = all[user.username] ?? getEmptyFriendData();
    if (!senderData.pendingOutgoing.includes(targetUsername)) {
      senderData.pendingOutgoing = [
        ...senderData.pendingOutgoing,
        targetUsername
      ];
    }
    all[user.username] = senderData;
    const recipientData = all[targetUsername] ?? getEmptyFriendData();
    if (!recipientData.pendingIncoming.includes(user.username)) {
      recipientData.pendingIncoming = [
        ...recipientData.pendingIncoming,
        user.username
      ];
    }
    all[targetUsername] = recipientData;
    saveFriendsData(all);
    setFriendData({ ...senderData });
  };
  const acceptRequest = (fromUsername) => {
    const all = loadFriendsData();
    const myData = all[user.username] ?? getEmptyFriendData();
    myData.pendingIncoming = myData.pendingIncoming.filter(
      (u) => u !== fromUsername
    );
    if (!myData.friends.includes(fromUsername)) {
      myData.friends = [...myData.friends, fromUsername];
    }
    all[user.username] = myData;
    const theirData = all[fromUsername] ?? getEmptyFriendData();
    theirData.pendingOutgoing = theirData.pendingOutgoing.filter(
      (u) => u !== user.username
    );
    if (!theirData.friends.includes(user.username)) {
      theirData.friends = [...theirData.friends, user.username];
    }
    all[fromUsername] = theirData;
    saveFriendsData(all);
    setFriendData({ ...myData });
  };
  const rejectRequest = (fromUsername) => {
    const all = loadFriendsData();
    const myData = all[user.username] ?? getEmptyFriendData();
    myData.pendingIncoming = myData.pendingIncoming.filter(
      (u) => u !== fromUsername
    );
    all[user.username] = myData;
    const theirData = all[fromUsername] ?? getEmptyFriendData();
    theirData.pendingOutgoing = theirData.pendingOutgoing.filter(
      (u) => u !== user.username
    );
    all[fromUsername] = theirData;
    saveFriendsData(all);
    setFriendData({ ...myData });
  };
  const removeFriend = (targetUsername) => {
    const all = loadFriendsData();
    const myData = all[user.username] ?? getEmptyFriendData();
    myData.friends = myData.friends.filter((u) => u !== targetUsername);
    all[user.username] = myData;
    const theirData = all[targetUsername] ?? getEmptyFriendData();
    theirData.friends = theirData.friends.filter((u) => u !== user.username);
    all[targetUsername] = theirData;
    saveFriendsData(all);
    setFriendData({ ...myData });
  };
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
  const renderFriendsPanel = () => {
    if (friendData.friends.length === 0) {
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          "data-ocid": "friends.friends_list.empty_state",
          style: {
            padding: 16,
            textAlign: "center",
            color: "#666",
            fontSize: 12
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 24, marginBottom: 8 }, children: "👤" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontWeight: "bold", marginBottom: 4 }, children: "No friends yet" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, color: "#888" }, children: "Go to Requests to add friends!" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "data-ocid": "friends.go_to_requests_button",
                className: "btn-95",
                onClick: () => setView("requests"),
                style: { marginTop: 10, fontSize: 11 },
                children: "Add Friends"
              }
            )
          ]
        }
      );
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "friends.friends_list",
        style: { flex: 1, overflowY: "auto" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              style: {
                background: "#000080",
                color: "#fff",
                padding: "3px 6px",
                fontSize: 10,
                fontWeight: "bold"
              },
              children: [
                "Friends (",
                friendData.friends.length,
                ")"
              ]
            }
          ),
          friendData.friends.map((friendName, idx) => {
            const online = isUserOnline(friendName);
            const unreadFromFriend = allMessages.filter(
              (m) => m.from === friendName && m.to === user.username && !m.isRead
            ).length;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                "data-ocid": `friends.friend_item.${idx + 1}`,
                style: {
                  display: "flex",
                  alignItems: "center",
                  padding: "5px 6px",
                  borderBottom: "1px solid #d0d0d0",
                  background: "#f0f0f0",
                  gap: 6
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(OnlineIndicator, { isOnline: online }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "span",
                    {
                      style: {
                        flex: 1,
                        fontSize: 12,
                        fontWeight: online ? "bold" : "normal",
                        color: online ? "#000" : "#555"
                      },
                      children: [
                        friendName,
                        !online && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 10, color: "#888", marginLeft: 4 }, children: "(offline)" })
                      ]
                    }
                  ),
                  unreadFromFriend > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      style: {
                        background: "#cc0000",
                        color: "#fff",
                        borderRadius: 8,
                        padding: "0 5px",
                        fontSize: 10,
                        fontWeight: "bold"
                      },
                      children: unreadFromFriend
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      "data-ocid": `friends.message_button.${idx + 1}`,
                      className: "btn-95",
                      style: { fontSize: 10, padding: "2px 6px" },
                      onClick: () => {
                        setSelectedFriend(friendName);
                        setView("messages");
                      },
                      children: "💬 Chat"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      "data-ocid": `friends.remove_button.${idx + 1}`,
                      className: "btn-95",
                      style: { fontSize: 10, padding: "2px 4px", color: "#800" },
                      onClick: () => removeFriend(friendName),
                      children: "✖"
                    }
                  )
                ]
              },
              friendName
            );
          })
        ]
      }
    );
  };
  const renderRequestsPanel = () => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, overflowY: "auto" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        style: {
          background: "#000080",
          color: "#fff",
          padding: "3px 6px",
          fontSize: 10,
          fontWeight: "bold"
        },
        children: "➕ Add a Friend"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        style: {
          padding: "6px 6px 4px",
          background: "#e8e8e8",
          borderBottom: "1px solid #aaa"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 4, marginBottom: 4 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                "data-ocid": "friends.search_input",
                className: "text-input-95",
                type: "text",
                placeholder: "Enter exact username...",
                value: searchQuery,
                onChange: (e) => {
                  setSearchQuery(e.target.value);
                  setSearchResult(null);
                },
                onKeyDown: (e) => e.key === "Enter" && handleSearch(),
                style: { flex: 1, fontSize: 11 }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "data-ocid": "friends.search_button",
                className: "btn-95",
                style: { fontSize: 11 },
                onClick: handleSearch,
                children: "Find"
              }
            )
          ] }),
          searchResult && searchResult !== "not-found" && searchResult !== "self" && searchResult !== "already-friend" && searchResult !== "already-sent" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              style: {
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: "#d8ffd8",
                border: "1px solid #4a4",
                padding: "4px 6px",
                borderRadius: 2
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  OnlineIndicator,
                  {
                    isOnline: isUserOnline(searchResult)
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { flex: 1, fontSize: 12, fontWeight: "bold" }, children: searchResult }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    "data-ocid": "friends.send_request_button",
                    className: "btn-95",
                    style: { fontSize: 11 },
                    onClick: () => {
                      sendFriendRequest(searchResult);
                      setSearchQuery("");
                      setSearchResult("already-sent");
                    },
                    children: "Add Friend"
                  }
                )
              ]
            }
          ),
          searchResult === "not-found" && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              "data-ocid": "friends.search_error_state",
              style: { color: "#cc0000", fontSize: 11 },
              children: "⚠ No registered user with that username."
            }
          ),
          searchResult === "self" && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              "data-ocid": "friends.search_error_state",
              style: { color: "#555", fontSize: 11 },
              children: "That's you! 😄"
            }
          ),
          searchResult === "already-friend" && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              "data-ocid": "friends.search_error_state",
              style: { color: "#006", fontSize: 11 },
              children: "✅ Already friends!"
            }
          ),
          searchResult === "already-sent" && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              "data-ocid": "friends.search_error_state",
              style: { color: "#555", fontSize: 11 },
              children: "📨 Friend request sent!"
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        style: {
          background: "#1a4a70",
          color: "#fff",
          padding: "3px 6px",
          fontSize: 10,
          fontWeight: "bold",
          marginTop: 4
        },
        children: "👥 All Registered Users"
      }
    ),
    (() => {
      const registeredUsers = [...allUsers.keys()].filter(
        (u) => u !== user.username && !friendData.friends.includes(u) && !friendData.pendingOutgoing.includes(u)
      );
      if (registeredUsers.length === 0) {
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: {
              padding: "8px 6px",
              fontSize: 11,
              color: "#666",
              background: "#f5f5f5"
            },
            children: "No other users to add right now."
          }
        );
      }
      return registeredUsers.map((uname, idx) => {
        const isPending = friendData.pendingIncoming.includes(uname);
        const online = isUserOnline(uname);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": `friends.user_item.${idx + 1}`,
            style: {
              display: "flex",
              alignItems: "center",
              padding: "4px 6px",
              borderBottom: "1px solid #d0d0d0",
              background: "#f8f8f8",
              gap: 6
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(OnlineIndicator, { isOnline: online }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { flex: 1, fontSize: 12 }, children: uname }),
              isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  style: { fontSize: 10, color: "#888", fontStyle: "italic" },
                  children: "incoming request"
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  "data-ocid": `friends.add_button.${idx + 1}`,
                  className: "btn-95",
                  style: { fontSize: 10, padding: "2px 6px" },
                  onClick: () => {
                    sendFriendRequest(uname);
                    setSearchResult("already-sent");
                  },
                  children: "+ Add"
                }
              )
            ]
          },
          uname
        );
      });
    })(),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        style: {
          background: "#800000",
          color: "#fff",
          padding: "3px 6px",
          fontSize: 10,
          fontWeight: "bold",
          marginTop: 4
        },
        children: [
          "📥 Incoming Requests (",
          friendData.pendingIncoming.length,
          ")"
        ]
      }
    ),
    friendData.pendingIncoming.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        "data-ocid": "friends.incoming_empty_state",
        style: {
          padding: "8px 6px",
          fontSize: 11,
          color: "#666",
          background: "#f5f5f5"
        },
        children: "No incoming requests."
      }
    ) : friendData.pendingIncoming.map((fromUser, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": `friends.incoming_request.${idx + 1}`,
        style: {
          display: "flex",
          alignItems: "center",
          padding: "5px 6px",
          borderBottom: "1px solid #d0d0d0",
          background: "#fff8e0",
          gap: 6
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { flex: 1, fontSize: 12, fontWeight: "bold" }, children: fromUser }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 10, color: "#666" }, children: "wants to be friends" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "data-ocid": `friends.accept_button.${idx + 1}`,
              className: "btn-95",
              style: { fontSize: 10, padding: "2px 6px", color: "#005500" },
              onClick: () => acceptRequest(fromUser),
              children: "✔ Accept"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "data-ocid": `friends.reject_button.${idx + 1}`,
              className: "btn-95",
              style: { fontSize: 10, padding: "2px 6px", color: "#800" },
              onClick: () => rejectRequest(fromUser),
              children: "✖ Reject"
            }
          )
        ]
      },
      fromUser
    )),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        style: {
          background: "#004080",
          color: "#fff",
          padding: "3px 6px",
          fontSize: 10,
          fontWeight: "bold",
          marginTop: 4
        },
        children: [
          "📤 Outgoing Requests (",
          friendData.pendingOutgoing.length,
          ")"
        ]
      }
    ),
    friendData.pendingOutgoing.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        "data-ocid": "friends.outgoing_empty_state",
        style: {
          padding: "8px 6px",
          fontSize: 11,
          color: "#666",
          background: "#f5f5f5"
        },
        children: "No pending outgoing requests."
      }
    ) : friendData.pendingOutgoing.map((toUser, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": `friends.outgoing_request.${idx + 1}`,
        style: {
          display: "flex",
          alignItems: "center",
          padding: "5px 6px",
          borderBottom: "1px solid #d0d0d0",
          background: "#e8f0ff",
          gap: 6
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { flex: 1, fontSize: 12 }, children: toUser }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 10, color: "#888", fontStyle: "italic" }, children: "pending..." })
        ]
      },
      toUser
    ))
  ] });
  const renderMessagesPanel = () => {
    if (!selectedFriend) {
      const friends = friendData.friends;
      if (friends.length === 0) {
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": "friends.messages_empty_state",
            style: {
              padding: 16,
              textAlign: "center",
              color: "#666",
              fontSize: 12
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 24, marginBottom: 8 }, children: "💬" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontWeight: "bold", marginBottom: 4 }, children: "No conversations yet" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, color: "#888" }, children: "Add friends first to chat privately!" })
            ]
          }
        );
      }
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          "data-ocid": "friends.conversation_list",
          style: { flex: 1, overflowY: "auto" },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                style: {
                  background: "#000080",
                  color: "#fff",
                  padding: "3px 6px",
                  fontSize: 10,
                  fontWeight: "bold"
                },
                children: "💬 Select a Conversation"
              }
            ),
            friends.map((friendName, idx) => {
              const unreadFromFriend = allMessages.filter(
                (m) => m.from === friendName && m.to === user.username && !m.isRead
              ).length;
              const lastMsg = [...allMessages].filter(
                (m) => m.from === user.username && m.to === friendName || m.from === friendName && m.to === user.username
              ).sort((a, b) => b.timestamp - a.timestamp)[0];
              const online2 = isUserOnline(friendName);
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  "data-ocid": `friends.conversation_item.${idx + 1}`,
                  onClick: () => setSelectedFriend(friendName),
                  style: {
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
                    gap: 6
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(OnlineIndicator, { isOnline: online2 }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, minWidth: 0 }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          style: { fontWeight: "bold", fontSize: 12, color: "#000" },
                          children: friendName
                        }
                      ),
                      lastMsg && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "div",
                        {
                          style: {
                            fontSize: 10,
                            color: "#666",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: 180
                          },
                          children: [
                            lastMsg.from === user.username ? "You: " : "",
                            lastMsg.body
                          ]
                        }
                      )
                    ] }),
                    unreadFromFriend > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        style: {
                          background: "#cc0000",
                          color: "#fff",
                          borderRadius: 8,
                          padding: "1px 6px",
                          fontSize: 10,
                          fontWeight: "bold",
                          flexShrink: 0
                        },
                        children: unreadFromFriend
                      }
                    )
                  ]
                },
                friendName
              );
            })
          ]
        }
      );
    }
    const online = isUserOnline(selectedFriend);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        style: {
          flex: 1,
          display: "flex",
          flexDirection: "column",
          height: "100%"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              style: {
                background: "#000080",
                color: "#fff",
                padding: "4px 6px",
                display: "flex",
                alignItems: "center",
                gap: 6,
                borderBottom: "2px solid #00008b"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    "data-ocid": "friends.back_button",
                    onClick: () => setSelectedFriend(null),
                    style: {
                      background: "#c0c0c0",
                      color: "#000",
                      border: "2px solid",
                      borderColor: "#fff #808080 #808080 #fff",
                      padding: "1px 6px",
                      fontSize: 10,
                      cursor: "pointer",
                      fontFamily: "Tahoma, sans-serif"
                    },
                    children: "◄ Back"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(OnlineIndicator, { isOnline: online }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontWeight: "bold", fontSize: 12 }, children: selectedFriend }),
                !online && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 10, color: "#aaa", fontStyle: "italic" }, children: "(offline)" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              "data-ocid": "friends.messages_panel",
              style: {
                flex: 1,
                overflowY: "auto",
                background: "#fff",
                padding: 8,
                display: "flex",
                flexDirection: "column",
                gap: 4
              },
              children: [
                conversation.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    style: {
                      color: "#888",
                      fontSize: 11,
                      textAlign: "center",
                      marginTop: 20
                    },
                    children: "No messages yet. Say hello! 👋"
                  }
                ) : conversation.map((msg, idx) => {
                  const isMine = msg.from === user.username;
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      "data-ocid": `friends.message.${idx + 1}`,
                      style: {
                        display: "flex",
                        flexDirection: "column",
                        alignItems: isMine ? "flex-end" : "flex-start",
                        gap: 2
                      },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "div",
                          {
                            style: {
                              maxWidth: "80%",
                              padding: "5px 8px",
                              fontSize: 12,
                              fontFamily: "Tahoma, sans-serif",
                              background: isMine ? "#000080" : "#e0e0e0",
                              color: isMine ? "#fff" : "#000",
                              borderRadius: isMine ? "8px 8px 2px 8px" : "8px 8px 8px 2px",
                              border: isMine ? "none" : "1px solid #bbb",
                              wordBreak: "break-word"
                            },
                            children: msg.body
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 9, color: "#999" }, children: new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit"
                        }) })
                      ]
                    },
                    msg.id
                  );
                }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: bottomRef })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              style: {
                padding: "4px 6px",
                background: "#c0c0c0",
                borderTop: "2px solid #808080",
                display: "flex",
                gap: 4
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    "data-ocid": "friends.message_input",
                    className: "text-input-95",
                    type: "text",
                    placeholder: "Type a message...",
                    value: msgInput,
                    onChange: (e) => setMsgInput(e.target.value),
                    onKeyDown: (e) => e.key === "Enter" && sendMessage(),
                    style: { flex: 1, fontSize: 11 },
                    maxLength: 500
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    "data-ocid": "friends.send_button",
                    className: "btn-95",
                    onClick: sendMessage,
                    style: { fontSize: 11, whiteSpace: "nowrap" },
                    children: "Send"
                  }
                )
              ]
            }
          )
        ]
      }
    );
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      style: {
        display: "flex",
        flexDirection: "column",
        height: "100%",
        fontFamily: "Tahoma, Verdana, sans-serif",
        fontSize: 12,
        background: "#c0c0c0"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              background: "linear-gradient(to right, #000080, #1084d0)",
              color: "#fff",
              padding: "4px 8px",
              display: "flex",
              alignItems: "center",
              gap: 8,
              borderBottom: "2px solid #808080"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 16 }, children: "👥" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontWeight: "bold", fontSize: 13 }, children: "Friends" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: 11, color: "#cce", marginLeft: 4 }, children: [
                "— ",
                user.username
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  style: {
                    marginLeft: "auto",
                    fontSize: 10,
                    background: "#00aa00",
                    color: "#fff",
                    padding: "1px 6px",
                    borderRadius: 10
                  },
                  children: "● Online"
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          TabBar,
          {
            view,
            onSwitch: (v) => {
              setView(v);
              if (v !== "messages") setSelectedFriend(null);
            },
            unreadCount
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              flex: 1,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column"
            },
            children: [
              view === "friends" && renderFriendsPanel(),
              view === "requests" && renderRequestsPanel(),
              view === "messages" && renderMessagesPanel()
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              background: "#c0c0c0",
              borderTop: "2px solid #808080",
              padding: "2px 8px",
              fontSize: 10,
              color: "#444",
              display: "flex",
              gap: 12
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "👤 ",
                friendData.friends.length,
                " friend",
                friendData.friends.length !== 1 ? "s" : ""
              ] }),
              friendData.pendingIncoming.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "#cc0000", fontWeight: "bold" }, children: [
                "📥 ",
                friendData.pendingIncoming.length,
                " pending"
              ] }),
              unreadCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "#006600", fontWeight: "bold" }, children: [
                "💬 ",
                unreadCount,
                " unread"
              ] })
            ]
          }
        )
      ]
    }
  );
}
export {
  FriendsApp
};
