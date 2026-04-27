import type { ReactNode } from "react";
import { Suspense, lazy } from "react";
import type { AppId, User, WindowState } from "../types";
import { DesktopIcon } from "./DesktopIcon";
import { Taskbar } from "./Taskbar";
import { Window } from "./Window";

// Lazy import apps to keep this file thin
const MyComputer = lazy(() =>
  import("../apps/MyComputer").then((m) => ({ default: m.MyComputer })),
);
const NetworkApp = lazy(() =>
  import("../apps/NetworkApp").then((m) => ({ default: m.NetworkApp })),
);
const GameCenter = lazy(() =>
  import("../apps/GameCenter").then((m) => ({ default: m.GameCenter })),
);
const LiveChat = lazy(() =>
  import("../apps/LiveChat").then((m) => ({ default: m.LiveChat })),
);
const NotesApp = lazy(() =>
  import("../apps/NotesApp").then((m) => ({ default: m.NotesApp })),
);
const PaintApp = lazy(() =>
  import("../apps/PaintApp").then((m) => ({ default: m.PaintApp })),
);
const MailApp = lazy(() =>
  import("../apps/MailApp").then((m) => ({ default: m.MailApp })),
);
const InternetExplorer = lazy(() =>
  import("../apps/InternetExplorer").then((m) => ({
    default: m.InternetExplorer,
  })),
);
const FriendsApp = lazy(() =>
  import("../apps/FriendsApp").then((m) => ({ default: m.FriendsApp })),
);

interface Props {
  user: User;
  windows: WindowState[];
  onOpenApp: (appId: AppId) => void;
  onCloseWindow: (id: string) => void;
  onMinimizeWindow: (id: string) => void;
  onMaximizeWindow: (id: string) => void;
  onFocusWindow: (id: string) => void;
  onMoveWindow: (id: string, x: number, y: number) => void;
  onLogout: () => void;
  userStore: Map<string, { username: string; password: string; user: User }>;
  onUpdateProfile: (
    updates: Partial<
      Pick<
        User,
        | "bio"
        | "avatarUrl"
        | "username"
        | "usernameEffect"
        | "textPlate"
        | "biography"
      >
    >,
  ) => void;
}

// ── 64-bit quality glossy SVG icons ─────────────────────────────────────────
// Each uses gradients, highlights, and shadows for a professional 3D look

function IconMyComputer() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="mc-monitor"
          x1="4"
          y1="4"
          x2="44"
          y2="32"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#e8e8e8" />
          <stop offset="100%" stopColor="#a0a0a0" />
        </linearGradient>
        <linearGradient
          id="mc-screen"
          x1="8"
          y1="8"
          x2="38"
          y2="28"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#2a50c8" />
          <stop offset="100%" stopColor="#000860" />
        </linearGradient>
        <linearGradient
          id="mc-base"
          x1="12"
          y1="34"
          x2="36"
          y2="46"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#d0d0d0" />
          <stop offset="100%" stopColor="#888" />
        </linearGradient>
        <filter id="mc-shadow">
          <feDropShadow
            dx="1"
            dy="2"
            stdDeviation="1.5"
            floodColor="#00000060"
          />
        </filter>
      </defs>
      {/* Monitor body */}
      <rect
        x="4"
        y="3"
        width="40"
        height="28"
        rx="2"
        fill="url(#mc-monitor)"
        filter="url(#mc-shadow)"
      />
      <rect x="5" y="4" width="38" height="2" fill="#f5f5f5" opacity="0.8" />
      <rect x="5" y="4" width="1" height="26" fill="#f5f5f5" opacity="0.6" />
      {/* Screen bezel */}
      <rect x="7" y="6" width="34" height="22" rx="1" fill="#333" />
      {/* Screen */}
      <rect x="8" y="7" width="32" height="20" fill="url(#mc-screen)" />
      {/* Screen shine */}
      <rect
        x="9"
        y="8"
        width="14"
        height="3"
        rx="1"
        fill="#ffffff"
        opacity="0.15"
      />
      {/* Screen content lines */}
      <rect
        x="11"
        y="13"
        width="18"
        height="2"
        rx="1"
        fill="#00e060"
        opacity="0.9"
      />
      <rect
        x="11"
        y="17"
        width="12"
        height="2"
        rx="1"
        fill="#00c050"
        opacity="0.7"
      />
      <rect
        x="11"
        y="21"
        width="15"
        height="2"
        rx="1"
        fill="#00e060"
        opacity="0.9"
      />
      {/* Power LED */}
      <circle cx="38" cy="27" r="1.5" fill="#00ff66" />
      {/* Neck */}
      <rect x="19" y="31" width="10" height="5" rx="1" fill="url(#mc-base)" />
      {/* Base */}
      <rect x="12" y="36" width="24" height="6" rx="3" fill="url(#mc-base)" />
      <rect x="13" y="37" width="22" height="1" fill="#e0e0e0" opacity="0.5" />
    </svg>
  );
}

