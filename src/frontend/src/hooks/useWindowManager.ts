import { useCallback, useRef, useState } from "react";
import type { AppId, WindowState } from "../types";

let zCounter = 100;

const DEFAULT_SIZES: Record<AppId, { width: number; height: number }> = {
  "my-computer": { width: 520, height: 400 },
  network: { width: 480, height: 360 },
  "game-center": { width: 640, height: 500 },
  "live-chat": { width: 600, height: 480 },
  notes: { width: 500, height: 420 },
  paint: { width: 640, height: 520 },
  mail: { width: 560, height: 440 },
  "internet-explorer": { width: 680, height: 520 },
  friends: { width: 560, height: 460 },
};

const APP_TITLES: Record<AppId, string> = {
  "my-computer": "My Computer",
  network: "Computer Network",
  "game-center": "Game Center",
  "live-chat": "Live Chat",
  notes: "Notes",
  paint: "Onyx Paint",
  mail: "Mail",
  "internet-explorer": "Internet Explorer",
  friends: "Friends",
};

export function useWindowManager() {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const openCountRef = useRef<Record<string, number>>({});

  const openWindow = useCallback((appId: AppId) => {
    const count = openCountRef.current[appId] ?? 0;
    openCountRef.current[appId] = count + 1;

    const id = `${appId}-${Date.now()}`;
    const size = DEFAULT_SIZES[appId];
    const offset =
      (Object.keys(openCountRef.current).indexOf(appId) + count) * 24;

    zCounter++;
    const win: WindowState = {
      id,
      appId,
      title: APP_TITLES[appId],
      isMinimized: false,
      isMaximized: false,
      x: 60 + offset,
      y: 40 + offset,
      width: size.width,
      height: size.height,
      zIndex: zCounter,
    };

    setWindows((prev) => {
      // If a window for this appId already exists and isn't minimized, just focus it
      const existing = prev.find((w) => w.appId === appId && !w.isMinimized);
      if (existing) {
        return prev.map((w) =>
          w.id === existing.id ? { ...w, zIndex: ++zCounter } : w,
        );
      }
      // Restore minimized
      const minimized = prev.find((w) => w.appId === appId && w.isMinimized);
      if (minimized) {
        return prev.map((w) =>
          w.id === minimized.id
            ? { ...w, isMinimized: false, zIndex: ++zCounter }
            : w,
        );
      }
      return [...prev, win];
    });
  }, []);

  const closeWindow = useCallback((id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMinimized: true } : w)),
    );
  }, []);

  const maximizeWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, isMaximized: !w.isMaximized } : w,
      ),
    );
  }, []);

  const focusWindow = useCallback((id: string) => {
    zCounter++;
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, zIndex: zCounter } : w)),
    );
  }, []);

  const moveWindow = useCallback((id: string, x: number, y: number) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, x, y } : w)));
  }, []);

  const resizeWindow = useCallback(
    (id: string, width: number, height: number) => {
      setWindows((prev) =>
        prev.map((w) => (w.id === id ? { ...w, width, height } : w)),
      );
    },
    [],
  );

  return {
    windows,
    openWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    focusWindow,
    moveWindow,
    resizeWindow,
  };
}
