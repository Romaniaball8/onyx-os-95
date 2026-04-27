import { useCallback, useEffect, useRef, useState } from "react";

// Classic Pac-Man: 28 cols x 31 rows
const CELL = 14;
const COLS = 28;
const ROWS = 31;
const W = COLS * CELL;
const H = ROWS * CELL + 40; // extra for HUD

const POWER_DURATION = 420; // ~7 seconds at 60fps
const GHOST_SCORE_CHAIN = [200, 400, 800, 1600];
const PACMAN_SPEED = 8; // move every N frames
const GHOST_SPEED = 10;
const GHOST_SPEED_SCARED = 16;

// Classic Pac-Man maze layout: 28 columns x 31 rows
// 0=empty path, 1=wall, 2=dot, 3=power pellet, 4=ghost house door, 5=ghost house interior
const MAZE_TEMPLATE: string[] = [
  "1111111111111111111111111111",
  "1222222222222112222222222221",
  "1211112111121121111211112011",
  "1311112111121121111211113011",
  "1211112111121121111211112011",
  "1222222222222222222222222221",
  "1211112112111111112112111201",
  "1211112112111111112112111201",
  "1222222112222112222112222221",
  "1111112111110001111011111111",
  "1111112111100000011101111111",
  "1111112110000000000011111111",
  "1111112110111441110011111111",
  "0000002000155551000200000000",
  "1111112110111111110011111111",
  "1111112110000000000011111111",
  "1111112111100000011101111111",
  "1111112111110001111011111111",
  "1222222222222112222222222221",
  "1211112111121121111211112011",
  "1211112111121121111211112011",
  "1322112222222022222222113211",
  "1112112112111111112112112111",
  "1112112112111111112112112111",
  "1222222112222112222112222221",
  "1211111111121121111111111201",
  "1211111111121121111111111201",
  "1222222222222222222222222221",
  "1111111111111111111111111111",
  "0000000000000000000000000000",
  "0000000000000000000000000000",
];

// Pac-Man start: row 23, col 14 area
// Ghost house center: rows 12-15, cols 11-16

type Dir = { x: number; y: number };
type GhostMode = "chase" | "scatter" | "frightened" | "eaten";
type GhostName = "blinky" | "pinky" | "inky" | "clyde";

interface Ghost {
  name: GhostName;
  x: number; // cell column (can be fractional during interpolation)
  y: number; // cell row
  dir: Dir;
  mode: GhostMode;
  color: string;
  scatterTarget: { x: number; y: number };
  frightenedFlash: boolean;
  eyeOnly: boolean; // returning to house
  inHouse: boolean;
  exitTimer: number; // frames before this ghost exits the house
}

function buildMap(): number[][] {
  return MAZE_TEMPLATE.map((row) => row.split("").map(Number));
}

function isWalkable(
  map: number[][],
  x: number,
  y: number,
  ghostHouseOk = false,
): boolean {
  if (x < 0 || x >= COLS || y < 0 || y >= ROWS) return false;
  const v = map[y][x];
  if (v === 1) return false;
  if (v === 4) return ghostHouseOk; // door — only ghosts can pass
  if (v === 5) return ghostHouseOk; // interior
  return true;
}

function manhattanDist(ax: number, ay: number, bx: number, by: number): number {
  return Math.abs(ax - bx) + Math.abs(ay - by);
}

function makeGhosts(): Ghost[] {
  return [
    {
      name: "blinky",
      x: 14,
      y: 11,
      dir: { x: -1, y: 0 },
      mode: "scatter",
      color: "#ff0000",
      scatterTarget: { x: COLS - 1, y: 0 },
      frightenedFlash: false,
      eyeOnly: false,
      inHouse: false,
      exitTimer: 0,
    },
    {
      name: "pinky",
      x: 13,
      y: 14,
      dir: { x: 1, y: 0 },
      mode: "scatter",
      color: "#ffb8ff",
      scatterTarget: { x: 0, y: 0 },
      frightenedFlash: false,
      eyeOnly: false,
      inHouse: true,
      exitTimer: 60,
    },
    {
      name: "inky",
      x: 11,
      y: 14,
      dir: { x: 0, y: 1 },
      mode: "scatter",
      color: "#00ffff",
      scatterTarget: { x: COLS - 1, y: ROWS - 1 },
      frightenedFlash: false,
      eyeOnly: false,
      inHouse: true,
      exitTimer: 180,
    },
    {
      name: "clyde",
      x: 16,
      y: 14,
      dir: { x: 0, y: -1 },
      mode: "scatter",
      color: "#ffb852",
      scatterTarget: { x: 0, y: ROWS - 1 },
      frightenedFlash: false,
      eyeOnly: false,
      inHouse: true,
      exitTimer: 300,
    },
  ];
}

