import { type ReactNode, useCallback, useRef } from "react";
import type { WindowState } from "../types";

interface Props {
  window: WindowState;
  children: ReactNode;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onMaximize: (id: string) => void;
  onFocus: (id: string) => void;
  onMove: (id: string, x: number, y: number) => void;
}

export function Window({
  window: win,
  children,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onMove,
}: Props) {
  const dragRef = useRef<{
    startX: number;
    startY: number;
    winX: number;
    winY: number;
  } | null>(null);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      onFocus(win.id);
      dragRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        winX: win.x,
        winY: win.y,
      };

      const onMouseMove = (me: MouseEvent) => {
        if (!dragRef.current) return;
        const dx = me.clientX - dragRef.current.startX;
        const dy = me.clientY - dragRef.current.startY;
        onMove(win.id, dragRef.current.winX + dx, dragRef.current.winY + dy);
      };

      const onMouseUp = () => {
        dragRef.current = null;
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      };

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    },
    [win.id, win.x, win.y, onFocus, onMove],
  );

  if (win.isMinimized) return null;

  const style: React.CSSProperties = win.isMaximized
    ? {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "calc(100vh - 30px)",
        zIndex: win.zIndex,
      }
    : {
        position: "fixed",
        top: win.y,
        left: win.x,
        width: win.width,
        height: win.height,
        zIndex: win.zIndex,
      };

  return (
    <div
      data-ocid={`window.${win.appId}`}
      style={{
        ...style,
        background: "#c0c0c0",
        border: "2px solid",
        borderColor: "#ffffff #808080 #808080 #ffffff",
        boxShadow: "2px 2px 0 #000",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Tahoma, Verdana, sans-serif",
        fontSize: 11,
        overflow: "hidden",
      }}
      onMouseDown={() => onFocus(win.id)}
    >
      {/* Title bar */}
      <div
        style={{
          background: "linear-gradient(90deg, #000080 0%, #1084d0 100%)",
          color: "#fff",
          padding: "2px 4px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: 11,
          fontWeight: "bold",
          userSelect: "none",
          cursor: "default",
          flexShrink: 0,
          height: 20,
        }}
        onMouseDown={handleMouseDown}
      >
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
            <rect x="1" y="1" width="12" height="12" fill="#c0c0c0" />
            <rect x="2" y="2" width="10" height="10" fill="#000080" />
          </svg>
          {win.title}
        </span>

        {/* Window control buttons */}
        <div style={{ display: "flex", gap: 1, flexShrink: 0 }}>
          <button
            type="button"
            data-ocid={`window.${win.appId}.minimize_button`}
            aria-label="Minimize"
            onClick={(e) => {
              e.stopPropagation();
              onMinimize(win.id);
            }}
            style={{
              width: 16,
              height: 14,
              background: "#c0c0c0",
              color: "#000",
              border: "1px solid",
              borderColor: "#fff #808080 #808080 #fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 9,
              cursor: "pointer",
              padding: 0,
              lineHeight: 1,
            }}
          >
            _
          </button>
          <button
            type="button"
            data-ocid={`window.${win.appId}.maximize_button`}
            aria-label={win.isMaximized ? "Restore" : "Maximize"}
            onClick={(e) => {
              e.stopPropagation();
              onMaximize(win.id);
            }}
            style={{
              width: 16,
              height: 14,
              background: "#c0c0c0",
              color: "#000",
              border: "1px solid",
              borderColor: "#fff #808080 #808080 #fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 9,
              cursor: "pointer",
              padding: 0,
              lineHeight: 1,
            }}
          >
            {win.isMaximized ? "❐" : "□"}
          </button>
          <button
            type="button"
            data-ocid={`window.${win.appId}.close_button`}
            aria-label="Close"
            onClick={(e) => {
              e.stopPropagation();
              onClose(win.id);
            }}
            style={{
              width: 16,
              height: 14,
              background: "#c0c0c0",
              color: "#000",
              border: "1px solid",
              borderColor: "#fff #808080 #808080 #fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 9,
              cursor: "pointer",
              padding: 0,
              fontWeight: "bold",
              lineHeight: 1,
            }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* Menu bar area */}
      <div
        style={{
          background: "#c0c0c0",
          borderBottom: "1px solid #808080",
          height: 18,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          paddingLeft: 4,
        }}
      >
        <span style={{ fontSize: 11, marginRight: 12, cursor: "default" }}>
          File
        </span>
        <span style={{ fontSize: 11, marginRight: 12, cursor: "default" }}>
          Edit
        </span>
        <span style={{ fontSize: 11, marginRight: 12, cursor: "default" }}>
          View
        </span>
        <span style={{ fontSize: 11, cursor: "default" }}>Help</span>
      </div>

      {/* Content area */}
      <div
        style={{
          flex: 1,
          overflow: "auto",
          background: "#c0c0c0",
          position: "relative",
        }}
      >
        {children}
      </div>

      {/* Status bar */}
      <div className="statusbar-95" style={{ flexShrink: 0 }}>
        <div className="statusbar-item">{win.title}</div>
        <div
          style={{
            width: 100,
            flexShrink: 0,
            padding: "2px 4px",
            fontSize: 10,
            borderLeft: "1px solid #808080",
          }}
        >
          Ready
        </div>
      </div>
    </div>
  );
}
