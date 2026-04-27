import { r as reactExports, j as jsxRuntimeExports } from "./index-D7X0lYXV.js";
const LS_USERS = "onyxos_users";
const LS_ONLINE = "onyxos_online";
const ONLINE_THRESHOLD_MS = 9e4;
function readAllUsers() {
  try {
    const raw = localStorage.getItem(LS_USERS);
    if (!raw) return [];
    const obj = JSON.parse(raw);
    return Object.values(obj);
  } catch {
    return [];
  }
}
function readOnlineMap() {
  try {
    const raw = localStorage.getItem(LS_ONLINE);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}
function isOnline(username, onlineMap) {
  const ts = onlineMap[username];
  if (!ts) return false;
  return Date.now() - ts < ONLINE_THRESHOLD_MS;
}
const ROLE_COLORS = {
  Owner: { bg: "#ffd700", text: "#000", border: "#b8860b" },
  Admin: { bg: "#4169e1", text: "#fff", border: "#27408b" },
  User: { bg: "#c0c0c0", text: "#000", border: "#808080" }
};
function NetworkApp(_props) {
  const [networkUsers, setNetworkUsers] = reactExports.useState([]);
  const [lastRefresh, setLastRefresh] = reactExports.useState(/* @__PURE__ */ new Date());
  reactExports.useEffect(() => {
    const refresh = () => {
      const records = readAllUsers();
      const onlineMap = readOnlineMap();
      const users = records.map((r) => ({
        user: r.user,
        isOnline: isOnline(r.username, onlineMap)
      }));
      const rolePriority = {
        Owner: 0,
        Admin: 1,
        User: 2
      };
      users.sort((a, b) => {
        if (a.isOnline !== b.isOnline) return a.isOnline ? -1 : 1;
        const rp = (rolePriority[a.user.role] ?? 3) - (rolePriority[b.user.role] ?? 3);
        if (rp !== 0) return rp;
        return a.user.username.localeCompare(b.user.username);
      });
      setNetworkUsers(users);
      setLastRefresh(/* @__PURE__ */ new Date());
    };
    refresh();
    const id = setInterval(refresh, 5e3);
    return () => clearInterval(id);
  }, []);
  const onlineCount = networkUsers.filter((u) => u.isOnline).length;
  const totalCount = networkUsers.length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      style: {
        display: "flex",
        flexDirection: "column",
        height: "100%",
        fontFamily: "Tahoma, Verdana, 'MS Sans Serif', sans-serif",
        fontSize: 11,
        background: "#d4d0c8"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              background: "#000080",
              color: "#fff",
              padding: "4px 8px",
              display: "flex",
              alignItems: "center",
              gap: 8,
              borderBottom: "2px solid #808080"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 16 }, children: "🌐" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontWeight: "bold", fontSize: 12 }, children: "Network Neighborhood" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 10, opacity: 0.85 }, children: "Onyx OS 95 Local Network" })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": "network.stats_bar",
            style: {
              background: "#c0c0c0",
              borderBottom: "1px solid #808080",
              padding: "3px 8px",
              display: "flex",
              gap: 16,
              alignItems: "center"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#008000", fontWeight: "bold" }, children: "●" }),
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: onlineCount }),
                " online"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#555" }, children: "●" }),
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: totalCount - onlineCount }),
                " offline"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "#666" }, children: [
                "Total: ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: totalCount }),
                " registered users"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { marginLeft: "auto", color: "#555", fontSize: 10 }, children: [
                "Refreshed: ",
                lastRefresh.toLocaleTimeString()
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              flex: 1,
              overflow: "auto",
              background: "#fff",
              border: "2px inset #808080",
              margin: 8
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  style: {
                    display: "grid",
                    gridTemplateColumns: "28px 1fr 90px 80px",
                    background: "#c0c0c8",
                    borderBottom: "2px solid #808080",
                    padding: "2px 6px",
                    fontWeight: "bold",
                    fontSize: 11,
                    position: "sticky",
                    top: 0,
                    zIndex: 1
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", {}),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Computer Name" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Role" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Status" })
                  ]
                }
              ),
              networkUsers.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  "data-ocid": "network.empty_state",
                  style: {
                    padding: 24,
                    textAlign: "center",
                    color: "#555",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 8
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 32 }, children: "🖥️" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontWeight: "bold" }, children: "No computers found" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 10 }, children: "Register an account to appear on the network." })
                  ]
                }
              ) : networkUsers.map((nu, i) => {
                const roleStyle = ROLE_COLORS[nu.user.role] ?? ROLE_COLORS.User;
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    "data-ocid": `network.item.${i + 1}`,
                    style: {
                      display: "grid",
                      gridTemplateColumns: "28px 1fr 90px 80px",
                      padding: "4px 6px",
                      borderBottom: "1px solid #e8e8e8",
                      alignItems: "center",
                      background: i % 2 === 0 ? "#fff" : "#f4f4f8",
                      transition: "background 0.1s"
                    },
                    onMouseEnter: (e) => {
                      e.currentTarget.style.background = "#dde8ff";
                    },
                    onMouseLeave: (e) => {
                      e.currentTarget.style.background = i % 2 === 0 ? "#fff" : "#f4f4f8";
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 16, lineHeight: 1 }, children: "🖥️" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          style: {
                            fontWeight: "bold",
                            fontSize: 12,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap"
                          },
                          children: nu.user.username
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          style: {
                            background: roleStyle.bg,
                            color: roleStyle.text,
                            border: `1px solid ${roleStyle.border}`,
                            padding: "1px 6px",
                            fontSize: 10,
                            fontWeight: "bold",
                            borderRadius: 2,
                            whiteSpace: "nowrap"
                          },
                          children: nu.user.role
                        }
                      ) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "span",
                        {
                          style: {
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                            color: nu.isOnline ? "#008000" : "#888",
                            fontWeight: nu.isOnline ? "bold" : "normal"
                          },
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "span",
                              {
                                style: {
                                  width: 8,
                                  height: 8,
                                  borderRadius: "50%",
                                  background: nu.isOnline ? "#00c800" : "#aaa",
                                  border: `1px solid ${nu.isOnline ? "#006400" : "#888"}`,
                                  display: "inline-block",
                                  flexShrink: 0,
                                  boxShadow: nu.isOnline ? "0 0 4px #00c800" : "none"
                                }
                              }
                            ),
                            nu.isOnline ? "Online" : "Offline"
                          ]
                        }
                      )
                    ]
                  },
                  nu.user.id
                );
              })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              background: "#c0c0c0",
              borderTop: "1px solid #808080",
              padding: "2px 8px",
              display: "flex",
              gap: 8,
              fontSize: 10,
              color: "#333"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  style: {
                    borderRight: "1px solid #808080",
                    paddingRight: 8
                  },
                  children: [
                    totalCount,
                    " object(s)"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Auto-refreshes every 5 seconds" })
            ]
          }
        )
      ]
    }
  );
}
export {
  NetworkApp
};