// Ghost chase target computation
function chaseTarget(
  ghost: Ghost,
  pac: { x: number; y: number; dir: Dir },
  blinky: Ghost,
): { x: number; y: number } {
  switch (ghost.name) {
    case "blinky":
      return { x: pac.x, y: pac.y };
    case "pinky": {
      // 4 tiles ahead of pac-man
      const tx = pac.x + pac.dir.x * 4;
      const ty = pac.y + pac.dir.y * 4;
      return {
        x: Math.max(0, Math.min(COLS - 1, tx)),
        y: Math.max(0, Math.min(ROWS - 1, ty)),
      };
    }
    case "inky": {
      // 2 tiles ahead of pac-man, then double the vector from blinky
      const px2 = pac.x + pac.dir.x * 2;
      const py2 = pac.y + pac.dir.y * 2;
      const tx = px2 + (px2 - blinky.x);
      const ty = py2 + (py2 - blinky.y);
      return {
        x: Math.max(0, Math.min(COLS - 1, tx)),
        y: Math.max(0, Math.min(ROWS - 1, ty)),
      };
    }
    case "clyde": {
      // Chase when far (>8), scatter when close
      const dist = manhattanDist(ghost.x, ghost.y, pac.x, pac.y);
      if (dist > 8) return { x: pac.x, y: pac.y };
      return ghost.scatterTarget;
    }
  }
}

function moveGhost(
  ghost: Ghost,
  map: number[][],
  pac: { x: number; y: number; dir: Dir },
  blinky: Ghost,
) {
  // Ghosts exiting house move toward exit door then up
  if (ghost.inHouse) {
    // Move toward column 14 then up out of house
    const targetX = 14;
    const targetY = 11; // just outside door
    if (ghost.x !== targetX) {
      const dx = targetX > ghost.x ? 1 : -1;
      ghost.x += dx;
    } else if (ghost.y > targetY) {
      ghost.y -= 1;
    } else {
      ghost.inHouse = false;
      ghost.dir = { x: -1, y: 0 };
    }
    return;
  }

  // Eaten ghosts return to house
  if (ghost.mode === "eaten") {
    // Navigate toward ghost house door
    const doorX = 14;
    const doorY = 12;
    if (ghost.x === doorX && ghost.y === doorY) {
      // Entered house
      ghost.y = 14;
      ghost.mode = "scatter";
      ghost.eyeOnly = false;
      ghost.inHouse = true;
      ghost.exitTimer = 120;
      return;
    }
    // Simple pathfinding: move toward door
    const dirs: Dir[] = [
      { x: 1, y: 0 },
      { x: -1, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: -1 },
    ];
    const possible = dirs.filter((d) => {
      const nx = ghost.x + d.x;
      const ny = ghost.y + d.y;
      return isWalkable(map, nx, ny, true);
    });
    if (possible.length > 0) {
      const best = possible.reduce((a, b) => {
        const da = manhattanDist(ghost.x + a.x, ghost.y + a.y, doorX, doorY);
        const db = manhattanDist(ghost.x + b.x, ghost.y + b.y, doorX, doorY);
        return da < db ? a : b;
      });
      ghost.dir = best;
      ghost.x += best.x;
      ghost.y += best.y;
      // Tunnel warp
      if (ghost.x < 0) ghost.x = COLS - 1;
      if (ghost.x >= COLS) ghost.x = 0;
    }
    return;
  }

  // Normal movement: pick best direction at intersections
  const dirs: Dir[] = [
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: -1 },
  ];
  // Never reverse direction (unless just turned frightened)
  const possible = dirs.filter((d) => {
    if (d.x === -ghost.dir.x && d.y === -ghost.dir.y) return false;
    const nx = ghost.x + d.x;
    const ny = ghost.y + d.y;
    return isWalkable(map, nx, ny, false);
  });

  if (possible.length === 0) {
    // Dead end - allow reversal
    const rev = dirs.find((d) =>
      isWalkable(map, ghost.x + d.x, ghost.y + d.y, false),
    );
    if (rev) {
      ghost.dir = rev;
      ghost.x += rev.x;
      ghost.y += rev.y;
    }
    return;
  }

  let target: { x: number; y: number };
  if (ghost.mode === "frightened") {
    // Random movement
    const chosen = possible[Math.floor(Math.random() * possible.length)];
    ghost.dir = chosen;
    ghost.x += chosen.x;
    ghost.y += chosen.y;
    if (ghost.x < 0) ghost.x = COLS - 1;
    if (ghost.x >= COLS) ghost.x = 0;
    return;
  }

  if (ghost.mode === "scatter") {
    target = ghost.scatterTarget;
  } else {
    target = chaseTarget(ghost, pac, blinky);
  }

  const best = possible.reduce((a, b) => {
    const da = manhattanDist(ghost.x + a.x, ghost.y + a.y, target.x, target.y);
    const db = manhattanDist(ghost.x + b.x, ghost.y + b.y, target.x, target.y);
    return da < db ? a : b;
  });
  ghost.dir = best;
  ghost.x += best.x;
  ghost.y += best.y;
  if (ghost.x < 0) ghost.x = COLS - 1;
  if (ghost.x >= COLS) ghost.x = 0;
}