function IconNetwork() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="net-mon"
          x1="0"
          y1="0"
          x2="16"
          y2="20"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#e0e0e0" />
          <stop offset="100%" stopColor="#909090" />
        </linearGradient>
        <linearGradient
          id="net-hub"
          x1="14"
          y1="30"
          x2="34"
          y2="44"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#3a4a6a" />
          <stop offset="100%" stopColor="#1a2030" />
        </linearGradient>
        <filter id="net-shadow">
          <feDropShadow dx="1" dy="1" stdDeviation="1" floodColor="#00000050" />
        </filter>
      </defs>
      {/* Left monitor */}
      <rect
        x="0"
        y="5"
        width="18"
        height="14"
        rx="1"
        fill="url(#net-mon)"
        filter="url(#net-shadow)"
      />
      <rect x="1" y="6" width="16" height="11" fill="#000860" />
      <rect x="2" y="7" width="8" height="2" fill="#2040a0" opacity="0.6" />
      <rect x="2" y="11" width="12" height="1" fill="#00cc44" />
      <rect x="2" y="13" width="9" height="1" fill="#00aa33" />
      <rect x="5" y="19" width="6" height="3" rx="1" fill="#909090" />
      <rect x="3" y="22" width="10" height="3" rx="2" fill="#a0a0a0" />
      {/* Right monitor */}
      <rect
        x="30"
        y="5"
        width="18"
        height="14"
        rx="1"
        fill="url(#net-mon)"
        filter="url(#net-shadow)"
      />
      <rect x="31" y="6" width="16" height="11" fill="#000860" />
      <rect x="32" y="7" width="8" height="2" fill="#2040a0" opacity="0.6" />
      <rect x="32" y="11" width="12" height="1" fill="#00cc44" />
      <rect x="32" y="13" width="9" height="1" fill="#00aa33" />
      <rect x="35" y="19" width="6" height="3" rx="1" fill="#909090" />
      <rect x="33" y="22" width="10" height="3" rx="2" fill="#a0a0a0" />
      {/* Hub/switch */}
      <rect
        x="14"
        y="30"
        width="20"
        height="10"
        rx="2"
        fill="url(#net-hub)"
        filter="url(#net-shadow)"
      />
      <rect
        x="15"
        y="31"
        width="18"
        height="2"
        rx="1"
        fill="#4060a0"
        opacity="0.5"
      />
      <circle cx="18" cy="37" r="2" fill="#00ff44" />
      <circle cx="24" cy="37" r="2" fill="#00cc44" />
      <circle cx="30" cy="37" r="2" fill="#44ff88" />
      {/* Cables */}
      <path
        d="M9 22 Q9 27 14 30"
        stroke="#ffd700"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M39 22 Q39 27 34 30"
        stroke="#ffd700"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M24 20 L24 30"
        stroke="#ffd700"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconGameCenter() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="gc-body"
          x1="4"
          y1="16"
          x2="44"
          y2="44"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#3a3a5a" />
          <stop offset="100%" stopColor="#1a1a2a" />
        </linearGradient>
        <linearGradient
          id="gc-btn-red"
          x1="0"
          y1="0"
          x2="8"
          y2="8"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#ff4040" />
          <stop offset="100%" stopColor="#880000" />
        </linearGradient>
        <linearGradient
          id="gc-ball"
          x1="18"
          y1="2"
          x2="30"
          y2="14"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#ff6040" />
          <stop offset="100%" stopColor="#aa1000" />
        </linearGradient>
        <filter id="gc-shadow">
          <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="#00000080" />
        </filter>
      </defs>
      {/* Controller body */}
      <rect
        x="4"
        y="20"
        width="40"
        height="22"
        rx="8"
        fill="url(#gc-body)"
        filter="url(#gc-shadow)"
      />
      <rect
        x="5"
        y="21"
        width="38"
        height="4"
        rx="3"
        fill="#5a5a7a"
        opacity="0.4"
      />
      {/* D-pad */}
      <rect x="9" y="27" width="10" height="4" rx="1" fill="#1a6aff" />
      <rect x="12" y="24" width="4" height="10" rx="1" fill="#1a6aff" />
      <rect x="13" y="25" width="2" height="2" fill="#6aabff" opacity="0.6" />
      {/* Action buttons */}
      <circle cx="33" cy="28" r="3.5" fill="url(#gc-btn-red)" />
      <circle cx="33" cy="28" r="1.5" fill="#ff9090" opacity="0.5" />
      <circle cx="39" cy="30" r="3.5" fill="#ddaa00" />
      <circle cx="39" cy="30" r="1.5" fill="#ffee66" opacity="0.5" />
      <circle cx="36" cy="35" r="3.5" fill="#008800" />
      <circle cx="36" cy="35" r="1.5" fill="#44ff44" opacity="0.5" />
      <circle cx="30" cy="34" r="3.5" fill="#000099" />
      <circle cx="30" cy="34" r="1.5" fill="#4444ff" opacity="0.5" />
      {/* Start/select */}
      <rect x="21" y="30" width="4" height="2" rx="1" fill="#666" />
      <rect x="26" y="30" width="4" height="2" rx="1" fill="#666" />
      {/* Joystick ball */}
      <circle
        cx="24"
        cy="10"
        r="8"
        fill="url(#gc-ball)"
        filter="url(#gc-shadow)"
      />
      <circle cx="21" cy="7" r="2.5" fill="#ff9070" opacity="0.5" />
      {/* Stick shaft */}
      <rect x="22" y="16" width="4" height="6" rx="1" fill="#555" />
    </svg>
  );
}

