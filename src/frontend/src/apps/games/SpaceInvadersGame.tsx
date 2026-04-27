import { useCallback, useEffect, useRef, useState } from "react";

const W = 480;
const H = 320;
const ALIEN_ROWS = 4;
const ALIEN_COLS = 10;
const ALIEN_W = 32;
const ALIEN_H = 24;
const ALIEN_GAP_X = 10;
const ALIEN_GAP_Y = 8;
const ALIEN_START_X = 20;
const ALIEN_START_Y = 30;
const PLAYER_W = 32;
const PLAYER_H = 16;
const BULLET_W = 3;
const BULLET_H = 10;
const PLAYER_SPEED = 4;
const BULLET_SPEED = 6;
const ALIEN_BULLET_SPEED = 3;

type Bullet = { x: number; y: number };
type Alien = { x: number; y: number; alive: boolean; row: number };

function makeAliens(): Alien[] {
  const aliens: Alien[] = [];
  for (let r = 0; r < ALIEN_ROWS; r++)
    for (let c = 0; c < ALIEN_COLS; c++)
      aliens.push({
        x: ALIEN_START_X + c * (ALIEN_W + ALIEN_GAP_X),
        y: ALIEN_START_Y + r * (ALIEN_H + ALIEN_GAP_Y),
        alive: true,
        row: r,
      });
  return aliens;
}

function drawAlienShape(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  row: number,
  frame: number,
) {
  const colors = ["#ff4444", "#ff44ff", "#44ffff", "#44ff44"];
  ctx.fillStyle = colors[row % colors.length];
  const px = (dx: number, dy: number, w = 3, h = 3) =>
    ctx.fillRect(x + dx, y + dy, w, h);
  if (row < 2) {
    // Crab style
    if (frame === 0) {
      px(3, 0, 20, 3);
      px(0, 3, 3, 3);
      px(23, 3, 3, 3);
      px(0, 6, 26, 3);
      px(3, 9, 3, 3);
      px(7, 9, 3, 3);
      px(13, 9, 3, 3);
      px(17, 9, 3, 3);
      px(0, 12, 6, 3);
      px(20, 12, 6, 3);
      px(7, 12, 3, 3);
      px(16, 12, 3, 3);
    } else {
      px(3, 0, 20, 3);
      px(0, 3, 3, 3);
      px(23, 3, 3, 3);
      px(0, 6, 26, 3);
      px(0, 9, 3, 3);
      px(6, 9, 3, 3);
      px(14, 9, 3, 3);
      px(23, 9, 3, 3);
      px(3, 12, 6, 3);
      px(17, 12, 6, 3);
      px(10, 12, 3, 3);
    }
  } else {
    // Squid style
    if (frame === 0) {
      px(9, 0, 8, 3);
      px(3, 3, 20, 3);
      px(0, 6, 26, 3);
      px(0, 9, 7, 3);
      px(10, 9, 6, 3);
      px(19, 9, 7, 3);
      px(3, 12, 3, 3);
      px(20, 12, 3, 3);
    } else {
      px(9, 0, 8, 3);
      px(3, 3, 20, 3);
      px(0, 6, 26, 3);
      px(0, 9, 5, 3);
      px(11, 9, 4, 3);
      px(21, 9, 5, 3);
      px(0, 12, 3, 3);
      px(23, 12, 3, 3);
    }
  }
}

