import type { ReactElement } from "react";
import { useState } from "react";

import { BreakoutGame } from "./games/BreakoutGame";
import { FroggerGame } from "./games/FroggerGame";
import { MinesweeperGame } from "./games/MinesweeperGame";
import { PacManGame } from "./games/PacManGame";
import { PongGame } from "./games/PongGame";
import { SnakeGame } from "./games/SnakeGame";
import { SpaceInvadersGame } from "./games/SpaceInvadersGame";
import { TetrisGame } from "./games/TetrisGame";

type GameId =
  | "snake"
  | "minesweeper"
  | "pong"
  | "tetris"
  | "spaceinvaders"
  | "breakout"
  | "frogger"
  | "pacman";

// 32-bit pixel art SVG icons
const ICONS: Record<GameId, ReactElement> = {
  snake: (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      style={{ imageRendering: "pixelated" }}
    >
      <title>Snake</title>
      <rect width="40" height="40" fill="#000" />
      {/* Snake body segments */}
      <rect x="4" y="20" width="8" height="8" fill="#00c000" />
      <rect x="12" y="20" width="8" height="8" fill="#008000" />
      <rect x="20" y="20" width="8" height="8" fill="#008000" />
      <rect x="20" y="12" width="8" height="8" fill="#008000" />
      {/* Snake head */}
      <rect x="28" y="12" width="8" height="8" fill="#00e000" />
      <rect x="30" y="13" width="2" height="2" fill="#fff" />
      <rect x="32" y="13" width="2" height="2" fill="#fff" />
      {/* Apple */}
      <rect x="8" y="8" width="8" height="8" fill="#e00000" />
      <rect x="10" y="6" width="2" height="2" fill="#004400" />
      <rect x="9" y="9" width="2" height="2" fill="#ff4444" />
    </svg>
  ),
  minesweeper: (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      style={{ imageRendering: "pixelated" }}
    >
      <title>Minesweeper</title>
      <rect width="40" height="40" fill="#c0c0c0" />
      {/* Grid cells */}
      {[0, 1, 2, 3].map((r) =>
        [0, 1, 2, 3].map((c) => (
          <rect
            key={`${r}-${c}`}
            x={2 + c * 9}
            y={2 + r * 9}
            width="8"
            height="8"
            fill={
              r === 1 && c === 2
                ? "#000"
                : r === 3 && c === 0
                  ? "#000"
                  : "#d4d0c8"
            }
            stroke="#808080"
            strokeWidth="0.5"
          />
        )),
      )}
      {/* Mine */}
      <rect x="20" y="16" width="4" height="4" fill="#e00" />
      <rect x="18" y="18" width="8" height="2" fill="#800" />
      <rect x="22" y="14" width="2" height="8" fill="#800" />
      <rect x="19" y="15" width="2" height="2" fill="#800" />
      <rect x="23" y="15" width="2" height="2" fill="#800" />
      <rect x="23" y="21" width="2" height="2" fill="#800" />
      <rect x="19" y="21" width="2" height="2" fill="#800" />
      {/* Flag */}
      <rect x="30" y="8" width="2" height="12" fill="#444" />
      <rect x="32" y="8" width="6" height="4" fill="#e00" />
    </svg>
  ),
  pong: (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      style={{ imageRendering: "pixelated" }}
    >
      <title>Pong</title>
      <rect width="40" height="40" fill="#000" />
      {/* Center line */}
      {[2, 8, 14, 20, 26, 32].map((y) => (
        <rect key={y} x="19" y={y} width="2" height="4" fill="#333" />
      ))}
      {/* Paddles */}
      <rect x="4" y="10" width="4" height="20" fill="#fff" />
      <rect x="32" y="12" width="4" height="20" fill="#fff" />
      {/* Ball */}
      <rect x="18" y="18" width="4" height="4" fill="#fff" />
      {/* Scores */}
      <rect x="10" y="4" width="2" height="6" fill="#888" />
      <rect x="26" y="4" width="2" height="6" fill="#888" />
      <rect x="28" y="4" width="2" height="2" fill="#888" />
      <rect x="28" y="8" width="2" height="2" fill="#888" />
    </svg>
  ),
  tetris: (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      style={{ imageRendering: "pixelated" }}
    >
      <title>Tetris</title>
      <rect width="40" height="40" fill="#111" />
      {/* I piece (cyan) */}
      <rect x="4" y="4" width="7" height="7" fill="#00f0f0" />
      <rect x="12" y="4" width="7" height="7" fill="#00f0f0" />
      <rect x="20" y="4" width="7" height="7" fill="#00f0f0" />
      <rect x="28" y="4" width="7" height="7" fill="#00f0f0" />
      {/* T piece (purple) */}
      <rect x="12" y="12" width="7" height="7" fill="#a000f0" />
      <rect x="4" y="20" width="7" height="7" fill="#a000f0" />
      <rect x="12" y="20" width="7" height="7" fill="#a000f0" />
      <rect x="20" y="20" width="7" height="7" fill="#a000f0" />
      {/* O piece (yellow) */}
      <rect x="20" y="12" width="7" height="7" fill="#f0f000" />
      <rect x="28" y="12" width="7" height="7" fill="#f0f000" />
      <rect x="20" y="20" width="0" height="0" fill="#f0f000" />
      {/* S piece (green) */}
      <rect x="20" y="28" width="7" height="7" fill="#00f000" />
      <rect x="28" y="28" width="7" height="7" fill="#00f000" />
      <rect x="4" y="28" width="7" height="7" fill="#f00000" />
      <rect x="12" y="28" width="7" height="7" fill="#f00000" />
      {/* Highlight */}
      <rect x="4" y="4" width="7" height="2" fill="rgba(255,255,255,0.3)" />
    </svg>
  ),
  spaceinvaders: (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      style={{ imageRendering: "pixelated" }}
    >
      <title>Space Invaders</title>
      <rect width="40" height="40" fill="#000" />
      {/* Stars */}
      <rect x="5" y="3" width="1" height="1" fill="#fff" />
      <rect x="15" y="7" width="1" height="1" fill="#fff" />
      <rect x="32" y="2" width="1" height="1" fill="#fff" />
      <rect x="38" y="12" width="1" height="1" fill="#fff" />
      {/* Alien body - crab style */}
      <rect x="10" y="8" width="4" height="4" fill="#0f0" />
      <rect x="26" y="8" width="4" height="4" fill="#0f0" />
      <rect x="8" y="12" width="24" height="4" fill="#0f0" />
      <rect x="12" y="16" width="4" height="4" fill="#0f0" />
      <rect x="24" y="16" width="4" height="4" fill="#0f0" />
      <rect x="16" y="16" width="8" height="4" fill="#0f0" />
      <rect x="8" y="20" width="6" height="4" fill="#0f0" />
      <rect x="26" y="20" width="6" height="4" fill="#0f0" />
      {/* Eyes */}
      <rect x="14" y="13" width="3" height="3" fill="#000" />
      <rect x="23" y="13" width="3" height="3" fill="#000" />
      {/* Player ship */}
      <rect x="18" y="34" width="4" height="3" fill="#0f0" />
      <rect x="14" y="35" width="12" height="3" fill="#0f0" />
      <rect x="10" y="36" width="20" height="2" fill="#0f0" />
      {/* Bullet */}
      <rect x="19" y="28" width="2" height="4" fill="#ff0" />
    </svg>
  ),
  breakout: (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      style={{ imageRendering: "pixelated" }}
    >
      <title>Breakout</title>
      <rect width="40" height="40" fill="#111" />
      {/* Bricks rows */}
      {[0, 1, 2].map((r) =>
        [0, 1, 2, 3].map((c) => (
          <rect
            key={`${r}-${c}`}
            x={1 + c * 10}
            y={2 + r * 6}
            width="9"
            height="5"
            fill={["#ff4444", "#ff8800", "#ffee00"][r]}
          />
        )),
      )}
      <rect x="41" y="2" width="9" height="5" fill="#ff4444" />
      {/* Ball */}
      <rect x="16" y="24" width="5" height="5" fill="#fff" />
      {/* Paddle */}
      <rect x="8" y="34" width="22" height="4" fill="#aaa" />
      <rect x="8" y="34" width="22" height="1" fill="rgba(255,255,255,0.5)" />
    </svg>
  ),
  frogger: (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      style={{ imageRendering: "pixelated" }}
    >
      <title>Frogger</title>
      <rect width="40" height="40" fill="#001a4d" />
      {/* Log */}
      <rect x="0" y="28" width="40" height="8" fill="#7a4a10" />
      <rect x="2" y="29" width="36" height="2" fill="#9a6a20" />
      {/* Road */}
      <rect x="0" y="36" width="40" height="4" fill="#333" />
      {/* Frog body */}
      <rect x="14" y="10" width="12" height="14" fill="#0c0" />
      {/* Frog head */}
      <rect x="12" y="6" width="16" height="8" fill="#0e0" />
      {/* Frog eyes */}
      <rect x="12" y="4" width="6" height="6" fill="#0e0" />
      <rect x="22" y="4" width="6" height="6" fill="#0e0" />
      <rect x="13" y="5" width="3" height="3" fill="#ff0" />
      <rect x="24" y="5" width="3" height="3" fill="#ff0" />
      <rect x="14" y="6" width="2" height="2" fill="#000" />
      <rect x="25" y="6" width="2" height="2" fill="#000" />
      {/* Legs */}
      <rect x="6" y="16" width="8" height="4" fill="#0a0" />
      <rect x="26" y="16" width="8" height="4" fill="#0a0" />
      <rect x="4" y="20" width="6" height="3" fill="#0c0" />
      <rect x="30" y="20" width="6" height="3" fill="#0c0" />
    </svg>
  ),
  pacman: (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      style={{ imageRendering: "pixelated" }}
    >
      <title>Pac-Man</title>
      <rect width="40" height="40" fill="#000" />
      {/* Maze walls (simplified) */}
      <rect x="0" y="0" width="40" height="4" fill="#00c" />
      <rect x="0" y="36" width="40" height="4" fill="#00c" />
      <rect x="0" y="0" width="4" height="40" fill="#00c" />
      <rect x="36" y="0" width="4" height="40" fill="#00c" />
      {/* Dots */}
      <rect x="8" y="18" width="3" height="3" fill="#ffdd88" />
      <rect x="18" y="18" width="3" height="3" fill="#ffdd88" />
      <rect x="28" y="18" width="3" height="3" fill="#ffdd88" />
      {/* Power pellet */}
      <rect x="6" y="8" width="5" height="5" fill="#fff" />
      {/* Pac-Man (eating pose) */}
      <rect x="8" y="22" width="16" height="14" fill="#ff0" />
      <rect x="12" y="20" width="8" height="18" fill="#ff0" />
      <rect x="16" y="19" width="4" height="4" fill="#ff0" />
      {/* Mouth */}
      <rect x="20" y="26" width="6" height="6" fill="#000" />
      <rect x="20" y="30" width="8" height="4" fill="#000" />
      {/* Eye */}
      <rect x="11" y="23" width="3" height="3" fill="#000" />
      {/* Ghost */}
      <rect x="27" y="20" width="10" height="10" fill="#ff4444" />
      <rect x="25" y="22" width="14" height="8" fill="#ff4444" />
      <rect x="25" y="30" width="3" height="4" fill="#ff4444" />
      <rect x="29" y="30" width="4" height="4" fill="#ff4444" />
      <rect x="34" y="30" width="5" height="4" fill="#ff4444" />
      <rect x="28" y="23" width="2" height="2" fill="#fff" />
      <rect x="33" y="23" width="2" height="2" fill="#fff" />
    </svg>
  ),
};