function IconLiveChat() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="lc-bubble1"
          x1="2"
          y1="2"
          x2="36"
          y2="28"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#2a60e0" />
          <stop offset="100%" stopColor="#0a1a80" />
        </linearGradient>
        <linearGradient
          id="lc-bubble2"
          x1="16"
          y1="22"
          x2="46"
          y2="44"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#1a8a20" />
          <stop offset="100%" stopColor="#0a4010" />
        </linearGradient>
        <filter id="lc-shadow">
          <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="#00000060" />
        </filter>
      </defs>
      {/* Blue speech bubble */}
      <rect
        x="2"
        y="2"
        width="32"
        height="22"
        rx="4"
        fill="url(#lc-bubble1)"
        filter="url(#lc-shadow)"
      />
      <rect
        x="3"
        y="3"
        width="20"
        height="3"
        rx="2"
        fill="#6090ff"
        opacity="0.3"
      />
      <rect
        x="6"
        y="8"
        width="22"
        height="3"
        rx="1.5"
        fill="#fff"
        opacity="0.9"
      />
      <rect
        x="6"
        y="13"
        width="16"
        height="3"
        rx="1.5"
        fill="#a0c0ff"
        opacity="0.8"
      />
      <rect
        x="6"
        y="18"
        width="18"
        height="3"
        rx="1.5"
        fill="#a0c0ff"
        opacity="0.8"
      />
      {/* Tail */}
      <path d="M6 24 L2 30 L12 24Z" fill="#1230a0" />
      {/* Green speech bubble */}
      <rect
        x="16"
        y="26"
        width="30"
        height="18"
        rx="4"
        fill="url(#lc-bubble2)"
        filter="url(#lc-shadow)"
      />
      <rect
        x="17"
        y="27"
        width="18"
        height="2"
        rx="1"
        fill="#44ff44"
        opacity="0.2"
      />
      <rect
        x="19"
        y="30"
        width="24"
        height="3"
        rx="1.5"
        fill="#44ff44"
        opacity="0.85"
      />
      <rect
        x="19"
        y="36"
        width="18"
        height="3"
        rx="1.5"
        fill="#44ff44"
        opacity="0.6"
      />
      {/* Tail */}
      <path d="M42 28 L46 22 L36 28Z" fill="#0a5010" />
      {/* Online dot */}
      <circle cx="42" cy="6" r="4" fill="#00ff66" />
      <circle cx="41" cy="5" r="1.5" fill="#aaffcc" opacity="0.7" />
    </svg>
  );
}

