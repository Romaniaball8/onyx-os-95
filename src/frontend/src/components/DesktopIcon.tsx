import type { ReactNode } from "react";
import type { AppId } from "../types";

interface Props {
  appId: AppId;
  label: string;
  icon: ReactNode;
  onDoubleClick: (appId: AppId) => void;
  index: number;
}

export function DesktopIcon({
  appId,
  label,
  icon,
  onDoubleClick,
  index,
}: Props) {
  return (
    <button
      type="button"
      data-ocid={`desktop.icon.${index}`}
      onDoubleClick={() => onDoubleClick(appId)}
      onClick={() => onDoubleClick(appId)}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: 72,
        padding: "4px 2px",
        cursor: "default",
        userSelect: "none",
        gap: 4,
        background: "none",
        border: "none",
      }}
      aria-label={`Open ${label}`}
    >
      {/* 32-bit pixel art SVG icon */}
      <div
        style={{
          width: 48,
          height: 48,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          imageRendering: "pixelated",
        }}
      >
        {icon}
      </div>
      {/* Label */}
      <span
        style={{
          fontFamily: "Tahoma, Verdana, sans-serif",
          fontSize: 11,
          color: "#fff",
          textAlign: "center",
          textShadow:
            "1px 1px 1px #000, -1px -1px 1px #000, 1px -1px 1px #000, -1px 1px 1px #000",
          lineHeight: 1.2,
          maxWidth: 72,
          wordBreak: "break-word",
        }}
      >
        {label}
      </span>
    </button>
  );
}