const GAMES: { id: GameId; label: string; desc: string; bg: string }[] = [
  {
    id: "snake",
    label: "Snake",
    desc: "Classic Snake — eat apples, grow longer!",
    bg: "#000",
  },
  {
    id: "minesweeper",
    label: "Minesweeper",
    desc: "Uncover all squares without hitting mines.",
    bg: "#c0c0c0",
  },
  {
    id: "pong",
    label: "Pong",
    desc: "Classic Pong — first to 7 points wins!",
    bg: "#000",
  },
  {
    id: "tetris",
    label: "Tetris",
    desc: "Stack falling tetrominoes to clear lines!",
    bg: "#111",
  },
  {
    id: "spaceinvaders",
    label: "Space Invaders",
    desc: "Shoot aliens before they reach Earth!",
    bg: "#000",
  },
  {
    id: "breakout",
    label: "Breakout",
    desc: "Smash all bricks with a bouncing ball!",
    bg: "#111",
  },
  {
    id: "frogger",
    label: "Frogger",
    desc: "Hop your frog safely across traffic and water!",
    bg: "#001a4d",
  },
  {
    id: "pacman",
    label: "Pac-Man",
    desc: "Eat all dots and dodge the ghosts!",
    bg: "#000",
  },
];

const GAME_COMPONENTS: Record<GameId, ReactElement> = {
  snake: <SnakeGame />,
  minesweeper: <MinesweeperGame />,
  pong: <PongGame />,
  tetris: <TetrisGame />,
  spaceinvaders: <SpaceInvadersGame />,
  breakout: <BreakoutGame />,
  frogger: <FroggerGame />,
  pacman: <PacManGame />,
};