function IconNotes() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="notes-paper"
          x1="6"
          y1="2"
          x2="42"
          y2="46"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#fffff0" />
          <stop offset="100%" stopColor="#e8e0b0" />
        </linearGradient>
        <linearGradient
          id="notes-bind"
          x1="6"
          y1="2"
          x2="6"
          y2="10"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#d0c878" />
          <stop offset="100%" stopColor="#a09040" />
        </linearGradient>
        <filter id="notes-shadow">
          <feDropShadow dx="2" dy="2" stdDeviation="2" floodColor="#00000050" />
        </filter>
      </defs>
      {/* Paper shadow */}
      <rect
        x="10"
        y="6"
        width="34"
        height="40"
        rx="2"
        fill="#c8b880"
        opacity="0.5"
      />
      {/* Paper */}
      <rect
        x="6"
        y="2"
        width="34"
        height="42"
        rx="2"
        fill="url(#notes-paper)"
        filter="url(#notes-shadow)"
      />
      <rect x="7" y="3" width="20" height="2" fill="#fff" opacity="0.7" />
      {/* Binding */}
      <rect x="6" y="2" width="34" height="7" rx="2" fill="url(#notes-bind)" />
      <rect x="7" y="3" width="32" height="1" fill="#e8dc98" opacity="0.6" />
      {/* Spiral holes */}
      {[11, 18, 25, 32].map((x) => (
        <ellipse key={x} cx={x} cy="5.5" rx="2" ry="2.5" fill="#505030" />
      ))}
      {/* Red margin line */}
      <rect
        x="14"
        y="11"
        width="1.5"
        height="30"
        fill="#ff6060"
        opacity="0.7"
      />
      {/* Ruled lines */}
      <rect
        x="17"
        y="13"
        width="19"
        height="1.5"
        rx="0.75"
        fill="#c0b878"
        opacity="0.5"
      />
      <rect
        x="17"
        y="19"
        width="19"
        height="1.5"
        rx="0.75"
        fill="#c0b878"
        opacity="0.5"
      />
      <rect
        x="17"
        y="25"
        width="19"
        height="1.5"
        rx="0.75"
        fill="#c0b878"
        opacity="0.5"
      />
      <rect
        x="17"
        y="31"
        width="19"
        height="1.5"
        rx="0.75"
        fill="#c0b878"
        opacity="0.5"
      />
      {/* Text content */}
      <rect x="17" y="11" width="16" height="1.5" rx="0.75" fill="#303030" />
      <rect x="17" y="17" width="11" height="1.5" rx="0.75" fill="#303030" />
      <rect x="17" y="23" width="14" height="1.5" rx="0.75" fill="#303030" />
      <rect x="17" y="29" width="8" height="1.5" rx="0.75" fill="#303030" />
      {/* Pencil */}
      <rect x="36" y="10" width="5" height="24" rx="1" fill="#ffd700" />
      <rect x="37" y="11" width="1" height="22" fill="#ffe866" opacity="0.5" />
      <rect x="36" y="8" width="5" height="3" rx="1" fill="#c0c0c0" />
      <rect x="36" y="6" width="5" height="3" rx="1" fill="#ffaaaa" />
      <rect x="37" y="33" width="3" height="3" rx="1" fill="#c88840" />
      <path d="M37 36 L38.5 40 L40 36Z" fill="#404020" />
    </svg>
  );
}