export function SpaceInvadersGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const aliensRef = useRef<Alien[]>([]);
  const playerRef = useRef({ x: W / 2 - PLAYER_W / 2 });
  const bulletRef = useRef<Bullet | null>(null);
  const alienBulletsRef = useRef<Bullet[]>([]);
  const alienDirRef = useRef(1);
  const alienTickRef = useRef(0);
  const frameRef = useRef(0);
  const aliveRef = useRef(false);
  const rafRef = useRef(0);
  const keysRef = useRef<Set<string>>(new Set());
  const scoreRef = useRef(0);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState<"idle" | "running" | "won" | "dead">(
    "idle",
  );
  const [msg, setMsg] = useState("");

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, W, H);
    // Stars
    ctx.fillStyle = "#fff";
    for (let i = 0; i < 40; i++) {
      const sx = (i * 73 + 11) % W;
      const sy = (i * 47 + 7) % H;
      ctx.fillRect(sx, sy, 1, 1);
    }
    // Aliens
    for (const a of aliensRef.current) {
      if (a.alive) drawAlienShape(ctx, a.x, a.y, a.row, frameRef.current);
    }
    // Player ship
    const px = playerRef.current.x;
    ctx.fillStyle = "#0f0";
    ctx.fillRect(px + 12, H - PLAYER_H - 4, 8, 4);
    ctx.fillRect(px + 6, H - PLAYER_H, 20, 4);
    ctx.fillRect(px, H - PLAYER_H + 4, 32, 8);
    // Player bullet
    if (bulletRef.current) {
      ctx.fillStyle = "#ff0";
      ctx.fillRect(
        bulletRef.current.x,
        bulletRef.current.y,
        BULLET_W,
        BULLET_H,
      );
    }
    // Alien bullets
    ctx.fillStyle = "#f44";
    for (const b of alienBulletsRef.current) {
      ctx.fillRect(b.x, b.y, BULLET_W, BULLET_H);
    }
    // Score
    ctx.fillStyle = "#fff";
    ctx.font = "bold 13px Courier New";
    ctx.textAlign = "left";
    ctx.fillText(`SCORE: ${scoreRef.current}`, 8, 16);
    // Alien count
    const alive = aliensRef.current.filter((a) => a.alive).length;
    ctx.textAlign = "right";
    ctx.fillText(`ALIENS: ${alive}`, W - 8, 16);
  }, []);

  const loop = useCallback(() => {
    if (!aliveRef.current) return;
    const keys = keysRef.current;
    if (keys.has("ArrowLeft"))
      playerRef.current.x = Math.max(0, playerRef.current.x - PLAYER_SPEED);
    if (keys.has("ArrowRight"))
      playerRef.current.x = Math.min(
        W - PLAYER_W,
        playerRef.current.x + PLAYER_SPEED,
      );
    // Player bullet
    if (bulletRef.current) {
      bulletRef.current.y -= BULLET_SPEED;
      if (bulletRef.current.y < 0) bulletRef.current = null;
      else {
        for (const a of aliensRef.current) {
          if (!a.alive || !bulletRef.current) continue;
          const b = bulletRef.current;
          if (
            b.x >= a.x &&
            b.x <= a.x + ALIEN_W &&
            b.y <= a.y + ALIEN_H &&
            b.y >= a.y
          ) {
            a.alive = false;
            bulletRef.current = null;
            scoreRef.current += 10;
            setScore(scoreRef.current);
            break;
          }
        }
      }
    }
    // Alien bullets move
    alienBulletsRef.current = alienBulletsRef.current.filter((b) => b.y < H);
    for (const b of alienBulletsRef.current) {
      b.y += ALIEN_BULLET_SPEED;
    }
    // Check alien bullet hits player
    const px = playerRef.current.x;
    for (const b of alienBulletsRef.current) {
      if (b.x >= px && b.x <= px + PLAYER_W && b.y >= H - PLAYER_H - 4) {
        aliveRef.current = false;
        setStatus("dead");
        setMsg("YOU WERE HIT!");
        draw();
        return;
      }
    }
    // Alien movement
    alienTickRef.current++;
    const alive = aliensRef.current.filter((a) => a.alive);
    if (alive.length === 0) {
      aliveRef.current = false;
      setStatus("won");
      setMsg("YOU WIN!");
      draw();
      return;
    }
    const speed = Math.max(
      6,
      24 - Math.floor((ALIEN_ROWS * ALIEN_COLS - alive.length) * 0.4),
    );
    if (alienTickRef.current % speed === 0) {
      frameRef.current = 1 - frameRef.current;
      let descend = false;
      const leftmost = Math.min(...alive.map((a) => a.x));
      const rightmost = Math.max(...alive.map((a) => a.x + ALIEN_W));
      if (alienDirRef.current === 1 && rightmost >= W - 5) descend = true;
      if (alienDirRef.current === -1 && leftmost <= 5) descend = true;
      if (descend) {
        for (const a of aliensRef.current) {
          if (a.alive) a.y += 12;
        }
        alienDirRef.current *= -1;
      } else {
        for (const a of aliensRef.current) {
          if (a.alive) a.x += alienDirRef.current * 10;
        }
      }
      // Check if aliens reached bottom
      if (alive.some((a) => a.y + ALIEN_H >= H - PLAYER_H - 8)) {
        aliveRef.current = false;
        setStatus("dead");
        setMsg("ALIENS INVADED!");
        draw();
        return;
      }
    }
    // Alien shoots
    if (Math.random() < 0.015 && alive.length > 0) {
      const shooter = alive[Math.floor(Math.random() * alive.length)];
      alienBulletsRef.current.push({
        x: shooter.x + ALIEN_W / 2,
        y: shooter.y + ALIEN_H,
      });
    }
    draw();
    rafRef.current = requestAnimationFrame(loop);
  }, [draw]);

  const startGame = useCallback(() => {
    aliensRef.current = makeAliens();
    playerRef.current = { x: W / 2 - PLAYER_W / 2 };
    bulletRef.current = null;
    alienBulletsRef.current = [];
    alienDirRef.current = 1;
    alienTickRef.current = 0;
    frameRef.current = 0;
    scoreRef.current = 0;
    setScore(0);
    aliveRef.current = true;
    setStatus("running");
    setMsg("");
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(loop);
  }, [loop]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      keysRef.current.add(e.key);
      if (e.key === " " && aliveRef.current && !bulletRef.current) {
        bulletRef.current = {
          x: playerRef.current.x + PLAYER_W / 2 - 1,
          y: H - PLAYER_H - 14,
        };
      }
      if (["ArrowLeft", "ArrowRight", " "].includes(e.key)) e.preventDefault();
    };
    const up = (e: KeyboardEvent) => keysRef.current.delete(e.key);
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
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
      }}
    >
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        data-ocid="spaceinvaders.canvas_target"
        style={{ border: "2px solid #444", imageRendering: "pixelated" }}
      />
      <div
        style={{
          color: "#0ff",
          fontFamily: "Courier New, monospace",
          fontSize: 12,
        }}
      >
        Score: {score}
      </div>
      {status !== "running" && (
        <div style={{ textAlign: "center" }}>
          {(status === "dead" || status === "won") && (
            <div
              style={{
                color: status === "won" ? "#ffd700" : "#f00",
                fontFamily: "Courier New, monospace",
                fontSize: 13,
                marginBottom: 6,
              }}
            >
              {msg}
            </div>
          )}
          <button
            type="button"
            data-ocid="spaceinvaders.start_button"
            className="btn-95"
            onClick={startGame}
            style={{ background: "#c0c0c0" }}
          >
            {status === "idle" ? "Start Game" : "Play Again"}
          </button>
          {status === "idle" && (
            <div
              style={{
                color: "#888",
                fontFamily: "Tahoma, sans-serif",
                fontSize: 10,
                marginTop: 4,
              }}
            >
              ← → Move &nbsp;|&nbsp; Space Shoot
            </div>
          )}
        </div>
      )}
    </div>
  );
}
