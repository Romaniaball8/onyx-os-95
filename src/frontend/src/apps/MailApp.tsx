import { useCallback, useEffect, useRef, useState } from "react";
import type { User } from "../types";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Mail {
  id: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  timestamp: number;
  isRead: boolean;
}

interface UserRecord {
  username: string;
  password: string;
  user: User;
}

// ── LocalStorage helpers ───────────────────────────────────────────────────────
const LS_MAIL = "onyxos_mail";
const LS_USERS = "onyxos_users";

function loadMail(): Mail[] {
  try {
    const raw = localStorage.getItem(LS_MAIL);
    if (!raw) return [];
    return JSON.parse(raw) as Mail[];
  } catch {
    return [];
  }
}

function saveMail(mails: Mail[]) {
  try {
    localStorage.setItem(LS_MAIL, JSON.stringify(mails));
  } catch {
    /* noop */
  }
}

function loadRegisteredUsernames(): string[] {
  try {
    const raw = localStorage.getItem(LS_USERS);
    if (!raw) return [];
    const obj = JSON.parse(raw) as Record<string, UserRecord>;
    return Object.keys(obj);
  } catch {
    return [];
  }
}

// ── Component ─────────────────────────────────────────────────────────────────
interface Props {
  user: User;
  userStore?: Map<string, { username: string; password: string; user: User }>;
}