function IconPaint() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="paint-palette" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#d4a840" />
          <stop offset="100%" stopColor="#7a4810" />
        </radialGradient>
        <linearGradient
          id="paint-brush"
          x1="34"
          y1="0"
          x2="40"
          y2="40"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#c06030" />
          <stop offset="100%" stopColor="#5a2808" />
        </linearGradient>
        <filter id="paint-shadow">
          <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="#00000060" />
        </filter>
      </defs>
      {/* Palette oval */}
      <ellipse
        cx="21"
        cy="28"
        rx="18"
        ry="16"
        fill="url(#paint-palette)"
        filter="url(#paint-shadow)"
      />
      <ellipse cx="19" cy="25" rx="10" ry="7" fill="#c49030" opacity="0.3" />
      {/* Thumb hole */}
      <ellipse cx="27" cy="36" rx="5" ry="4" fill="#7a4010" />
      <ellipse cx="27" cy="36" rx="3" ry="2.5" fill="#4a2008" />
      {/* Color blobs */}
      <circle cx="10" cy="22" r="4" fill="#dd2222" />
      <circle cx="10" cy="22" r="1.5" fill="#ff7070" opacity="0.6" />
      <circle cx="17" cy="16" r="4" fill="#2244dd" />
      <circle cx="17" cy="16" r="1.5" fill="#7090ff" opacity="0.6" />
      <circle cx="25" cy="14" r="4" fill="#ddcc00" />
      <circle cx="25" cy="14" r="1.5" fill="#ffee66" opacity="0.6" />
      <circle cx="10" cy="32" r="4" fill="#118800" />
      <circle cx="10" cy="32" r="1.5" fill="#44cc44" opacity="0.6" />
      <circle cx="16" cy="38" r="4" fill="#9900cc" />
      <circle cx="16" cy="38" r="1.5" fill="#cc66ff" opacity="0.6" />
      <circle cx="7" cy="28" r="3" fill="#ee6600" />
      <circle cx="7" cy="28" r="1" fill="#ffaa44" opacity="0.6" />
      {/* Paintbrush */}
      <rect
        x="33"
        y="1"
        width="6"
        height="30"
        rx="2"
        fill="url(#paint-brush)"
      />
      <rect x="34" y="2" width="2" height="28" fill="#d08050" opacity="0.3" />
      <rect x="32" y="28" width="8" height="5" rx="1" fill="#c0c0c0" />
      <rect x="33" y="29" width="2" height="3" fill="#e8e8e8" opacity="0.6" />
      <rect x="33" y="33" width="6" height="12" rx="1" fill="#1a1a1a" />
      <rect x="33" y="33" width="2" height="10" fill="#333" opacity="0.5" />
      <path d="M34 44 L36 48 L38 44Z" fill="#111" />
      {/* Paint drip on tip */}
      <ellipse cx="35" cy="43" rx="2" ry="1" fill="#dd2222" opacity="0.8" />
    </svg>
  );
}

function IconMail() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="mail-env"
          x1="2"
          y1="8"
          x2="46"
          y2="40"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#e0e8ff" />
          <stop offset="100%" stopColor="#a0b0ee" />
        </linearGradient>
        <linearGradient
          id="mail-flap"
          x1="2"
          y1="8"
          x2="24"
          y2="24"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#2244dd" />
          <stop offset="100%" stopColor="#0011aa" />
        </linearGradient>
        <filter id="mail-shadow">
          <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="#00000060" />
        </filter>
      </defs>
      {/* Envelope */}
      <rect
        x="2"
        y="10"
        width="44"
        height="30"
        rx="3"
        fill="url(#mail-env)"
        filter="url(#mail-shadow)"
      />
      <rect x="3" y="11" width="32" height="3" fill="#fff" opacity="0.4" />
      {/* Envelope flap (V fold) */}
      <path d="M2 10 L24 26 L46 10Z" fill="url(#mail-flap)" opacity="0.9" />
      <path
        d="M3 11 L24 25 L45 11"
        stroke="#4466ff"
        strokeWidth="0.5"
        fill="none"
      />
      <circle cx="24" cy="26" r="3" fill="#1133bb" />
      <circle cx="24" cy="26" r="1.5" fill="#4466ff" opacity="0.7" />
      {/* Bottom corner folds */}
      <path d="M2 40 L18 27" stroke="#8090cc" strokeWidth="1" opacity="0.5" />
      <path d="M46 40 L30 27" stroke="#8090cc" strokeWidth="1" opacity="0.5" />
      {/* Stamp */}
      <rect x="33" y="14" width="10" height="10" rx="1" fill="#cc2222" />
      <rect x="34" y="15" width="8" height="8" fill="#ff5555" />
      <rect x="35" y="16" width="6" height="6" fill="#ff8888" />
      <circle cx="37" cy="19" r="2" fill="#ffbbbb" />
      <rect x="32" y="25" width="4" height="1" fill="#cc2222" />
      <rect x="37" y="25" width="4" height="1" fill="#cc2222" />
    </svg>
  );
}

function IconInternetExplorer() {
  return (
    <img
      src="/assets/generated/ie-logo-transparent.dim_48x48.png"
      alt="Internet Explorer"
      width={48}
      height={48}
      style={{ imageRendering: "auto", objectFit: "contain" }}
    />
  );
}