function drawGhost(ctx: CanvasRenderingContext2D, ghost: Ghost, frame: number) {
  const px = ghost.x * CELL + 1;
  const py = ghost.y * CELL + 40; // HUD offset
  const r = CELL / 2 - 1;
  const cx = px + r + 1;
  const cy = py + r + 1;

  if (ghost.mode === "eaten") {
    // Draw eyes only
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.ellipse(cx - 3, cy - 1, 3, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(cx + 3, cy - 1, 3, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#00f";
    ctx.beginPath();
    ctx.arc(cx - 2 + ghost.dir.x, cy - 1 + ghost.dir.y, 1.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx + 4 + ghost.dir.x, cy - 1 + ghost.dir.y, 1.5, 0, Math.PI * 2);
    ctx.fill();
    return;
  }

  const flash = ghost.frightenedFlash && Math.floor(frame / 8) % 2 === 0;
  const bodyColor =
    ghost.mode === "frightened" ? (flash ? "#fff" : "#0000ff") : ghost.color;

  ctx.fillStyle = bodyColor;
  // Ghost body: half circle top + wavy bottom
  ctx.beginPath();
  ctx.arc(cx, cy, r, Math.PI, 0, false);
  // Wavy bottom
  const bottom = py + CELL - 1;
  ctx.lineTo(px + CELL - 2, bottom);
  const waveW = (CELL - 2) / 3;
  for (let i = 0; i < 3; i++) {
    const wx = px + CELL - 2 - i * waveW;
    ctx.lineTo(wx - waveW * 0.5, bottom - 3);
    ctx.lineTo(wx - waveW, bottom);
  }
  ctx.lineTo(px + 1, bottom);
  ctx.closePath();
  ctx.fill();

  if (ghost.mode === "frightened") {
    // Frightened face
    ctx.fillStyle = flash ? "#f00" : "#ffb8ff";
    // Eyes (dots)
    ctx.beginPath();
    ctx.arc(cx - 3, cy - 1, 1.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx + 3, cy - 1, 1.5, 0, Math.PI * 2);
    ctx.fill();
    // Wavy mouth
    ctx.strokeStyle = flash ? "#f00" : "#ffb8ff";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx - 4, cy + 3);
    ctx.lineTo(cx - 2, cy + 1);
    ctx.lineTo(cx, cy + 3);
    ctx.lineTo(cx + 2, cy + 1);
    ctx.lineTo(cx + 4, cy + 3);
    ctx.stroke();
  } else {
    // Normal eyes
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.ellipse(cx - 3, cy - 1, 2.5, 3.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(cx + 3, cy - 1, 2.5, 3.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#00b";
    ctx.beginPath();
    ctx.arc(
      cx - 3 + ghost.dir.x * 1.5,
      cy - 1 + ghost.dir.y * 1.5,
      1.5,
      0,
      Math.PI * 2,
    );
    ctx.fill();
    ctx.beginPath();
    ctx.arc(
      cx + 3 + ghost.dir.x * 1.5,
      cy - 1 + ghost.dir.y * 1.5,
      1.5,
      0,
      Math.PI * 2,
    );
    ctx.fill();
  }
}

function drawPacman(
  ctx: CanvasRenderingContext2D,
  pac: { x: number; y: number; dir: Dir; mouth: number },
  deathAnim: number,
) {
  const px = pac.x * CELL + CELL / 2;
  const py = pac.y * CELL + CELL / 2 + 40;
  const r = CELL / 2 - 1;

  if (deathAnim > 0) {
    // Death animation: pac shrinks/closes
    const progress = deathAnim / 60;
    const startAngle = Math.PI * progress;
    ctx.fillStyle = "#ff0";
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.arc(
      px,
      py,
      r * (1 - progress * 0.5),
      startAngle,
      Math.PI * 2 - startAngle,
    );
    ctx.closePath();
    ctx.fill();
    return;
  }

  const angle = Math.atan2(pac.dir.y, pac.dir.x);
  const mouthAngle = (pac.mouth / 5) * 0.45;
  ctx.fillStyle = "#ffff00";
  ctx.beginPath();
  ctx.moveTo(px, py);
  ctx.arc(px, py, r, angle + mouthAngle, angle + Math.PI * 2 - mouthAngle);
  ctx.closePath();
  ctx.fill();
}

function drawMaze(
  ctx: CanvasRenderingContext2D,
  map: number[][],
  frame: number,
) {
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const v = map[row][col];
      const px = col * CELL;
      const py = row * CELL + 40;

      if (v === 1) {
        // Wall fill
        ctx.fillStyle = "#000080";
        ctx.fillRect(px, py, CELL, CELL);
        // Draw wall borders - check neighbors for more realistic look
        ctx.strokeStyle = "#0000ff";
        ctx.lineWidth = 1.5;

        // Top border
        if (row === 0 || map[row - 1]?.[col] !== 1) {
          ctx.beginPath();
          ctx.moveTo(px + 1, py + 1);
          ctx.lineTo(px + CELL - 1, py + 1);
          ctx.stroke();
        }
        // Bottom border
        if (row === ROWS - 1 || map[row + 1]?.[col] !== 1) {
          ctx.beginPath();
          ctx.moveTo(px + 1, py + CELL - 1);
          ctx.lineTo(px + CELL - 1, py + CELL - 1);
          ctx.stroke();
        }
        // Left border
        if (col === 0 || map[row]?.[col - 1] !== 1) {
          ctx.beginPath();
          ctx.moveTo(px + 1, py + 1);
          ctx.lineTo(px + 1, py + CELL - 1);
          ctx.stroke();
        }
        // Right border
        if (col === COLS - 1 || map[row]?.[col + 1] !== 1) {
          ctx.beginPath();
          ctx.moveTo(px + CELL - 1, py + 1);
          ctx.lineTo(px + CELL - 1, py + CELL - 1);
          ctx.stroke();
        }
      } else if (v === 4) {
        // Ghost house door
        ctx.fillStyle = "#000";
        ctx.fillRect(px, py, CELL, CELL);
        ctx.fillStyle = "#ffb8ae";
        ctx.fillRect(px + 1, py + CELL / 2 - 1, CELL - 2, 3);
      } else if (v === 5) {
        // Ghost house interior
        ctx.fillStyle = "#000";
        ctx.fillRect(px, py, CELL, CELL);
      } else if (v === 2) {
        // Dot
        ctx.fillStyle = "#000";
        ctx.fillRect(px, py, CELL, CELL);
        ctx.fillStyle = "#ffdd99";
        ctx.beginPath();
        ctx.arc(px + CELL / 2, py + CELL / 2, 2, 0, Math.PI * 2);
        ctx.fill();
      } else if (v === 3) {
        // Power pellet — pulsing
        const pulse = 0.8 + 0.2 * Math.sin(frame * 0.1);
        ctx.fillStyle = "#000";
        ctx.fillRect(px, py, CELL, CELL);
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(px + CELL / 2, py + CELL / 2, 5 * pulse, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Empty path
        ctx.fillStyle = "#000";
        ctx.fillRect(px, py, CELL, CELL);
      }
    }
  }
}

function drawHUD(
  ctx: CanvasRenderingContext2D,
  score: number,
  lives: number,
  level: number,
) {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, W, 40);
  // Score
  ctx.fillStyle = "#fff";
  ctx.font = "bold 11px 'Courier New', monospace";
  ctx.textAlign = "left";
  ctx.fillText("1UP", 4, 12);
  ctx.fillStyle = "#fff";
  ctx.fillText(score.toString().padStart(6, "0"), 4, 26);
  // Level
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.fillText(`LEVEL ${level}`, W / 2, 20);
  // Lives (pac-man icons)
  ctx.textAlign = "right";
  ctx.fillText("LIVES", W - 4, 12);
  for (let i = 0; i < lives; i++) {
    const lx = W - 10 - i * 16;
    const ly = 26;
    ctx.fillStyle = "#ff0";
    ctx.beginPath();
    ctx.moveTo(lx, ly);
    ctx.arc(lx, ly, 6, 0.3, Math.PI * 2 - 0.3);
    ctx.closePath();
    ctx.fill();
  }
}

export function PacManGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mapRef = useRef<number[][]>(buildMap());
  const pacRef = useRef({
    x: 14,
    y: 23,
    dir: { x: 0, y: 0 } as Dir,
    nextDir: { x: -1, y: 0 } as Dir,
    mouth: 0,
    mouthOpen: true,
  });
  const ghostsRef = useRef<Ghost[]>(makeGhosts());
  const scoreRef = useRef(0);
  const livesRef = useRef(3);
  const levelRef = useRef(1);
  const powerRef = useRef(0);
  const ghostEatChainRef = useRef(0);
  const frameRef = useRef(0);
  const aliveRef = useRef(false);
  const rafRef = useRef(0);
  const deathAnimRef = useRef(0);
  const modeTimerRef = useRef(0);
  const scatterRef = useRef(true); // starts in scatter
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [status, setStatus] = useState<
    "idle" | "running" | "won" | "dead" | "dying"
  >("idle");

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, W, H);

    drawMaze(ctx, mapRef.current, frameRef.current);

    for (const g of ghostsRef.current) {
      drawGhost(ctx, g, frameRef.current);
    }

    if (deathAnimRef.current > 0) {
      drawPacman(ctx, pacRef.current, deathAnimRef.current);
    } else {
      drawPacman(ctx, pacRef.current, 0);
    }

    drawHUD(ctx, scoreRef.current, livesRef.current, levelRef.current);
  }, []);

  const resetPositions = useCallback(() => {
    pacRef.current = {
      x: 14,
      y: 23,
      dir: { x: 0, y: 0 },
      nextDir: { x: -1, y: 0 },
      mouth: 0,
      mouthOpen: true,
    };
    ghostsRef.current = makeGhosts();
    powerRef.current = 0;
    ghostEatChainRef.current = 0;
  }, []);

  const startLevel = useCallback(() => {
    mapRef.current = buildMap();
    resetPositions();
    frameRef.current = 0;
    modeTimerRef.current = 0;
    scatterRef.current = true;
  }, [resetPositions]);

  const loop = useCallback(() => {
    if (!aliveRef.current) return;
    frameRef.current++;

    // Death animation
    if (deathAnimRef.current > 0) {
      deathAnimRef.current--;
      draw();
      if (deathAnimRef.current === 0) {
        livesRef.current--;
        setLives(livesRef.current);
        if (livesRef.current <= 0) {
          aliveRef.current = false;
          setStatus("dead");
          draw();
          return;
        }
        // Respawn
        resetPositions();
      }
      rafRef.current = requestAnimationFrame(loop);
      return;
    }

    const p = pacRef.current;

    // Scatter/chase mode cycling: scatter 7s → chase 20s → scatter 7s → chase 20s → chase forever
    modeTimerRef.current++;
    const modeCycle = [420, 1200, 420, 1200, 420, 1200, 420]; // frames
    let cumulative = 0;
    let newScatter = false;
    for (let i = 0; i < modeCycle.length; i++) {
      cumulative += modeCycle[i];
      if (modeTimerRef.current < cumulative) {
        newScatter = i % 2 === 0;
        break;
      }
    }
    if (newScatter !== scatterRef.current) {
      scatterRef.current = newScatter;
      // Change modes for non-frightened, non-eaten ghosts
      for (const g of ghostsRef.current) {
        if (g.mode !== "frightened" && g.mode !== "eaten" && !g.inHouse) {
          g.mode = newScatter ? "scatter" : "chase";
          // Reverse direction on mode change
          g.dir = { x: -g.dir.x, y: -g.dir.y };
        }
      }
    }

    // Ghost exit timers
    for (const g of ghostsRef.current) {
      if (g.inHouse && g.exitTimer > 0) {
        g.exitTimer--;
        if (g.exitTimer === 0) {
          // Start exiting
        }
      }
    }

    // Power pellet flash warning
    if (powerRef.current > 0) {
      powerRef.current--;
      if (powerRef.current <= 120) {
        for (const g of ghostsRef.current) {
          if (g.mode === "frightened") g.frightenedFlash = true;
        }
      }
      if (powerRef.current === 0) {
        ghostEatChainRef.current = 0;
        for (const g of ghostsRef.current) {
          if (g.mode === "frightened") {
            g.mode = scatterRef.current ? "scatter" : "chase";
            g.frightenedFlash = false;
          }
        }
      }
    }

    // Mouth animation
    if (frameRef.current % 3 === 0) {
      if (p.mouthOpen) {
        p.mouth = Math.min(p.mouth + 1, 5);
        if (p.mouth >= 5) p.mouthOpen = false;
      } else {
        p.mouth = Math.max(p.mouth - 1, 0);
        if (p.mouth <= 0) p.mouthOpen = true;
      }
    }

    // Try queued direction
    if (isWalkable(mapRef.current, p.x + p.nextDir.x, p.y + p.nextDir.y)) {
      p.dir = { ...p.nextDir };
    }

    // Move pac-man
    const pacSpeed = PACMAN_SPEED;
    if (frameRef.current % pacSpeed === 0) {
      const nx = p.x + p.dir.x;
      const ny = p.y + p.dir.y;

      // Tunnel warp
      if (p.dir.x === -1 && p.x === 0) {
        p.x = COLS - 1;
      } else if (p.dir.x === 1 && p.x === COLS - 1) {
        p.x = 0;
      } else if (isWalkable(mapRef.current, nx, ny)) {
        p.x = nx;
        p.y = ny;
      }

      // Eat dot
      const cell = mapRef.current[p.y]?.[p.x];
      if (cell === 2) {
        mapRef.current[p.y][p.x] = 0;
        scoreRef.current += 10;
        setScore(scoreRef.current);
      } else if (cell === 3) {
        mapRef.current[p.y][p.x] = 0;
        scoreRef.current += 50;
        setScore(scoreRef.current);
        powerRef.current = POWER_DURATION;
        ghostEatChainRef.current = 0;
        for (const g of ghostsRef.current) {
          if (g.mode !== "eaten") {
            g.mode = "frightened";
            g.frightenedFlash = false;
            // Reverse direction
            g.dir = { x: -g.dir.x, y: -g.dir.y };
          }
        }
      }
    }

    // Move ghosts
    const ghostSpeed = ghostsRef.current.some(
      (g) => g.mode === "frightened" && !g.inHouse,
    )
      ? GHOST_SPEED_SCARED
      : GHOST_SPEED;

    if (frameRef.current % ghostSpeed === 0) {
      const blinky = ghostsRef.current[0];
      for (const g of ghostsRef.current) {
        if (g.inHouse && g.exitTimer > 0) continue; // waiting
        moveGhost(g, mapRef.current, p, blinky);
      }
    }

    // Ghost collision
    for (const g of ghostsRef.current) {
      if (g.x === p.x && g.y === p.y && !g.inHouse) {
        if (g.mode === "frightened") {
          // Eat ghost
          g.mode = "eaten";
          g.frightenedFlash = false;
          g.eyeOnly = true;
          const pts = GHOST_SCORE_CHAIN[Math.min(ghostEatChainRef.current, 3)];
          ghostEatChainRef.current = Math.min(ghostEatChainRef.current + 1, 3);
          scoreRef.current += pts;
          setScore(scoreRef.current);
        } else if (g.mode !== "eaten") {
          // Pac-man dies
          deathAnimRef.current = 60;
          setStatus("dying");
          // Freeze pac
          p.dir = { x: 0, y: 0 };
          // Continue loop for death animation
          draw();
          rafRef.current = requestAnimationFrame(loop);
          return;
        }
      }
    }

    // Win check
    if (!mapRef.current.some((row) => row.some((v) => v === 2 || v === 3))) {
      aliveRef.current = false;
      levelRef.current++;
      setLevel(levelRef.current);
      setStatus("won");
      draw();
      return;
    }

    draw();
    rafRef.current = requestAnimationFrame(loop);
  }, [draw, resetPositions]);

  const startGame = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    scoreRef.current = 0;
    livesRef.current = 3;
    levelRef.current = 1;
    setScore(0);
    setLives(3);
    setLevel(1);
    deathAnimRef.current = 0;
    startLevel();
    aliveRef.current = true;
    setStatus("running");
    rafRef.current = requestAnimationFrame(loop);
  }, [loop, startLevel]);

  const nextLevel = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    deathAnimRef.current = 0;
    startLevel();
    aliveRef.current = true;
    setStatus("running");
    rafRef.current = requestAnimationFrame(loop);
  }, [loop, startLevel]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const dirs: Record<string, Dir> = {
        ArrowUp: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 },
      };
      const d = dirs[e.key];
      if (d) {
        pacRef.current.nextDir = d;
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("keydown", handleKey);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    draw();
  }, [draw]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        background: "#000",
        padding: 8,
        borderRadius: 4,
      }}
    >
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        data-ocid="pacman.canvas_target"
        style={{
          border: "2px solid #0000ff",
          imageRendering: "pixelated",
          display: "block",
        }}
      />

      {status !== "running" && status !== "dying" && (
        <div
          style={{ textAlign: "center", fontFamily: "Courier New, monospace" }}
        >
          {status === "dead" && (
            <div style={{ color: "#f00", fontSize: 14, marginBottom: 6 }}>
              GAME OVER — Score: {score}
            </div>
          )}
          {status === "won" && (
            <div style={{ color: "#ffd700", fontSize: 14, marginBottom: 6 }}>
              LEVEL {level} CLEAR! Lives: {lives} 🎉
            </div>
          )}
          {status === "idle" && (
            <div style={{ color: "#ffff00", fontSize: 11, marginBottom: 4 }}>
              Arrow keys to move. Eat all dots. Avoid ghosts!
            </div>
          )}
          <button
            type="button"
            data-ocid="pacman.start_button"
            className="btn-95"
            onClick={status === "won" ? nextLevel : startGame}
            style={{ background: "#c0c0c0", cursor: "pointer" }}
          >
            {status === "idle"
              ? "Start Game"
              : status === "won"
                ? "Next Level"
                : "Play Again"}
          </button>
        </div>
      )}
    </div>
  );
}