export function MailApp({ user }: Props) {
  const [view, setView] = useState<"inbox" | "sent" | "compose">("inbox");
  const [mails, setMails] = useState<Mail[]>(() => loadMail());
  const [selected, setSelected] = useState<Mail | null>(null);
  const [registeredUsers, setRegisteredUsers] = useState<string[]>(() =>
    loadRegisteredUsernames(),
  );

  // Compose fields
  const [composeTo, setComposeTo] = useState("");
  const [composeSubject, setComposeSubject] = useState("");
  const [composeBody, setComposeBody] = useState("");
  const [sendStatus, setSendStatus] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const toInputRef = useRef<HTMLInputElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Poll localStorage every 5 seconds for new mail
  const refreshMail = useCallback(() => {
    setMails(loadMail());
    setRegisteredUsers(loadRegisteredUsernames());
  }, []);

  useEffect(() => {
    refreshMail();
    pollRef.current = setInterval(refreshMail, 5000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [refreshMail]);

  const inbox = mails.filter((m) => m.to === user.username);
  const sent = mails.filter((m) => m.from === user.username);
  const unreadCount = inbox.filter((m) => !m.isRead).length;
  const list = view === "inbox" ? inbox : view === "sent" ? sent : [];

  // Username autocomplete
  const handleToChange = (val: string) => {
    setComposeTo(val);
    setSendStatus(null);
    if (val.trim().length > 0) {
      const filtered = registeredUsers.filter(
        (u) =>
          u !== user.username && u.toLowerCase().includes(val.toLowerCase()),
      );
      setSuggestions(filtered.slice(0, 6));
      setShowSuggestions(filtered.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const pickSuggestion = (name: string) => {
    setComposeTo(name);
    setSuggestions([]);
    setShowSuggestions(false);
    toInputRef.current?.focus();
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
    const newMail: Mail = {
      id: `mail-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      from: user.username,
      to: toTrimmed,
      subject: composeSubject.trim(),
      body: composeBody.trim(),
      timestamp: Date.now(),
      isRead: false,
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

  const markRead = (mail: Mail) => {
    const latest = loadMail();
    const updated = latest.map((m) =>
      m.id === mail.id ? { ...m, isRead: true } : m,
    );
    saveMail(updated);
    setMails(updated);
    setSelected({ ...mail, isRead: true });
  };

  // ── Shared styles ────────────────────────────────────────────────────────────
  const fontBase = {
    fontFamily: "Tahoma, Verdana, Arial, sans-serif",
    fontSize: 11,
  };
  const btn95: React.CSSProperties = {
    ...fontBase,
    background: "#c0c0c0",
    border: "2px solid",
    borderColor: "#ffffff #808080 #808080 #ffffff",
    padding: "2px 12px",
    cursor: "pointer",
    outline: "none",
  };
  const folderBtn = (active: boolean): React.CSSProperties => ({
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
    textAlign: "left",
  });
  const insetBorder: React.CSSProperties = {
    border: "2px solid",
    borderColor: "#808080 #ffffff #ffffff #808080",
    padding: "2px 4px",
    background: "#ffffff",
    ...fontBase,
  };

  return (
    <div
      data-ocid="mail.panel"
      style={{
        display: "flex",
        height: "100%",
        ...fontBase,
        background: "#c0c0c0",
      }}
    >
      {/* ── Left sidebar ───────────────────────────────────────────────────── */}
      <div
        style={{
          width: 180,
          borderRight: "2px solid #808080",
          display: "flex",
          flexDirection: "column",
          background: "#d4d0c8",
        }}
      >
        {/* Toolbar */}
        <div
          style={{
            padding: "4px 6px",
            borderBottom: "1px solid #808080",
            background: "#c0c0c0",
          }}
        >
          <button
            type="button"
            data-ocid="mail.compose_button"
            style={{ ...btn95, fontSize: 11, width: "100%" }}
            onClick={() => {
              setView("compose");
              setSelected(null);
              setSendStatus(null);
            }}
          >
            ✉ New Message
          </button>
        </div>

        {/* Folders */}
        <div
          style={{
            padding: "6px 4px 4px",
            borderBottom: "1px solid #808080",
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: "bold",
              color: "#444",
              padding: "0 4px 2px",
              fontFamily: "Tahoma",
            }}
          >
            📁 Folders
          </div>
          <button
            type="button"
            data-ocid="mail.inbox_tab"
            style={folderBtn(view === "inbox")}
            onClick={() => {
              setView("inbox");
              setSelected(null);
              setSendStatus(null);
            }}
          >
            <span>📥 Inbox</span>
            {unreadCount > 0 && (
              <span
                style={{
                  background: "#cc0000",
                  color: "#fff",
                  borderRadius: 2,
                  padding: "0 4px",
                  fontSize: 10,
                  fontWeight: "bold",
                }}
              >
                {unreadCount}
              </span>
            )}
          </button>
          <button
            type="button"
            data-ocid="mail.sent_tab"
            style={folderBtn(view === "sent")}
            onClick={() => {
              setView("sent");
              setSelected(null);
              setSendStatus(null);
            }}
          >
            <span>📤 Sent Items</span>
          </button>
        </div>

        {/* Mail list */}
        {view !== "compose" && (
          <div
            style={{
              flex: 1,
              overflow: "auto",
              background: "#ffffff",
              borderTop: "none",
            }}
          >
            {list.length === 0 ? (
              <div
                data-ocid="mail.empty_state"
                style={{
                  padding: "12px 8px",
                  color: "#888",
                  textAlign: "center",
                  fontSize: 10,
                  fontStyle: "italic",
                }}
              >
                {view === "inbox" ? "No messages." : "No sent mail."}
              </div>
            ) : (
              [...list].reverse().map((m, i) => (
                <button
                  key={m.id}
                  type="button"
                  data-ocid={`mail.item.${i + 1}`}
                  onClick={() => markRead(m)}
                  style={{
                    width: "100%",
                    padding: "4px 6px",
                    borderTop: "none",
                    borderLeft: "none",
                    borderRight: "none",
                    borderBottom: "1px solid #e0e0e0",
                    cursor: "pointer",
                    background:
                      selected?.id === m.id ? "#000080" : "transparent",
                    color: selected?.id === m.id ? "#ffffff" : "#000000",
                    fontWeight: m.isRead ? "normal" : "bold",
                    textAlign: "left",
                    fontFamily: "Tahoma, Verdana, sans-serif",
                    fontSize: 10,
                  }}
                >
                  <div
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {view === "inbox" ? `▶ ${m.from}` : `▶ ${m.to}`}
                  </div>
                  <div
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      fontSize: 10,
                      opacity: 0.8,
                    }}
                  >
                    {m.subject}
                  </div>
                  <div style={{ fontSize: 9, opacity: 0.6 }}>
                    {new Date(m.timestamp).toLocaleDateString()}
                  </div>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* ── Right pane ─────────────────────────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          background: "#ffffff",
          overflow: "hidden",
        }}
      >
        {/* Title bar strip */}
        <div
          style={{
            background: "linear-gradient(90deg, #000080 0%, #1084d0 100%)",
            color: "#ffffff",
            padding: "3px 8px",
            fontSize: 11,
            fontWeight: "bold",
            fontFamily: "Tahoma",
            letterSpacing: 0.3,
            flexShrink: 0,
          }}
        >
          {view === "compose"
            ? "✉ New Message"
            : view === "inbox"
              ? "📥 Inbox"
              : "📤 Sent Items"}
        </div>

        {/* Content */}
        {view === "compose" ? (
          // ── Compose ──────────────────────────────────────────────────────
          <div
            style={{
              padding: 10,
              display: "flex",
              flexDirection: "column",
              gap: 6,
              background: "#d4d0c8",
              flex: 1,
              boxSizing: "border-box",
            }}
          >
            {/* To field with autocomplete */}
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <label
                htmlFor="mail-to"
                style={{ width: 56, flexShrink: 0, ...fontBase }}
              >
                To:
              </label>
              <div style={{ flex: 1, position: "relative" }}>
                <input
                  id="mail-to"
                  ref={toInputRef}
                  data-ocid="mail.to_input"
                  type="text"
                  value={composeTo}
                  onChange={(e) => handleToChange(e.target.value)}
                  onBlur={() =>
                    setTimeout(() => setShowSuggestions(false), 150)
                  }
                  onFocus={() =>
                    composeTo.length > 0 &&
                    suggestions.length > 0 &&
                    setShowSuggestions(true)
                  }
                  style={{
                    ...insetBorder,
                    width: "100%",
                    boxSizing: "border-box",
                  }}
                  placeholder="Username..."
                  autoComplete="off"
                />
                {showSuggestions && suggestions.length > 0 && (
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      right: 0,
                      background: "#ffffff",
                      border: "1px solid #808080",
                      zIndex: 100,
                      maxHeight: 120,
                      overflow: "auto",
                    }}
                  >
                    {suggestions.map((s) => (
                      <button
                        key={s}
                        type="button"
                        data-ocid={`mail.suggestion.${s}`}
                        onMouseDown={() => pickSuggestion(s)}
                        style={{
                          display: "block",
                          width: "100%",
                          padding: "3px 8px",
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          textAlign: "left",
                          ...fontBase,
                        }}
                        onMouseEnter={(e) => {
                          (
                            e.currentTarget as HTMLButtonElement
                          ).style.background = "#000080";
                          (e.currentTarget as HTMLButtonElement).style.color =
                            "#fff";
                        }}
                        onMouseLeave={(e) => {
                          (
                            e.currentTarget as HTMLButtonElement
                          ).style.background = "transparent";
                          (e.currentTarget as HTMLButtonElement).style.color =
                            "#000";
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Subject */}
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <label
                htmlFor="mail-subject"
                style={{ width: 56, flexShrink: 0, ...fontBase }}
              >
                Subject:
              </label>
              <input
                id="mail-subject"
                data-ocid="mail.subject_input"
                type="text"
                value={composeSubject}
                onChange={(e) => setComposeSubject(e.target.value)}
                style={{ ...insetBorder, flex: 1, boxSizing: "border-box" }}
                placeholder="Subject..."
              />
            </div>

            {/* Separator line */}
            <div
              style={{ height: 1, background: "#808080", margin: "2px 0" }}
            />

            {/* Body */}
            <textarea
              data-ocid="mail.body_input"
              value={composeBody}
              onChange={(e) => setComposeBody(e.target.value)}
              style={{
                flex: 1,
                resize: "none",
                fontFamily: "Times New Roman, serif",
                fontSize: 13,
                ...insetBorder,
                padding: 6,
              }}
              placeholder="Type your message here..."
            />

            {/* Status + Send */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              {sendStatus ? (
                <div
                  data-ocid="mail.send_status"
                  style={{
                    fontSize: 11,
                    color: sendStatus.startsWith("✔") ? "#006600" : "#cc0000",
                    fontFamily: "Tahoma",
                  }}
                >
                  {sendStatus}
                </div>
              ) : (
                <div />
              )}
              <button
                type="button"
                data-ocid="mail.send_button"
                style={{ ...btn95 }}
                onClick={sendMail}
              >
                📨 Send
              </button>
            </div>
          </div>
        ) : selected ? (
          // ── Read message ──────────────────────────────────────────────────
          <div
            style={{
              flex: 1,
              overflow: "auto",
              padding: 10,
            }}
          >
            {/* Header */}
            <div
              style={{
                background: "#f0f0f0",
                border: "1px solid #c0c0c0",
                padding: "6px 10px",
                marginBottom: 10,
                ...fontBase,
              }}
            >
              <table style={{ borderCollapse: "collapse", width: "100%" }}>
                <tbody>
                  {[
                    ["From:", selected.from],
                    ["To:", selected.to],
                    ["Subject:", selected.subject],
                    ["Date:", new Date(selected.timestamp).toLocaleString()],
                  ].map(([label, val]) => (
                    <tr key={label}>
                      <td
                        style={{
                          fontWeight: "bold",
                          width: 60,
                          paddingRight: 8,
                          color: "#333",
                          verticalAlign: "top",
                        }}
                      >
                        {label}
                      </td>
                      <td style={{ color: "#000" }}>{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Reply button */}
            <div style={{ marginBottom: 8 }}>
              <button
                type="button"
                data-ocid="mail.reply_button"
                style={{ ...btn95 }}
                onClick={() => {
                  setComposeTo(selected.from);
                  setComposeSubject(
                    selected.subject.startsWith("Re:")
                      ? selected.subject
                      : `Re: ${selected.subject}`,
                  );
                  setComposeBody("");
                  setView("compose");
                }}
              >
                ↩ Reply
              </button>
            </div>
            {/* Body */}
            <div
              style={{
                fontFamily: "Times New Roman, serif",
                fontSize: 13,
                lineHeight: 1.7,
                whiteSpace: "pre-wrap",
                borderTop: "1px solid #d0d0d0",
                paddingTop: 8,
              }}
            >
              {selected.body}
            </div>
          </div>
        ) : (
          // ── Empty state ───────────────────────────────────────────────────
          <div
            data-ocid="mail.empty_state"
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: "#888",
              gap: 6,
            }}
          >
            <div style={{ fontSize: 32 }}>📭</div>
            <div style={{ ...fontBase, color: "#666" }}>
              {view === "inbox" && inbox.length === 0
                ? "Your inbox is empty."
                : "Select a message to read."}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