function IconFriends() {
  return (
    <div
      style={{
        width: 48,
        height: 48,
        background: "#c0c0c0",
        borderRadius: 4,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <img
        src="/assets/generated/friends-icon-transparent.dim_48x48.png"
        alt="Friends"
        width={48}
        height={48}
        style={{ imageRendering: "auto", objectFit: "contain" }}
      />
    </div>
  );
}

const DESKTOP_ICONS: { appId: AppId; label: string; icon: ReactNode }[] = [
  { appId: "my-computer", label: "My Computer", icon: <IconMyComputer /> },
  { appId: "network", label: "Computer Network", icon: <IconNetwork /> },
  { appId: "game-center", label: "Game Center", icon: <IconGameCenter /> },
  { appId: "live-chat", label: "Live Chat", icon: <IconLiveChat /> },
  { appId: "notes", label: "Notes", icon: <IconNotes /> },
  { appId: "paint", label: "Onyx Paint", icon: <IconPaint /> },
  { appId: "mail", label: "Mail", icon: <IconMail /> },
  {
    appId: "internet-explorer",
    label: "Internet Explorer",
    icon: <IconInternetExplorer />,
  },
  { appId: "friends", label: "Friends", icon: <IconFriends /> },
];

function AppContent({
  appId,
  user,
  userStore,
  onUpdateProfile,
}: {
  appId: AppId;
  user: User;
  userStore: Map<string, { username: string; password: string; user: User }>;
  onUpdateProfile: (
    updates: Partial<
      Pick<
        User,
        | "bio"
        | "avatarUrl"
        | "username"
        | "usernameEffect"
        | "textPlate"
        | "biography"
      >
    >,
  ) => void;
}) {
  const fallback = (
    <div
      style={{ padding: 12, fontSize: 11, fontFamily: "Tahoma, sans-serif" }}
    >
      Loading...
    </div>
  );
  switch (appId) {
    case "my-computer":
      return (
        <Suspense fallback={fallback}>
          <MyComputer user={user} onUpdateProfile={onUpdateProfile} />
        </Suspense>
      );
    case "network":
      return (
        <Suspense fallback={fallback}>
          <NetworkApp userStore={userStore} />
        </Suspense>
      );
    case "game-center":
      return (
        <Suspense fallback={fallback}>
          <GameCenter />
        </Suspense>
      );
    case "live-chat":
      return (
        <Suspense fallback={fallback}>
          <LiveChat user={user} userStore={userStore} />
        </Suspense>
      );
    case "notes":
      return (
        <Suspense fallback={fallback}>
          <NotesApp user={user} />
        </Suspense>
      );
    case "paint":
      return (
        <Suspense fallback={fallback}>
          <PaintApp />
        </Suspense>
      );
    case "mail":
      return (
        <Suspense fallback={fallback}>
          <MailApp user={user} userStore={userStore} />
        </Suspense>
      );
    case "internet-explorer":
      return (
        <Suspense fallback={fallback}>
          <InternetExplorer />
        </Suspense>
      );
    case "friends":
      return (
        <Suspense fallback={fallback}>
          <FriendsApp user={user} userStore={userStore} />
        </Suspense>
      );
    default:
      return <div style={{ padding: 12 }}>App not found.</div>;
  }
}

export function Desktop({
  user,
  windows,
  onOpenApp,
  onCloseWindow,
  onMinimizeWindow,
  onMaximizeWindow,
  onFocusWindow,
  onMoveWindow,
  onLogout,
  userStore,
  onUpdateProfile,
}: Props) {
  return (
    <div
      data-ocid="desktop.screen"
      style={{
        position: "fixed",
        inset: 0,
        backgroundImage: "url('/assets/images/bliss.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        overflow: "hidden",
        userSelect: "none",
      }}
    >
      {/* Desktop icons — left column */}
      <div
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {DESKTOP_ICONS.map((icon, i) => (
          <DesktopIcon
            key={icon.appId}
            appId={icon.appId}
            label={icon.label}
            icon={icon.icon}
            onDoubleClick={onOpenApp}
            index={i + 1}
          />
        ))}
      </div>

      {/* Open windows */}
      {windows.map((win) => (
        <Window
          key={win.id}
          window={win}
          onClose={onCloseWindow}
          onMinimize={onMinimizeWindow}
          onMaximize={onMaximizeWindow}
          onFocus={onFocusWindow}
          onMove={onMoveWindow}
        >
          <AppContent
            appId={win.appId}
            user={user}
            userStore={userStore}
            onUpdateProfile={onUpdateProfile}
          />
        </Window>
      ))}

      {/* Taskbar */}
      <Taskbar
        windows={windows}
        user={user}
        onOpenApp={onOpenApp}
        onRestoreWindow={(id) => {
          onMinimizeWindow(id); // toggle off minimize
          onFocusWindow(id);
        }}
        onFocusWindow={onFocusWindow}
        onLogout={onLogout}
      />
    </div>
  );
}
