import { useEffect, useState } from "react";
import type { AppId, User, WindowState } from "../types";

interface Props {
  windows: WindowState[];
  user: User | null;
  onOpenApp: (appId: AppId) => void;
  onRestoreWindow: (id: string) => void;
  onFocusWindow: (id: string) => void;
  onLogout: () => void;
}

export function Taskbar({
  windows,
  user,
  onOpenApp,
  onRestoreWindow,
  onFocusWindow,
  onLogout,
}: Props) {
  const [time, setTime] = useState(() => new Date());
  const [startOpen, setStartOpen] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const timeStr = time.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const taskbarBtns = windows.filter((w) => !w.isMinimized || true);

  return (
    <div
      data-ocid="taskbar.bar"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: 30,
        background: "#c0c0c0",
        border: "none",
        borderTop: "2px solid #fff",
        display: "flex",
        alignItems: "center",
        zIndex: 10000,
        gap: 2,
        padding: "0 2px",
        fontFamily: "Tahoma, Verdana, sans-serif",
        fontSize: 11,
      }}
    >
      {/* Start button with uploaded logo */}
      <button
        type="button"
        data-ocid="taskbar.start_button"
        onClick={() => setStartOpen((s) => !s)}
        style={{
          height: 22,
          padding: "0 8px 0 4px",
          background: "#c0c0c0",
          border: "2px solid",
          borderColor: startOpen
            ? "#808080 #fff #fff #808080"
            : "#fff #808080 #808080 #fff",
          display: "flex",
          alignItems: "center",
          gap: 4,
          fontFamily: "Tahoma, Verdana, sans-serif",
          fontSize: 11,
          fontWeight: "bold",
          cursor: "pointer",
          userSelect: "none",
          flexShrink: 0,
        }}
      >
        <img
          src="/assets/onyx-logo.png"
          alt="Onyx OS 95"
          width={16}
          height={16}
          style={{ imageRendering: "auto", objectFit: "contain" }}
        />
        Start
      </button>

      {/* Separator */}
      <div
        style={{
          width: 1,
          height: 22,
          background: "#808080",
          flexShrink: 0,
          margin: "0 2px",
        }}
      />

      {/* Open windows */}
      <div style={{ flex: 1, display: "flex", gap: 2, overflow: "hidden" }}>
        {taskbarBtns.map((w) => (
          <button
            key={w.id}
            type="button"
            data-ocid={`taskbar.window.${w.appId}`}
            onClick={() => {
              if (w.isMinimized) {
                onRestoreWindow(w.id);
              } else {
                onFocusWindow(w.id);
              }
            }}
            style={{
              height: 22,
              maxWidth: 140,
              padding: "0 6px",
              background: "#c0c0c0",
              border: "2px solid",
              borderColor: "#fff #808080 #808080 #fff",
              fontFamily: "Tahoma, Verdana, sans-serif",
              fontSize: 11,
              cursor: "pointer",
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              textAlign: "left",
              flexShrink: 0,
            }}
          >
            {w.title}
          </button>
        ))}
      </div>

      {/* System tray */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          padding: "0 4px",
          border: "2px solid",
          borderColor: "#808080 #fff #fff #808080",
          height: 22,
          flexShrink: 0,
          fontSize: 11,
        }}
      >
        {user && (
          <span style={{ marginRight: 6, color: "#333" }}>
            👤 {user.username}
          </span>
        )}
        <span
          data-ocid="taskbar.clock"
          style={{ minWidth: 48, textAlign: "center" }}
        >
          {timeStr}
        </span>
      </div>

      {/* Logout button */}
      {user && (
        <button
          type="button"
          data-ocid="taskbar.logout_button"
          onClick={onLogout}
          title="Log off"
          style={{
            height: 22,
            padding: "0 6px",
            background: "#c0c0c0",
            border: "2px solid",
            borderColor: "#fff #808080 #808080 #fff",
            fontFamily: "Tahoma, Verdana, sans-serif",
            fontSize: 11,
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          Log Off
        </button>
      )}

      {/* Start menu */}
      {startOpen && (
        <div
          data-ocid="taskbar.start_menu"
          style={{
            position: "absolute",
            bottom: 30,
            left: 0,
            width: 200,
            background: "#c0c0c0",
            border: "2px solid",
            borderColor: "#fff #808080 #808080 #fff",
            boxShadow: "2px 2px 0 #000",
            zIndex: 10001,
          }}
        >
          {/* Vertical banner with uploaded logo */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: 22,
              background: "linear-gradient(180deg, #808080 0%, #404040 100%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-end",
              paddingBottom: 4,
              gap: 4,
            }}
          >
            <img
              src="/assets/onyx-logo.png"
              alt="Onyx OS 95"
              width={18}
              height={18}
              style={{ imageRendering: "auto", objectFit: "contain" }}
            />
            <span
              style={{
                writingMode: "vertical-rl",
                transform: "rotate(180deg)",
                color: "#c0c0c0",
                fontSize: 12,
                fontFamily: "Georgia, serif",
                fontWeight: "bold",
                letterSpacing: 1,
                userSelect: "none",
              }}
            >
              Onyx OS 95
            </span>
          </div>

          {/* Menu items */}
          <div style={{ marginLeft: 22 }}>
            {(
              [
                { appId: "my-computer", label: "My Computer", emoji: "🖥️" },
                {
                  appId: "internet-explorer",
                  label: "Internet Explorer",
                  emoji: "🌐",
                },
                { appId: "network", label: "Computer Network", emoji: "📡" },
                { appId: "game-center", label: "Game Center", emoji: "🕹️" },
                { appId: "live-chat", label: "Live Chat", emoji: "💬" },
                { appId: "friends", label: "Friends", emoji: "👥" },
                { appId: "notes", label: "Notes", emoji: "📝" },
                { appId: "paint", label: "Onyx Paint", emoji: "🎨" },
                { appId: "mail", label: "Mail", emoji: "📧" },
              ] as { appId: AppId; label: string; emoji: string }[]
            ).map((item) => (
              <button
                key={item.appId}
                type="button"
                data-ocid={`start_menu.${item.appId}`}
                onClick={() => {
                  onOpenApp(item.appId);
                  setStartOpen(false);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  width: "100%",
                  padding: "5px 8px",
                  background: "none",
                  border: "none",
                  fontFamily: "Tahoma, Verdana, sans-serif",
                  fontSize: 11,
                  cursor: "pointer",
                  textAlign: "left",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "#000080";
                  (e.currentTarget as HTMLElement).style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "none";
                  (e.currentTarget as HTMLElement).style.color = "#000";
                }}
              >
                <span>{item.emoji}</span>
                {item.label}
              </button>
            ))}
            <div style={{ borderTop: "1px solid #808080", margin: "2px 0" }} />
            <button
              type="button"
              data-ocid="start_menu.logout"
              onClick={() => {
                onLogout();
                setStartOpen(false);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                width: "100%",
                padding: "5px 8px",
                background: "none",
                border: "none",
                fontFamily: "Tahoma, Verdana, sans-serif",
                fontSize: 11,
                cursor: "pointer",
                textAlign: "left",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "#000080";
                (e.currentTarget as HTMLElement).style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "none";
                (e.currentTarget as HTMLElement).style.color = "#000";
              }}
            >
              <span>🚪</span>
              Shut Down...
            </button>
          </div>
        </div>
      )}

      {/* Close start menu on outside click */}
      {startOpen && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 10000 }}
          onClick={() => setStartOpen(false)}
          onKeyDown={(e) => e.key === "Escape" && setStartOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