export function GameCenter() {
  const [activeGame, setActiveGame] = useState<GameId | null>(null);

  if (activeGame) {
    const game = GAMES.find((g) => g.id === activeGame)!;
    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <div
          style={{
            padding: "4px 8px",
            borderBottom: "1px solid #808080",
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontFamily: "Tahoma, sans-serif",
            fontSize: 11,
          }}
        >
          <button
            type="button"
            className="btn-95"
            data-ocid="gamecenter.back_button"
            onClick={() => setActiveGame(null)}
          >
            ◀ Back
          </button>
          <strong>{game.label}</strong>
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: game.bg,
            overflow: "auto",
            padding: 8,
          }}
        >
          {GAME_COMPONENTS[activeGame]}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: 12,
        fontFamily: "Tahoma, Verdana, sans-serif",
        fontSize: 11,
        height: "100%",
        overflowY: "auto",
      }}
    >
      <div
        style={{
          marginBottom: 8,
          fontWeight: "bold",
          borderBottom: "1px solid #808080",
          paddingBottom: 4,
        }}
      >
        🕹️ Game Center — Choose a Game
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {GAMES.map((g, i) => (
          <div
            key={g.id}
            data-ocid={`gamecenter.item.${i + 1}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "6px 10px",
              background: "#c0c0c0",
              border: "2px solid",
              borderColor: "#fff #808080 #808080 #fff",
              cursor: "pointer",
            }}
          >
            <div style={{ width: 40, height: 40, flexShrink: 0 }}>
              {ICONS[g.id]}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: "bold" }}>{g.label}</div>
              <div style={{ color: "#555" }}>{g.desc}</div>
            </div>
            <button
              type="button"
              data-ocid={`gamecenter.play_button.${i + 1}`}
              className="btn-95"
              onClick={() => setActiveGame(g.id)}
            >
              ▶ Play
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
