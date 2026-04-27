import { r as reactExports, j as jsxRuntimeExports } from "./index-D7X0lYXV.js";
const LS_MAIL = "onyxos_mail";
const LS_USERS = "onyxos_users";
function loadMail() {
  try {
    const raw = localStorage.getItem(LS_MAIL);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}
function saveMail(mails) {
  try {
    localStorage.setItem(LS_MAIL, JSON.stringify(mails));
  } catch {
  }
}
function loadRegisteredUsernames() {
  try {
    const raw = localStorage.getItem(LS_USERS);
    if (!raw) return [];
    const obj = JSON.parse(raw);
    return Object.keys(obj);
  } catch {
    return [];
  }
}
function MailApp({ user }) {
  const [view, setView] = reactExports.useState("inbox");
  const [mails, setMails] = reactExports.useState(() => loadMail());
  const [selected, setSelected] = reactExports.useState(null);
  const [registeredUsers, setRegisteredUsers] = reactExports.useState(
    () => loadRegisteredUsernames()
  );
  const [composeTo, setComposeTo] = reactExports.useState("");
  const [composeSubject, setComposeSubject] = reactExports.useState("");
  const [composeBody, setComposeBody] = reactExports.useState("");
  const [sendStatus, setSendStatus] = reactExports.useState(null);
  const [suggestions, setSuggestions] = reactExports.useState([]);
  const [showSuggestions, setShowSuggestions] = reactExports.useState(false);
  const toInputRef = reactExports.useRef(null);
  const pollRef = reactExports.useRef(null);
  const refreshMail = reactExports.useCallback(() => {
    setMails(loadMail());
    setRegisteredUsers(loadRegisteredUsernames());
  }, []);
  reactExports.useEffect(() => {
    refreshMail();
    pollRef.current = setInterval(refreshMail, 5e3);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [refreshMail]);
  const inbox = mails.filter((m) => m.to === user.username);
  const sent = mails.filter((m) => m.from === user.username);
  const unreadCount = inbox.filter((m) => !m.isRead).length;
  const list = view === "inbox" ? inbox : view === "sent" ? sent : [];
  const handleToChange = (val) => {
    setComposeTo(val);
    setSendStatus(null);
    if (val.trim().length > 0) {
      const filtered = registeredUsers.filter(
        (u) => u !== user.username && u.toLowerCase().includes(val.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 6));
      setShowSuggestions(filtered.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };
  const pickSuggestion = (name) => {
    var _a;
    setComposeTo(name);
    setSuggestions([]);
    setShowSuggestions(false);
    (_a = toInputRef.current) == null ? void 0 : _a.focus();
  };
  const sendMail = () => {
    const toTrimmed = composeTo.trim();
    if (!toTrimmed || !composeSubject.trim() || !composeBody.trim()) {
      setSendStatus("Please fill in all fields.");
      return;
    }
    if (!registeredUsers.includes(toTrimmed)) {
      setSendStatus("User not found");
      return;
    }
    const newMail = {
      id: `mail-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      from: user.username,
      to: toTrimmed,
      subject: composeSubject.trim(),
      body: composeBody.trim(),
      timestamp: Date.now(),
      isRead: false
    };
    const updated = [...loadMail(), newMail];
    saveMail(updated);
    setMails(updated);
    setComposeTo("");
    setComposeSubject("");
    setComposeBody("");
    setSendStatus("✔ Message sent!");
    setView("sent");
  };
  const markRead = (mail) => {
    const latest = loadMail();
    const updated = latest.map(
      (m) => m.id === mail.id ? { ...m, isRead: true } : m
    );
    saveMail(updated);
    setMails(updated);
    setSelected({ ...mail, isRead: true });
  };
  const fontBase = {
    fontFamily: "Tahoma, Verdana, Arial, sans-serif",
    fontSize: 11
  };
  const btn95 = {
    ...fontBase,
    background: "#c0c0c0",
    border: "2px solid",
    borderColor: "#ffffff #808080 #808080 #ffffff",
    padding: "2px 12px",
    cursor: "pointer",
    outline: "none"
  };
  const folderBtn = (active) => ({
    ...fontBase,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    padding: "4px 8px",
    background: active ? "#000080" : "transparent",
    color: active ? "#ffffff" : "#000000",
    border: "none",
    cursor: "pointer",
    textAlign: "left"
  });
  const insetBorder = {
    border: "2px solid",
    borderColor: "#808080 #ffffff #ffffff #808080",
    padding: "2px 4px",
    background: "#ffffff",
    ...fontBase
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "mail.panel",
      style: {
        display: "flex",
        height: "100%",
        ...fontBase,
        background: "#c0c0c0"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              width: 180,
              borderRight: "2px solid #808080",
              display: "flex",
              flexDirection: "column",
              background: "#d4d0c8"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: {
                    padding: "4px 6px",
                    borderBottom: "1px solid #808080",
                    background: "#c0c0c0"
                  },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      "data-ocid": "mail.compose_button",
                      style: { ...btn95, fontSize: 11, width: "100%" },
                      onClick: () => {
                        setView("compose");
                        setSelected(null);
                        setSendStatus(null);
                      },
                      children: "✉ New Message"
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  style: {
                    padding: "6px 4px 4px",
                    borderBottom: "1px solid #808080"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        style: {
                          fontSize: 10,
                          fontWeight: "bold",
                          color: "#444",
                          padding: "0 4px 2px",
                          fontFamily: "Tahoma"
                        },
                        children: "📁 Folders"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        type: "button",
                        "data-ocid": "mail.inbox_tab",
                        style: folderBtn(view === "inbox"),
                        onClick: () => {
                          setView("inbox");
                          setSelected(null);
                          setSendStatus(null);
                        },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "📥 Inbox" }),
                          unreadCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "span",
                            {
                              style: {
                                background: "#cc0000",
                                color: "#fff",
                                borderRadius: 2,
                                padding: "0 4px",
                                fontSize: 10,
                                fontWeight: "bold"
                              },
                              children: unreadCount
                            }
                          )
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        "data-ocid": "mail.sent_tab",
                        style: folderBtn(view === "sent"),
                        onClick: () => {
                          setView("sent");
                          setSelected(null);
                          setSendStatus(null);
                        },
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "📤 Sent Items" })
                      }
                    )
                  ]
                }
              ),
              view !== "compose" && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: {
                    flex: 1,
                    overflow: "auto",
                    background: "#ffffff",
                    borderTop: "none"
                  },
                  children: list.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      "data-ocid": "mail.empty_state",
                      style: {
                        padding: "12px 8px",
                        color: "#888",
                        textAlign: "center",
                        fontSize: 10,
                        fontStyle: "italic"
                      },
                      children: view === "inbox" ? "No messages." : "No sent mail."
                    }
                  ) : [...list].reverse().map((m, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      type: "button",
                      "data-ocid": `mail.item.${i + 1}`,
                      onClick: () => markRead(m),
                      style: {
                        width: "100%",
                        padding: "4px 6px",
                        borderTop: "none",
                        borderLeft: "none",
                        borderRight: "none",
                        borderBottom: "1px solid #e0e0e0",
                        cursor: "pointer",
                        background: (selected == null ? void 0 : selected.id) === m.id ? "#000080" : "transparent",
                        color: (selected == null ? void 0 : selected.id) === m.id ? "#ffffff" : "#000000",
                        fontWeight: m.isRead ? "normal" : "bold",
                        textAlign: "left",
                        fontFamily: "Tahoma, Verdana, sans-serif",
                        fontSize: 10
                      },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "div",
                          {
                            style: {
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap"
                            },
                            children: view === "inbox" ? `▶ ${m.from}` : `▶ ${m.to}`
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "div",
                          {
                            style: {
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              fontSize: 10,
                              opacity: 0.8
                            },
                            children: m.subject
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 9, opacity: 0.6 }, children: new Date(m.timestamp).toLocaleDateString() })
                      ]
                    },
                    m.id
                  ))
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              flex: 1,
              display: "flex",
              flexDirection: "column",
              background: "#ffffff",
              overflow: "hidden"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: {
                    background: "linear-gradient(90deg, #000080 0%, #1084d0 100%)",
                    color: "#ffffff",
                    padding: "3px 8px",
                    fontSize: 11,
                    fontWeight: "bold",
                    fontFamily: "Tahoma",
                    letterSpacing: 0.3,
                    flexShrink: 0
                  },
                  children: view === "compose" ? "✉ New Message" : view === "inbox" ? "📥 Inbox" : "📤 Sent Items"
                }
              ),
              view === "compose" ? (
                // ── Compose ──────────────────────────────────────────────────────
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    style: {
                      padding: 10,
                      display: "flex",
                      flexDirection: "column",
                      gap: 6,
                      background: "#d4d0c8",
                      flex: 1,
                      boxSizing: "border-box"
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 6 }, children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "label",
                          {
                            htmlFor: "mail-to",
                            style: { width: 56, flexShrink: 0, ...fontBase },
                            children: "To:"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, position: "relative" }, children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "input",
                            {
                              id: "mail-to",
                              ref: toInputRef,
                              "data-ocid": "mail.to_input",
                              type: "text",
                              value: composeTo,
                              onChange: (e) => handleToChange(e.target.value),
                              onBlur: () => setTimeout(() => setShowSuggestions(false), 150),
                              onFocus: () => composeTo.length > 0 && suggestions.length > 0 && setShowSuggestions(true),
                              style: {
                                ...insetBorder,
                                width: "100%",
                                boxSizing: "border-box"
                              },
                              placeholder: "Username...",
                              autoComplete: "off"
                            }
                          ),
                          showSuggestions && suggestions.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "div",
                            {
                              style: {
                                position: "absolute",
                                top: "100%",
                                left: 0,
                                right: 0,
                                background: "#ffffff",
                                border: "1px solid #808080",
                                zIndex: 100,
                                maxHeight: 120,
                                overflow: "auto"
                              },
                              children: suggestions.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                                "button",
                                {
                                  type: "button",
                                  "data-ocid": `mail.suggestion.${s}`,
                                  onMouseDown: () => pickSuggestion(s),
                                  style: {
                                    display: "block",
                                    width: "100%",
                                    padding: "3px 8px",
                                    background: "transparent",
                                    border: "none",
                                    cursor: "pointer",
                                    textAlign: "left",
                                    ...fontBase
                                  },
                                  onMouseEnter: (e) => {
                                    e.currentTarget.style.background = "#000080";
                                    e.currentTarget.style.color = "#fff";
                                  },
                                  onMouseLeave: (e) => {
                                    e.currentTarget.style.background = "transparent";
                                    e.currentTarget.style.color = "#000";
                                  },
                                  children: s
                                },
                                s
                              ))
                            }
                          )
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 6 }, children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "label",
                          {
                            htmlFor: "mail-subject",
                            style: { width: 56, flexShrink: 0, ...fontBase },
                            children: "Subject:"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "input",
                          {
                            id: "mail-subject",
                            "data-ocid": "mail.subject_input",
                            type: "text",
                            value: composeSubject,
                            onChange: (e) => setComposeSubject(e.target.value),
                            style: { ...insetBorder, flex: 1, boxSizing: "border-box" },
                            placeholder: "Subject..."
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          style: { height: 1, background: "#808080", margin: "2px 0" }
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "textarea",
                        {
                          "data-ocid": "mail.body_input",
                          value: composeBody,
                          onChange: (e) => setComposeBody(e.target.value),
                          style: {
                            flex: 1,
                            resize: "none",
                            fontFamily: "Times New Roman, serif",
                            fontSize: 13,
                            ...insetBorder,
                            padding: 6
                          },
                          placeholder: "Type your message here..."
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "div",
                        {
                          style: {
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between"
                          },
                          children: [
                            sendStatus ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "div",
                              {
                                "data-ocid": "mail.send_status",
                                style: {
                                  fontSize: 11,
                                  color: sendStatus.startsWith("✔") ? "#006600" : "#cc0000",
                                  fontFamily: "Tahoma"
                                },
                                children: sendStatus
                              }
                            ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", {}),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "button",
                              {
                                type: "button",
                                "data-ocid": "mail.send_button",
                                style: { ...btn95 },
                                onClick: sendMail,
                                children: "📨 Send"
                              }
                            )
                          ]
                        }
                      )
                    ]
                  }
                )
              ) : selected ? (
                // ── Read message ──────────────────────────────────────────────────
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    style: {
                      flex: 1,
                      overflow: "auto",
                      padding: 10
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          style: {
                            background: "#f0f0f0",
                            border: "1px solid #c0c0c0",
                            padding: "6px 10px",
                            marginBottom: 10,
                            ...fontBase
                          },
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx("table", { style: { borderCollapse: "collapse", width: "100%" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: [
                            ["From:", selected.from],
                            ["To:", selected.to],
                            ["Subject:", selected.subject],
                            ["Date:", new Date(selected.timestamp).toLocaleString()]
                          ].map(([label, val]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "td",
                              {
                                style: {
                                  fontWeight: "bold",
                                  width: 60,
                                  paddingRight: 8,
                                  color: "#333",
                                  verticalAlign: "top"
                                },
                                children: label
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { color: "#000" }, children: val })
                          ] }, label)) }) })
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginBottom: 8 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          "data-ocid": "mail.reply_button",
                          style: { ...btn95 },
                          onClick: () => {
                            setComposeTo(selected.from);
                            setComposeSubject(
                              selected.subject.startsWith("Re:") ? selected.subject : `Re: ${selected.subject}`
                            );
                            setComposeBody("");
                            setView("compose");
                          },
                          children: "↩ Reply"
                        }
                      ) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          style: {
                            fontFamily: "Times New Roman, serif",
                            fontSize: 13,
                            lineHeight: 1.7,
                            whiteSpace: "pre-wrap",
                            borderTop: "1px solid #d0d0d0",
                            paddingTop: 8
                          },
                          children: selected.body
                        }
                      )
                    ]
                  }
                )
              ) : (
                // ── Empty state ───────────────────────────────────────────────────
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    "data-ocid": "mail.empty_state",
                    style: {
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#888",
                      gap: 6
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 32 }, children: "📭" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { ...fontBase, color: "#666" }, children: view === "inbox" && inbox.length === 0 ? "Your inbox is empty." : "Select a message to read." })
                    ]
                  }
                )
              )
            ]
          }
        )
      ]
    }
  );
}
export {
  MailApp
};
